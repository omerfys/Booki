import { PaperType, RulingStyle } from '../../types/book';

export interface PaperRenderOptions {
  width: number;
  height: number;
  type: PaperType;
  ruling: RulingStyle;
  isRightPage: boolean;
  pageNumber?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  dpr?: number;
}

interface PaperPalette {
  baseColor: string;
  grainColor: string;
  fiberColor: string;
  vignetteColor: string;
  rulingColor: string;
  spineShadowAlpha: number;
}

const PAPER_PALETTES: Record<PaperType, PaperPalette> = {
  'clean-white': {
    baseColor: '#fbfbfa',
    grainColor: 'rgba(0, 0, 0, 0.02)',
    fiberColor: 'rgba(120, 110, 100, 0.04)',
    vignetteColor: 'rgba(140, 130, 110, 0.08)',
    rulingColor: 'rgba(70, 100, 140, 0.12)',
    spineShadowAlpha: 0.18
  },
  'cream-notebook': {
    baseColor: '#f5edd9',
    grainColor: 'rgba(120, 80, 40, 0.035)',
    fiberColor: 'rgba(140, 95, 50, 0.06)',
    vignetteColor: 'rgba(110, 75, 40, 0.15)',
    rulingColor: 'rgba(140, 120, 95, 0.16)',
    spineShadowAlpha: 0.28
  },
  'aged-vintage': {
    baseColor: '#e9d6b2',
    grainColor: 'rgba(90, 50, 15, 0.06)',
    fiberColor: 'rgba(110, 60, 20, 0.10)',
    vignetteColor: 'rgba(90, 45, 10, 0.26)',
    rulingColor: 'rgba(110, 70, 30, 0.18)',
    spineShadowAlpha: 0.38
  },
  'yellowed': {
    baseColor: '#f2e4c4',
    grainColor: 'rgba(110, 80, 30, 0.04)',
    fiberColor: 'rgba(120, 70, 25, 0.07)',
    vignetteColor: 'rgba(120, 70, 20, 0.18)',
    rulingColor: 'rgba(130, 100, 60, 0.15)',
    spineShadowAlpha: 0.30
  },
  'fine-textured': {
    baseColor: '#f7f3ea',
    grainColor: 'rgba(80, 70, 60, 0.03)',
    fiberColor: 'rgba(100, 90, 75, 0.05)',
    vignetteColor: 'rgba(120, 100, 80, 0.12)',
    rulingColor: 'rgba(100, 110, 130, 0.14)',
    spineShadowAlpha: 0.22
  },
  'lightly-rough': {
    baseColor: '#ede2ce',
    grainColor: 'rgba(100, 70, 40, 0.05)',
    fiberColor: 'rgba(120, 80, 40, 0.09)',
    vignetteColor: 'rgba(100, 60, 30, 0.22)',
    rulingColor: 'rgba(120, 90, 60, 0.16)',
    spineShadowAlpha: 0.34
  }
};

export function renderPaperBackground(
  ctx: CanvasRenderingContext2D,
  options: PaperRenderOptions
): void {
  const {
    width,
    height,
    type,
    ruling,
    isRightPage,
    pageNumber,
    lineHeight = 38,
    marginTop = 60,
    marginBottom = 50,
    marginLeft = 50,
    marginRight = 50,
    dpr = 1
  } = options;

  const palette = PAPER_PALETTES[type] || PAPER_PALETTES['cream-notebook'];

  ctx.save();
  ctx.scale(dpr, dpr);

  // 1. Base solid paper color
  ctx.fillStyle = palette.baseColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle parchment lighting gradient
  const lightGrad = ctx.createLinearGradient(0, 0, width, height);
  lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
  lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.04)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Procedural paper fibers and speckles (deterministic using sinusoidal hash)
  const fiberCount = type === 'aged-vintage' || type === 'lightly-rough' ? 140 : 60;
  ctx.lineWidth = 0.5;

  for (let i = 0; i < fiberCount; i++) {
    const rx = ((Math.sin(i * 37.17) * 43758.54) % 1 + 1) % 1 * width;
    const ry = ((Math.cos(i * 59.23) * 23421.19) % 1 + 1) % 1 * height;
    const len = 3 + ((Math.sin(i * 13.51) + 1) * 3);
    const angle = Math.sin(i * 7.1) * Math.PI;

    ctx.strokeStyle = palette.fiberColor;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + Math.cos(angle) * len, ry + Math.sin(angle) * len);
    ctx.stroke();

    // Occasional foxing / age spots for vintage paper
    if (type === 'aged-vintage' && i % 12 === 0) {
      const spotRadius = 1.5 + (Math.sin(i) * 0.5 + 0.5) * 3.5;
      const spotGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, spotRadius);
      spotGrad.addColorStop(0, 'rgba(120, 70, 20, 0.16)');
      spotGrad.addColorStop(1, 'rgba(120, 70, 20, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(rx, ry, spotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Ruling Lines / Grids / Dots
  if (ruling === 'lined') {
    ctx.strokeStyle = palette.rulingColor;
    ctx.lineWidth = 0.8;
    for (let lineIdx = 0; ; lineIdx++) {
      const y = marginTop + 32 + lineIdx * 38;
      if (y > height - marginBottom) break;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(width - marginRight, y);
      ctx.stroke();
    }
    // Classic vertical margin line
    ctx.strokeStyle = 'rgba(210, 80, 80, 0.12)';
    ctx.lineWidth = 1.0;
    const verticalMarginX = isRightPage ? marginLeft + 12 : width - marginRight - 12;
    ctx.beginPath();
    ctx.moveTo(verticalMarginX, marginTop);
    ctx.lineTo(verticalMarginX, height - marginBottom);
    ctx.stroke();

  } else if (ruling === 'dotted') {
    ctx.fillStyle = palette.rulingColor;
    const dotSpacing = 20;
    for (let x = marginLeft; x <= width - marginRight; x += dotSpacing) {
      for (let y = marginTop; y <= height - marginBottom; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (ruling === 'grid') {
    ctx.strokeStyle = palette.rulingColor;
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    // Horizontals
    for (let y = marginTop; y <= height - marginBottom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(width - marginRight, y);
      ctx.stroke();
    }
    // Verticals
    for (let x = marginLeft; x <= width - marginRight; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, height - marginBottom);
      ctx.stroke();
    }
  }

  // 5. Spine 3D Curvature & Valley Shadow
  // Left page has spine on the right (x=width)
  // Right page has spine on the left (x=0)
  const spineGrad = ctx.createLinearGradient(
    isRightPage ? 0 : width - 70,
    0,
    isRightPage ? 70 : width,
    0
  );

  if (isRightPage) {
    spineGrad.addColorStop(0, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 1.2})`);
    spineGrad.addColorStop(0.25, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 0.6})`);
    spineGrad.addColorStop(0.65, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 0.15})`);
    spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spineGrad;
    ctx.fillRect(0, 0, 75, height);
  } else {
    spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    spineGrad.addColorStop(0.35, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 0.15})`);
    spineGrad.addColorStop(0.75, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 0.6})`);
    spineGrad.addColorStop(1, `rgba(0, 0, 0, ${palette.spineShadowAlpha * 1.2})`);
    ctx.fillStyle = spineGrad;
    ctx.fillRect(width - 75, 0, 75, height);
  }

  // 6. Outer Deckled Edge Shadow (Subtle darkening near page trims)
  const edgeWidth = 14;
  const outerEdgeGrad = ctx.createLinearGradient(
    isRightPage ? width - edgeWidth : 0,
    0,
    isRightPage ? width : edgeWidth,
    0
  );
  if (isRightPage) {
    outerEdgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    outerEdgeGrad.addColorStop(1, palette.vignetteColor);
    ctx.fillStyle = outerEdgeGrad;
    ctx.fillRect(width - edgeWidth, 0, edgeWidth, height);
  } else {
    outerEdgeGrad.addColorStop(0, palette.vignetteColor);
    outerEdgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = outerEdgeGrad;
    ctx.fillRect(0, 0, edgeWidth, height);
  }

  // 7. Page Number
  if (pageNumber !== undefined) {
    ctx.fillStyle = 'rgba(80, 65, 50, 0.45)';
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = isRightPage ? 'right' : 'left';
    const pageX = isRightPage ? width - marginRight : marginLeft;
    ctx.fillText(`${pageNumber}`, pageX, height - 22);
  }

  ctx.restore();
}
