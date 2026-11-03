import React, { useState, useEffect, useRef } from 'react';
import { CharacterProfile, WritingInstrument } from '../types/book';
import { CHARACTERS } from '../data/characters';
import { generatePageStrokes } from '../engine/handwriting/strokeGenerator';
import { renderPageStrokes } from '../engine/handwriting/strokeRenderer';
import { renderPaperBackground } from '../engine/paper/paperTexture';
import { Users, Check, X, Sparkles, Feather } from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  activeCharacterId: string;
  instrument: WritingInstrument;
  penColor: string;
  onSelectCharacter: (characterId: string) => void;
  onClose: () => void;
}

// Mini preview canvas for each character card
const CharacterPreviewCanvas: React.FC<{
  character: CharacterProfile;
  instrument: WritingInstrument;
  penColor: string;
}> = ({ character, instrument, penColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 240;
    const height = 88;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    // Render subtle background
    renderPaperBackground(ctx, {
      width,
      height,
      type: 'cream-notebook',
      ruling: 'lined',
      isRightPage: true,
      lineHeight: 25,
      marginTop: 15,
      marginBottom: 8,
      marginLeft: 14,
      marginRight: 14,
      dpr
    });

    // Render sample quote
    const content = generatePageStrokes(
      character.sampleQuote.slice(0, 60) + '...',
      {
        ...character,
        style: {
          ...character.style,
          size: 14,
          lineHeight: 25
        }
      },
      {
        width,
        height,
        marginTop: 15,
        marginBottom: 8,
        marginLeft: 14,
        marginRight: 14,
        isRightPage: true
      },
      instrument,
      penColor,
      1.4,
      0.95
    );

    renderPageStrokes(ctx, content.strokes, undefined, 1.0, dpr);
  }, [character, instrument, penColor]);

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border border-amber-900/40 bg-[#f5edd9]">
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
};

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  activeCharacterId,
  instrument,
  penColor,
  onSelectCharacter,
  onClose
}) => {
  const [selectedId, setSelectedId] = useState(activeCharacterId);

  useEffect(() => {
    setSelectedId(activeCharacterId);
  }, [activeCharacterId]);

  if (!isOpen) return null;

  const currentProfile = CHARACTERS.find(c => c.id === selectedId) || CHARACTERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#1a120c] border border-amber-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50 bg-gradient-to-r from-[#241710] to-[#1c120c]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-900/40 border border-amber-700/50 rounded-xl text-amber-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-amber-100">International Character Handwriting Identities</h2>
              <p className="text-xs text-amber-400/60">Choose a writer. Each character possesses authentic anatomical strokes, proportions, and rhythm.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-950/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left sidebar list & Right detailed inspection */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-amber-900/40">
          
          {/* Left Grid: Character Cards */}
          <div className="md:col-span-7 overflow-y-auto p-4 space-y-3 max-h-[72vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTERS.map(c => {
                const isSelected = c.id === selectedId;
                const isActive = c.id === activeCharacterId;

                return (
                  <div
                    key={c.id}
                    data-character-id={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)] ring-1 ring-amber-400/50'
                        : 'bg-black/30 border-amber-900/40 hover:bg-black/50 hover:border-amber-800'
                    }`}
                  >
                    {/* Top Identity Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl" role="img" aria-label={c.country}>{c.flag}</span>
                        <div>
                          <div className="font-bold text-sm text-amber-200">{c.name}</div>
                          <div className="text-[11px] text-amber-400/60">{c.country} • {c.nationality}</div>
                        </div>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-amber-600/30 border border-amber-500/50 rounded-full text-[10px] text-amber-300 font-sans">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Handwriting Preview Canvas */}
                    <div className="my-2">
                      <CharacterPreviewCanvas
                        character={c}
                        instrument={instrument}
                        penColor={penColor}
                      />
                    </div>

                    {/* Quick bio snippet */}
                    <p className="text-[11px] text-amber-300/70 italic line-clamp-2 mt-1">
                      "{c.sampleQuote}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Detailed Profile & Sample Paragraph */}
          <div className="md:col-span-5 p-6 bg-[#160e0a]/80 flex flex-col justify-between overflow-y-auto max-h-[72vh]">
            <div className="space-y-4">
              {/* Persona Profile Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-amber-900/40">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-amber-700/50"
                  style={{ backgroundColor: currentProfile.avatarBg }}
                >
                  <span role="img" aria-label={currentProfile.country}>{currentProfile.flag}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-100">{currentProfile.name}</h3>
                  <div className="text-xs text-amber-400/80">{currentProfile.country} ({currentProfile.nationality})</div>
                </div>
              </div>

              {/* Bio & Voice */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" /> Personality & Background
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed bg-black/30 p-3 rounded-lg border border-amber-900/30">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Handwriting Metrics */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Stroke Dynamics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/30 p-2 rounded border border-amber-900/30 flex justify-between">
                    <span className="text-amber-400/60">Slant:</span>
                    <span className="text-amber-200 font-mono">+{currentProfile.style.slant}°</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-amber-900/30 flex justify-between">
                    <span className="text-amber-400/60">Curvature:</span>
                    <span className="text-amber-200 font-mono">{currentProfile.style.curvature}x</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-amber-900/30 flex justify-between">
                    <span className="text-amber-400/60">Jitter:</span>
                    <span className="text-amber-200 font-mono">±{currentProfile.style.baselineJitter}px</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-amber-900/30 flex justify-between">
                    <span className="text-amber-400/60">Rhythm:</span>
                    <span className="text-amber-200 font-mono">{currentProfile.style.speedFactor}x</span>
                  </div>
                </div>
              </div>

              {/* Sample Native Language Paragraph */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Sample Text ({currentProfile.nationality})
                </h4>
                <p className="text-xs text-amber-100/90 italic bg-amber-950/30 p-3 rounded-lg border border-amber-900/40 leading-relaxed">
                  "{currentProfile.sampleParagraph}"
                </p>
              </div>
            </div>

            {/* Selection Action Button */}
            <div className="pt-4 border-t border-amber-900/40 mt-4">
              <button
                onClick={() => {
                  onSelectCharacter(currentProfile.id);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-bold text-sm rounded-xl shadow-lg border border-amber-400/50 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Check className="w-4 h-4" />
                <span>Write as {currentProfile.name}</span>
              </button>
              <p className="text-[10px] text-amber-400/50 text-center mt-2">
                Existing pages retain the original characters who penned them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
