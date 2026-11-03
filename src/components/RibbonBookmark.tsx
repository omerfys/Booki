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
  const [dragTip, setDragTip] = useState<{ x: number; y: number } | null>(null);
  const [animateSlide, setAnimateSlide] = useState(false);

  const prevPageRef = useRef(currentPage);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if current spread has a bookmark placed on it
  const activeBookmark = bookmarks.find(
    b => b.pageNumber === currentPage || b.pageNumber === currentPage + 1
  );
  const isPlaced = !!activeBookmark;

  const totalHeight = bookHeight + 48;
  const restingHeight = 26; // Tucked above the spine when not placed

  // When navigating between pages: do NOT animate slide-down! It must already be there ("hep ordaymış gibi")
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      setAnimateSlide(false);
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  // Current visual coordinates of the ribbon tip (center is X = 120 in 240px canvas)
  const currentTipX = isDragging && dragTip !== null ? dragTip.x : 120;
  const currentTipY = isDragging && dragTip !== null 
    ? dragTip.y 
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

  // Interactive Physical Drag-and-Drop: grab ribbon from top loop or tail, pull down to place, pull up to remove
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setAnimateSlide(false);

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialTipX = currentTipX;
    const initialTipY = currentTipY;

    let hasMoved = false;

    const onPointerMove = (moveEv: PointerEvent) => {
      const deltaX = moveEv.clientX - startClientX;
      const deltaY = moveEv.clientY - startClientY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasMoved = true;
      }

      // Sola çekince SOLA (deltaX < 0 -> tipX < 120), sağa çekince SAĞA (deltaX > 0 -> tipX > 120)
      const targetX = Math.max(40, Math.min(200, initialTipX + deltaX));
      const targetY = Math.max(restingHeight, Math.min(totalHeight + 35, initialTipY + deltaY));

      setDragTip({ x: targetX, y: targetY });
    };

    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      setIsDragging(false);
      setDragTip(null);
      setAnimateSlide(true);

      if (!hasMoved) {
        handleToggleRibbon();
        return;
      }

      const finalDeltaY = upEv.clientY - startClientY;
      const finalY = initialTipY + finalDeltaY;

      // Threshold: if dragged more than 38% down, place ribbon; else remove / tuck
      if (finalY > totalHeight * 0.38) {
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
      {/* 1. PHYSICAL 3D SATIN RIBBON WITH BEZIER DRAPE & PULL     */}
      {/* ======================================================== */}
      {(() => {
        const anchorX = 120;
        const anchorY = 10;
        const hw = 10; // 20px ribbon width
        const svgWidth = 240;
        const svgHeight = totalHeight + 40;

        // Tangent control points for flexible hanging cloth
        const cp1X = anchorX;
        const cp1Y = anchorY + (currentTipY - anchorY) * 0.35;

        const cp2X = anchorX + (currentTipX - anchorX) * 0.75;
        const cp2Y = anchorY + (currentTipY - anchorY) * 0.72;

        const isRestingTucked = currentTipY <= restingHeight + 4;

        const ribbonPath = isRestingTucked
          ? `M ${anchorX - 8} ${anchorY} L ${anchorX - 4} 26 L ${anchorX} 20 L ${anchorX + 4} 26 L ${anchorX + 8} ${anchorY} Z`
          : `
            M ${anchorX - hw} ${anchorY}
            C ${cp1X - hw} ${cp1Y}, ${cp2X - hw} ${cp2Y}, ${currentTipX - hw} ${currentTipY}
            L ${currentTipX} ${Math.max(anchorY + 10, currentTipY - 14)}
            L ${currentTipX + hw} ${currentTipY}
            C ${cp2X + hw} ${cp2Y}, ${cp1X + hw} ${cp1Y}, ${anchorX + hw} ${anchorY}
            Z
          `;

        return (
          <div 
            ref={containerRef}
            className="absolute top-[-26px] left-1/2 transform -translate-x-1/2 z-4 select-none pointer-events-none"
            style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}
          >
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible filter drop-shadow-md"
            >
              <defs>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#801515" />
                  <stop offset="30%" stopColor="#dc2626" />
                  <stop offset="60%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="ribbonShade" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
                  <stop offset="12%" stopColor="rgba(0,0,0,0.0)" />
                  <stop offset="85%" stopColor="rgba(0,0,0,0.0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                </linearGradient>
              </defs>

              {/* Upper anchor tuck into book spine */}
              <path
                d={`M ${anchorX - 14} 0 L ${anchorX + 14} 0 L ${anchorX + 12} 16 L ${anchorX - 12} 16 Z`}
                fill="rgba(0,0,0,0.6)"
                className="pointer-events-none"
              />

              {/* Transparent expanded hit-area for effortless mouse grab */}
              <path
                d={ribbonPath}
                strokeWidth="32"
                stroke="transparent"
                fill="none"
                onPointerDown={handlePointerDown}
                className={`pointer-events-auto ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab hover:brightness-110'
                }`}
              >
                <title>{isPlaced ? 'Ayracı kaldırmak için yukarı çekin veya tıklayın' : 'Ayracı sayfaya yerleştirmek için aşağı çekin veya tıklayın'}</title>
              </path>

              {/* Satin ribbon body with dynamic Bézier curvature */}
              <path
                d={ribbonPath}
                fill="url(#ribbonGrad)"
                onPointerDown={handlePointerDown}
                className={`pointer-events-auto transition-all ${
                  animateSlide ? 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'duration-0'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:brightness-110'}`}
              />

              {/* Satin sheen overlay */}
              <path
                d={ribbonPath}
                fill="url(#ribbonShade)"
                opacity="0.5"
                className="pointer-events-none"
              />
            </svg>
          </div>
        );
      })()}


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
