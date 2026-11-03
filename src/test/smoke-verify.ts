import { CHARACTERS, getCharacterById } from '../data/characters';
import { getGlyph, hasGlyph } from '../engine/handwriting/strokeRegistry';
import { generatePageStrokes } from '../engine/handwriting/strokeGenerator';
import { WritingInstrument } from '../types/book';

console.log('=== BOOKI HANDWRITING ENGINE VERIFICATION ===\n');

// 1. Verify 10 International Characters
console.log('1. Checking 10 Character Profiles:');
if (CHARACTERS.length !== 10) {
  throw new Error(`Expected 10 characters, found ${CHARACTERS.length}`);
}
for (const char of CHARACTERS) {
  if (!char.id || !char.name || !char.country || !char.flag || !char.style) {
    throw new Error(`Invalid character profile: ${JSON.stringify(char)}`);
  }
  if (typeof char.style.slant !== 'number' || typeof char.style.size !== 'number') {
    throw new Error(`Invalid handwriting style in character: ${char.name}`);
  }
  console.log(`  ✓ ${char.flag} ${char.name} (${char.country}) — Slant: +${char.style.slant}°, Size: ${char.style.size}px`);
}

// 2. Multilingual Glyph Support Verification
console.log('\n2. Checking Multilingual Glyph Support:');
const testGlyphs = [
  // Latin
  'a', 'Z', '5', '?', '!',
  // Turkish
  'ç', 'ğ', 'ı', 'İ', 'ö', 'ş', 'ü', 'Ç', 'Ğ', 'Ş',
  // French / Spanish / German
  'é', 'è', 'ê', 'ñ', 'ä', 'ß', '¿', '¡',
  // Russian / Cyrillic
  'а', 'б', 'в', 'г', 'д', 'ж', 'и', 'й', 'л', 'п', 'ф', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я', 'Б', 'Д', 'Ж', 'Л', 'П', 'Ф',
  // Japanese
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'の', 'は', 'ま', 'め', 'も', 'ん', '日', '本', '書', '人', '山', '川', '心', '月', '、',
  // Hindi / Devanagari
  'अ', 'आ', 'इ', 'ई', 'क', 'ख', 'ग', 'घ', 'च', 'ज', 'ट', 'त', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'स', 'ह', 'ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ं'
];

for (const char of testGlyphs) {
  const glyph = getGlyph(char);
  if (!glyph || !glyph.strokes) {
    throw new Error(`Missing glyph strokes for: '${char}'`);
  }
  const totalPoints = glyph.strokes.reduce((acc, s) => acc + s.length, 0);
  if (totalPoints === 0 && char !== ' ') {
    throw new Error(`Glyph has 0 stroke points: '${char}'`);
  }
}
console.log(`  ✓ Successfully verified stroke definitions for all ${testGlyphs.length} multilingual test glyphs.`);

// 3. Stroke Generation across Characters & Languages
console.log('\n3. Testing Stroke Generation for all 10 Characters:');
const instruments: WritingInstrument[] = ['pencil', 'ballpoint', 'fountain', 'marker'];

for (let i = 0; i < CHARACTERS.length; i++) {
  const character = CHARACTERS[i];
  const instrument = instruments[i % instruments.length];

  const layout = generatePageStrokes(
    character.sampleQuote,
    character,
    {
      width: 480,
      height: 640,
      marginTop: 65,
      marginBottom: 55,
      marginLeft: 55,
      marginRight: 45,
      isRightPage: true
    },
    instrument,
    '#1e293b',
    1.6,
    0.95,
    i * 10
  );

  if (layout.strokes.length === 0) {
    throw new Error(`No strokes generated for ${character.name}`);
  }

  const strokeCount = layout.strokes.length;
  const totalPoints = layout.strokes.reduce(
    (sum, s) => sum + s.segments.reduce((segSum, seg) => segSum + seg.points.length, 0),
    0
  );

  console.log(`  ✓ ${character.flag} ${character.name}: Generated ${strokeCount} strokes (${totalPoints} points) using ${instrument}`);

  // Check bounds validity
  for (const stroke of layout.strokes) {
    if (stroke.bounds.minX > stroke.bounds.maxX || stroke.bounds.minY > stroke.bounds.maxY) {
      throw new Error(`Invalid bounding box in stroke: ${stroke.char}`);
    }
  }
}

// 4. Test Page Overflow & Continuation
console.log('\n4. Testing Word-Wrap & Automatic Page Continuation:');
const longText = 'This is a test of the automatic line wrapping and page pagination engine. '.repeat(18);
const overflowResult = generatePageStrokes(
  longText,
  CHARACTERS[0],
  {
    width: 480,
    height: 640,
    marginTop: 65,
    marginBottom: 55,
    marginLeft: 55,
    marginRight: 45,
    isRightPage: true
  },
  'fountain',
  '#1e293b',
  1.6,
  0.95
);

if (!overflowResult.isFull || !overflowResult.overflowText) {
  throw new Error('Expected page overflow when text exceeds page bounds');
}
console.log(`  ✓ Page overflow detected cleanly. Overflow text length: ${overflowResult.overflowText.length} chars.`);

console.log('\n=== ALL SMOKE TESTS PASSED CLEANLY! ===\n');
