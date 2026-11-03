import { CharacterHandwritingStyle, WritingInstrument, StrokePoint, StrokeSegment, HandwrittenStroke } from '../../types/book';

export type RawPoint = [number, number]; // [x, y] in normalized glyph box (y=0 baseline, y=1 cap/ascender, y=-0.35 descender)
export type RawStroke = RawPoint[];

export interface NormalizedGlyph {
  char: string;
  width: number; // relative width (e.g. 0.2 to 1.1)
  strokes: RawStroke[];
  hasDescender?: boolean;
  hasAscender?: boolean;
  canConnectNext?: boolean; // whether a cursive tail can join to next character
  entryPoint?: RawPoint;
  exitPoint?: RawPoint;
}

export interface GeneratedCharLayout {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lineIndex: number;
  charIndex: number;
  rawGlyph: NormalizedGlyph;
}

export interface RenderOptions {
  instrument: WritingInstrument;
  color: string;
  baseThickness: number;
  opacity: number;
  scale?: number;
  progress?: number; // 0 to 1 for animated drawing of current stroke
}
