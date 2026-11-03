import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, BookPage, WritingInstrument } from './types/book';
import { CHARACTERS, getCharacterById } from './data/characters';
import { loadAllBooks, saveBookToDB, deleteBookFromDB, getStoredActiveBookId, setStoredActiveBookId } from './storage/db';
import { BookEngine } from './components/BookEngine';
import { LeftDeskPenStand, RightDeskPenStand } from './components/DeskPenStand';
import { CharacterModal } from './components/CharacterModal';
import { BookCustomizerModal } from './components/BookCustomizerModal';
import { LibraryModal } from './components/LibraryModal';
import { Library, Palette, Users, Maximize2, Minimize2, CheckCircle2, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { sound } from './engine/audio/soundEngine';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBookId, setActiveBookId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active Tooling State
  const [activeInstrument, setActiveInstrument] = useState<WritingInstrument>('fountain');
  const [activeColor, setActiveColor] = useState<string>('#1e3a8a');
  const [activeThickness, setActiveThickness] = useState<number>(1.6);
  const [activeWritingSpeed, setActiveWritingSpeed] = useState<number>(1);
  const [activeSize, setActiveSize] = useState<number>(22);

  // Modals
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const saveTimerRef = useRef<number | null>(null);

  // Load books from IndexedDB on startup
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadAllBooks();
        setBooks(loaded);

        const storedId = await getStoredActiveBookId();
        const initialId = storedId && loaded.some(b => b.id === storedId)
          ? storedId
          : loaded[0]?.id || '';

        setActiveBookId(initialId);

        const initialBook = loaded.find(b => b.id === initialId);
        if (initialBook) {
          setActiveInstrument(initialBook.instrument || 'fountain');
          setActiveColor(initialBook.penColor || '#1e3a8a');
          setActiveThickness(initialBook.penThickness || 1.6);
          setActiveWritingSpeed(initialBook.writingSpeed ?? 1);
        }
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const currentBook = books.find(b => b.id === activeBookId) || books[0];
  const activeCharacter = getCharacterById(currentBook?.activeCharacterId || CHARACTERS[0].id);

  // Debounced Autosave to IndexedDB
  const handleUpdateBook = useCallback((updated: Partial<Book>) => {
    if (!currentBook) return;

    setIsSaving(true);
    const newBook: Book = {
      ...currentBook,
      ...updated,
      updatedAt: Date.now()
    };

    setBooks(prev => prev.map(b => (b.id === newBook.id ? newBook : b)));

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveBookToDB(newBook);
      } catch (err) {
        console.error('Autosave error:', err);
      } finally {
        setIsSaving(false);
      }
    }, 600);
  }, [currentBook]);

  // Handle Book Switching
  const handleSelectBook = async (id: string) => {
    setActiveBookId(id);
    await setStoredActiveBookId(id);
    const selected = books.find(b => b.id === id);
    if (selected) {
      setActiveInstrument(selected.instrument || 'fountain');
      setActiveColor(selected.penColor || '#1e3a8a');
      setActiveThickness(selected.penThickness || 1.6);
      setActiveWritingSpeed(selected.writingSpeed ?? 1);
    }
  };

  // Create Book with dynamic page count
  const handleCreateBook = async (title: string, requestedPages: number = 24) => {
    const pageCount = requestedPages % 2 === 0 ? requestedPages : requestedPages + 1;
    const initialPages: BookPage[] = [];
    for (let i = 1; i <= pageCount; i++) {
      initialPages.push({
        pageNumber: i,
        strokes: [],
        rawText: ''
      });
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      subtitle: 'Journal & Notes',
      coverMaterial: 'leather-morocco',
      coverColor: '#3b1d11',
      embossingColor: 'gold',
      paperType: 'cream-notebook',
      rulingStyle: 'lined',
      ribbonColor: '#991b1b',
      instrument: activeInstrument,
      penColor: activeColor,
      penThickness: activeThickness,
      penOpacity: 0.95,
      writingSpeed: activeWritingSpeed,
      activeCharacterId: CHARACTERS[0].id,
      pages: initialPages,
      bookmarks: [],
      currentPage: 1,
      isClosed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await saveBookToDB(newBook);
    setBooks(prev => [...prev, newBook]);
    setActiveBookId(newBook.id);
    await setStoredActiveBookId(newBook.id);
  };

  // Duplicate Book
  const handleDuplicateBook = async (id: string) => {
    const source = books.find(b => b.id === id);
    if (!source) return;

    const copy: Book = {
      ...source,
      id: `book-${Date.now()}`,
      title: `${source.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await saveBookToDB(copy);
    setBooks(prev => [...prev, copy]);
  };

  // Rename Book
  const handleRenameBook = async (id: string, newTitle: string) => {
    const target = books.find(b => b.id === id);
    if (!target) return;

    const updated = { ...target, title: newTitle, updatedAt: Date.now() };
    await saveBookToDB(updated);
    setBooks(prev => prev.map(b => (b.id === id ? updated : b)));
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    if (books.length <= 1) return;
    await deleteBookFromDB(id);
    const remaining = books.filter(b => b.id !== id);
    setBooks(remaining);
    if (activeBookId === id) {
      setActiveBookId(remaining[0].id);
      await setStoredActiveBookId(remaining[0].id);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (isLoading || !currentBook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#140d09] text-amber-200 font-serif">
        <div className="p-4 rounded-2xl bg-[#23150d] border border-amber-900/60 shadow-2xl flex flex-col items-center">
          <BookOpen className="w-10 h-10 text-amber-400 animate-pulse mb-3" />
          <h2 className="text-xl font-bold tracking-widest text-amber-100">BOOKI ATELIER</h2>
          <p className="text-xs text-amber-400/60 mt-1 italic">Opening your handcrafted library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-between desk-surface overflow-hidden text-amber-100 font-serif relative">
      
      {/* Ambient Room Lighting Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/30 z-0" />

      {/* ======================================================== */}
      {/* 1. TOP FLOATING DESK CONTROLS */}
      {/* ======================================================== */}
      <header className="relative z-40 flex items-center justify-between px-6 py-3 bg-[#19100a]/80 border-b border-amber-950/80 backdrop-blur-md shadow-lg select-none">
        
        {/* Left: Library Drawer & Book Title Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/70 border border-amber-700/50 text-amber-300 shadow-md cursor-pointer transition-all flex items-center gap-2"
            title="Library Shelf"
          >
            <Library className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">Volumes ({books.length})</span>
          </button>

          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-wide text-amber-100 flex items-center gap-2">
              <span>{currentBook.title}</span>
            </h1>
            <div className="text-[10px] text-amber-400/60 tracking-wider">
              {currentBook.coverMaterial.replace('-', ' ').toUpperCase()} • {currentBook.paperType.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Center: International Character Persona Chip */}
        <button
          onClick={() => setIsCharacterModalOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#25170f]/90 hover:bg-[#2d1c13] border border-amber-600/40 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105"
          title="Switch Writing Persona & Handwriting Style"
        >
          <span className="text-base" role="img" aria-label={activeCharacter.country}>
            {activeCharacter.flag}
          </span>
          <div className="text-left">
            <div className="text-xs font-bold text-amber-200 leading-tight">
              {activeCharacter.name}
            </div>
            <div className="text-[9px] text-amber-400/60 leading-tight">
              {activeCharacter.nationality} Handwriting
            </div>
          </div>
          <Users className="w-3.5 h-3.5 text-amber-400/70 ml-1" />
        </button>

        {/* Right: Bindery Customizer & Status Badges */}
        <div className="flex items-center gap-3">
          {/* Autosaved Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-400/60 bg-black/30 px-2.5 py-1 rounded-full border border-amber-950">
            <CheckCircle2 className={`w-3.5 h-3.5 ${isSaving ? 'text-amber-500 animate-spin' : 'text-emerald-400'}`} />
            <span>{isSaving ? 'Inking...' : 'Autosaved'}</span>
          </div>

          {/* Book Bindery Customizer */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/70 border border-amber-700/50 text-amber-300 shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            title="Book Customizer & Bindery"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold hidden md:inline">Bindery</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={() => setIsMuted(sound.toggleMute())}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-900/50 text-amber-400/70 hover:text-amber-200 cursor-pointer transition-all"
            title={isMuted ? 'Unmute Realistic Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400/80" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-900/50 text-amber-400/70 hover:text-amber-200 cursor-pointer transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </header>

      {/* ======================================================== */}
      {/* 2. MAIN CENTER STAGE: 3D BOOK FLANKED BY DESK PEN STANDS */}
      {/* ======================================================== */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-2 sm:px-6 overflow-hidden gap-3 lg:gap-8">
        {/* Left Desk Stand: Pencil & Ballpoint Pen */}
        <LeftDeskPenStand
          currentInstrument={activeInstrument}
          onSelectInstrument={inst => {
            setActiveInstrument(inst);
            handleUpdateBook({ instrument: inst });
          }}
          onSelectColor={col => {
            setActiveColor(col);
            handleUpdateBook({ penColor: col });
          }}
        />

        {/* Center Stage: Interactive 3D Hardcover Book */}
        <BookEngine
          key={currentBook.id}
          book={currentBook}
          activeCharacter={activeCharacter}
          instrument={activeInstrument}
          penColor={activeColor}
          penThickness={activeThickness}
          writingSpeed={activeWritingSpeed}
          fontSize={activeSize}
          onUpdateBook={handleUpdateBook}
        />

        {/* Right Desk Stand: Fountain Pen, Marker, Inks & Tuning Settings */}
        <RightDeskPenStand
          currentInstrument={activeInstrument}
          currentColor={activeColor}
          currentThickness={activeThickness}
          currentWritingSpeed={activeWritingSpeed}
          currentSize={activeSize}
          onSelectInstrument={inst => {
            setActiveInstrument(inst);
            handleUpdateBook({ instrument: inst });
          }}
          onSelectColor={col => {
            setActiveColor(col);
            handleUpdateBook({ penColor: col });
          }}
          onChangeThickness={th => {
            setActiveThickness(th);
            handleUpdateBook({ penThickness: th });
          }}
          onChangeWritingSpeed={spd => {
            setActiveWritingSpeed(spd);
            handleUpdateBook({ writingSpeed: spd });
          }}
          onChangeSize={sz => setActiveSize(sz)}
        />
      </main>
      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        activeCharacterId={currentBook.activeCharacterId}
        instrument={activeInstrument}
        penColor={activeColor}
        onSelectCharacter={charId => {
          handleUpdateBook({ activeCharacterId: charId });
        }}
        onClose={() => setIsCharacterModalOpen(false)}
      />

      <BookCustomizerModal
        isOpen={isCustomizerOpen}
        book={currentBook}
        onUpdateBook={handleUpdateBook}
        onClose={() => setIsCustomizerOpen(false)}
      />

      <LibraryModal
        isOpen={isLibraryOpen}
        books={books}
        activeBookId={currentBook.id}
        onSelectBook={handleSelectBook}
        onCreateBook={handleCreateBook}
        onDuplicateBook={handleDuplicateBook}
        onRenameBook={handleRenameBook}
        onDeleteBook={handleDeleteBook}
        onClose={() => setIsLibraryOpen(false)}
      />

    </div>
  );
}
