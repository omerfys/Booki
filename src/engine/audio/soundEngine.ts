import { WritingInstrument } from '../../types/book';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85;
  private lastStrokeSoundTime: number = 0;
  private activeWritingGain: GainNode | null = null;

  // Real Acoustic Recorded Audio Buffers
  private realPencilBuffers: AudioBuffer[] = [];
  private realPenBuffers: AudioBuffer[] = [];
  private realMarkerBuffers: AudioBuffer[] = [];
  private realPageTurnBuffer: AudioBuffer | null = null;
  private isAudioFilesLoaded: boolean = false;
  constructor() {
    // Lazily initialized on first user interaction
  }

  public initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.loadRealAudioAssets(this.ctx);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    const ctx = this.initCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // =========================================================================
  // LOAD & SLICE REAL ACOUSTIC AUDIO RECORDINGS
  // =========================================================================

  private async loadRealAudioAssets(ctx: AudioContext): Promise<void> {
    if (this.isAudioFilesLoaded || typeof window === 'undefined') return;
    this.isAudioFilesLoaded = true;

    try {
      // 1. Real Pencil Audio Recording
      const pencilRes = await fetch('/sounds/pencil-writing.mp3').catch(() => null);
      if (pencilRes && pencilRes.ok) {
        const arrayBuf = await pencilRes.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        // Slice real individual strokes from the 10-second pencil recording
        const sliceOffsets = [0.15, 0.52, 0.95, 1.45, 1.95, 2.65, 3.20, 3.85];
        this.realPencilBuffers = sliceOffsets.map(offset =>
          this.extractSlice(decoded, offset, 0.095, ctx)
        );
      }

      // Also load short pencil sample for additional variation
      const pencilShortRes = await fetch('/sounds/pencil-short.mp3').catch(() => null);
      if (pencilShortRes && pencilShortRes.ok) {
        const arrayBuf = await pencilShortRes.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        this.realPencilBuffers.push(this.extractSlice(decoded, 0.05, 0.12, ctx));
        this.realPencilBuffers.push(this.extractSlice(decoded, 0.35, 0.14, ctx));
      }

      // 2. Real Page Turn Audio Recording
      const pageRes = await fetch('/sounds/page-turn.mp3').catch(() => null);
      if (pageRes && pageRes.ok) {
        const arrayBuf = await pageRes.arrayBuffer();
        this.realPageTurnBuffer = await ctx.decodeAudioData(arrayBuf);
      }

      // 3. Real Pen Writing Audio Recording
      const penRes = await fetch('/sounds/pen-writing.mp3').catch(() => null);
      if (penRes && penRes.ok) {
        const arrayBuf = await penRes.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        const offsets = [0.10, 0.40, 0.80, 1.20, 1.70];
        this.realPenBuffers = offsets.map(offset =>
          this.extractSlice(decoded, offset, 0.08, ctx)
        );
      }

      // 4. Real Marker Audio Recording
      const markerRes = await fetch('/sounds/marker-writing.mp3').catch(() => null);
      if (markerRes && markerRes.ok) {
        const arrayBuf = await markerRes.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        const offsets = [0.10, 0.50, 1.00, 1.50];
        this.realMarkerBuffers = offsets.map(offset =>
          this.extractSlice(decoded, offset, 0.11, ctx)
        );
      }
    } catch {}
  }

  // Slice a clean portion of an AudioBuffer with fade-in and fade-out to prevent clicks
  private extractSlice(src: AudioBuffer, startSec: number, durSec: number, ctx: AudioContext): AudioBuffer {
    const sampleRate = src.sampleRate;
    const startSample = Math.min(src.length - 1, Math.floor(startSec * sampleRate));
    const len = Math.min(src.length - startSample, Math.floor(durSec * sampleRate));
    const slice = ctx.createBuffer(src.numberOfChannels, len, sampleRate);

    const fadeLen = Math.floor(sampleRate * 0.008); // 8ms edge smoothing

    for (let ch = 0; ch < src.numberOfChannels; ch++) {
      const srcData = src.getChannelData(ch);
      const destData = slice.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        let gain = 1.0;
        if (i < fadeLen) gain = i / fadeLen;
        else if (i > len - fadeLen) gain = (len - i) / fadeLen;
        destData[i] = srcData[startSample + i] * gain;
      }
    }
    return slice;
  }

  // Play a pre-decoded AudioBuffer with voice crossfade and micro-pitch variation
  private playStrokeBuffer(buffer: AudioBuffer | null, volumeScale: number = 0.35): boolean {
    if (this.isMuted || !buffer) return false;
    const ctx = this.initCtx();
    if (!ctx) return false;

    try {
      const t = ctx.currentTime;

      // Crossfade out previous writing stroke smoothly over 12ms to prevent overlap clutter
      if (this.activeWritingGain) {
        try {
          this.activeWritingGain.gain.setValueAtTime(this.activeWritingGain.gain.value, t);
          this.activeWritingGain.gain.linearRampToValueAtTime(0.001, t + 0.012);
        } catch {}
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Subtle organic pitch/speed micro-variation (95% - 105%) so consecutive strokes feel human
      source.playbackRate.setValueAtTime(0.95 + Math.random() * 0.10, t);

      const gain = ctx.createGain();
      // Lower, gentle volume scale (soft ASMR background level)
      gain.gain.setValueAtTime(this.volume * volumeScale, t);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(t);

      this.activeWritingGain = gain;
      return true;
    } catch {
      return false;
    }
  }

  // Play general audio buffer (page turn, book thump, ribbon)
  private playBuffer(buffer: AudioBuffer | null, volumeScale: number = 1.0): boolean {
    if (this.isMuted || !buffer) return false;
    const ctx = this.initCtx();
    if (!ctx) return false;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * volumeScale, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(ctx.currentTime);
      return true;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // PLAY WRITING SOUNDS (REAL RECORDINGS WITH PROCEDURAL FALLBACK)
  // =========================================================================

  public playWritingSound(instrument: WritingInstrument = 'ballpoint'): void {
    if (this.isMuted) return;

    const now = Date.now();
    // Speed-aware cadence throttle: 65ms for pencil keeps strokes connected without piling up
    const minInterval = instrument === 'pencil' ? 65 : 50;
    if (now - this.lastStrokeSoundTime < minInterval) return;
    this.lastStrokeSoundTime = now;

    const ctx = this.initCtx();
    if (!ctx) return;

    // 1. Real pencil recording: soft, soothing background volume (0.32)
    if (instrument === 'pencil' && this.realPencilBuffers.length > 0) {
      const idx = Math.floor(Math.random() * this.realPencilBuffers.length);
      this.playStrokeBuffer(this.realPencilBuffers[idx], 0.32);
      return;
    }

    // 2. Real pen recording: soft volume
    if ((instrument === 'ballpoint' || instrument === 'fountain') && this.realPenBuffers.length > 0) {
      const idx = Math.floor(Math.random() * this.realPenBuffers.length);
      this.playStrokeBuffer(this.realPenBuffers[idx], instrument === 'fountain' ? 0.32 : 0.24);
      return;
    }

    // 3. Real marker recording: gentle squeak volume
    if (instrument === 'marker' && this.realMarkerBuffers.length > 0) {
      const idx = Math.floor(Math.random() * this.realMarkerBuffers.length);
      this.playStrokeBuffer(this.realMarkerBuffers[idx], 0.36);
      return;
    }
    // Fallback synthesis if audio files are still loading or offline
    switch (instrument) {
      case 'pencil':
        this.synthesizePencilScratch(ctx);
        break;
      case 'fountain':
        this.synthesizeFountainNib(ctx);
        break;
      case 'marker':
        this.synthesizeMarkerFelt(ctx);
        break;
      case 'ballpoint':
      default:
        this.synthesizeBallpointRoller(ctx);
        break;
    }
  }

  // Real Page Turn Audio Playback
  public playPageTurn(): void {
    if (this.realPageTurnBuffer) {
      this.playBuffer(this.realPageTurnBuffer, 1.1);
      return;
    }
    const ctx = this.initCtx();
    if (ctx) {
      this.synthesizePageTurn(ctx);
    }
  }

  // =========================================================================
  // FALLBACK PROCEDURAL ACOUSTIC MODELS
  // =========================================================================

  private synthesizePencilScratch(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const dur = 0.085 + Math.random() * 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let hpState = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      hpState = 0.80 * hpState + 0.20 * white;
      const scrape = white - hpState;
      const p = i / bufferSize;
      const env = p < 0.08 ? (p / 0.08) : Math.pow(1 - (p - 0.08) / 0.92, 1.3);
      output[i] = scrape * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandFilter = ctx.createBiquadFilter();
    bandFilter.type = 'bandpass';
    bandFilter.frequency.setValueAtTime(3600 + (Math.random() * 800 - 400), t);
    bandFilter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.35 * this.volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(bandFilter);
    bandFilter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  private synthesizeFountainNib(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const dur = 0.07;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(5400, t);
    filter.Q.setValueAtTime(4.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.65 * this.volume, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  private synthesizeBallpointRoller(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const dur = 0.055;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.35 * this.volume, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  private synthesizeMarkerFelt(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const dur = 0.095;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + dur);
    filter.Q.setValueAtTime(2.8, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.65 * this.volume, t + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  private synthesizePageTurn(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const dur = 0.32;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const p = i / bufferSize;
      const env = p < 0.2 ? (p / 0.2) : Math.pow(1 - (p - 0.2) / 0.8, 2.0);
      output[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.24 * this.volume, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }

  public playBookCover(isClosing: boolean = true): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isClosing ? 130 : 85, t);
    osc.frequency.exponentialRampToValueAtTime(isClosing ? 40 : 110, t + 0.20);
    oscGain.gain.setValueAtTime(0.30 * this.volume, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  public playRibbonSlide(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const dur = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const p = i / bufferSize;
      const env = p < 0.2 ? (p / 0.2) : Math.pow(1 - (p - 0.2) / 0.8, 1.6);
      output[i] = (Math.random() * 2 - 1) * env * 0.6;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.linearRampToValueAtTime(1300, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01 * this.volume, t);
    gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
  }
}

export const sound = new SoundEngine();

// Auto-unlock audio on user gesture
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    sound.unlock();
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
}
