import { CharacterProfile, HandwrittenStroke, StrokePoint, StrokeSegment, WritingInstrument } from '../../types/book';
import { getGlyph } from './strokeRegistry';
import { NormalizedGlyph, RawPoint } from './types';

export interface PageLayoutConstraints {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  isRightPage?: boolean;
}

export interface GeneratedPageContent {
  strokes: HandwrittenStroke[];
  linesCount: number;
  isFull: boolean;
  overflowText?: string;
  caretPosition: { x: number; y: number; height: number };
}

// Pseudo-random generator for reproducible organic variation
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999.1337) * 43758.5453123;
  return x - Math.floor(x);
}

// Catmull-Rom spline point interpolation for smooth organic curve
function interpolateCatmullRom(p0: RawPoint, p1: RawPoint, p2: RawPoint, p3: RawPoint, t: number): RawPoint {
  const t2 = t * t;
  const t3 = t2 * t;

  const f0 = -0.5 * t3 + t2 - 0.5 * t;
  const f1 = 1.5 * t3 - 2.5 * t2 + 1.0;
  const f2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
  const f3 = 0.5 * t3 - 0.5 * t2;

  return [
    p0[0] * f0 + p1[0] * f1 + p2[0] * f2 + p3[0] * f3,
    p0[1] * f0 + p1[1] * f1 + p2[1] * f2 + p3[1] * f3
  ];
}

export function generatePageStrokes(
  text: string,
  profile: CharacterProfile,
  constraints: PageLayoutConstraints,
  instrument: WritingInstrument = 'ballpoint',
  color: string = '#1a233a',
  baseThickness: number = 1.8,
  opacity: number = 0.95,
  seedOffset: number = 42
): GeneratedPageContent {
  const { style } = profile;
  const usableWidth = constraints.width - constraints.marginLeft - constraints.marginRight;
  const usableHeight = constraints.height - constraints.marginTop - constraints.marginBottom;

  const fontSize = style.size;
  const PAGE_LINE_HEIGHT = 38;
  const LINE_BASELINE_OFFSET = 32;

  let currentX = constraints.marginLeft;
  let lineIndex = 0;
  let charIndex = 0;

  const strokes: HandwrittenStroke[] = [];
  // Tokenize cleanly into words and whitespace runs
  const tokens = text.match(/\S+|\s+/g) || [];

  let isFull = false;
  let overflowStartIndex = -1;
  let globalCharCounter = 0;

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];

    // 1. Explicit Newline handling
    if (token.includes('\n')) {
      const newlinesCount = (token.match(/\n/g) || []).length;
      for (let n = 0; n < newlinesCount; n++) {
        currentX = constraints.marginLeft;
        lineIndex++;
        const testY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT;
        if (testY > constraints.height - constraints.marginBottom) {
          isFull = true;
          overflowStartIndex = globalCharCounter;
          break;
        }
      }
      globalCharCounter += token.length;
      if (isFull) break;
      continue;
    }

    // 2. Spaces: natural, clean word spacing without double padding
    if (/^\s+$/.test(token)) {
      // Suppress leading space right after a newline or wrap
      if (currentX === constraints.marginLeft) {
        globalCharCounter += token.length;
        continue;
      }
      const spaceAdvance = Math.round(fontSize * 0.36) * token.length;
      currentX += spaceAdvance;
      globalCharCounter += token.length;
      continue;
    }

    // 3. Word token: calculate exact rendered width for wrapping
    let wordWidth = 0;
    for (let i = 0; i < token.length; i++) {
      const glyph = getGlyph(token[i]);
      wordWidth += glyph.width * fontSize + style.letterSpacing;
    }

    // Wrap if word overflows right margin
    if (currentX > constraints.marginLeft && currentX + wordWidth > constraints.width - constraints.marginRight) {
      currentX = constraints.marginLeft;
      lineIndex++;
      const testY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT;
      if (testY > constraints.height - constraints.marginBottom) {
        isFull = true;
        overflowStartIndex = globalCharCounter;
        break;
      }
    }
    const isHindiWord = /[\u0900-\u097F]/.test(token);
    const shirorekhaStartX = currentX;

    // Render individual characters of the word
    for (let c = 0; c < token.length; c++) {
      const char = token[c];
      const glyph = getGlyph(char);
      const seed = seedOffset + globalCharCounter * 17.31 + c * 3.7;

      const sizeScale = 1.0 + (pseudoRandom(seed + 2) - 0.5) * 0.05;
      const effectiveFontSize = fontSize * sizeScale;
      const charWidth = glyph.width * effectiveFontSize;

      // HARD MARGIN CONSTRAINT: never allow characters to cross into the spine or off page
      if (currentX + charWidth > constraints.width - constraints.marginRight) {
        currentX = constraints.marginLeft;
        lineIndex++;
        const nextY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT;
        if (nextY > constraints.height - constraints.marginBottom) {
          isFull = true;
          overflowStartIndex = globalCharCounter;
          break;
        }
      }

      const currentBaselineY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT;
      const baselineJitter = (pseudoRandom(seed + 1) - 0.5) * Math.min(0.7, style.baselineJitter);
      const slantRad = ((style.slant + (pseudoRandom(seed + 3) - 0.5) * 0.8) * Math.PI) / 180;
      const slantFactor = Math.tan(slantRad);
      const charBaselineY = currentBaselineY + baselineJitter;
      const segments: StrokeSegment[] = [];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      for (let s = 0; s < glyph.strokes.length; s++) {
        const rawPoints = glyph.strokes[s];
        if (rawPoints.length === 0) continue;

        const points: StrokePoint[] = [];

        // Densify points with Catmull-Rom interpolation for natural smoothness
        const densePoints: RawPoint[] = [];
        if (rawPoints.length === 1) {
          densePoints.push(rawPoints[0]);
        } else if (rawPoints.length === 2) {
          const steps = 6;
          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            densePoints.push([
              rawPoints[0][0] + (rawPoints[1][0] - rawPoints[0][0]) * t,
              rawPoints[0][1] + (rawPoints[1][1] - rawPoints[0][1]) * t
            ]);
          }
        } else {
          for (let p = 0; p < rawPoints.length - 1; p++) {
            const p0 = rawPoints[Math.max(0, p - 1)];
            const p1 = rawPoints[p];
            const p2 = rawPoints[p + 1];
            const p3 = rawPoints[Math.min(rawPoints.length - 1, p + 2)];

            const steps = 5;
            for (let step = 0; step < steps; step++) {
              densePoints.push(interpolateCatmullRom(p0, p1, p2, p3, step / steps));
            }
          }
          densePoints.push(rawPoints[rawPoints.length - 1]);
        }

        // Transform dense points to page coordinates
        for (let ptIdx = 0; ptIdx < densePoints.length; ptIdx++) {
          const [normX, normY] = densePoints[ptIdx];

          // Micro tremor jitter (hand shake)
          const tremorX = (pseudoRandom(seed + ptIdx * 2.1) - 0.5) * 0.4;
          const tremorY = (pseudoRandom(seed + ptIdx * 2.1 + 0.5) - 0.5) * 0.4;

          // Apply slant and coordinate mapping
          const px = currentX + (normX * effectiveFontSize) + (normY * effectiveFontSize * slantFactor) + tremorX;
          const py = charBaselineY - (normY * effectiveFontSize) + tremorY;

          // Pressure simulation: downstrokes are heavier, upstrokes and edges are lighter
          let dy = 0;
          if (ptIdx > 0) {
            dy = densePoints[ptIdx][1] - densePoints[ptIdx - 1][1];
          }
          const isDownstroke = dy < 0; // In normalized box, dy < 0 means moving downwards towards baseline
          const downstrokeBoost = isDownstroke ? 0.35 : -0.15;

          const edgeFade = Math.sin((ptIdx / Math.max(1, densePoints.length - 1)) * Math.PI);
          const rawPressure = style.pressureMin + (style.pressureMax - style.pressureMin) * (0.6 + downstrokeBoost);
          const pressure = Math.max(0.3, Math.min(2.0, rawPressure * (0.8 + 0.2 * edgeFade)));

          points.push({ x: px, y: py, pressure });

          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxX = Math.max(maxX, px);
          maxY = Math.max(maxY, py);
        }

        segments.push({ points });
      }

      // Connecting cursive tail if next char exists and glyph can connect
      const nextChar = token[c + 1];
      if (glyph.canConnectNext && nextChar && style.connectTailLength > 0 && glyph.exitPoint) {
        const nextGlyph = getGlyph(nextChar);
        if (nextGlyph.strokes.length > 0) {
          const exitX = currentX + (glyph.exitPoint[0] * effectiveFontSize) + (glyph.exitPoint[1] * effectiveFontSize * slantFactor);
          const exitY = charBaselineY - (glyph.exitPoint[1] * effectiveFontSize);

          const targetEntryX = currentX + charWidth + style.letterSpacing + (nextGlyph.entryPoint ? nextGlyph.entryPoint[0] * effectiveFontSize : 0);
          const targetEntryY = charBaselineY - (nextGlyph.entryPoint ? nextGlyph.entryPoint[1] * effectiveFontSize : 0);

          const tailPoints: StrokePoint[] = [];
          const tailSteps = 4;
          for (let t = 0; t <= tailSteps; t++) {
            const frac = t / tailSteps;
            const midDip = Math.sin(frac * Math.PI) * 1.5; // Natural subtle baseline dip
            tailPoints.push({
              x: exitX + (targetEntryX - exitX) * frac,
              y: exitY + (targetEntryY - exitY) * frac + midDip,
              pressure: style.pressureMin * 0.7
            });
          }
          segments.push({ points: tailPoints });
        }
      }

      if (segments.length > 0 && minX < Infinity) {
        strokes.push({
          id: `stroke-${lineIndex}-${charIndex}-${globalCharCounter}`,
          char,
          lineIndex,
          charIndex,
          characterId: profile.id,
          instrument,
          color,
          baseThickness,
          opacity,
          segments,
          bounds: { minX, minY, maxX, maxY },
          timestamp: Date.now()
        });
      }

      currentX += charWidth + style.letterSpacing;
      charIndex++;
      globalCharCounter++;
    }

    // Connect Devanagari continuous shirorekha top bar across the Hindi word
    if (isHindiWord && currentX > shirorekhaStartX + 5) {
      const topBarY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT - fontSize * 0.85;
      const barPoints: StrokePoint[] = [];
      const steps = 8;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        barPoints.push({
          x: shirorekhaStartX + (currentX - shirorekhaStartX) * frac,
          y: topBarY + (pseudoRandom(s * 3.3) - 0.5) * 0.6,
          pressure: style.pressureMax * 0.9
        });
      }
      strokes.push({
        id: `shirorekha-${lineIndex}-${globalCharCounter}`,
        char: '—',
        lineIndex,
        charIndex: globalCharCounter,
        characterId: profile.id,
        instrument,
        color,
        baseThickness: baseThickness * 0.9,
        opacity,
        segments: [{ points: barPoints }],
        bounds: {
          minX: shirorekhaStartX,
          minY: topBarY - 2,
          maxX: currentX,
          maxY: topBarY + 2
        },
        timestamp: Date.now()
      });
    }
    // No spurious inter-word spacing added to tokens!
  }

  const finalY = constraints.marginTop + LINE_BASELINE_OFFSET + lineIndex * PAGE_LINE_HEIGHT;

  return {
    strokes,
    linesCount: lineIndex + 1,
    isFull,
    overflowText: isFull && overflowStartIndex >= 0 ? text.slice(overflowStartIndex) : undefined,
    caretPosition: {
      x: currentX,
      y: finalY - fontSize * 0.82,
      height: fontSize * 0.95
    }
  };
}
