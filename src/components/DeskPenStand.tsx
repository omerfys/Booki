import React, { useState } from 'react';
import { WritingInstrument } from '../types/book';
import { Sliders, Zap, Gauge, Sparkles } from 'lucide-react';
import { sound } from '../engine/audio/soundEngine';

export const INK_PALETTES: Record<WritingInstrument, Array<{ name: string; hex: string }>> = {
  pencil: [
    { name: 'HB Graphite', hex: '#444444' },
    { name: '2B Soft Lead', hex: '#2b2b2b' },
    { name: '4B Dark Lead', hex: '#181818' },
    { name: 'Sepia Lead', hex: '#5c4838' }
  ],
  ballpoint: [
    { name: 'Midnight Black', hex: '#111827' },
    { name: 'Royal Blue', hex: '#1d4ed8' },
    { name: 'Classic Navy', hex: '#1e3a8a' },
    { name: 'Crimson Red', hex: '#b91c1c' },
    { name: 'Forest Green', hex: '#15803d' }
  ],
  fountain: [
    { name: 'Parker Quink Black', hex: '#0f172a' },
    { name: 'Iroshizuku Asa-gao Blue', hex: '#1e40af' },
    { name: 'Burgundy Oxblood', hex: '#831843' },
    { name: 'Sepia Walnut', hex: '#5c3a21' },
    { name: 'Dark Teal Emerald', hex: '#115e59' }
  ],
  marker: [
    { name: 'Solar Yellow', hex: '#ca8a04' },
    { name: 'Highlighter Green', hex: '#16a34a' },
    { name: 'Electric Cyan', hex: '#0284c7' },
    { name: 'Rose Highlighter', hex: '#db2777' },
    { name: 'Amber Orange', hex: '#ea580c' }
  ]
};

// =========================================================================
// 1. LEFT DESK PEN STAND: PENCIL & BALLPOINT
// =========================================================================

interface LeftDeskPenStandProps {
  currentInstrument: WritingInstrument;
  onSelectInstrument: (instrument: WritingInstrument) => void;
  onSelectColor: (color: string) => void;
}

export const LeftDeskPenStand: React.FC<LeftDeskPenStandProps> = ({
  currentInstrument,
  onSelectInstrument,
  onSelectColor
}) => {
  return (
    <aside 
      className="hidden md:flex flex-col items-center justify-center z-30 select-none animate-fade-in"
      aria-label="Pencil and Ballpoint Desk Stand"
    >
      {/* Carved Walnut Wood Desk Pen Stand */}
      <div className="relative bg-gradient-to-b from-[#2d1c13] via-[#21140d] to-[#170c07] border border-amber-900/60 rounded-2xl p-3 shadow-[0_25px_50px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.12)] flex flex-col items-center gap-3 backdrop-blur-md w-24">
        
        {/* Brass Inset Label */}
        <div className="text-[9px] uppercase tracking-widest text-amber-400/60 font-serif border-b border-amber-900/50 pb-1 w-full text-center">
          Pencil Stand
        </div>

        {/* Felt Grooves Holding the Pens */}
        <div className="flex gap-3 bg-[#110905]/85 p-2 rounded-xl border border-amber-950/90 shadow-inner">
          
          {/* A. GRAPHITE PENCIL */}
          <button
            onClick={() => {
              sound.playWritingSound('pencil');
              onSelectInstrument('pencil');
              onSelectColor(INK_PALETTES.pencil[0].hex);
            }}
            className={`group relative flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'pencil'
                ? 'bg-amber-900/50 shadow-[0_0_18px_rgba(217,119,6,0.35)] -translate-y-2 ring-1 ring-amber-400/50'
                : 'hover:-translate-y-1 opacity-75 hover:opacity-100'
            }`}
            title="Graphite Pencil"
          >
            <div className="w-4 h-28 relative flex flex-col items-center justify-between">
              {/* Pink eraser & ferrule */}
              <div className="w-3.5 h-4 bg-rose-400 rounded-t-sm shadow-xs" />
              <div className="w-3.5 h-2.5 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 border-y border-zinc-500" />
              {/* Yellow hexagonal pencil body */}
              <div className="w-3.5 flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-sm" />
              {/* Sharpened cedar cone & graphite lead tip */}
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[12px] border-t-[#d8b589]" />
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[6px] border-t-[#1c1c1c] -mt-[1px]" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1.5 font-serif font-medium">Pencil</span>
          </button>

          {/* B. BALLPOINT PEN */}
          <button
            onClick={() => {
              sound.playWritingSound('ballpoint');
              onSelectInstrument('ballpoint');
              onSelectColor(INK_PALETTES.ballpoint[0].hex);
            }}
            className={`group relative flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'ballpoint'
                ? 'bg-amber-900/50 shadow-[0_0_18px_rgba(217,119,6,0.35)] -translate-y-2 ring-1 ring-amber-400/50'
                : 'hover:-translate-y-1 opacity-75 hover:opacity-100'
            }`}
            title="Ballpoint Pen"
          >
            <div className="w-4 h-28 relative flex flex-col items-center justify-between">
              {/* Metallic clicker button */}
              <div className="w-2.5 h-3 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-t-xs" />
              {/* Pen barrel with metallic clip */}
              <div className="w-3.5 flex-1 bg-gradient-to-r from-sky-950 via-sky-850 to-sky-950 rounded-xs relative">
                <div className="absolute top-1 left-0 w-1 h-12 bg-gradient-to-r from-zinc-200 to-zinc-400 rounded-r shadow-xs" />
              </div>
              {/* Chrome grip & ball cone */}
              <div className="w-3 h-3 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 rounded-b-xs" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-zinc-400" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1.5 font-serif font-medium">Ballpoint</span>
          </button>

        </div>

      </div>
    </aside>
  );
};

// =========================================================================
// 2. RIGHT DESK PEN STAND: FOUNTAIN PEN, MARKER, INK WELLS & SETTINGS
// =========================================================================

interface RightDeskPenStandProps {
  currentInstrument: WritingInstrument;
  currentColor: string;
  currentThickness: number;
  currentWritingSpeed: number;
  currentSize: number;
  onSelectInstrument: (instrument: WritingInstrument) => void;
  onSelectColor: (color: string) => void;
  onChangeThickness: (thickness: number) => void;
  onChangeWritingSpeed: (speed: number) => void;
  onChangeSize: (size: number) => void;
}

export const RightDeskPenStand: React.FC<RightDeskPenStandProps> = ({
  currentInstrument,
  currentColor,
  currentThickness,
  currentWritingSpeed,
  currentSize,
  onSelectInstrument,
  onSelectColor,
  onChangeThickness,
  onChangeWritingSpeed,
  onChangeSize
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const availableColors = INK_PALETTES[currentInstrument] || INK_PALETTES.fountain;

  return (
    <aside 
      className="hidden md:flex flex-col items-center justify-center z-30 select-none animate-fade-in relative"
      aria-label="Fountain Pen and Marker Desk Stand"
    >
      {/* Carved Walnut Wood Desk Pen Stand */}
      <div className="relative bg-gradient-to-b from-[#2d1c13] via-[#21140d] to-[#170c07] border border-amber-900/60 rounded-2xl p-3 shadow-[0_25px_50px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.12)] flex flex-col items-center gap-3 backdrop-blur-md w-28">
        
        {/* Brass Inset Label */}
        <div className="text-[9px] uppercase tracking-widest text-amber-400/60 font-serif border-b border-amber-900/50 pb-1 w-full text-center">
          Ink Atelier
        </div>

        {/* Felt Grooves Holding Fountain Pen & Marker */}
        <div className="flex gap-3 bg-[#110905]/85 p-2 rounded-xl border border-amber-950/90 shadow-inner">
          
          {/* C. FOUNTAIN PEN */}
          <button
            onClick={() => {
              sound.playWritingSound('fountain');
              onSelectInstrument('fountain');
              onSelectColor(INK_PALETTES.fountain[0].hex);
            }}
            className={`group relative flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'fountain'
                ? 'bg-amber-900/50 shadow-[0_0_18px_rgba(217,119,6,0.35)] -translate-y-2 ring-1 ring-amber-400/50'
                : 'hover:-translate-y-1 opacity-75 hover:opacity-100'
            }`}
            title="Fountain Pen"
          >
            <div className="w-4 h-28 relative flex flex-col items-center justify-between">
              {/* Gold finial */}
              <div className="w-3 h-2 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-500 rounded-t-full shadow-xs" />
              {/* Tortoiseshell resin body with gold bands */}
              <div className="w-4 flex-1 bg-gradient-to-r from-[#1c140e] via-[#3a2215] to-[#140e0a] relative flex flex-col justify-between py-1">
                <div className="w-full h-0.5 bg-amber-400 shadow-xs" />
                <div className="w-full h-0.5 bg-amber-400 shadow-xs" />
              </div>
              {/* 14K Gold Nib */}
              <div className="w-3 h-2 bg-gradient-to-r from-amber-400 to-amber-200" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-amber-300 filter drop-shadow-xs" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1.5 font-serif font-medium">Fountain</span>
          </button>

          {/* D. ARTIST MARKER */}
          <button
            onClick={() => {
              sound.playWritingSound('marker');
              onSelectInstrument('marker');
              onSelectColor(INK_PALETTES.marker[0].hex);
            }}
            className={`group relative flex flex-col items-center p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'marker'
                ? 'bg-amber-900/50 shadow-[0_0_18px_rgba(217,119,6,0.35)] -translate-y-2 ring-1 ring-amber-400/50'
                : 'hover:-translate-y-1 opacity-75 hover:opacity-100'
            }`}
            title="Artist Marker"
          >
            <div className="w-4 h-28 relative flex flex-col items-center justify-between">
              {/* Flat cap top */}
              <div className="w-5 h-2.5 bg-zinc-700 rounded-t-xs" />
              {/* Thick white barrel */}
              <div className="w-5 flex-1 bg-gradient-to-r from-zinc-200 via-white to-zinc-300 shadow-sm flex items-center justify-center">
                <div className="w-1 h-10 bg-amber-500/30 rounded" />
              </div>
              {/* Chisel felt tip */}
              <div className="w-4 h-1.5 bg-zinc-800" />
              <div className="w-3.5 h-3 bg-amber-500 rounded-b-xs" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1.5 font-serif font-medium">Marker</span>
          </button>

        </div>

        {/* Ink Wells */}
        <div className="flex flex-col items-center gap-1.5 pt-1 w-full border-t border-amber-900/40">
          <span className="text-[9px] uppercase tracking-wider text-amber-400/60 font-serif">Inks</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {availableColors.map(c => (
              <button
                key={c.hex}
                onClick={() => onSelectColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border shadow-inner cursor-pointer transition-all ${
                  currentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'scale-125 border-amber-200 ring-2 ring-amber-400/60'
                    : 'border-black/60 hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Settings Flyout Button */}
        <div className="pt-1 w-full border-t border-amber-900/40">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-full py-1.5 px-2 rounded-lg border text-[11px] font-serif transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              showSettings
                ? 'bg-amber-600/40 border-amber-500 text-amber-100 shadow-sm'
                : 'bg-black/30 border-amber-900/50 text-amber-300/80 hover:text-amber-100'
            }`}
            title="Fine-tune Instrument Dynamics"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

      </div>

      {/* Settings Modal / Flyout */}
      {showSettings && (
        <div className="absolute top-1/2 -left-88 transform -translate-y-1/2 z-50 w-80 bg-[#1b120c]/95 border border-amber-800/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-amber-100 font-serif">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/50 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-semibold text-sm">Pen & Writing Dynamics</h4>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-amber-400/60 hover:text-amber-200"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Pen Thickness Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-300/80">Stroke Thickness</span>
                <span className="text-amber-400 font-mono">{currentThickness.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="4.0"
                step="0.2"
                value={currentThickness}
                onChange={e => onChangeThickness(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Handwriting Scale Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-300/80">Writing Size</span>
                <span className="text-amber-400 font-mono">{currentSize} px</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                step="1"
                value={currentSize}
                onChange={e => onChangeSize(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Writing Animation Speed Buttons */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-amber-300/80">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Animation Speed:</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Instant', value: 0, icon: Zap },
                  { label: 'Normal', value: 1, icon: null },
                  { label: 'Fast', value: 2, icon: null },
                  { label: 'Swift', value: 3, icon: null }
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => onChangeWritingSpeed(s.value)}
                    className={`py-1.5 px-1 rounded border text-center transition-all cursor-pointer ${
                      currentWritingSpeed === s.value
                        ? 'bg-amber-600/50 border-amber-400 text-amber-100 font-medium shadow-sm'
                        : 'bg-black/40 border-amber-900/40 text-amber-400/60 hover:text-amber-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
