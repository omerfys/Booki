import { HandwrittenStroke, StrokePoint, WritingInstrument } from '../../types/book';

export interface StrokeRenderContext {
  ctx: CanvasRenderingContext2D;
  dpr?: number;
  highlightColor?: string;
  isCaretActive?: boolean;
}

// Convert hex color to rgba components
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(26, 35, 58, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Render a single stroke onto the 2D canvas with instrument-specific physics
export function renderStroke(
  ctx: CanvasRenderingContext2D,
  stroke: HandwrittenStroke,
  progress: number = 1.0,
  dpr: number = 1
): void {
  if (progress <= 0 || stroke.segments.length === 0) return;

  const totalPoints = stroke.segments.reduce((sum, seg) => sum + seg.points.length, 0);
  if (totalPoints === 0) return;

  const pointsToRender = Math.max(1, Math.floor(totalPoints * Math.min(1.0, progress)));
  let renderedCount = 0;

  ctx.save();

  switch (stroke.instrument) {
    case 'pencil':
      renderPencilStroke(ctx, stroke, pointsToRender, dpr);
      break;
    case 'fountain':
      renderFountainPenStroke(ctx, stroke, pointsToRender, dpr);
      break;
    case 'marker':
      renderMarkerStroke(ctx, stroke, pointsToRender, dpr);
      break;
    case 'ballpoint':
    default:
      renderBallpointStroke(ctx, stroke, pointsToRender, dpr);
      break;
  }

  ctx.restore();
}

// 1. PENCIL: Graphite texture, rough grain, pressure density, stippled fibers
function renderPencilStroke(
  ctx: CanvasRenderingContext2D,
  stroke: HandwrittenStroke,
  pointsLimit: number,
  dpr: number
): void {
  const baseColor = stroke.color || '#333333';
  const baseThickness = stroke.baseThickness * dpr;
  let pointCounter = 0;

  for (let s = 0; s < stroke.segments.length; s++) {
    const segment = stroke.segments[s];
    const pts = segment.points;
    if (pts.length < 2) continue;

    for (let i = 0; i < pts.length - 1; i++) {
      if (pointCounter >= pointsLimit) return;
      pointCounter++;

      const p0 = pts[i];
      const p1 = pts[i + 1];

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.1) continue;

      const normX = -dy / dist;
      const normY = dx / dist;

      const avgPressure = (p0.pressure + p1.pressure) * 0.5;
      const currentThickness = baseThickness * avgPressure * 0.9;
      const alpha = Math.min(0.85, stroke.opacity * 0.65 * avgPressure);

      // Core graphite line
      ctx.beginPath();
      ctx.moveTo(p0.x * dpr, p0.y * dpr);
      ctx.lineTo(p1.x * dpr, p1.y * dpr);
      ctx.strokeStyle = hexToRgba(baseColor, alpha);
      ctx.lineWidth = currentThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Graphite texture grain fibers along stroke normal
      const grainPasses = Math.min(4, Math.max(1, Math.floor(currentThickness)));
      for (let g = 0; g < grainPasses; g++) {
        const offsetDist = ((g / grainPasses) - 0.5) * currentThickness * 1.1;
        const grainAlpha = alpha * (0.2 + (Math.sin(pointCounter * 12.3 + g) * 0.5 + 0.5) * 0.4);

        ctx.beginPath();
        ctx.moveTo(
          (p0.x + normX * offsetDist) * dpr,
          (p0.y + normY * offsetDist) * dpr
        );
        ctx.lineTo(
          (p1.x + normX * offsetDist) * dpr,
          (p1.y + normY * offsetDist) * dpr
        );
        ctx.strokeStyle = hexToRgba(baseColor, grainAlpha);
        ctx.lineWidth = 0.6 * dpr;
        ctx.stroke();
      }
    }
  }
}

// 2. BALLPOINT: Smooth fluid rolling ink line, crisp edge, subtle pressure modulation
function renderBallpointStroke(
  ctx: CanvasRenderingContext2D,
  stroke: HandwrittenStroke,
  pointsLimit: number,
  dpr: number
): void {
  const baseThickness = stroke.baseThickness * dpr;
  let pointCounter = 0;

  for (let s = 0; s < stroke.segments.length; s++) {
    const segment = stroke.segments[s];
    const pts = segment.points;
    if (pts.length < 2) continue;

    for (let i = 0; i < pts.length - 1; i++) {
      if (pointCounter >= pointsLimit) return;
      pointCounter++;

      const p0 = pts[i];
      const p1 = pts[i + 1];

      const avgPressure = (p0.pressure + p1.pressure) * 0.5;
      const currentThickness = Math.max(0.6 * dpr, baseThickness * avgPressure);
      const currentAlpha = Math.min(1.0, stroke.opacity * (0.85 + 0.15 * avgPressure));

      ctx.beginPath();
      ctx.moveTo(p0.x * dpr, p0.y * dpr);
      ctx.lineTo(p1.x * dpr, p1.y * dpr);
      ctx.strokeStyle = hexToRgba(stroke.color, currentAlpha);
      ctx.lineWidth = currentThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }
}

// 3. FOUNTAIN PEN: Elegant calligraphic nib angle dynamics, line thickness variation, wet ink pooling
function renderFountainPenStroke(
  ctx: CanvasRenderingContext2D,
  stroke: HandwrittenStroke,
  pointsLimit: number,
  dpr: number
): void {
  const baseThickness = stroke.baseThickness * dpr;
  const nibAngleRad = (45 * Math.PI) / 180; // 45-degree italic / flex nib
  let pointCounter = 0;

  for (let s = 0; s < stroke.segments.length; s++) {
    const segment = stroke.segments[s];
    const pts = segment.points;
    if (pts.length < 2) continue;

    for (let i = 0; i < pts.length - 1; i++) {
      if (pointCounter >= pointsLimit) return;
      pointCounter++;

      const p0 = pts[i];
      const p1 = pts[i + 1];

      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const strokeAngle = Math.atan2(dy, dx);

      // Calligraphic factor: line is wide when perpendicular to nib slit, thin when parallel
      const angleDiff = Math.abs(Math.sin(strokeAngle - nibAngleRad));
      const nibFactor = 0.45 + 0.85 * angleDiff;

      const avgPressure = (p0.pressure + p1.pressure) * 0.5;
      const currentThickness = Math.max(0.8 * dpr, baseThickness * nibFactor * avgPressure * 1.25);
      const alpha = Math.min(1.0, stroke.opacity * (0.9 + 0.1 * avgPressure));

      ctx.beginPath();
      ctx.moveTo(p0.x * dpr, p0.y * dpr);
      ctx.lineTo(p1.x * dpr, p1.y * dpr);
      ctx.strokeStyle = hexToRgba(stroke.color, alpha);
      ctx.lineWidth = currentThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Wet ink pooling at sharp turns or stroke termination
      if (i > 0 && i < pts.length - 1) {
        const pPrev = pts[i - 1];
        const prevDx = p0.x - pPrev.x;
        const prevDy = p0.y - pPrev.y;
        const prevAngle = Math.atan2(prevDy, prevDx);
        const turnAngle = Math.abs(strokeAngle - prevAngle);

        if (turnAngle > 0.85) {
          // Sharp turn pooling puddle
          ctx.beginPath();
          ctx.arc(p0.x * dpr, p0.y * dpr, currentThickness * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(stroke.color, alpha * 0.4);
          ctx.fill();
        }
      }
    }

    // Pool at stroke end
    if (pts.length > 2 && pointCounter < pointsLimit) {
      const endPt = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(endPt.x * dpr, endPt.y * dpr, baseThickness * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(stroke.color, stroke.opacity * 0.35);
      ctx.fill();
    }
  }
}

// 4. MARKER: Broad semi-translucent felt tip, slight overlap darkening
function renderMarkerStroke(
  ctx: CanvasRenderingContext2D,
  stroke: HandwrittenStroke,
  pointsLimit: number,
  dpr: number
): void {
  const baseThickness = stroke.baseThickness * 2.8 * dpr;
  const alpha = Math.min(0.65, stroke.opacity * 0.5);
  let pointCounter = 0;

  for (let s = 0; s < stroke.segments.length; s++) {
    const segment = stroke.segments[s];
    const pts = segment.points;
    if (pts.length < 2) continue;

    for (let i = 0; i < pts.length - 1; i++) {
      if (pointCounter >= pointsLimit) return;
      pointCounter++;

      const p0 = pts[i];
      const p1 = pts[i + 1];

      const avgPressure = (p0.pressure + p1.pressure) * 0.5;
      const currentThickness = baseThickness * (0.85 + 0.25 * avgPressure);

      ctx.beginPath();
      ctx.moveTo(p0.x * dpr, p0.y * dpr);
      ctx.lineTo(p1.x * dpr, p1.y * dpr);
      ctx.strokeStyle = hexToRgba(stroke.color, alpha);
      ctx.lineWidth = currentThickness;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.stroke();
    }
  }
}

// Render all strokes of a page
export function renderPageStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: HandwrittenStroke[],
  animatingStrokeId?: string,
  animatingProgress: number = 1.0,
  dpr: number = 1
): void {
  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];
    if (stroke.id === animatingStrokeId) {
      renderStroke(ctx, stroke, animatingProgress, dpr);
    } else {
      renderStroke(ctx, stroke, 1.0, dpr);
    }
  }
}
