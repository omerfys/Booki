import { NormalizedGlyph } from './types';

// Normalized coordinates:
// Baseline is at y = 0
// X-height is around y = 0.55
// Cap height / Ascender is around y = 1.0
// Descender is around y = -0.35
// X progresses from left (0) to width

export const LATIN_LOWERCASE: Record<string, NormalizedGlyph> = {
  a: {
    char: 'a',
    width: 0.55,
    strokes: [
      // Oval loop counter-clockwise
      [[0.48, 0.48], [0.38, 0.56], [0.18, 0.50], [0.08, 0.32], [0.12, 0.12], [0.28, 0.02], [0.46, 0.10], [0.50, 0.46]],
      // Downstem and connecting exit flick
      [[0.48, 0.50], [0.48, 0.12], [0.52, 0.00], [0.58, 0.04]]
    ],
    canConnectNext: true,
    exitPoint: [0.58, 0.04]
  },
  b: {
    char: 'b',
    width: 0.55,
    hasAscender: true,
    strokes: [
      // Ascender stroke from top down to baseline
      [[0.14, 0.98], [0.14, 0.40], [0.14, 0.02]],
      // Lower belly loop
      [[0.14, 0.28], [0.24, 0.48], [0.42, 0.50], [0.52, 0.38], [0.52, 0.18], [0.38, 0.02], [0.16, 0.02], [0.22, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.50, 0.12]
  },
  c: {
    char: 'c',
    width: 0.46,
    strokes: [
      [[0.44, 0.46], [0.36, 0.54], [0.18, 0.48], [0.08, 0.30], [0.10, 0.12], [0.24, 0.00], [0.44, 0.02], [0.50, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.50, 0.08]
  },
  d: {
    char: 'd',
    width: 0.55,
    hasAscender: true,
    strokes: [
      // Oval loop
      [[0.46, 0.44], [0.36, 0.52], [0.18, 0.46], [0.08, 0.28], [0.12, 0.10], [0.28, 0.02], [0.44, 0.12], [0.46, 0.44]],
      // Tall ascender downstem and flick
      [[0.48, 0.98], [0.46, 0.36], [0.46, 0.06], [0.50, 0.00], [0.58, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.58, 0.06]
  },
  e: {
    char: 'e',
    width: 0.48,
    strokes: [
      // Loop from crossbar up and around
      [[0.10, 0.26], [0.44, 0.28], [0.44, 0.42], [0.34, 0.54], [0.18, 0.50], [0.08, 0.30], [0.12, 0.10], [0.28, 0.00], [0.46, 0.02], [0.50, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.50, 0.08]
  },
  f: {
    char: 'f',
    width: 0.42,
    hasAscender: true,
    hasDescender: true,
    strokes: [
      // Top hook and downstroke
      [[0.38, 0.96], [0.28, 0.98], [0.20, 0.88], [0.18, 0.30], [0.18, 0.00], [0.16, -0.22]],
      // Crossbar
      [[0.06, 0.52], [0.34, 0.52]]
    ],
    canConnectNext: false
  },
  g: {
    char: 'g',
    width: 0.52,
    hasDescender: true,
    strokes: [
      // Top bowl
      [[0.46, 0.44], [0.36, 0.52], [0.18, 0.46], [0.08, 0.28], [0.12, 0.12], [0.28, 0.02], [0.44, 0.12], [0.46, 0.44]],
      // Descender hook / loop
      [[0.46, 0.46], [0.46, 0.02], [0.44, -0.20], [0.32, -0.34], [0.14, -0.32], [0.08, -0.18], [0.30, 0.00], [0.52, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.52, 0.08]
  },
  h: {
    char: 'h',
    width: 0.55,
    hasAscender: true,
    strokes: [
      // Tall stem
      [[0.14, 0.98], [0.14, 0.38], [0.14, 0.00]],
      // Arch and right leg
      [[0.14, 0.26], [0.24, 0.48], [0.40, 0.52], [0.48, 0.38], [0.48, 0.04], [0.54, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.54, 0.06]
  },
  i: {
    char: 'i',
    width: 0.26,
    strokes: [
      // Main stem
      [[0.12, 0.52], [0.14, 0.14], [0.18, 0.00], [0.26, 0.06]],
      // Dot
      [[0.16, 0.72], [0.17, 0.73]]
    ],
    canConnectNext: true,
    exitPoint: [0.26, 0.06]
  },
  j: {
    char: 'j',
    width: 0.30,
    hasDescender: true,
    strokes: [
      // Stem into descender loop
      [[0.18, 0.52], [0.18, 0.02], [0.16, -0.20], [0.08, -0.32], [-0.04, -0.28], [-0.02, -0.14], [0.18, 0.02], [0.28, 0.08]],
      // Dot
      [[0.20, 0.72], [0.21, 0.73]]
    ],
    canConnectNext: true,
    exitPoint: [0.28, 0.08]
  },
  k: {
    char: 'k',
    width: 0.50,
    hasAscender: true,
    strokes: [
      // Ascender
      [[0.14, 0.98], [0.14, 0.38], [0.14, 0.00]],
      // Upper diagonal branch
      [[0.44, 0.50], [0.28, 0.28], [0.14, 0.22]],
      // Lower leg
      [[0.24, 0.24], [0.44, 0.00], [0.50, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.50, 0.06]
  },
  l: {
    char: 'l',
    width: 0.26,
    hasAscender: true,
    strokes: [
      // Tall stem with soft baseline curve
      [[0.12, 0.98], [0.12, 0.30], [0.14, 0.04], [0.22, 0.00], [0.28, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.28, 0.06]
  },
  m: {
    char: 'm',
    width: 0.82,
    strokes: [
      // Left leg
      [[0.12, 0.50], [0.12, 0.00]],
      // Middle arch
      [[0.12, 0.32], [0.22, 0.50], [0.36, 0.50], [0.42, 0.28], [0.42, 0.00]],
      // Right arch
      [[0.42, 0.32], [0.52, 0.50], [0.68, 0.50], [0.74, 0.28], [0.74, 0.04], [0.80, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.80, 0.08]
  },
  n: {
    char: 'n',
    width: 0.55,
    strokes: [
      // Left leg
      [[0.14, 0.50], [0.14, 0.00]],
      // Right arch
      [[0.14, 0.30], [0.26, 0.50], [0.42, 0.50], [0.48, 0.30], [0.48, 0.04], [0.54, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.54, 0.08]
  },
  o: {
    char: 'o',
    width: 0.50,
    strokes: [
      // Counter-clockwise oval
      [[0.42, 0.46], [0.32, 0.54], [0.16, 0.48], [0.08, 0.30], [0.10, 0.12], [0.26, 0.00], [0.42, 0.08], [0.46, 0.36], [0.42, 0.48], [0.50, 0.50]]
    ],
    canConnectNext: true,
    exitPoint: [0.50, 0.50]
  },
  p: {
    char: 'p',
    width: 0.52,
    hasDescender: true,
    strokes: [
      // Descender stem
      [[0.14, 0.52], [0.14, 0.00], [0.14, -0.32]],
      // Bowl
      [[0.14, 0.32], [0.24, 0.50], [0.42, 0.50], [0.50, 0.36], [0.50, 0.18], [0.38, 0.02], [0.14, 0.04]]
    ],
    canConnectNext: false
  },
  q: {
    char: 'q',
    width: 0.52,
    hasDescender: true,
    strokes: [
      // Oval bowl
      [[0.44, 0.44], [0.34, 0.52], [0.16, 0.46], [0.08, 0.28], [0.12, 0.10], [0.28, 0.02], [0.44, 0.12], [0.44, 0.44]],
      // Descender stem and flick
      [[0.44, 0.48], [0.44, 0.00], [0.44, -0.32], [0.52, -0.20]]
    ],
    canConnectNext: false
  },
  r: {
    char: 'r',
    width: 0.38,
    strokes: [
      // Stem
      [[0.12, 0.50], [0.12, 0.00]],
      // Shoulder arch
      [[0.12, 0.28], [0.20, 0.48], [0.32, 0.52], [0.38, 0.48]]
    ],
    canConnectNext: true,
    exitPoint: [0.38, 0.48]
  },
  s: {
    char: 's',
    width: 0.42,
    strokes: [
      // S curve
      [[0.36, 0.44], [0.28, 0.52], [0.16, 0.48], [0.10, 0.36], [0.22, 0.26], [0.36, 0.20], [0.38, 0.08], [0.26, 0.00], [0.12, 0.04], [0.38, 0.08]]
    ],
    canConnectNext: true,
    exitPoint: [0.38, 0.08]
  },
  t: {
    char: 't',
    width: 0.36,
    hasAscender: true,
    strokes: [
      // Stem with curve at base
      [[0.18, 0.82], [0.18, 0.20], [0.22, 0.02], [0.32, 0.04]],
      // Crossbar
      [[0.06, 0.56], [0.32, 0.56]]
    ],
    canConnectNext: true,
    exitPoint: [0.32, 0.04]
  },
  u: {
    char: 'u',
    width: 0.54,
    strokes: [
      // Left down and scoop
      [[0.14, 0.50], [0.14, 0.16], [0.20, 0.02], [0.34, 0.02], [0.44, 0.14], [0.44, 0.50]],
      // Right stem flick
      [[0.44, 0.46], [0.44, 0.08], [0.48, 0.00], [0.54, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.54, 0.06]
  },
  v: {
    char: 'v',
    width: 0.46,
    strokes: [
      [[0.10, 0.50], [0.22, 0.06], [0.26, 0.00], [0.40, 0.46], [0.46, 0.48]]
    ],
    canConnectNext: true,
    exitPoint: [0.46, 0.48]
  },
  w: {
    char: 'w',
    width: 0.72,
    strokes: [
      [[0.10, 0.50], [0.18, 0.04], [0.26, 0.00], [0.36, 0.42], [0.46, 0.02], [0.54, 0.00], [0.66, 0.46], [0.72, 0.48]]
    ],
    canConnectNext: true,
    exitPoint: [0.72, 0.48]
  },
  x: {
    char: 'x',
    width: 0.46,
    strokes: [
      // Main diagonal
      [[0.10, 0.48], [0.38, 0.02]],
      // Cross diagonal
      [[0.38, 0.48], [0.10, 0.02]]
    ],
    canConnectNext: false
  },
  y: {
    char: 'y',
    width: 0.52,
    hasDescender: true,
    strokes: [
      // Left scoop
      [[0.12, 0.50], [0.14, 0.16], [0.22, 0.02], [0.36, 0.04], [0.44, 0.20], [0.44, 0.50]],
      // Descender tail
      [[0.44, 0.48], [0.44, 0.00], [0.38, -0.22], [0.26, -0.34], [0.12, -0.32], [0.08, -0.18], [0.32, 0.02]]
    ],
    canConnectNext: true,
    exitPoint: [0.32, 0.02]
  },
  z: {
    char: 'z',
    width: 0.46,
    strokes: [
      [[0.10, 0.48], [0.40, 0.48], [0.12, 0.02], [0.42, 0.02], [0.46, 0.06]]
    ],
    canConnectNext: true,
    exitPoint: [0.46, 0.06]
  }
};

export const LATIN_UPPERCASE: Record<string, NormalizedGlyph> = {
  A: {
    char: 'A',
    width: 0.70,
    hasAscender: true,
    strokes: [
      // Left diagonal
      [[0.35, 0.98], [0.10, 0.02]],
      // Right diagonal
      [[0.35, 0.98], [0.60, 0.02]],
      // Crossbar
      [[0.18, 0.38], [0.52, 0.38]]
    ]
  },
  B: {
    char: 'B',
    width: 0.65,
    hasAscender: true,
    strokes: [
      // Vertical stem
      [[0.16, 0.98], [0.16, 0.02]],
      // Upper lobe
      [[0.16, 0.98], [0.44, 0.96], [0.54, 0.80], [0.46, 0.56], [0.18, 0.56]],
      // Lower lobe
      [[0.18, 0.56], [0.48, 0.54], [0.60, 0.32], [0.48, 0.02], [0.16, 0.02]]
    ]
  },
  C: {
    char: 'C',
    width: 0.62,
    hasAscender: true,
    strokes: [
      [[0.56, 0.84], [0.42, 0.98], [0.22, 0.86], [0.12, 0.50], [0.16, 0.18], [0.34, 0.00], [0.56, 0.08]]
    ]
  },
  D: {
    char: 'D',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.16, 0.98], [0.16, 0.02]],
      [[0.16, 0.98], [0.42, 0.96], [0.62, 0.74], [0.62, 0.30], [0.46, 0.02], [0.16, 0.02]]
    ]
  },
  E: {
    char: 'E',
    width: 0.60,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.18, 0.98], [0.56, 0.98]],
      [[0.18, 0.54], [0.46, 0.54]],
      [[0.18, 0.02], [0.58, 0.02]]
    ]
  },
  F: {
    char: 'F',
    width: 0.58,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.18, 0.98], [0.54, 0.98]],
      [[0.18, 0.54], [0.44, 0.54]]
    ]
  },
  G: {
    char: 'G',
    width: 0.66,
    hasAscender: true,
    strokes: [
      [[0.58, 0.84], [0.44, 0.98], [0.22, 0.86], [0.12, 0.50], [0.16, 0.16], [0.36, 0.00], [0.58, 0.04], [0.58, 0.44], [0.40, 0.44]]
    ]
  },
  H: {
    char: 'H',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.54, 0.98], [0.54, 0.02]],
      [[0.18, 0.52], [0.54, 0.52]]
    ]
  },
  I: {
    char: 'I',
    width: 0.36,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.06, 0.98], [0.30, 0.98]],
      [[0.06, 0.02], [0.30, 0.02]]
    ]
  },
  J: {
    char: 'J',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.10, 0.98], [0.38, 0.98]],
      [[0.32, 0.98], [0.32, 0.24], [0.26, 0.04], [0.14, 0.00], [0.06, 0.12]]
    ]
  },
  K: {
    char: 'K',
    width: 0.64,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.56, 0.96], [0.20, 0.50]],
      [[0.26, 0.52], [0.58, 0.02]]
    ]
  },
  L: {
    char: 'L',
    width: 0.54,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.04], [0.22, 0.02], [0.52, 0.02]]
    ]
  },
  M: {
    char: 'M',
    width: 0.82,
    hasAscender: true,
    strokes: [
      [[0.14, 0.02], [0.14, 0.98], [0.41, 0.28], [0.68, 0.98], [0.68, 0.02]]
    ]
  },
  N: {
    char: 'N',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.16, 0.02], [0.16, 0.98], [0.54, 0.04], [0.54, 0.98]]
    ]
  },
  O: {
    char: 'O',
    width: 0.66,
    hasAscender: true,
    strokes: [
      [[0.40, 0.98], [0.20, 0.86], [0.10, 0.52], [0.16, 0.18], [0.36, 0.00], [0.54, 0.16], [0.60, 0.52], [0.52, 0.86], [0.38, 0.98]]
    ]
  },
  P: {
    char: 'P',
    width: 0.60,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.18, 0.98], [0.44, 0.96], [0.56, 0.80], [0.46, 0.54], [0.18, 0.54]]
    ]
  },
  Q: {
    char: 'Q',
    width: 0.66,
    hasAscender: true,
    hasDescender: true,
    strokes: [
      [[0.40, 0.98], [0.20, 0.86], [0.10, 0.52], [0.16, 0.18], [0.36, 0.00], [0.54, 0.16], [0.60, 0.52], [0.52, 0.86], [0.38, 0.98]],
      [[0.38, 0.18], [0.58, -0.12]]
    ]
  },
  R: {
    char: 'R',
    width: 0.64,
    hasAscender: true,
    strokes: [
      [[0.18, 0.98], [0.18, 0.02]],
      [[0.18, 0.98], [0.44, 0.96], [0.56, 0.80], [0.46, 0.54], [0.18, 0.54]],
      [[0.34, 0.54], [0.58, 0.02]]
    ]
  },
  S: {
    char: 'S',
    width: 0.56,
    hasAscender: true,
    strokes: [
      [[0.48, 0.86], [0.38, 0.98], [0.22, 0.92], [0.14, 0.74], [0.24, 0.56], [0.44, 0.44], [0.50, 0.24], [0.40, 0.02], [0.18, 0.02], [0.10, 0.12]]
    ]
  },
  T: {
    char: 'T',
    width: 0.60,
    hasAscender: true,
    strokes: [
      [[0.06, 0.98], [0.54, 0.98]],
      [[0.30, 0.98], [0.30, 0.02]]
    ]
  },
  U: {
    char: 'U',
    width: 0.66,
    hasAscender: true,
    strokes: [
      [[0.16, 0.98], [0.16, 0.26], [0.24, 0.04], [0.42, 0.04], [0.50, 0.24], [0.50, 0.98]]
    ]
  },
  V: {
    char: 'V',
    width: 0.64,
    hasAscender: true,
    strokes: [
      [[0.12, 0.98], [0.32, 0.02], [0.56, 0.98]]
    ]
  },
  W: {
    char: 'W',
    width: 0.88,
    hasAscender: true,
    strokes: [
      [[0.12, 0.98], [0.24, 0.02], [0.44, 0.82], [0.64, 0.02], [0.78, 0.98]]
    ]
  },
  X: {
    char: 'X',
    width: 0.62,
    hasAscender: true,
    strokes: [
      [[0.14, 0.98], [0.50, 0.02]],
      [[0.50, 0.98], [0.14, 0.02]]
    ]
  },
  Y: {
    char: 'Y',
    width: 0.62,
    hasAscender: true,
    strokes: [
      [[0.12, 0.98], [0.32, 0.52]],
      [[0.52, 0.98], [0.32, 0.52], [0.32, 0.02]]
    ]
  },
  Z: {
    char: 'Z',
    width: 0.60,
    hasAscender: true,
    strokes: [
      [[0.12, 0.98], [0.52, 0.98], [0.14, 0.02], [0.54, 0.02]]
    ]
  }
};

export const DIGITS_AND_PUNCTUATION: Record<string, NormalizedGlyph> = {
  ' ': { char: ' ', width: 0.34, strokes: [] },
  '\n': { char: '\n', width: 0, strokes: [] },
  '\r': { char: '\r', width: 0, strokes: [] },
  '\t': { char: '\t', width: 0.8, strokes: [] },
  '0': {
    char: '0',
    width: 0.52,
    hasAscender: true,
    strokes: [
      [[0.32, 0.94], [0.16, 0.78], [0.12, 0.48], [0.16, 0.16], [0.32, 0.02], [0.44, 0.16], [0.46, 0.48], [0.42, 0.80], [0.30, 0.94]]
    ]
  },
  '1': {
    char: '1',
    width: 0.32,
    hasAscender: true,
    strokes: [
      [[0.10, 0.76], [0.20, 0.94], [0.20, 0.02]]
    ]
  },
  '2': {
    char: '2',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.12, 0.78], [0.22, 0.94], [0.38, 0.88], [0.42, 0.72], [0.12, 0.04], [0.44, 0.02]]
    ]
  },
  '3': {
    char: '3',
    width: 0.46,
    hasAscender: true,
    strokes: [
      [[0.12, 0.92], [0.38, 0.92], [0.24, 0.56], [0.38, 0.50], [0.42, 0.24], [0.32, 0.02], [0.12, 0.06]]
    ]
  },
  '4': {
    char: '4',
    width: 0.50,
    hasAscender: true,
    strokes: [
      [[0.36, 0.94], [0.10, 0.32], [0.46, 0.32]],
      [[0.36, 0.94], [0.36, 0.02]]
    ]
  },
  '5': {
    char: '5',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.40, 0.94], [0.16, 0.94], [0.14, 0.54], [0.34, 0.58], [0.44, 0.42], [0.42, 0.16], [0.30, 0.02], [0.12, 0.06]]
    ]
  },
  '6': {
    char: '6',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.38, 0.92], [0.20, 0.72], [0.12, 0.38], [0.16, 0.12], [0.32, 0.02], [0.44, 0.16], [0.44, 0.36], [0.32, 0.48], [0.16, 0.38]]
    ]
  },
  '7': {
    char: '7',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.10, 0.94], [0.44, 0.94], [0.22, 0.02]]
    ]
  },
  '8': {
    char: '8',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.28, 0.94], [0.16, 0.82], [0.18, 0.62], [0.34, 0.50], [0.42, 0.32], [0.38, 0.08], [0.24, 0.02], [0.12, 0.12], [0.14, 0.34], [0.30, 0.50], [0.40, 0.66], [0.38, 0.84], [0.26, 0.94]]
    ]
  },
  '9': {
    char: '9',
    width: 0.48,
    hasAscender: true,
    strokes: [
      [[0.40, 0.56], [0.26, 0.66], [0.14, 0.56], [0.14, 0.38], [0.26, 0.28], [0.40, 0.36], [0.40, 0.90], [0.32, 0.08], [0.20, 0.02]]
    ]
  },
  '.': {
    char: '.',
    width: 0.22,
    strokes: [[[0.10, 0.04], [0.11, 0.05]]]
  },
  ',': {
    char: ',',
    width: 0.22,
    hasDescender: true,
    strokes: [[[0.12, 0.08], [0.12, 0.02], [0.06, -0.14]]]
  },
  ';': {
    char: ';',
    width: 0.24,
    hasDescender: true,
    strokes: [
      [[0.12, 0.40], [0.13, 0.41]],
      [[0.12, 0.08], [0.12, 0.02], [0.06, -0.14]]
    ]
  },
  ':': {
    char: ':',
    width: 0.22,
    strokes: [
      [[0.11, 0.42], [0.12, 0.43]],
      [[0.11, 0.08], [0.12, 0.09]]
    ]
  },
  '!': {
    char: '!',
    width: 0.24,
    hasAscender: true,
    strokes: [
      [[0.12, 0.94], [0.12, 0.30]],
      [[0.12, 0.06], [0.13, 0.07]]
    ]
  },
  '?': {
    char: '?',
    width: 0.42,
    hasAscender: true,
    strokes: [
      [[0.10, 0.82], [0.20, 0.94], [0.34, 0.86], [0.32, 0.68], [0.20, 0.54], [0.20, 0.32]],
      [[0.20, 0.06], [0.21, 0.07]]
    ]
  },
  '-': {
    char: '-',
    width: 0.32,
    strokes: [[[0.06, 0.28], [0.26, 0.28]]]
  },
  '—': {
    char: '—',
    width: 0.56,
    strokes: [[[0.04, 0.28], [0.52, 0.28]]]
  },
  '(': {
    char: '(',
    width: 0.26,
    hasAscender: true,
    hasDescender: true,
    strokes: [[[0.20, 0.92], [0.10, 0.45], [0.20, -0.15]]]
  },
  ')': {
    char: ')',
    width: 0.26,
    hasAscender: true,
    hasDescender: true,
    strokes: [[[0.08, 0.92], [0.18, 0.45], [0.08, -0.15]]]
  },
  '"': {
    char: '"',
    width: 0.30,
    hasAscender: true,
    strokes: [
      [[0.08, 0.92], [0.08, 0.72]],
      [[0.20, 0.92], [0.20, 0.72]]
    ]
  },
  '\'': {
    char: '\'',
    width: 0.18,
    hasAscender: true,
    strokes: [[[0.08, 0.92], [0.08, 0.72]]]
  },
  '/': {
    char: '/',
    width: 0.36,
    hasAscender: true,
    strokes: [[[0.08, 0.02], [0.30, 0.92]]]
  }
};
