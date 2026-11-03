import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bookmark as BookmarkType } from '../types/book';
import { Bookmark, Plus, Trash2, X, ChevronRight } from 'lucide-react';
import { sound } from '../engine/audio/soundEngine';

interface RibbonBookmarkProps {
  bookmarks: BookmarkType[];
  currentPage: number;
  bookWidth: number;
  bookHeight: number;
  onAddBookmark: (page: number, label?: string, color?: string) => void;
  onRemoveBookmark: (id: string) => void;
  onJumpToPage: (page: number) => void;
}

export const RIBBON_COLORS = [
  { name: 'Crimson Red', hex: '#991b1b', light: '#dc2626' },
  { name: 'Royal Navy', hex: '#1e3a8a', light: '#2563eb' },
  { name: 'Forest Emerald', hex: '#065f46', light: '#059669' },
  { name: 'Antique Gold', hex: '#b45309', light: '#d97706' },
  { name: 'Deep Violet', hex: '#581c87', light: '#7c3aed' },
  { name: 'Burgundy Wine', hex: '#701a75', light: '#a21caf' }
];

export const RibbonBookmark: React.FC<RibbonBookmarkProps> = ({
  bookmarks,
  currentPage,
  bookHeight,
  onAddBookmark,
  onRemoveBookmark,
  onJumpToPage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(RIBBON_COLORS[0].hex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [dragTilt, setDragTilt] = useState(0);
  const [animateSlide, setAnimateSlide] = useState(false);

  const prevPageRef = useRef(currentPage);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // When navigating between pages: do NOT animate slide-down! It must already be there ("hep ordaymış gibi")
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      setAnimateSlide(false);
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);
  // Check if current spread has a bookmark placed on it
  const activeBookmark = bookmarks.find(
    b => b.pageNumber === currentPage || b.pageNumber === currentPage + 1
  );

  const isPlaced = !!activeBookmark;

  // Always Crimson Red per user requirement - zero orange
  const colorMeta = { name: 'Crimson Red', hex: '#991b1b', light: '#dc2626' };

  const totalHeight = bookHeight + 48;
  const restingHeight = 26; // Tucked above the spine when not placed

  // Current visual height of the draped ribbon
  const currentVisualHeight = isDragging && dragHeight !== null
    ? dragHeight
    : (isPlaced ? totalHeight : restingHeight);

  // Interactive Click to Toggle Ribbon Placement on Current Page
  const handleToggleRibbon = useCallback(() => {
    setAnimateSlide(true);
    sound.playRibbonSlide();
    if (isPlaced && activeBookmark) {
      onRemoveBookmark(activeBookmark.id);
    } else {
      onAddBookmark(currentPage, `Page ${currentPage}`, '#991b1b');
    }
  }, [isPlaced, activeBookmark, currentPage, onAddBookmark, onRemoveBookmark]);

  // Interactive Physical Drag-and-Drop: grab ribbon from top or tail, pull down to place, pull up to remove
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setAnimateSlide(false);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialHeight = currentVisualHeight;

    const onPointerMove = (moveEv: PointerEvent) => {
      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;
      const targetH = Math.max(restingHeight, Math.min(totalHeight + 20, initialHeight + deltaY));
      const targetTilt = Math.max(-12, Math.min(12, deltaX * 0.15));

      setDragHeight(targetH);
      setDragTilt(targetTilt);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      const finalDeltaY = upEv.clientY - startY;
      const finalHeight = initialHeight + finalDeltaY;

      setIsDragging(false);
      setDragHeight(null);
      setDragTilt(0);
      setAnimateSlide(true);

      // Threshold: if dragged more than 38% down, place ribbon; else remove / tuck
      if (finalHeight > totalHeight * 0.38) {
        if (!isPlaced) {
          sound.playRibbonSlide();
          onAddBookmark(currentPage, `Page ${currentPage}`, '#991b1b');
        }
      } else {
        if (isPlaced && activeBookmark) {
          sound.playRibbonSlide();
          onRemoveBookmark(activeBookmark.id);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. PHYSICAL 3D SATIN RIBBON WITH ANIMATED DRAPE & PULL   */}
      {/* ======================================================== */}
      <div 
        ref={containerRef}
        onClick={handleToggleRibbon}
        onPointerDown={handlePointerDown}
        className={`absolute top-[-26px] left-1/2 transform -translate-x-1/2 z-4 select-none cursor-pointer group ${
          isDragging ? 'cursor-grabbing' : 'cursor-pointer hover:brightness-110'
        }`}
        style={{ width: '38px' }}
        title={isPlaced ? 'Ayracı kaldırmak için tıklayın veya yukarı çekin' : 'Ayracı sayfaya yerleştirmek için aşağı çekin veya tıklayın'}
      >
        {/* Animated height container with Physics tilt and zero-delay on page navigation */}
        <div
          className={`relative overflow-hidden origin-top ${
            isDragging
              ? 'transition-none'
              : animateSlide
              ? 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : 'transition-none'
          }`}
          style={{
            height: `${currentVisualHeight}px`,
            width: '38px',
            transform: `rotate(${dragTilt}deg)`
          }}
        >
          <svg
            width="38"
            height={Math.max(restingHeight + 10, currentVisualHeight)}
            viewBox={`0 0 38 ${Math.max(restingHeight + 10, currentVisualHeight)}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            <defs>
              <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorMeta.hex} />
                <stop offset="35%" stopColor={colorMeta.light} />
                <stop offset="65%" stopColor={colorMeta.light} />
                <stop offset="100%" stopColor={colorMeta.hex} />
              </linearGradient>
              <linearGradient id="ribbonShade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
                <stop offset="12%" stopColor="rgba(0,0,0,0.0)" />
                <stop offset="85%" stopColor="rgba(0,0,0,0.0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
              </linearGradient>
            </defs>

            {/* Upper anchor tuck into book spine */}
            <path
              d="M 6 0 L 32 0 L 30 18 L 8 18 Z"
              fill="rgba(0,0,0,0.55)"
            />

            {/* Draped ribbon body with dynamic swallowtail tip always at fingertips */}
            {currentVisualHeight <= restingHeight + 4 ? (
              // Resting folded tab when not placed
              <path
                d="M 8 12 L 14 26 L 25 20 L 32 26 L 30 12 Z"
                fill="url(#ribbonGrad)"
              />
            ) : (
              // Extended ribbon body with dynamic swallowtail tip at currentVisualHeight
              <>
                <path
                  d={`
                    M 8 12
                    C 12 ${currentVisualHeight * 0.28}, 25 ${currentVisualHeight * 0.65}, 15 ${Math.max(12, currentVisualHeight - 28)}
                    L 15 ${currentVisualHeight}
                    L 25 ${Math.max(12, currentVisualHeight - 14)}
                    L 34 ${currentVisualHeight}
                    L 34 ${Math.max(12, currentVisualHeight - 28)}
                    C 43 ${currentVisualHeight * 0.65}, 30 ${currentVisualHeight * 0.28}, 30 12
                    Z
                  `}
                  fill="url(#ribbonGrad)"
                />
                {/* Satin sheen texture overlay */}
                <path
                  d={`
                    M 8 12
                    C 12 ${currentVisualHeight * 0.28}, 25 ${currentVisualHeight * 0.65}, 15 ${Math.max(12, currentVisualHeight - 28)}
                    L 15 ${currentVisualHeight}
                    L 25 ${Math.max(12, currentVisualHeight - 14)}
                    L 34 ${currentVisualHeight}
                    L 34 ${Math.max(12, currentVisualHeight - 28)}
                    C 43 ${currentVisualHeight * 0.65}, 30 ${currentVisualHeight * 0.28}, 30 12
                    Z
                  `}
                  fill="url(#ribbonShade)"
                  opacity="0.6"
                />
              </>
            )}
          </svg>
        </div>

      </div>


      {/* ======================================================== */}
      {/* 3. BOOKMARK MANAGER MODAL / FLYOUT                       */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 w-80 bg-[#1e1713]/95 border border-amber-800/50 rounded-xl p-4 shadow-2xl backdrop-blur-md text-amber-100 font-serif">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/60 mb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm tracking-wide">Ribbon Bookmarks</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-400/60 hover:text-amber-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Place Bookmark for Current Page */}
          <div className="mb-4 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/30">
            <div className="text-xs text-amber-300/80 mb-2">Place Ribbon on Page {currentPage}:</div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Bookmark note / chapter..."
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="flex-1 bg-black/40 border border-amber-800/40 rounded px-2.5 py-1 text-xs text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-600"
              />
              <button
                onClick={() => {
                  sound.playRibbonSlide();
                  onAddBookmark(currentPage, newLabel || `Page ${currentPage}`, selectedColor);
                  setNewLabel('');
                }}
                className="px-3 py-1 bg-amber-700/60 hover:bg-amber-600 border border-amber-500/40 rounded text-xs text-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Place</span>
              </button>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-amber-400/60">Ribbon:</span>
              <div className="flex gap-1.5">
                {RIBBON_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                      selectedColor === c.hex ? 'scale-125 border-amber-200 ring-2 ring-amber-400/50' : 'border-black/50 hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Existing Bookmarks List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {bookmarks.length === 0 ? (
              <div className="text-center py-4 text-xs text-amber-400/50 italic">
                No ribbons placed yet. Click "Place Ribbon" to bookmark this page.
              </div>
            ) : (
              bookmarks.map(b => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 border border-amber-900/30 text-xs transition-colors group"
                >
                  <button
                    onClick={() => {
                      sound.playRibbonSlide();
                      onJumpToPage(b.pageNumber);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                  >
                    <div
                      className="w-2.5 h-6 rounded-sm shadow-sm"
                      style={{ backgroundColor: b.color }}
                    />
                    <div>
                      <div className="font-medium text-amber-200 group-hover:text-amber-100">
                        {b.label}
                      </div>
                      <div className="text-[10px] text-amber-400/60">Page {b.pageNumber}</div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        sound.playRibbonSlide();
                        onJumpToPage(b.pageNumber);
                        setIsOpen(false);
                      }}
                      className="p-1 text-amber-400/60 hover:text-amber-200 cursor-pointer"
                      title="Jump to page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playRibbonSlide();
                        onRemoveBookmark(b.id);
                      }}
                      className="p-1 text-red-400/60 hover:text-red-300 cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
