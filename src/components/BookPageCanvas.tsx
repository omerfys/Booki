import React, { useRef, useEffect } from 'react';
import { BookPage, PaperType, RulingStyle } from '../types/book';
import { renderPaperBackground } from '../engine/paper/paperTexture';
import { renderPageStrokes } from '../engine/handwriting/strokeRenderer';

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(250, 204, 21, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface BookPageCanvasProps {
  page: BookPage;
  pageNumber: number;
  width: number;
  height: number;
  paperType: PaperType;
  rulingStyle: RulingStyle;
  isRightPage: boolean;
  isActiveWritingPage: boolean;
  caretPosition?: { x: number; y: number; height: number };
  animatingStrokeId?: string;
  animatingProgress?: number;
  activeHighlightRect?: { x: number; y: number; width: number; height: number; color: string } | null;
  onClickPage?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPointerDownPage?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMovePage?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUpPage?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const BookPageCanvas: React.FC<BookPageCanvasProps> = ({
  page,
  pageNumber,
  width,
  height,
  paperType,
  rulingStyle,
  isRightPage,
  isActiveWritingPage,
  caretPosition,
  animatingStrokeId,
  animatingProgress = 1.0,
  activeHighlightRect,
  onClickPage,
  onPointerDownPage,
  onPointerMovePage,
  onPointerUpPage
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 1. Render realistic paper texture, grain, rulings, and spine shadows
    renderPaperBackground(ctx, {
      width,
      height,
      type: paperType,
      ruling: rulingStyle,
      isRightPage,
      pageNumber,
      lineHeight: 38,
      marginTop: 65,
      marginBottom: 55,
      marginLeft: isRightPage ? 55 : 45,
      marginRight: isRightPage ? 45 : 55,
      dpr
    });
    // 1b. Render text highlights (Marker ile Vurgulanan Metinler)
    if ((page.highlights && page.highlights.length > 0) || activeHighlightRect) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = 'multiply';

      // Persisted highlights
      for (const h of page.highlights || []) {
        ctx.fillStyle = hexToRgba(h.color || '#facc15', h.opacity || 0.42);
        for (const rect of h.rects) {
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 3);
          else ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.fill();
        }
      }

      // Live dragging highlight preview
      if (activeHighlightRect) {
        ctx.fillStyle = hexToRgba(activeHighlightRect.color || '#facc15', 0.45);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(activeHighlightRect.x, activeHighlightRect.y, activeHighlightRect.width, activeHighlightRect.height, 3);
        else ctx.rect(activeHighlightRect.x, activeHighlightRect.y, activeHighlightRect.width, activeHighlightRect.height);
        ctx.fill();
      }

      ctx.restore();
    }

    // 2. Render all handwritten strokes on this page
    renderPageStrokes(
      ctx,
      page.strokes,
      animatingStrokeId,
      animatingProgress,
      dpr
    );

    // 3. Render elegant writing caret if this page is active for typing
    if (isActiveWritingPage && caretPosition) {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.moveTo(caretPosition.x, caretPosition.y);
      ctx.lineTo(caretPosition.x, caretPosition.y + caretPosition.height);
      ctx.strokeStyle = '#b45309'; // Warm amber-gold caret
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Delicate nib diamond at caret top
      ctx.beginPath();
      ctx.arc(caretPosition.x, caretPosition.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.restore();
    }
  }, [
    page,
    pageNumber,
    width,
    height,
    paperType,
    rulingStyle,
    isRightPage,
    isActiveWritingPage,
    caretPosition,
    animatingStrokeId,
    animatingProgress
  ]);

  return (
    <div
      onClick={onClickPage}
      onPointerDown={onPointerDownPage}
      onPointerMove={onPointerMovePage}
      onPointerUp={onPointerUpPage}
      className={`relative w-full h-full select-none cursor-text overflow-hidden ${
        isActiveWritingPage ? 'ring-1 ring-amber-500/20' : ''
      }`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
