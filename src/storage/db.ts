import { openDB, IDBPDatabase } from 'idb';
import { Book, BookPage, CharacterProfile } from '../types/book';
import { CHARACTERS } from '../data/characters';
import { generatePageStrokes } from '../engine/handwriting/strokeGenerator';

const DB_NAME = 'booki-handwritten-db';
const DB_VERSION = 1;

interface BookiDB {
  books: {
    key: string;
    value: Book;
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<BookiDB>> | null = null;

function getDB(): Promise<IDBPDatabase<BookiDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BookiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      }
    });
  }
  return dbPromise;
}

// Generate pre-written sample pages with real vector strokes
function createSamplePages(character: CharacterProfile, text: string, pageNumber: number): BookPage {
  const content = generatePageStrokes(
    text,
    character,
    {
      width: 480,
      height: 640,
      marginTop: 65,
      marginBottom: 55,
      marginLeft: pageNumber % 2 === 0 ? 50 : 60,
      marginRight: pageNumber % 2 === 0 ? 60 : 50,
      isRightPage: pageNumber % 2 !== 0
    },
    'fountain',
    '#1e293b',
    1.6,
    0.95,
    pageNumber * 100
  );

  return {
    pageNumber,
    strokes: content.strokes,
    rawText: text,
    lastEdited: Date.now()
  };
}

// Seed initial default books
function createInitialBooks(): Book[] {
  const oliver = CHARACTERS[0];
  const sofia = CHARACTERS[1];
  const deniz = CHARACTERS[9];
  const hana = CHARACTERS[3];

  const book1Pages: BookPage[] = [
    createSamplePages(
      oliver,
      "October 14th.\n\nThe quiet autumn rain taps softly against the high gothic windows of the Bodleian. Here amidst shelves of leather-bound folios, time yields its stubborn pace.\n\nTo write with a patient pen is to honor each passing thought before it dissolves into silence.",
      1
    ),
    createSamplePages(
      sofia,
      "Chaque page blanche est un jardin où les mots s'épanouissent comme des fleurs sauvages.\n\nSur les berges du Rhône, la brume matinale se dissipe lentement, dévoilant les reflets dorés de la vieille ville.",
      2
    ),
    createSamplePages(
      deniz,
      "Boğaziçi'nin serin rüzgarları eski kütüphanenin pencerelerinden süzülürken, kalemim asırlık çınarların gölgesinde huzurla dans ediyor.\n\nHer harf, bu kadim şehrin ruhundan bir parça taşır.",
      3
    ),
    createSamplePages(
      hana,
      "静けさの中に、言葉の真の重みがある。\n\n一文字一文字が呼吸とともに生まれ、紙の上に静かに息づいてゆく。",
      4
    )
  ];

  const book1: Book = {
    id: 'book-archivist-journal',
    title: "The Archivist's Journal",
    subtitle: 'Chronicles & Literary Reflections',
    coverMaterial: 'leather-morocco',
    coverColor: '#4a151b',
    embossingColor: 'gold',
    paperType: 'cream-notebook',
    rulingStyle: 'lined',
    ribbonColor: '#991b1b',
    instrument: 'fountain',
    penColor: '#1e3a8a',
    penThickness: 1.6,
    penOpacity: 0.95,
    writingSpeed: 1,
    activeCharacterId: oliver.id,
    pages: book1Pages,
    bookmarks: [
      {
        id: 'bm-1',
        pageNumber: 1,
        positionY: 0.25,
        color: '#991b1b',
        label: 'Bodleian Reflections',
        createdAt: Date.now() - 86400000
      },
      {
        id: 'bm-2',
        pageNumber: 3,
        positionY: 0.2,
        color: '#b45309',
        label: 'Bosphorus Notes',
        createdAt: Date.now() - 43200000
      }
    ],
    currentPage: 1,
    isClosed: false,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now()
  };

  const book2Pages: BookPage[] = [
    createSamplePages(
      CHARACTERS[6], // Arjun
      "ज्ञान की बहती धारा कागज पर उतरकर समय की सीमाओं को मिटा देती है।\n\nगंगा के पावन तट पर सुबह की पहली किरण जब प्राचीन घाटों को छूती है, मन में विचारों की अविरल गंगा बहने लगती है।",
      1
    ),
    createSamplePages(
      CHARACTERS[7], // Elena
      "В тишине белых ночей чернила ложатся на бумагу, словно ноты забытой сонаты.\n\nСеверный ветер шепчет истории великих поэтов над гладью Невы.",
      2
    )
  ];

  const book2: Book = {
    id: 'book-silk-roads',
    title: 'Wanderer across Continents',
    subtitle: 'Philosophical Dialogues & Sketches',
    coverMaterial: 'cloth-linen',
    coverColor: '#16233b',
    embossingColor: 'silver',
    paperType: 'aged-vintage',
    rulingStyle: 'dotted',
    ribbonColor: '#1e3a8a',
    instrument: 'ballpoint',
    penColor: '#111827',
    penThickness: 1.8,
    penOpacity: 0.95,
    writingSpeed: 1,
    activeCharacterId: CHARACTERS[6].id,
    pages: book2Pages,
    bookmarks: [
      {
        id: 'bm-silk-1',
        pageNumber: 1,
        positionY: 0.3,
        color: '#1e3a8a',
        label: 'Varanasi Dawns',
        createdAt: Date.now() - 100000
      }
    ],
    currentPage: 1,
    isClosed: false,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  };

  return [book1, book2];
}

export async function loadAllBooks(): Promise<Book[]> {
  const db = await getDB();
  const stored = await db.getAll('books');
  const defaults = createInitialBooks();

  if (!stored || stored.length === 0) {
    const tx = db.transaction('books', 'readwrite');
    for (const b of defaults) {
      await tx.store.put(b);
    }
    await tx.done;
    return defaults;
  }

  // Ensure all default starter books exist
  const existingIds = new Set(stored.map(b => b.id));
  for (const b of defaults) {
    if (!existingIds.has(b.id)) {
      await db.put('books', b);
      stored.push(b);
    }
  }

  return stored;
}

export async function saveBookToDB(book: Book): Promise<void> {
  const db = await getDB();
  await db.put('books', { ...book, updatedAt: Date.now() });
}

export async function deleteBookFromDB(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('books', id);
}

export async function getStoredActiveBookId(): Promise<string | null> {
  const db = await getDB();
  const val = await db.get('settings', 'activeBookId');
  return typeof val === 'string' ? val : null;
}

export async function setStoredActiveBookId(id: string): Promise<void> {
  const db = await getDB();
  await db.put('settings', id, 'activeBookId');
}
