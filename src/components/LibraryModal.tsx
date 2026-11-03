import React, { useState } from 'react';
import { Book } from '../types/book';
import { Library, Plus, Copy, Trash2, Edit3, Check, X, ArrowRight } from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  books: Book[];
  activeBookId: string;
  onSelectBook: (id: string) => void;
  onCreateBook: (title: string) => void;
  onDuplicateBook: (id: string) => void;
  onRenameBook: (id: string, newTitle: string) => void;
  onDeleteBook: (id: string) => void;
  onClose: () => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  books,
  activeBookId,
  onSelectBook,
  onCreateBook,
  onDuplicateBook,
  onRenameBook,
  onDeleteBook,
  onClose
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onCreateBook(newTitle.trim());
    setNewTitle('');
  };

  const handleStartRename = (book: Book) => {
    setEditingId(book.id);
    setEditingTitle(book.title);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameBook(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1c120c] border border-amber-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50 bg-[#241710]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/40 border border-amber-700/50 rounded-xl text-amber-300">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-amber-100">Private Library & Volumes</h2>
              <p className="text-xs text-amber-400/60">Manage your collection of handwritten volumes. Each book stores independent pages and stroke data.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-950/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Book Bar */}
        <div className="p-4 bg-black/30 border-b border-amber-900/40 flex items-center gap-3">
          <input
            type="text"
            placeholder="New book title (e.g. Letters from Paris, Daily Journal)..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="flex-1 bg-black/50 border border-amber-800/50 rounded-xl px-4 py-2 text-sm text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleCreate}
            disabled={!newTitle.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 text-amber-50 font-bold text-xs rounded-xl shadow-md border border-amber-400/50 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Bind New Book</span>
          </button>
        </div>

        {/* Bookshelf Grid */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[65vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {books.map(b => {
              const isActive = b.id === activeBookId;
              const isEditing = editingId === b.id;

              return (
                <div
                  key={b.id}
                  className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all group ${
                    isActive
                      ? 'bg-amber-950/50 border-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.25)] ring-1 ring-amber-400/60'
                      : 'bg-black/40 border-amber-900/40 hover:bg-black/60 hover:border-amber-800'
                  }`}
                >
                  {/* Miniature Spine & Hardcover visual */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-10 h-16 rounded-r rounded-l-xs shadow-md border-r-2 border-black/40 relative overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: b.coverColor }}
                    >
                      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-black/40" />
                      <div
                        className="w-1.5 h-6 rounded-b shadow-xs"
                        style={{ backgroundColor: b.ribbonColor }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            className="w-full bg-black/60 border border-amber-600 rounded px-2 py-0.5 text-xs text-amber-100"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleSaveRename(b.id)}
                          />
                          <button
                            onClick={() => handleSaveRename(b.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <h4 className="font-bold text-sm text-amber-200 truncate group-hover:text-amber-100">
                          {b.title}
                        </h4>
                      )}
                      <p className="text-[11px] text-amber-400/60 mt-0.5">
                        {b.pages.length} {b.pages.length === 1 ? 'page' : 'pages'} • {b.bookmarks.length} ribbons
                      </p>
                      <p className="text-[10px] text-amber-500/40 mt-1">
                        Updated {new Date(b.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-amber-900/40 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartRename(b)}
                        className="p-1.5 text-amber-400/60 hover:text-amber-200 cursor-pointer rounded hover:bg-black/30"
                        title="Rename Book"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateBook(b.id)}
                        className="p-1.5 text-amber-400/60 hover:text-amber-200 cursor-pointer rounded hover:bg-black/30"
                        title="Duplicate Book"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {books.length > 1 && (
                        <button
                          onClick={() => onDeleteBook(b.id)}
                          className="p-1.5 text-red-400/60 hover:text-red-300 cursor-pointer rounded hover:bg-black/30"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectBook(b.id);
                        onClose();
                      }}
                      className={`px-3 py-1 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-600/40 border-amber-400 text-amber-100 font-bold'
                          : 'bg-black/30 border-amber-800/40 text-amber-300 hover:bg-amber-800/40'
                      }`}
                    >
                      <span>{isActive ? 'Current' : 'Open'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
