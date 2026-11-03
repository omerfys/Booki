import React, { useState } from 'react';
import { Book, CoverMaterial, PaperType, RulingStyle } from '../types/book';
import { Palette, X, Check } from 'lucide-react';
import { RIBBON_COLORS } from './RibbonBookmark';

interface BookCustomizerModalProps {
  isOpen: boolean;
  book: Book;
  onUpdateBook: (updated: Partial<Book>) => void;
  onClose: () => void;
}

export const COVER_MATERIALS: Array<{
  id: CoverMaterial;
  name: string;
  desc: string;
  textureClass: string;
}> = [
  {
    id: 'leather-morocco',
    name: 'Moroccan Leather',
    desc: 'Full-grain goatskin with deep organic pebble grain and gold corner tooling.',
    textureClass: 'bg-[#3b1d11]'
  },
  {
    id: 'cloth-linen',
    name: 'Woven Bookcloth',
    desc: 'Fine natural library buckram with tactile cross-weave texture.',
    textureClass: 'bg-[#2b3542]'
  },
  {
    id: 'velvet-royal',
    name: 'Royal Velvet',
    desc: 'Plush heritage velvet with deep jewel-tone lustre and brass corners.',
    textureClass: 'bg-[#1e1526]'
  },
  {
    id: 'marbled-florentine',
    name: 'Florentine Marbled',
    desc: 'Traditional hand-marbled comb pattern with leather quarter-binding spine.',
    textureClass: 'bg-[#3e2718]'
  },
  {
    id: 'vintage-brown',
    name: 'Distressed Antique',
    desc: 'Aged patinated calfskin with blind debossed borders and antique wear.',
    textureClass: 'bg-[#2f1c0f]'
  }
];

export const COVER_COLORS = [
  { name: 'Oxblood Crimson', hex: '#4a151b' },
  { name: 'Imperial Navy', hex: '#16233b' },
  { name: 'Forest Emerald', hex: '#142e20' },
  { name: 'Dark Walnut', hex: '#2b1b12' },
  { name: 'Obsidian Black', hex: '#18181b' },
  { name: 'Royal Amethyst', hex: '#2e183b' },
  { name: 'Saddle Tan', hex: '#5c381e' },
  { name: 'Parchment Ochre', hex: '#634825' }
];

export const PAPER_OPTIONS: Array<{ id: PaperType; name: string; desc: string; sampleBg: string }> = [
  { id: 'clean-white', name: 'Crisp White', desc: 'Modern bright archival bond paper', sampleBg: '#fbfbfa' },
  { id: 'cream-notebook', name: 'Warm Cream', desc: 'Classic Italian notebook cream wove', sampleBg: '#f5edd9' },
  { id: 'aged-vintage', name: 'Aged Parchment', desc: 'Antique vellum with foxing and patina', sampleBg: '#e9d6b2' },
  { id: 'yellowed', name: 'Nostalgic Yellowed', desc: 'Naturally aged literary paper', sampleBg: '#f2e4c4' },
  { id: 'fine-textured', name: 'Fine Textured', desc: 'Soft-grain cotton rag drawing paper', sampleBg: '#f7f3ea' },
  { id: 'lightly-rough', name: 'Deckled Rough', desc: 'Handmade artisanal fibrous paper', sampleBg: '#ede2ce' }
];

export const RULING_OPTIONS: Array<{ id: RulingStyle; name: string; icon: string }> = [
  { id: 'blank', name: 'Plain Blank', icon: '◻' },
  { id: 'lined', name: 'Feint Lined', icon: '☰' },
  { id: 'dotted', name: 'Dot Grid (5mm)', icon: '⁖' },
  { id: 'grid', name: 'Architectural Grid', icon: '▦' }
];

export const BookCustomizerModal: React.FC<BookCustomizerModalProps> = ({
  isOpen,
  book,
  onUpdateBook,
  onClose
}) => {
  const [title, setTitle] = useState(book.title);
  const [subtitle, setSubtitle] = useState(book.subtitle || '');
  const [material, setMaterial] = useState(book.coverMaterial);
  const [color, setColor] = useState(book.coverColor);
  const [embossing, setEmbossing] = useState(book.embossingColor);
  const [paper, setPaper] = useState(book.paperType);
  const [ruling, setRuling] = useState(book.rulingStyle);
  const [ribbon, setRibbon] = useState(book.ribbonColor);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateBook({
      title: title.trim() || 'My Handwritten Book',
      subtitle: subtitle.trim(),
      coverMaterial: material,
      coverColor: color,
      embossingColor: embossing,
      paperType: paper,
      rulingStyle: ruling,
      ribbonColor: ribbon
    });
    onClose();
  };

  const getFoilStyle = (type: string) => {
    switch (type) {
      case 'gold':
        return 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent';
      case 'silver':
        return 'text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent';
      case 'bronze':
        return 'text-amber-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 bg-clip-text text-transparent';
      default:
        return 'text-black/60 drop-shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#1a120c] border border-amber-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50 bg-[#221610]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/40 border border-amber-700/50 rounded-xl text-amber-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-amber-100">Bookmaker's Bindery & Atelier</h2>
              <p className="text-xs text-amber-400/60">Customize the physical hardcover, materials, paper grain, and gold foil stamping.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-950/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Controls & Right 3D Hardcover Preview */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-amber-900/40">
          
          {/* Left Configuration Panel */}
          <div className="md:col-span-7 overflow-y-auto p-5 space-y-5 max-h-[75vh]">
            
            {/* Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  Book Title (Embossed on Cover)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Chronicles of Venice"
                  className="w-full bg-black/40 border border-amber-800/50 rounded-lg px-3 py-2 text-sm text-amber-100 placeholder-amber-600/40 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-1">
                  Subtitle / Volume
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="e.g. Personal Memoirs & Reflections"
                  className="w-full bg-black/40 border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-100 placeholder-amber-600/40 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Cover Material */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                Hardcover Material
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COVER_MATERIALS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      material === m.id
                        ? 'bg-amber-900/40 border-amber-500 ring-1 ring-amber-400/50 shadow-sm'
                        : 'bg-black/30 border-amber-900/40 hover:bg-black/50 hover:border-amber-800'
                    }`}
                  >
                    <div className="font-bold text-xs text-amber-200">{m.name}</div>
                    <div className="text-[10px] text-amber-400/60 leading-tight mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Color Dye */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                Cover Leather Dye
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COVER_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border shadow-md cursor-pointer transition-transform ${
                      color === c.hex ? 'scale-125 border-amber-200 ring-2 ring-amber-400/60' : 'border-black/50 hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Foil Stamping Type */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                Title Stamping & Tooling
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'gold', name: 'Gold Foil' },
                    { id: 'silver', name: 'Silver Foil' },
                    { id: 'bronze', name: 'Antique Bronze' },
                    { id: 'blind-deboss', name: 'Blind Deboss' }
                  ] as const
                ).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setEmbossing(f.id)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                      embossing === f.id
                        ? 'bg-amber-600/40 border-amber-400 text-amber-100 font-bold shadow-xs'
                        : 'bg-black/30 border-amber-900/40 text-amber-400/70 hover:text-amber-200'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Selection */}
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                Interior Paper Variety
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PAPER_OPTIONS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPaper(p.id)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      paper === p.id
                        ? 'bg-amber-900/40 border-amber-500 ring-1 ring-amber-400/50'
                        : 'bg-black/30 border-amber-900/40 hover:bg-black/50'
                    }`}
                  >
                    <div
                      className="w-4 h-6 rounded-xs border border-black/40 shadow-xs shrink-0"
                      style={{ backgroundColor: p.sampleBg }}
                    />
                    <div>
                      <div className="font-semibold text-xs text-amber-200">{p.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ruling Style & Ribbon Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Page Ruling
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {RULING_OPTIONS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRuling(r.id)}
                      className={`p-1.5 rounded border text-xs text-center cursor-pointer transition-all ${
                        ruling === r.id
                          ? 'bg-amber-700/50 border-amber-400 text-amber-100 font-bold'
                          : 'bg-black/30 border-amber-900/40 text-amber-400/60 hover:text-amber-200'
                      }`}
                    >
                      <span className="mr-1">{r.icon}</span>
                      <span>{r.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Ribbon Bookmark Color
                </label>
                <div className="flex gap-1.5 pt-1">
                  {RIBBON_COLORS.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setRibbon(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                        ribbon === c.hex ? 'scale-125 border-amber-200 ring-2 ring-amber-400/60' : 'border-black/50 hover:scale-110'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Live 3D Hardcover Preview */}
          <div className="md:col-span-5 p-6 bg-[#130b08]/90 flex flex-col items-center justify-center">
            <span className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-4">Live Cover Bindery Preview</span>
            
            {/* 3D Hardcover Book Model */}
            <div 
              className="relative w-64 h-92 rounded-r-xl rounded-l-xs shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col justify-between p-6 transition-all duration-500 overflow-hidden border-r-4 border-b-4 border-black/40"
              style={{ backgroundColor: color }}
            >
              {/* Hardcover Material Grain / Leather Texture Overlay */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none wood-texture" />

              {/* Spine Hinge Groove Shadow */}
              <div className="absolute top-0 left-0 bottom-0 w-5 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              <div className="absolute top-0 left-4 bottom-0 w-[1px] bg-black/40 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />

              {/* Gilt / Embossed Border Framing */}
              <div className="absolute inset-3 border border-amber-400/30 rounded-r-lg rounded-l-xs pointer-events-none flex flex-col justify-between p-1">
                <div className="flex justify-between">
                  <div className="w-2.5 h-2.5 border-t border-l border-amber-400/60" />
                  <div className="w-2.5 h-2.5 border-t border-r border-amber-400/60" />
                </div>
                <div className="flex justify-between">
                  <div className="w-2.5 h-2.5 border-b border-l border-amber-400/60" />
                  <div className="w-2.5 h-2.5 border-b border-r border-amber-400/60" />
                </div>
              </div>

              {/* Ribbon tail peeking out from the bottom edge */}
              <div 
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-12 shadow-lg rounded-b-xs"
                style={{ backgroundColor: ribbon }}
              />

              {/* Top Cover Tooling Header */}
              <div className="text-center pt-8 z-10">
                <div className="text-[10px] uppercase tracking-widest text-amber-400/50 font-serif">
                  Handcrafted Edition
                </div>
              </div>

              {/* Embossed Title & Subtitle */}
              <div className="text-center my-auto z-10 px-2">
                <h3 className={`text-xl font-bold font-serif tracking-wider leading-snug ${getFoilStyle(embossing)}`}>
                  {title || 'Untitled Book'}
                </h3>
                {subtitle && (
                  <p className="text-xs italic text-amber-200/80 font-serif mt-2 tracking-wide">
                    {subtitle}
                  </p>
                )}
                <div className="w-12 h-[1px] bg-amber-400/40 mx-auto mt-4" />
              </div>

              {/* Bottom Colophon Marker */}
              <div className="text-center pb-2 z-10">
                <div className="text-[9px] uppercase tracking-widest text-amber-400/40 font-serif">
                  Booki Atelier
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="w-full mt-6">
              <button
                onClick={handleSave}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-bold text-sm rounded-xl shadow-lg border border-amber-400/50 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Check className="w-4 h-4" />
                <span>Save Bindery Settings</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
