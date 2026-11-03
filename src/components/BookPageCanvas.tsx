import React, { useRef, useEffect } from 'react';
import { BookPage, PaperType, RulingStyle } from '../types/book';
import { renderPaperBackground } from '../engine/paper/paperTexture';
import { renderPageStrokes } from '../engine/handwriting/strokeRenderer';

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
  onClickPage?: (e: React.MouseEvent<HTMLDivElement>) => void;
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
  onClickPage
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
      className={`relative w-full h-full select-none cursor-text overflow-hidden ${
        isActiveWritingPage ? 'ring-1 ring-amber-500/20' : ''
      }`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
