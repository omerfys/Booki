import React from 'react';
import { WritingInstrument } from '../types/book';
import { Sliders, Zap, Gauge, Sparkles } from 'lucide-react';
import { sound } from '../engine/audio/soundEngine';

interface PenTrayProps {
  currentInstrument: WritingInstrument;
  currentColor: string;
  currentThickness: number;
  currentWritingSpeed: number; // 0=instant, 1=normal, 2=fast, 3=ultra
  currentSize: number;
  onSelectInstrument: (instrument: WritingInstrument) => void;
  onSelectColor: (color: string) => void;
  onChangeThickness: (thickness: number) => void;
  onChangeWritingSpeed: (speed: number) => void;
  onChangeSize: (size: number) => void;
}

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

export const PenTray: React.FC<PenTrayProps> = ({
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
  const [showSettings, setShowSettings] = React.useState(false);

  const availableColors = INK_PALETTES[currentInstrument] || INK_PALETTES.ballpoint;

  return (
    <div className="relative flex flex-col items-center">
      {/* 1. Physical Carved Wooden Tray Base */}
      <div className="relative bg-gradient-to-b from-[#2a1b12] to-[#1c120c] border border-amber-900/60 rounded-2xl px-6 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center gap-6 backdrop-blur-md">
        
        {/* Felt / Velvet Grooves for Instruments */}
        <div className="flex items-center gap-4 bg-[#120a07]/80 px-4 py-2 rounded-xl border border-amber-950/80 shadow-inner">
          
          {/* A. Graphite Pencil */}
          <button
            onClick={() => {
              sound.playWritingSound('pencil');
              onSelectInstrument('pencil');
              onSelectColor(INK_PALETTES.pencil[0].hex);
            }}
            className={`group relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'pencil'
                ? 'bg-amber-900/40 shadow-[0_0_15px_rgba(217,119,6,0.25)] -translate-y-1'
                : 'hover:-translate-y-0.5 opacity-70 hover:opacity-100'
            }`}
            title="Graphite Pencil"
          >
            <div className="w-4 h-24 relative flex flex-col items-center justify-between">
              {/* Pink eraser & ferrule */}
              <div className="w-3.5 h-3.5 bg-rose-400 rounded-t-sm" />
              <div className="w-3.5 h-2 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 border-y border-zinc-500" />
              {/* Yellow hexagonal pencil body */}
              <div className="w-3.5 flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-sm" />
              {/* Sharpened wood cone & graphite lead tip */}
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-[#d8b589]" />
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[6px] border-t-[#222222] -mt-[1px]" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1 font-serif">Pencil</span>
          </button>

          {/* B. Ballpoint Pen */}
          <button
            onClick={() => {
              sound.playWritingSound('ballpoint');
              onSelectInstrument('ballpoint');
              onSelectColor(INK_PALETTES.ballpoint[0].hex);
            }}
            className={`group relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'ballpoint'
                ? 'bg-amber-900/40 shadow-[0_0_15px_rgba(217,119,6,0.25)] -translate-y-1'
                : 'hover:-translate-y-0.5 opacity-70 hover:opacity-100'
            }`}
            title="Ballpoint Pen"
          >
            <div className="w-4 h-24 relative flex flex-col items-center justify-between">
              {/* Metallic clicker button */}
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-t-xs" />
              {/* Pen barrel with metallic clip */}
              <div className="w-3.5 flex-1 bg-gradient-to-r from-sky-900 via-sky-800 to-sky-950 rounded-xs relative">
                <div className="absolute top-1 left-0 w-1 h-10 bg-gradient-to-r from-zinc-200 to-zinc-400 rounded-r shadow-xs" />
              </div>
              {/* Chrome grip & ball cone */}
              <div className="w-3 h-3 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 rounded-b-xs" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-zinc-400" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1 font-serif">Ballpoint</span>
          </button>

          {/* C. Fountain Pen */}
          <button
            onClick={() => {
              sound.playWritingSound('fountain');
              onSelectInstrument('fountain');
              onSelectColor(INK_PALETTES.fountain[0].hex);
            }}
            className={`group relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'fountain'
                ? 'bg-amber-900/40 shadow-[0_0_15px_rgba(217,119,6,0.25)] -translate-y-1'
                : 'hover:-translate-y-0.5 opacity-70 hover:opacity-100'
            }`}
            title="Fountain Pen"
          >
            <div className="w-4 h-24 relative flex flex-col items-center justify-between">
              {/* Gold finial */}
              <div className="w-3 h-2 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-500 rounded-t-full shadow-xs" />
              {/* Black / Tortoiseshell resin body with gold bands */}
              <div className="w-4 flex-1 bg-gradient-to-r from-[#1c140e] via-[#3a2215] to-[#140e0a] relative flex flex-col justify-between py-1">
                <div className="w-full h-0.5 bg-amber-400 shadow-xs" />
                <div className="w-full h-0.5 bg-amber-400 shadow-xs" />
              </div>
              {/* 14K Gold Nib */}
              <div className="w-3 h-2 bg-gradient-to-r from-amber-400 to-amber-200" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-amber-300 filter drop-shadow-xs" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1 font-serif">Fountain</span>
          </button>

          {/* D. Marker */}
          <button
            onClick={() => {
              sound.playWritingSound('marker');
              onSelectInstrument('marker');
              onSelectColor(INK_PALETTES.marker[0].hex);
            }}
            className={`group relative flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              currentInstrument === 'marker'
                ? 'bg-amber-900/40 shadow-[0_0_15px_rgba(217,119,6,0.25)] -translate-y-1'
                : 'hover:-translate-y-0.5 opacity-70 hover:opacity-100'
            }`}
            title="Artist Marker"
          >
            <div className="w-4 h-24 relative flex flex-col items-center justify-between">
              {/* Flat cap top */}
              <div className="w-5 h-2 bg-zinc-700 rounded-t-xs" />
              {/* Thick white barrel */}
              <div className="w-5 flex-1 bg-gradient-to-r from-zinc-200 via-white to-zinc-300 shadow-sm flex items-center justify-center">
                <div className="w-1 h-8 bg-amber-500/30 rounded" />
              </div>
              {/* Chisel felt tip */}
              <div className="w-4 h-1.5 bg-zinc-800" />
              <div className="w-3 h-3 bg-amber-500 rounded-b-xs" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1 font-serif">Marker</span>
          </button>
        </div>

        {/* 2. Color Palette Wells */}
        <div className="flex flex-col gap-1.5 border-l border-amber-900/40 pl-5">
          <span className="text-[10px] text-amber-400/60 font-serif uppercase tracking-wider">Ink Well</span>
          <div className="flex items-center gap-2">
            {availableColors.map(c => (
              <button
                key={c.hex}
                onClick={() => onSelectColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full border shadow-inner cursor-pointer transition-all ${
                  currentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'scale-125 border-amber-200 ring-2 ring-amber-400/60'
                    : 'border-black/60 hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* 3. Pen Tuning Drawer Toggle */}
        <div className="border-l border-amber-900/40 pl-5 flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              showSettings
                ? 'bg-amber-600/40 border-amber-500 text-amber-200 shadow-md'
                : 'bg-black/30 border-amber-900/50 text-amber-400/80 hover:text-amber-200 hover:border-amber-700'
            }`}
            title="Fine-tune Writing Parameters"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-serif hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* 4. Pen Settings Modal / Flyout */}
      {showSettings && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-84 bg-[#1b120c]/95 border border-amber-800/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-amber-100 font-serif">
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
    </div>
  );
};
