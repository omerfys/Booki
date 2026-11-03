export type WritingInstrument = 'pencil' | 'ballpoint' | 'fountain' | 'marker';

export type PaperType = 
  | 'clean-white' 
  | 'cream-notebook' 
  | 'aged-vintage' 
  | 'yellowed' 
  | 'fine-textured' 
  | 'lightly-rough';

export type CoverMaterial = 
  | 'leather-morocco' 
  | 'cloth-linen' 
  | 'velvet-royal' 
  | 'marbled-florentine' 
  | 'vintage-brown';

export type RulingStyle = 'blank' | 'lined' | 'dotted' | 'grid';

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  speed?: number;
}

export interface StrokeSegment {
  points: StrokePoint[];
  isLift?: boolean;
}

export interface HandwrittenStroke {
  id: string;
  char: string;
  lineIndex: number;
  charIndex: number;
  characterId: string; // ID of the character profile who wrote this
  instrument: WritingInstrument;
  color: string;
  baseThickness: number;
  opacity: number;
  segments: StrokeSegment[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  timestamp: number;
}

export interface PageHighlight {
  id: string;
  color: string;
  opacity: number;
  rects: Array<{ x: number; y: number; width: number; height: number }>;
  timestamp: number;
}

export interface BookPage {
  pageNumber: number; // 1-based display
  strokes: HandwrittenStroke[];
  rawText: string;
  highlights?: PageHighlight[];
  lastEdited?: number;
}

export interface Bookmark {
  id: string;
  pageNumber: number;
  positionY: number; // 0 to 1 relative page coordinate
  color: string; // hex ribbon color
  label: string;
  createdAt: number;
}

export interface CharacterHandwritingStyle {
  slant: number; // angle in degrees (-12 to 24)
  curvature: number; // 0.8 to 1.5
  size: number; // 18 to 32 px
  baselineJitter: number; // 0 to 4 px
  sizeJitter: number; // 0 to 3 px
  slantJitter: number; // 0 to 5 degrees
  speedFactor: number; // 0.8 to 1.4
  letterSpacing: number; // -1 to 8 px
  wordSpacing: number; // 12 to 24 px
  lineHeight: number; // 32 to 44 px
  pressureMin: number; // 0.4 to 0.8
  pressureMax: number; // 1.0 to 1.8
  connectTailLength: number; // connecting stroke length to next letter
  quirks?: {
    highCrossbars?: boolean;
    openLoops?: boolean;
    angularJoins?: boolean;
    longAscenders?: boolean;
    flourishTails?: boolean;
  };
}

export interface CharacterProfile {
  id: string;
  name: string;
  country: string;
  flag: string;
  nationality: string;
  bio: string;
  avatarBg: string;
  avatarIcon: string;
  sampleQuote: string;
  sampleParagraph: string;
  style: CharacterHandwritingStyle;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  coverMaterial: CoverMaterial;
  coverColor: string;
  embossingColor: 'gold' | 'silver' | 'bronze' | 'blind-deboss';
  paperType: PaperType;
  rulingStyle: RulingStyle;
  ribbonColor: string;
  instrument: WritingInstrument;
  penColor: string;
  penThickness: number;
  penOpacity: number;
  writingSpeed: number; // 0 = instant, 1 = normal, 2 = fast, 3 = very fast
  activeCharacterId: string;
  pages: BookPage[];
  bookmarks: Bookmark[];
  currentPage: number;
  isClosed: boolean;
  createdAt: number;
  updatedAt: number;
}
