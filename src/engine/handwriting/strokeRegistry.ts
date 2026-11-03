import { NormalizedGlyph } from './types';
import { LATIN_LOWERCASE, LATIN_UPPERCASE, DIGITS_AND_PUNCTUATION } from './latinStrokes';
import { EXTENDED_LATIN } from './extendedLatinStrokes';
import { CYRILLIC_STROKES } from './cyrillicStrokes';
import { JAPANESE_STROKES } from './japaneseStrokes';
import { HINDI_STROKES } from './hindiStrokes';

const GLYPH_MAP: Record<string, NormalizedGlyph> = {
  ...LATIN_LOWERCASE,
  ...LATIN_UPPERCASE,
  ...DIGITS_AND_PUNCTUATION,
  ...EXTENDED_LATIN,
  ...CYRILLIC_STROKES,
  ...JAPANESE_STROKES,
  ...HINDI_STROKES
};

// Additional currency & symbols
GLYPH_MAP['$'] = {
  char: '$',
  width: 0.52,
  hasAscender: true,
  hasDescender: true,
  strokes: [
    ...LATIN_UPPERCASE['S'].strokes,
    [[0.26, 1.08], [0.26, -0.15]]
  ]
};
GLYPH_MAP['€'] = {
  char: '€',
  width: 0.58,
  hasAscender: true,
  strokes: [
    ...LATIN_UPPERCASE['C'].strokes,
    [[0.10, 0.58], [0.38, 0.58]],
    [[0.10, 0.42], [0.38, 0.42]]
  ]
};
GLYPH_MAP['£'] = {
  char: '£',
  width: 0.56,
  hasAscender: true,
  strokes: [
    [[0.46, 0.88], [0.34, 0.98], [0.22, 0.84], [0.24, 0.42], [0.16, 0.12], [0.12, 0.02], [0.50, 0.02]],
    [[0.12, 0.46], [0.36, 0.46]]
  ]
};
GLYPH_MAP['¥'] = {
  char: '¥',
  width: 0.58,
  hasAscender: true,
  strokes: [
    [[0.14, 0.96], [0.29, 0.50], [0.44, 0.96]],
    [[0.29, 0.50], [0.29, 0.02]],
    [[0.16, 0.48], [0.42, 0.48]],
    [[0.16, 0.34], [0.42, 0.34]]
  ]
};
GLYPH_MAP['#'] = {
  char: '#',
  width: 0.54,
  hasAscender: true,
  strokes: [
    [[0.22, 0.96], [0.16, 0.02]],
    [[0.38, 0.96], [0.32, 0.02]],
    [[0.08, 0.64], [0.46, 0.64]],
    [[0.06, 0.36], [0.44, 0.36]]
  ]
};
GLYPH_MAP['&'] = {
  char: '&',
  width: 0.60,
  hasAscender: true,
  strokes: [
    [[0.52, 0.12], [0.44, 0.02], [0.24, 0.04], [0.14, 0.22], [0.24, 0.48], [0.36, 0.72], [0.30, 0.94], [0.18, 0.82], [0.18, 0.68], [0.48, 0.20], [0.56, 0.02]]
  ]
};
GLYPH_MAP['%'] = {
  char: '%',
  width: 0.66,
  hasAscender: true,
  strokes: [
    [[0.52, 0.94], [0.14, 0.04]],
    [[0.20, 0.88], [0.28, 0.88], [0.28, 0.72], [0.20, 0.72], [0.20, 0.88]],
    [[0.38, 0.28], [0.46, 0.28], [0.46, 0.12], [0.38, 0.12], [0.38, 0.28]]
  ]
};

// Procedural vector stroke synthesizer for rare unlisted Unicode characters
function createProceduralGlyph(char: string): NormalizedGlyph {
  // If decomposable accented char
  const normalized = char.normalize('NFD');
  if (normalized.length > 1) {
    const baseChar = normalized[0];
    const baseGlyph = GLYPH_MAP[baseChar] || LATIN_LOWERCASE['a'];
    return {
      ...baseGlyph,
      char,
      strokes: [
        ...baseGlyph.strokes,
        [[baseGlyph.width * 0.4, 0.68], [baseGlyph.width * 0.6, 0.68]]
      ]
    };
  }

  const code = char.charCodeAt(0);
  // Authentic CJK Ideographic calligraphic stroke structure
  if (code >= 0x4e00 && code <= 0x9fff) {
    return {
      char,
      width: 0.82,
      hasAscender: true,
      strokes: [
        [[0.20, 0.84], [0.66, 0.84]],
        [[0.43, 0.88], [0.43, 0.12]],
        [[0.22, 0.54], [0.62, 0.54]],
        [[0.43, 0.54], [0.22, 0.18]],
        [[0.43, 0.54], [0.64, 0.18]],
        [[0.16, 0.12], [0.70, 0.12]]
      ]
    };
  }

  // Generic handwritten mark for other rare codepoints
  return {
    char,
    width: 0.45,
    hasAscender: true,
    strokes: [
      [[0.12, 0.70], [0.35, 0.12]],
      [[0.35, 0.70], [0.12, 0.12]]
    ]
  };
}

export function getGlyph(char: string): NormalizedGlyph {
  if (GLYPH_MAP[char]) {
    return GLYPH_MAP[char];
  }
  // Case-insensitive fallback if available
  const lower = char.toLowerCase();
  if (GLYPH_MAP[lower]) {
    return GLYPH_MAP[lower];
  }
  const upper = char.toUpperCase();
  if (GLYPH_MAP[upper]) {
    return GLYPH_MAP[upper];
  }
  return createProceduralGlyph(char);
}

export function hasGlyph(char: string): boolean {
  return !!GLYPH_MAP[char];
}
