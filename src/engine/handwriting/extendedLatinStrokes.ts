import { NormalizedGlyph } from './types';
import { LATIN_LOWERCASE, LATIN_UPPERCASE } from './latinStrokes';

function cloneGlyph(base: NormalizedGlyph, newChar: string): NormalizedGlyph {
  return {
    ...base,
    char: newChar,
    strokes: base.strokes.map(s => s.map(p => [...p] as [number, number]))
  };
}

export const EXTENDED_LATIN: Record<string, NormalizedGlyph> = {
  // Turkish specific
  'ç': {
    ...cloneGlyph(LATIN_LOWERCASE['c'], 'ç'),
    hasDescender: true,
    strokes: [
      ...LATIN_LOWERCASE['c'].strokes,
      // Cedilla hook below
      [[0.24, 0.00], [0.24, -0.08], [0.18, -0.18], [0.32, -0.16]]
    ]
  },
  'Ç': {
    ...cloneGlyph(LATIN_UPPERCASE['C'], 'Ç'),
    hasDescender: true,
    strokes: [
      ...LATIN_UPPERCASE['C'].strokes,
      // Cedilla hook below
      [[0.34, 0.00], [0.34, -0.08], [0.26, -0.18], [0.42, -0.16]]
    ]
  },
  'ğ': {
    ...cloneGlyph(LATIN_LOWERCASE['g'], 'ğ'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['g'].strokes,
      // Breve curved accent above
      [[0.18, 0.68], [0.28, 0.60], [0.38, 0.68]]
    ]
  },
  'Ğ': {
    ...cloneGlyph(LATIN_UPPERCASE['G'], 'Ğ'),
    hasAscender: true,
    strokes: [
      ...LATIN_UPPERCASE['G'].strokes,
      // Breve above
      [[0.24, 1.14], [0.36, 1.06], [0.48, 1.14]]
    ]
  },
  // Dotless i
  'ı': {
    char: 'ı',
    width: 0.26,
    strokes: [
      [[0.12, 0.52], [0.14, 0.14], [0.18, 0.00], [0.26, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.26, 0.06]
  },
  'I': LATIN_UPPERCASE['I'], // Dotless capital I is regular I
  // Dotted capital I
  'İ': {
    ...cloneGlyph(LATIN_UPPERCASE['I'], 'İ'),
    strokes: [
      ...LATIN_UPPERCASE['I'].strokes,
      [[0.18, 1.15], [0.19, 1.16]]
    ]
  },
  'ö': {
    ...cloneGlyph(LATIN_LOWERCASE['o'], 'ö'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['o'].strokes,
      [[0.18, 0.68], [0.19, 0.69]],
      [[0.32, 0.68], [0.33, 0.69]]
    ]
  },
  'Ö': {
    ...cloneGlyph(LATIN_UPPERCASE['O'], 'Ö'),
    hasAscender: true,
    strokes: [
      ...LATIN_UPPERCASE['O'].strokes,
      [[0.26, 1.14], [0.27, 1.15]],
      [[0.42, 1.14], [0.43, 1.15]]
    ]
  },
  'ş': {
    ...cloneGlyph(LATIN_LOWERCASE['s'], 'ş'),
    hasDescender: true,
    strokes: [
      ...LATIN_LOWERCASE['s'].strokes,
      [[0.24, 0.00], [0.24, -0.08], [0.18, -0.18], [0.32, -0.16]]
    ]
  },
  'Ş': {
    ...cloneGlyph(LATIN_UPPERCASE['S'], 'Ş'),
    hasDescender: true,
    strokes: [
      ...LATIN_UPPERCASE['S'].strokes,
      [[0.28, 0.00], [0.28, -0.08], [0.22, -0.18], [0.36, -0.16]]
    ]
  },
  'ü': {
    ...cloneGlyph(LATIN_LOWERCASE['u'], 'ü'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['u'].strokes,
      [[0.20, 0.68], [0.21, 0.69]],
      [[0.38, 0.68], [0.39, 0.69]]
    ]
  },
  'Ü': {
    ...cloneGlyph(LATIN_UPPERCASE['U'], 'Ü'),
    hasAscender: true,
    strokes: [
      ...LATIN_UPPERCASE['U'].strokes,
      [[0.24, 1.14], [0.25, 1.15]],
      [[0.42, 1.14], [0.43, 1.15]]
    ]
  },

  // French, Spanish, German accents
  'é': {
    ...cloneGlyph(LATIN_LOWERCASE['e'], 'é'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['e'].strokes,
      [[0.18, 0.60], [0.34, 0.76]] // Acute accent
    ]
  },
  'É': {
    ...cloneGlyph(LATIN_UPPERCASE['E'], 'É'),
    hasAscender: true,
    strokes: [
      ...LATIN_UPPERCASE['E'].strokes,
      [[0.24, 1.04], [0.40, 1.20]]
    ]
  },
  'è': {
    ...cloneGlyph(LATIN_LOWERCASE['e'], 'è'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['e'].strokes,
      [[0.34, 0.76], [0.18, 0.60]] // Grave accent
    ]
  },
  'ê': {
    ...cloneGlyph(LATIN_LOWERCASE['e'], 'ê'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['e'].strokes,
      [[0.16, 0.62], [0.26, 0.74], [0.36, 0.62]] // Circumflex
    ]
  },
  'ë': {
    ...cloneGlyph(LATIN_LOWERCASE['e'], 'ë'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['e'].strokes,
      [[0.18, 0.68], [0.19, 0.69]],
      [[0.32, 0.68], [0.33, 0.69]]
    ]
  },
  'à': {
    ...cloneGlyph(LATIN_LOWERCASE['a'], 'à'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['a'].strokes,
      [[0.38, 0.76], [0.24, 0.60]]
    ]
  },
  'á': {
    ...cloneGlyph(LATIN_LOWERCASE['a'], 'á'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['a'].strokes,
      [[0.24, 0.60], [0.38, 0.76]]
    ]
  },
  'â': {
    ...cloneGlyph(LATIN_LOWERCASE['a'], 'â'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['a'].strokes,
      [[0.22, 0.62], [0.32, 0.74], [0.42, 0.62]]
    ]
  },
  'ä': {
    ...cloneGlyph(LATIN_LOWERCASE['a'], 'ä'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['a'].strokes,
      [[0.22, 0.68], [0.23, 0.69]],
      [[0.38, 0.68], [0.39, 0.69]]
    ]
  },
  'í': {
    ...cloneGlyph(LATIN_LOWERCASE['i'], 'í'),
    hasAscender: true,
    strokes: [
      [[0.12, 0.52], [0.14, 0.14], [0.18, 0.00], [0.26, 0.06]],
      [[0.10, 0.62], [0.22, 0.76]]
    ]
  },
  'ó': {
    ...cloneGlyph(LATIN_LOWERCASE['o'], 'ó'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['o'].strokes,
      [[0.22, 0.60], [0.34, 0.76]]
    ]
  },
  'ú': {
    ...cloneGlyph(LATIN_LOWERCASE['u'], 'ú'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['u'].strokes,
      [[0.24, 0.60], [0.38, 0.76]]
    ]
  },
  'ñ': {
    ...cloneGlyph(LATIN_LOWERCASE['n'], 'ñ'),
    hasAscender: true,
    strokes: [
      ...LATIN_LOWERCASE['n'].strokes,
      // Tilde wave
      [[0.16, 0.66], [0.26, 0.72], [0.36, 0.62], [0.46, 0.68]]
    ]
  },
  'Ñ': {
    ...cloneGlyph(LATIN_UPPERCASE['N'], 'Ñ'),
    hasAscender: true,
    strokes: [
      ...LATIN_UPPERCASE['N'].strokes,
      [[0.24, 1.10], [0.36, 1.16], [0.46, 1.06], [0.58, 1.12]]
    ]
  },
  'ß': {
    char: 'ß',
    width: 0.56,
    hasAscender: true,
    hasDescender: true,
    strokes: [
      // Left vertical stem
      [[0.16, 0.96], [0.16, -0.20]],
      // Upper lobe and lower lobe
      [[0.16, 0.88], [0.34, 0.94], [0.46, 0.78], [0.34, 0.56], [0.18, 0.56]],
      [[0.18, 0.56], [0.44, 0.52], [0.50, 0.28], [0.38, 0.02], [0.18, 0.02]]
    ]
  },
  '¿': {
    char: '¿',
    width: 0.42,
    hasDescender: true,
    strokes: [
      [[0.20, 0.38], [0.21, 0.39]],
      [[0.20, 0.12], [0.20, -0.10], [0.32, -0.24], [0.34, -0.42], [0.20, -0.50], [0.10, -0.38]]
    ]
  },
  '¡': {
    char: '¡',
    width: 0.24,
    hasDescender: true,
    strokes: [
      [[0.12, 0.38], [0.13, 0.39]],
      [[0.12, 0.14], [0.12, -0.50]]
    ]
  }
};
