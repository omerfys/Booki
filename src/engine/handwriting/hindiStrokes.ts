import { NormalizedGlyph } from './types';

// In Devanagari, characters hang from the top horizontal line (shirorekha).
// Normalized coordinates:
// Shirorekha is at y ~ 0.85
// Glyph bottom is at y ~ 0.05
// Baseline y=0

export const HINDI_STROKES: Record<string, NormalizedGlyph> = {
  // Vowels
  'अ': {
    char: 'अ',
    width: 0.82,
    hasAscender: true,
    strokes: [
      // Left 3-like shape
      [[0.18, 0.76], [0.38, 0.82], [0.44, 0.64], [0.32, 0.52]],
      [[0.32, 0.52], [0.46, 0.44], [0.42, 0.16], [0.26, 0.08], [0.14, 0.18]],
      // Connecting middle bar
      [[0.32, 0.52], [0.58, 0.52]],
      // Right vertical stem
      [[0.58, 0.86], [0.58, 0.06]],
      // Top shirorekha bar
      [[0.50, 0.86], [0.72, 0.86]]
    ]
  },
  'आ': {
    char: 'आ',
    width: 0.94,
    hasAscender: true,
    strokes: [
      [[0.16, 0.76], [0.34, 0.82], [0.40, 0.64], [0.28, 0.52]],
      [[0.28, 0.52], [0.42, 0.44], [0.38, 0.16], [0.24, 0.08], [0.12, 0.18]],
      [[0.28, 0.52], [0.52, 0.52]],
      [[0.52, 0.86], [0.52, 0.06]],
      // Second aa-matra stem
      [[0.72, 0.86], [0.72, 0.06]],
      // Top bar
      [[0.44, 0.86], [0.84, 0.86]]
    ]
  },
  'इ': {
    char: 'इ',
    width: 0.70,
    hasAscender: true,
    strokes: [
      // Top shirorekha
      [[0.14, 0.86], [0.60, 0.86]],
      // Small downstem
      [[0.36, 0.86], [0.36, 0.76]],
      // S-curve body
      [[0.36, 0.76], [0.20, 0.72], [0.20, 0.54], [0.48, 0.46], [0.52, 0.26], [0.36, 0.14], [0.22, 0.22]],
      // Descender tail
      [[0.22, 0.22], [0.28, 0.06], [0.44, -0.16]]
    ]
  },
  'ई': {
    char: 'ई',
    width: 0.70,
    hasAscender: true,
    strokes: [
      [[0.14, 0.86], [0.60, 0.86]],
      [[0.36, 0.86], [0.36, 0.76]],
      [[0.36, 0.76], [0.20, 0.72], [0.20, 0.54], [0.48, 0.46], [0.52, 0.26], [0.36, 0.14], [0.22, 0.22]],
      [[0.22, 0.22], [0.28, 0.06], [0.44, -0.16]],
      // Top curve
      [[0.36, 0.86], [0.46, 1.04], [0.58, 1.00]]
    ]
  },
  'उ': {
    char: 'उ',
    width: 0.65,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.54, 0.86]],
      [[0.20, 0.76], [0.42, 0.82], [0.48, 0.62], [0.32, 0.50]],
      [[0.32, 0.50], [0.50, 0.40], [0.46, 0.14], [0.28, 0.06], [0.14, 0.16]]
    ]
  },
  'ए': {
    char: 'ए',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.58, 0.86]],
      // Left vertical slant into curve
      [[0.24, 0.86], [0.24, 0.54], [0.42, 0.24]],
      // Right stem
      [[0.48, 0.86], [0.48, 0.44], [0.34, 0.36]]
    ]
  },

  // Consonants
  'क': {
    char: 'क',
    width: 0.82,
    hasAscender: true,
    strokes: [
      // Top bar
      [[0.14, 0.86], [0.72, 0.86]],
      // Central vertical stem
      [[0.44, 0.86], [0.44, 0.08]],
      // Left circle
      [[0.44, 0.62], [0.24, 0.62], [0.22, 0.40], [0.32, 0.32], [0.44, 0.38]],
      // Right hook curve
      [[0.44, 0.58], [0.62, 0.58], [0.66, 0.36], [0.58, 0.20]]
    ]
  },
  'ख': {
    char: 'ख',
    width: 0.88,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.76, 0.86]],
      // Left curve into baseline loop
      [[0.26, 0.78], [0.18, 0.60], [0.28, 0.46], [0.18, 0.16], [0.42, 0.16]],
      // Right vertical stem
      [[0.60, 0.86], [0.60, 0.08]],
      // Internal circle connected to stem
      [[0.40, 0.44], [0.60, 0.44], [0.60, 0.24], [0.40, 0.24], [0.40, 0.44]]
    ]
  },
  'ग': {
    char: 'ग',
    width: 0.72,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.64, 0.86]],
      // Left stem with inner loop
      [[0.30, 0.86], [0.30, 0.34], [0.22, 0.28], [0.30, 0.22]],
      // Right vertical stem
      [[0.52, 0.86], [0.52, 0.08]]
    ]
  },
  'घ': {
    char: 'घ',
    width: 0.80,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.72, 0.86]],
      // Double left bowls
      [[0.26, 0.78], [0.42, 0.68], [0.34, 0.54]],
      [[0.34, 0.54], [0.50, 0.44], [0.38, 0.24], [0.54, 0.24]],
      // Right vertical stem
      [[0.58, 0.86], [0.58, 0.08]]
    ]
  },
  'च': {
    char: 'च',
    width: 0.78,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.70, 0.86]],
      // Horizontal bar into lower curve
      [[0.22, 0.52], [0.40, 0.52], [0.36, 0.26], [0.46, 0.20], [0.56, 0.36]],
      // Right vertical stem
      [[0.56, 0.86], [0.56, 0.08]]
    ]
  },
  'ज': {
    char: 'ज',
    width: 0.80,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.72, 0.86]],
      // Left curl
      [[0.22, 0.62], [0.28, 0.32], [0.42, 0.30], [0.42, 0.52]],
      // Horizontal connector
      [[0.42, 0.52], [0.58, 0.52]],
      // Vertical stem
      [[0.58, 0.86], [0.58, 0.08]]
    ]
  },
  'ट': {
    char: 'ट',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.60, 0.86]],
      // Short vertical
      [[0.38, 0.86], [0.38, 0.74]],
      // Round lower cup
      [[0.38, 0.74], [0.20, 0.64], [0.20, 0.32], [0.34, 0.12], [0.54, 0.18]]
    ]
  },
  'त': {
    char: 'त',
    width: 0.72,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.66, 0.86]],
      // Vertical stem
      [[0.54, 0.86], [0.54, 0.08]],
      // Left arch leg
      [[0.54, 0.54], [0.32, 0.54], [0.28, 0.20], [0.26, 0.08]]
    ]
  },
  'द': {
    char: 'द',
    width: 0.70,
    hasAscender: true,
    hasDescender: true,
    strokes: [
      [[0.16, 0.86], [0.60, 0.86]],
      [[0.36, 0.86], [0.36, 0.74]],
      [[0.36, 0.74], [0.22, 0.64], [0.22, 0.40], [0.36, 0.26], [0.44, 0.32]],
      // Tail
      [[0.44, 0.32], [0.40, 0.12], [0.48, -0.12]]
    ]
  },
  'ध': {
    char: 'ध',
    width: 0.80,
    hasAscender: true,
    strokes: [
      [[0.46, 0.86], [0.72, 0.86]],
      // Top loop then double bowl
      [[0.22, 0.78], [0.18, 0.70], [0.28, 0.68], [0.40, 0.60], [0.32, 0.48]],
      [[0.32, 0.48], [0.48, 0.38], [0.36, 0.20], [0.54, 0.20]],
      // Vertical stem
      [[0.58, 0.86], [0.58, 0.08]]
    ]
  },
  'न': {
    char: 'न',
    width: 0.72,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.66, 0.86]],
      // Vertical stem
      [[0.52, 0.86], [0.52, 0.08]],
      // Horizontal bar with left triangle loop
      [[0.52, 0.50], [0.24, 0.50], [0.20, 0.38], [0.26, 0.36], [0.32, 0.50]]
    ]
  },
  'प': {
    char: 'प',
    width: 0.72,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.66, 0.86]],
      // Left vertical curving into horizontal
      [[0.28, 0.86], [0.28, 0.42], [0.36, 0.32], [0.52, 0.32]],
      // Right vertical stem
      [[0.52, 0.86], [0.52, 0.08]]
    ]
  },
  'फ': {
    char: 'फ',
    width: 0.86,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.76, 0.86]],
      // Left cup
      [[0.24, 0.86], [0.24, 0.42], [0.34, 0.32], [0.46, 0.32]],
      // Center vertical stem
      [[0.46, 0.86], [0.46, 0.08]],
      // Right hook
      [[0.46, 0.54], [0.64, 0.54], [0.68, 0.24], [0.64, 0.16]]
    ]
  },
  'ब': {
    char: 'ब',
    width: 0.78,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.70, 0.86]],
      // Vertical stem
      [[0.54, 0.86], [0.54, 0.08]],
      // Left circle
      [[0.54, 0.60], [0.30, 0.60], [0.26, 0.40], [0.34, 0.28], [0.54, 0.28]],
      // Internal diagonal slash
      [[0.32, 0.56], [0.48, 0.32]]
    ]
  },
  'भ': {
    char: 'भ',
    width: 0.82,
    hasAscender: true,
    strokes: [
      [[0.46, 0.86], [0.72, 0.86]],
      // Top loop down into left loop
      [[0.24, 0.80], [0.20, 0.72], [0.28, 0.70], [0.28, 0.38], [0.20, 0.32], [0.28, 0.30], [0.56, 0.30]],
      // Right vertical stem
      [[0.56, 0.86], [0.56, 0.08]]
    ]
  },
  'म': {
    char: 'म',
    width: 0.78,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.70, 0.86]],
      // Left downstem with loop
      [[0.28, 0.86], [0.28, 0.40], [0.20, 0.32], [0.28, 0.30], [0.54, 0.30]],
      // Right vertical stem
      [[0.54, 0.86], [0.54, 0.08]]
    ]
  },
  'य': {
    char: 'य',
    width: 0.76,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.68, 0.86]],
      // Left arch into belly
      [[0.26, 0.78], [0.36, 0.68], [0.28, 0.48], [0.40, 0.32], [0.52, 0.32]],
      // Right stem
      [[0.52, 0.86], [0.52, 0.08]]
    ]
  },
  'र': {
    char: 'र',
    width: 0.60,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.54, 0.86]],
      // Top curve
      [[0.26, 0.86], [0.26, 0.74], [0.42, 0.70], [0.44, 0.52], [0.30, 0.44]],
      // Diagonal slant leg
      [[0.30, 0.44], [0.44, 0.08]]
    ]
  },
  'ल': {
    char: 'ल',
    width: 0.80,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.72, 0.86]],
      // Vertical stem
      [[0.56, 0.86], [0.56, 0.08]],
      // Double arch
      [[0.56, 0.48], [0.40, 0.36], [0.36, 0.52], [0.20, 0.36], [0.22, 0.16]]
    ]
  },
  'व': {
    char: 'व',
    width: 0.74,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.66, 0.86]],
      // Vertical stem
      [[0.52, 0.86], [0.52, 0.08]],
      // Left circle
      [[0.52, 0.60], [0.30, 0.60], [0.26, 0.40], [0.34, 0.28], [0.52, 0.28]]
    ]
  },
  'श': {
    char: 'श',
    width: 0.80,
    hasAscender: true,
    strokes: [
      [[0.44, 0.86], [0.72, 0.86]],
      // Top curl down into loop
      [[0.24, 0.80], [0.20, 0.72], [0.32, 0.68], [0.36, 0.52], [0.24, 0.44], [0.32, 0.40]],
      // Diagonal leg
      [[0.32, 0.40], [0.44, 0.12]],
      // Right vertical stem
      [[0.58, 0.86], [0.58, 0.08]]
    ]
  },
  'स': {
    char: 'स',
    width: 0.82,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.74, 0.86]],
      // Left curve like र
      [[0.26, 0.86], [0.26, 0.74], [0.40, 0.70], [0.40, 0.52], [0.28, 0.46]],
      [[0.28, 0.46], [0.42, 0.12]],
      // Connecting crossbar
      [[0.34, 0.46], [0.58, 0.46]],
      // Right vertical stem
      [[0.58, 0.86], [0.58, 0.08]]
    ]
  },
  'ह': {
    char: 'ह',
    width: 0.68,
    hasAscender: true,
    strokes: [
      [[0.16, 0.86], [0.60, 0.86]],
      [[0.36, 0.86], [0.36, 0.74]],
      [[0.36, 0.74], [0.22, 0.66], [0.42, 0.50], [0.24, 0.36], [0.30, 0.24]],
      // Lower belly hook
      [[0.30, 0.36], [0.46, 0.30], [0.44, 0.10], [0.26, 0.08]]
    ]
  },

  // Matras
  'ा': {
    char: 'ा',
    width: 0.36,
    hasAscender: true,
    strokes: [
      [[0.08, 0.86], [0.28, 0.86]],
      [[0.20, 0.86], [0.20, 0.08]]
    ]
  },
  'ि': {
    char: 'ि',
    width: 0.44,
    hasAscender: true,
    strokes: [
      [[0.14, 0.86], [0.14, 0.08]],
      [[0.14, 0.86], [0.24, 1.08], [0.40, 0.86]]
    ]
  },
  'ी': {
    char: 'ी',
    width: 0.44,
    hasAscender: true,
    strokes: [
      [[0.32, 0.86], [0.32, 0.08]],
      [[0.08, 0.86], [0.20, 1.08], [0.32, 0.86]]
    ]
  },
  'ु': {
    char: 'ु',
    width: 0.30,
    hasDescender: true,
    strokes: [
      [[0.16, 0.04], [0.24, -0.16], [0.10, -0.18]]
    ]
  },
  'ू': {
    char: 'ू',
    width: 0.30,
    hasDescender: true,
    strokes: [
      [[0.14, 0.04], [0.10, -0.16], [0.26, -0.22]]
    ]
  },
  'े': {
    char: 'े',
    width: 0.32,
    hasAscender: true,
    strokes: [
      [[0.14, 0.86], [0.24, 1.10]]
    ]
  },
  'ै': {
    char: 'ै',
    width: 0.40,
    hasAscender: true,
    strokes: [
      [[0.12, 0.86], [0.20, 1.10]],
      [[0.24, 0.86], [0.34, 1.12]]
    ]
  },
  'ो': {
    char: 'ो',
    width: 0.40,
    hasAscender: true,
    strokes: [
      [[0.24, 0.86], [0.24, 0.08]],
      [[0.24, 0.86], [0.34, 1.10]],
      [[0.12, 0.86], [0.32, 0.86]]
    ]
  },
  'ं': {
    char: 'ं',
    width: 0.24,
    hasAscender: true,
    strokes: [[[0.12, 0.98], [0.13, 0.99]]]
  }
};
