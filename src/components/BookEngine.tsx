import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { Book, CharacterProfile, WritingInstrument, PageHighlight } from '../types/book';
import { BookPageCanvas } from './BookPageCanvas';
import { RibbonBookmark } from './RibbonBookmark';
import { generatePageStrokes, PageLayoutConstraints } from '../engine/handwriting/strokeGenerator';
import { StrokeAnimator } from '../engine/handwriting/strokeAnimator';
import { BookOpen, Lock, Undo, Redo } from 'lucide-react';
import { sound } from '../engine/audio/soundEngine';

interface BookEngineProps {
  book: Book;
  activeCharacter: CharacterProfile;
  instrument: WritingInstrument;
  penColor: string;
  penThickness: number;
  writingSpeed: number;
  fontSize: number;
  isOpening?: boolean;
  onStartOpening?: () => void;
  onFinishOpening?: () => void;
  onUpdateBook: (updated: Partial<Book>) => void;
  onPageChange?: (newPage: number) => void;
}

const PAGE_WIDTH = 480;
const PAGE_HEIGHT = 640;

export const BookEngine: React.FC<BookEngineProps> = ({
  book,
  activeCharacter,
  instrument,
  penColor,
  penThickness,
  writingSpeed,
  fontSize,
  isOpening = false,
  onStartOpening,
  onFinishOpening,
  onUpdateBook,
  onPageChange
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const hiddenInputRef = useRef<HTMLTextAreaElement | null>(null);
  const animatorRef = useRef<StrokeAnimator | null>(null);

  const [activePageIndex, setActivePageIndex] = useState<number>(book.currentPage || 1);
  const [activeWritingSide, setActiveWritingSide] = useState<'left' | 'right'>('right');
  const [animatingStrokeId, setAnimatingStrokeId] = useState<string | undefined>(undefined);
  const [animatingProgress, setAnimatingProgress] = useState<number>(1.0);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  // Opening state is controlled via props
  const [scale, setScale] = useState(1);
  const isFlippingRef = useRef<boolean>(false);
  const [highlightDrag, setHighlightDrag] = useState<{
    pageNumber: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  useEffect(() => {
    const updateScale = () => {
      const availWidth = window.innerWidth - 32;
      const availHeight = window.innerHeight - 200;
      const scaleX = availWidth / (PAGE_WIDTH * 2 + 60);
      const scaleY = availHeight / (PAGE_HEIGHT + 40);
      const target = Math.min(1.0, Math.max(0.45, Math.min(scaleX, scaleY)));
      setScale(target);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Layout constraints for page writing
  const getConstraints = useCallback((isRightPage: boolean): PageLayoutConstraints => {
    return {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      marginTop: 65,
      marginBottom: 55,
      marginLeft: isRightPage ? 55 : 45,
      marginRight: isRightPage ? 45 : 55,
      isRightPage
    };
  }, []);

  // Determine current left and right page objects
  const leftPageNumber = activePageIndex % 2 === 0 ? activePageIndex - 1 : activePageIndex;
  const rightPageNumber = leftPageNumber + 1;

  const leftPage = book.pages.find(p => p.pageNumber === leftPageNumber) || {
    pageNumber: leftPageNumber,
    strokes: [],
    rawText: ''
  };

  const rightPage = book.pages.find(p => p.pageNumber === rightPageNumber) || {
    pageNumber: rightPageNumber,
    strokes: [],
    rawText: ''
  };

  const activeTargetPage = activeWritingSide === 'left' ? leftPage : rightPage;
  const activeIsRight = activeWritingSide === 'right';

  // Initialize Stroke Animator
  useEffect(() => {
    animatorRef.current = new StrokeAnimator(
      state => {
        setAnimatingStrokeId(state.currentStrokeId || undefined);
        setAnimatingProgress(state.progress);
      },
      () => {
        setAnimatingStrokeId(undefined);
        setAnimatingProgress(1.0);
      }
    );

    return () => {
      animatorRef.current?.stop();
    };
  }, []);

  // Update animator speed
  useEffect(() => {
    animatorRef.current?.setSpeed(writingSpeed);
  }, [writingSpeed]);

  // Initialize or reconfigure StPageFlip persistently (never destroyed on open/close!)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;
      try {
        if (pageFlipRef.current) {
          pageFlipRef.current.destroy();
          pageFlipRef.current = null;
        }

        const pf = new PageFlip(container, {
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          size: 'fixed',
          minWidth: 320,
          maxWidth: 540,
          minHeight: 460,
          maxHeight: 720,
          drawShadow: true,
          flippingTime: 750,
          usePortrait: false,
          maxShadowOpacity: 0.6,
          showCover: false,
          mobileScrollSupport: false,
          useMouseEvents: true,
          swipeDistance: 35,
          showPageCorners: false,
          disableFlipByClick: true,
          clickEventForward: true
        });

        const pageElements = container.querySelectorAll<HTMLElement>('.book-flip-page');
        if (pageElements.length >= 2) {
          pf.loadFromHTML(pageElements);
          pf.on('flip', e => {
            isFlippingRef.current = false;
            sound.playPageTurn();
            const newIndex = (e.data as number) + 1;
            setActivePageIndex(newIndex);
            onPageChange?.(newIndex);
            onUpdateBook({ currentPage: newIndex });
          });
          pageFlipRef.current = pf;
        }
      } catch (err) {
        console.warn('PageFlip init:', err);
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {}
        pageFlipRef.current = null;
      }
    };
  }, [book.id, book.pages.length]);
  // Perform the exact same 3D paper bending, diagonal curling, and folding animation as mouse drag
  const animateCornerCurlFlip = useCallback((direction: 'next' | 'prev') => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    sound.playPageTurn();

    const distEl = (containerRef.current?.querySelector('.stf__block') as HTMLElement | null) || containerRef.current;
    if (distEl && pageFlipRef.current) {
      const rect = distEl.getBoundingClientRect();
      const isNext = direction === 'next';

      // Full sweep: from far right edge completely across to the far left edge!
      const startX = isNext ? (rect.left + rect.width - 20) : (rect.left + 20);
      const startY = rect.top + rect.height - 20;
      const targetX = isNext ? (rect.left + 20) : (rect.left + rect.width - 20);
      const targetY = rect.top + rect.height * 0.85;

      // 1. Mouse down on distEl
      distEl.dispatchEvent(new MouseEvent('mousedown', {
        clientX: startX,
        clientY: startY,
        bubbles: true,
        cancelable: true,
        view: window
      }));

      // 2. Animate complete natural 3D curl trajectory across the entire book over 180ms
      const steps = 12;
      let s = 1;
      const stepInterval = setInterval(() => {
        const frac = s / steps;
        const curX = startX + (targetX - startX) * frac;
        const curY = startY + (targetY - startY) * frac - Math.sin(frac * Math.PI) * 45;

        window.dispatchEvent(new MouseEvent('mousemove', {
          clientX: curX,
          clientY: curY,
          bubbles: true,
          cancelable: true,
          view: window
        }));

        s++;
        if (s > steps) {
          clearInterval(stepInterval);
          // 3. Mouse up: StPageFlip's internal physics engine completes the 3D flip cleanly!
          window.dispatchEvent(new MouseEvent('mouseup', {
            clientX: targetX,
            clientY: targetY,
            bubbles: true,
            cancelable: true,
            view: window
          }));
          setTimeout(() => {
            isFlippingRef.current = false;
          }, 700);
        }
      }, 15);
      return;
    }

    if (pageFlipRef.current) {
      try {
        if (direction === 'next') pageFlipRef.current.flipNext('bottom');
        else pageFlipRef.current.flipPrev('bottom');
      } catch {}
      setTimeout(() => {
        isFlippingRef.current = false;
      }, 700);
    } else {
      isFlippingRef.current = false;
    }
  }, []);

  const handleNextPage = useCallback(() => {
    animateCornerCurlFlip('next');
  }, [animateCornerCurlFlip]);

  const handlePrevPage = useCallback(() => {
    animateCornerCurlFlip('prev');
  }, [animateCornerCurlFlip]);
  // Keyboard Navigation: Arrow Left/Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (book.isClosed) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.target !== hiddenInputRef.current) return;
      }

      if (e.key === 'ArrowRight' && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book.isClosed, handleNextPage, handlePrevPage]);

  // Focus hidden input when user clicks on a page to write
  const handlePageClick = (side: 'left' | 'right') => {
    setActiveWritingSide(side);
    hiddenInputRef.current?.focus();
  };

  // Live Typing Handler: converts keyboard input to handwritten strokes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const oldText = activeTargetPage.rawText;

    // Push to undo stack
    setUndoStack(prev => [...prev.slice(-25), oldText]);
    setRedoStack([]);

    // Character profile with current user adjustments
    const currentProfile: CharacterProfile = {
      ...activeCharacter,
      style: {
        ...activeCharacter.style,
        size: fontSize,
        lineHeight: 38
      }
    };

    const constraints = getConstraints(activeIsRight);

    // Generate strokes with controlled randomization
    const generated = generatePageStrokes(
      newText,
      currentProfile,
      constraints,
      instrument,
      penColor,
      penThickness,
      book.penOpacity || 0.95,
      activeTargetPage.pageNumber * 50
    );

    // Handle automatic page continuation when full
    if (generated.isFull && generated.overflowText) {
      const remainingTextOnThisPage = newText.slice(0, newText.length - generated.overflowText.length);
      const nextPageNum = activeTargetPage.pageNumber + 1;

      // Update current page
      const updatedThisPage = {
        ...activeTargetPage,
        rawText: remainingTextOnThisPage,
        strokes: generated.strokes,
        lastEdited: Date.now()
      };

      // Create or update next page
      const nextConstraints = getConstraints(!activeIsRight);
      const nextPageGenerated = generatePageStrokes(
        generated.overflowText,
        currentProfile,
        nextConstraints,
        instrument,
        penColor,
        penThickness,
        book.penOpacity || 0.95,
        nextPageNum * 50
      );

      const updatedNextPage = {
        pageNumber: nextPageNum,
        rawText: generated.overflowText,
        strokes: nextPageGenerated.strokes,
        lastEdited: Date.now()
      };

      const newPages = [...book.pages];
      const thisIdx = newPages.findIndex(p => p.pageNumber === activeTargetPage.pageNumber);
      if (thisIdx >= 0) newPages[thisIdx] = updatedThisPage;
      else newPages.push(updatedThisPage);

      const nextIdx = newPages.findIndex(p => p.pageNumber === nextPageNum);
      if (nextIdx >= 0) newPages[nextIdx] = updatedNextPage;
      else newPages.push(updatedNextPage);

      onUpdateBook({ pages: newPages });

      // Automatically advance page
      setTimeout(() => {
        handleNextPage();
      }, 200);

      return;
    }

    // Normal page update
    const updatedPage: typeof activeTargetPage = {
      ...activeTargetPage,
      rawText: newText,
      strokes: generated.strokes,
      lastEdited: Date.now()
    };

    const newPages = [...book.pages];
    const idx = newPages.findIndex(p => p.pageNumber === activeTargetPage.pageNumber);
    if (idx >= 0) {
      newPages[idx] = updatedPage;
    } else {
      newPages.push(updatedPage);
    }

    onUpdateBook({ pages: newPages });

    // Animate newly penned stroke if typing forward
    if (newText.length > oldText.length && generated.strokes.length > 0) {
      sound.playWritingSound(instrument);
      const lastStroke = generated.strokes[generated.strokes.length - 1];
      animatorRef.current?.animateStrokes([lastStroke]);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, activeTargetPage.rawText]);
    setUndoStack(u => u.slice(0, -1));

    const currentProfile: CharacterProfile = {
      ...activeCharacter,
      style: { ...activeCharacter.style, size: fontSize, lineHeight: 38 }
    };
    const generated = generatePageStrokes(
      prev,
      currentProfile,
      getConstraints(activeIsRight),
      instrument,
      penColor,
      penThickness,
      book.penOpacity,
      activeTargetPage.pageNumber * 50
    );

    const updated = { ...activeTargetPage, rawText: prev, strokes: generated.strokes };
    const newPages = book.pages.map(p => (p.pageNumber === updated.pageNumber ? updated : p));
    onUpdateBook({ pages: newPages });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, activeTargetPage.rawText]);
    setRedoStack(r => r.slice(0, -1));

    const currentProfile: CharacterProfile = {
      ...activeCharacter,
      style: { ...activeCharacter.style, size: fontSize, lineHeight: 38 }
    };
    const generated = generatePageStrokes(
      next,
      currentProfile,
      getConstraints(activeIsRight),
      instrument,
      penColor,
      penThickness,
      book.penOpacity,
      activeTargetPage.pageNumber * 50
    );

    const updated = { ...activeTargetPage, rawText: next, strokes: generated.strokes };
    const newPages = book.pages.map(p => (p.pageNumber === updated.pageNumber ? updated : p));
    onUpdateBook({ pages: newPages });
  };

  // Caret layout for active writing page
  const activeConstraints = getConstraints(activeIsRight);
  const activeLayout = generatePageStrokes(
    activeTargetPage.rawText,
    { ...activeCharacter, style: { ...activeCharacter.style, size: fontSize, lineHeight: 38 } },
    activeConstraints,
    instrument,
    penColor,
    penThickness,
    book.penOpacity,
    activeTargetPage.pageNumber * 50
  );

  // Animate opening the book smoothly with symmetrical center-split 3D rotation
  const handleOpenBook = () => {
    sound.playBookCover(false);
    onStartOpening?.();
    setTimeout(() => {
      onUpdateBook({ isClosed: false });
      onFinishOpening?.();
    }, 850);
  };

  // Marker Highlighting Handlers
  const handlePointerDownPage = (e: React.PointerEvent<HTMLDivElement>, pageNum: number) => {
    if (instrument !== 'marker') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setHighlightDrag({ pageNumber: pageNum, startX: x, startY: y, currentX: x, currentY: y });
    sound.playWritingSound('marker');
  };

  const handlePointerMovePage = (e: React.PointerEvent<HTMLDivElement>, pageNum: number) => {
    if (instrument !== 'marker' || !highlightDrag || highlightDrag.pageNumber !== pageNum) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setHighlightDrag(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
  };

  const PAGE_LINE_HEIGHT = 38;
  const LINE_BASELINE_OFFSET = 32;

  // Calculate line-snapped highlight rectangles for neat text line marking
  const getLineRectsForDrag = (
    startX: number,
    startY: number,
    curX: number,
    curY: number,
    isRightPage: boolean,
    color?: string
  ) => {
    const constraints = getConstraints(isRightPage);
    const fromLine = Math.max(0, Math.round((startY - (constraints.marginTop + LINE_BASELINE_OFFSET)) / PAGE_LINE_HEIGHT));
    const toLine = Math.max(0, Math.round((curY - (constraints.marginTop + LINE_BASELINE_OFFSET)) / PAGE_LINE_HEIGHT));

    const startLine = Math.min(fromLine, toLine);
    const endLine = Math.max(fromLine, toLine);
    const minDragX = Math.min(startX, curX);
    const maxDragX = Math.max(startX, curX);

    const rects: Array<{ x: number; y: number; width: number; height: number; color: string }> = [];

    for (let l = startLine; l <= endLine; l++) {
      const lineBaseY = constraints.marginTop + LINE_BASELINE_OFFSET + l * PAGE_LINE_HEIGHT;
      if (lineBaseY > constraints.height - constraints.marginBottom + 10) break;

      let x1 = constraints.marginLeft;
      let x2 = constraints.width - constraints.marginRight;

      if (startLine === endLine) {
        x1 = Math.max(constraints.marginLeft, minDragX);
        x2 = Math.min(constraints.width - constraints.marginRight, maxDragX);
      } else if (l === startLine) {
        x1 = Math.max(constraints.marginLeft, minDragX);
        x2 = constraints.width - constraints.marginRight;
      } else if (l === endLine) {
        x1 = constraints.marginLeft;
        x2 = Math.min(constraints.width - constraints.marginRight, maxDragX);
      }

      const w = Math.max(16, x2 - x1);
      rects.push({
        x: x1,
        y: lineBaseY - 24, // perfectly covers the text line!
        width: w,
        height: 28, // uniform line highlight height!
        color: color || penColor || '#facc15'
      });
    }
    return rects;
  };

  const handlePointerUpPage = (e: React.PointerEvent<HTMLDivElement>, pageNum: number) => {
    if (instrument !== 'marker' || !highlightDrag || highlightDrag.pageNumber !== pageNum) return;

    const isRight = pageNum % 2 !== 0;
    const lineRects = getLineRectsForDrag(
      highlightDrag.startX,
      highlightDrag.startY,
      highlightDrag.currentX,
      highlightDrag.currentY,
      isRight
    );

    const targetPage = book.pages.find(p => p.pageNumber === pageNum);
    if (targetPage && lineRects.length > 0) {
      const newHighlight: PageHighlight = {
        id: `hl-${Date.now()}`,
        color: penColor || '#facc15',
        opacity: 0.45,
        rects: lineRects.map(r => ({ x: r.x, y: r.y, width: r.width, height: r.height })),
        timestamp: Date.now()
      };
      const updated = {
        ...targetPage,
        highlights: [...(targetPage.highlights || []), newHighlight]
      };
      const newPages = book.pages.map(p => (p.pageNumber === pageNum ? updated : p));
      onUpdateBook({ pages: newPages });
      sound.playWritingSound('marker');
    }
    setHighlightDrag(null);
  };

  // Close the book
  const handleCloseBook = () => {
    sound.playBookCover(true);
    onUpdateBook({ isClosed: true });
  };

  // Foil style generator for cover embossing
  const getFoilStyle = (type: string) => {
    switch (type) {
      case 'gold':
        return 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent';
      case 'silver':
        return 'text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent';
      case 'bronze':
        return 'text-amber-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 bg-clip-text text-transparent';
      default:
        return 'text-black/60 drop-shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full">
      
      {/* Hidden Textarea for capturing physical keyboard typing (disabled when highlighting) */}
      {!book.isClosed && instrument !== 'marker' && (
        <textarea
          ref={hiddenInputRef}
          value={activeTargetPage.rawText}
          onChange={handleTextChange}
          className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none w-1 h-1"
          autoFocus
        />
      )}

      {/* ======================================================== */}
      {/* 1. CLOSED BOOK 3D STATE (Realistic Hardcover on Wooden Desk) */}
      {/* ======================================================== */}
      {/* 1. CLOSED BOOK 3D STATE & ROTATING COVER OVERLAY */}
      {(book.isClosed || isOpening) && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 perspective-book flex items-center justify-center select-none z-40 pointer-events-auto">
          {/* Symmetrical Book Shell: Expands smoothly from 480px to 960px right where it sits! */}
          <div
            onClick={!isOpening ? handleOpenBook : undefined}
            className={`relative h-[640px] preserve-3d cursor-pointer transition-all duration-850 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_35px_70px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.6)] ${
              isOpening ? 'w-[960px]' : 'w-[480px]'
            }`}
          >
            {/* UNDERNEATH (Right half): Right interior page (Page 2), revealed as front cover lifts */}
            <div 
              className={`absolute top-0 bottom-0 right-0 overflow-hidden bg-[#fbf9f5] transition-opacity duration-500 rounded-r-sm ${
                isOpening ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: `${PAGE_WIDTH}px` }}
            >
              <BookPageCanvas
                page={rightPage}
                pageNumber={rightPageNumber}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                paperType={book.paperType}
                rulingStyle={book.rulingStyle}
                isRightPage={true}
                isActiveWritingPage={false}
              />
            </div>

            {/* ROTATING FRONT COVER LEAF: Anchored on the center spine axis */}
            <div
              className={`absolute top-0 bottom-0 preserve-3d transition-all duration-850 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpening
                  ? 'left-1/2 -rotate-y-180'
                  : 'left-0 rotate-y-0'
              }`}
              style={{
                width: `${PAGE_WIDTH}px`,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* FRONT FACE OF LEAF: Closed Hardcover with Embossed Title & centered gold border */}
              <div
                className="absolute inset-0 rounded-r-2xl rounded-l-xs shadow-2xl flex flex-col justify-between p-8 border-r-8 border-b-8 border-black/50 overflow-hidden"
                style={{
                  backgroundColor: book.coverColor,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                {/* Hardcover Material Grain / Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none wood-texture" />

                {/* Spine Hinge Groove Shadow */}
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                <div className="absolute top-0 left-6 bottom-0 w-[2px] bg-black/40 shadow-[0_0_5px_rgba(0,0,0,0.7)]" />

                {/* Stacked Page Edge Block Illusion on the right side */}
                <div className="absolute top-2 right-[-14px] bottom-2 w-3.5 bg-gradient-to-r from-[#e3d7bf] to-[#c7b99c] rounded-r-xs shadow-md border-y border-black/30 flex flex-col justify-between py-1 opacity-90">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-black/20" />
                  ))}
                </div>

                {/* Gilt / Embossed Border Framing - Shifted right to clear spine */}
                <div className="absolute top-5 bottom-5 left-10 right-4 border border-amber-400/35 rounded-r-xl rounded-l-xs pointer-events-none flex flex-col justify-between p-1.5">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-amber-400/60" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400/60" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-amber-400/60" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-amber-400/60" />
                  </div>
                </div>

                {/* Top Cover Tooling Header */}
                <div className="text-center pt-8 z-10">
                  <div className="text-[11px] uppercase tracking-widest text-amber-300/60 font-serif">
                    Handcrafted Physical Edition
                  </div>
                </div>

                {/* Embossed Title & Subtitle */}
                <div className="text-center my-auto z-10 px-4">
                  <h1 className={`text-2xl sm:text-3xl font-bold font-serif tracking-wider leading-snug ${getFoilStyle(book.embossingColor)}`}>
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-sm italic text-amber-200/80 font-serif mt-3 tracking-wide">
                      {book.subtitle}
                    </p>
                  )}
                  <div className="w-16 h-[1px] bg-amber-400/40 mx-auto mt-6" />
                </div>

                {/* Bottom Colophon Marker */}
                <div className="text-center pb-6 z-10">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400/40 font-serif">
                    Booki Atelier
                  </span>
                </div>
              </div>

              {/* BACK FACE OF LEAF: Left Interior Page (Page 1), revealed as leaf flips over */}
              <div
                className="absolute inset-0 overflow-hidden bg-[#fbf9f5] rounded-l-2xl shadow-2xl"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <BookPageCanvas
                  page={leftPage}
                  pageNumber={leftPageNumber}
                  width={PAGE_WIDTH}
                  height={PAGE_HEIGHT}
                  paperType={book.paperType}
                  rulingStyle={book.rulingStyle}
                  isRightPage={false}
                  isActiveWritingPage={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. OPEN TWO-PAGE SPREAD STATE (Persistent in DOM, zero flicker!) */}
      {/* ======================================================== */}
      <div className={`relative flex flex-col items-center py-2 transition-opacity duration-300 ${
        book.isClosed && !isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
          
          {/* Main Book Structure with Deckled Stacked Edge Depth */}
          <div className="relative flex items-center shadow-[0_45px_90px_rgba(0,0,0,0.85),0_15px_30px_rgba(0,0,0,0.6)] rounded-sm">
            
            {/* Left Stacked Paper Thickness (Deckled Edges) */}
            <div 
              className="h-[640px] bg-gradient-to-r from-[#bfae8f] via-[#d5c7ab] to-[#ece1cc] rounded-l-xs shadow-inner border-y border-black/30 hidden sm:flex flex-col justify-between py-2 shrink-0 transition-all duration-500"
              style={{ width: `${Math.min(26, Math.max(10, Math.round(book.pages.length * 0.35)))}px` }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-full h-[1px] bg-black/15" />
              ))}
            </div>

            {/* StPageFlip Interactive Book Shell */}
            <div className="relative overflow-visible">
              
            {/* Spine Valley Center Shadow Gradient Overlay (z-2 sits on resting pages, under flipping page at z-5) */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-14 pointer-events-none z-2 bg-gradient-to-r from-transparent via-black/40 to-transparent" />

            {/* Central Spine Binding Stitch Illusion */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[2px] bg-black/60 pointer-events-none z-3" />
              {/* Physical Satin Ribbon Bookmark Component */}
              <RibbonBookmark
                bookmarks={book.bookmarks}
                currentPage={activePageIndex}
                bookWidth={PAGE_WIDTH * 2}
                bookHeight={PAGE_HEIGHT}
                onAddBookmark={(page, label, color) => {
                  const newBm = {
                    id: `bm-${Date.now()}`,
                    pageNumber: page,
                    positionY: 0.25,
                    color: color || book.ribbonColor,
                    label: label || `Page ${page}`,
                    createdAt: Date.now()
                  };
                  onUpdateBook({ bookmarks: [...book.bookmarks, newBm] });
                }}
                onRemoveBookmark={id => {
                  onUpdateBook({ bookmarks: book.bookmarks.filter(b => b.id !== id) });
                }}
                onJumpToPage={page => {
                  setActivePageIndex(page);
                  onPageChange?.(page);
                  onUpdateBook({ currentPage: page });
                }}
              />

              {/* Page Container: Dual Page Spread */}
              <div
                ref={containerRef}
                className="flex items-center bg-[#fbf9f5] rounded-sm select-none"
                style={{ width: `${PAGE_WIDTH * 2}px`, height: `${PAGE_HEIGHT}px` }}
              >
                {(() => {
                  const pagesToRender = [...book.pages];
                  if (pagesToRender.length < 2) {
                    pagesToRender.push({ pageNumber: 2, strokes: [], rawText: '' });
                  }
                  if (pagesToRender.length % 2 !== 0) {
                    pagesToRender.push({ pageNumber: pagesToRender.length + 1, strokes: [], rawText: '' });
                  }

                  return pagesToRender.map((p, idx) => {
                    const isRight = idx % 2 !== 0;
                    const isCurrentWritingTarget = p.pageNumber === activeTargetPage.pageNumber;
                    const paperBgColor =
                      book.paperType === 'aged-vintage' ? '#e9d6b2' :
                      book.paperType === 'yellowed' ? '#f2e4c4' :
                      book.paperType === 'clean-white' ? '#fbfbfa' :
                      book.paperType === 'fine-textured' ? '#f7f3ea' :
                      book.paperType === 'lightly-rough' ? '#f4eee1' : '#f5edd9';

                    return (
                      <div
                        key={p.pageNumber}
                        className="book-flip-page relative w-[480px] h-[640px] bg-[#fbf9f5] overflow-hidden"
                        style={{ backgroundColor: paperBgColor }}
                      >
                        <BookPageCanvas
                          page={p}
                          pageNumber={p.pageNumber}
                          width={PAGE_WIDTH}
                          height={PAGE_HEIGHT}
                          paperType={book.paperType}
                          rulingStyle={book.rulingStyle}
                          isRightPage={isRight}
                          isActiveWritingPage={isCurrentWritingTarget && instrument !== 'marker'}
                          caretPosition={isCurrentWritingTarget && instrument !== 'marker' ? activeLayout.caretPosition : undefined}
                          animatingStrokeId={isCurrentWritingTarget ? animatingStrokeId : undefined}
                          animatingProgress={isCurrentWritingTarget ? animatingProgress : 1.0}
                          isMarkerActive={instrument === 'marker'}
                          activeHighlightRects={
                            highlightDrag && highlightDrag.pageNumber === p.pageNumber
                              ? getLineRectsForDrag(
                                  highlightDrag.startX,
                                  highlightDrag.startY,
                                  highlightDrag.currentX,
                                  highlightDrag.currentY,
                                  isRight,
                                  penColor || '#facc15'
                                )
                              : null
                          }
                          onPointerDownPage={e => handlePointerDownPage(e, p.pageNumber)}
                          onPointerMovePage={e => handlePointerMovePage(e, p.pageNumber)}
                          onPointerUpPage={e => handlePointerUpPage(e, p.pageNumber)}
                          onClickPage={() => {
                            if (instrument !== 'marker') {
                              handlePageClick(isRight ? 'right' : 'left');
                            }
                          }}
                        />
                      </div>
                    );
                  });
                })()}
              </div>

            </div>

            {/* Right Stacked Paper Thickness (Deckled Edges) */}
            <div 
              className="h-[640px] bg-gradient-to-r from-[#ece1cc] via-[#d5c7ab] to-[#bfae8f] rounded-r-xs shadow-inner border-y border-black/30 hidden sm:flex flex-col justify-between py-2 shrink-0 transition-all duration-500"
              style={{ width: `${Math.min(26, Math.max(10, Math.round(book.pages.length * 0.35)))}px` }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-full h-[1px] bg-black/15" />
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* Ambient Navigation & Writing Status Floating Bar */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between w-full max-w-[960px] mt-4 px-4 py-2 bg-[#1c120c]/80 border border-amber-900/50 rounded-2xl shadow-xl backdrop-blur-md text-amber-200 text-xs font-serif">
            
            {/* Left Action Button: Close Book */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCloseBook}
                className="p-1.5 rounded-lg bg-black/30 hover:bg-black/60 border border-amber-900/40 text-amber-400 cursor-pointer transition-all flex items-center gap-1.5"
                title="Close Book"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">Close</span>
              </button>
            </div>

            {/* Center Spread / Author Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-800/40 rounded-full">
                <span className="text-amber-400 font-bold">{leftPageNumber}</span>
                <span className="text-amber-600/60">—</span>
                <span className="text-amber-400 font-bold">{rightPageNumber}</span>
                <span className="text-[10px] text-amber-500/50 ml-1">of {book.pages.length}</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-amber-300/80">
                <span className="text-xs">{activeCharacter.flag}</span>
                <span className="text-xs font-medium">{activeCharacter.name}</span>
                <span className="text-[10px] text-amber-500/60">({activeWritingSide === 'left' ? 'Page L' : 'Page R'})</span>
              </div>
            </div>

            {/* Right Action Buttons: Undo & Redo */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="p-1.5 rounded-lg bg-black/30 hover:bg-black/60 border border-amber-900/40 disabled:opacity-30 text-amber-300 cursor-pointer transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1.5 rounded-lg bg-black/30 hover:bg-black/60 border border-amber-900/40 disabled:opacity-30 text-amber-300 cursor-pointer transition-all"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
    </div>
  );
};
