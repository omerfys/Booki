import { HandwrittenStroke } from '../../types/book';
import { sound } from '../audio/soundEngine';

export interface StrokeAnimationState {
  isAnimating: boolean;
  currentStrokeId: string | null;
  progress: number;
}

export type AnimationUpdateCallback = (state: StrokeAnimationState) => void;

export class StrokeAnimator {
  private queue: HandwrittenStroke[] = [];
  private currentStrokeIndex: number = 0;
  private currentProgress: number = 0;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;
  private onUpdate: AnimationUpdateCallback;
  private onFinish?: () => void;
  private speedMultiplier: number = 1.0;

  constructor(onUpdate: AnimationUpdateCallback, onFinish?: () => void) {
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
  }

  public setSpeed(speedMode: number): void {
    // 0 = instant, 1 = normal, 2 = fast, 3 = swift
    switch (speedMode) {
      case 0:
        this.speedMultiplier = 0; // Instant
        break;
      case 1:
        this.speedMultiplier = 4.5;
        break;
      case 2:
        this.speedMultiplier = 8.5;
        break;
      case 3:
        this.speedMultiplier = 15.0;
        break;
      default:
        this.speedMultiplier = 4.5;
    }
  }

  public animateStrokes(strokes: HandwrittenStroke[]): void {
    this.stop();

    if (strokes.length === 0) {
      this.onUpdate({ isAnimating: false, currentStrokeId: null, progress: 1.0 });
      this.onFinish?.();
      return;
    }

    if (this.speedMultiplier === 0) {
      // Instant display
      this.onUpdate({ isAnimating: false, currentStrokeId: null, progress: 1.0 });
      this.onFinish?.();
      return;
    }

    this.queue = strokes;
    this.currentStrokeIndex = 0;
    this.currentProgress = 0;
    this.isRunning = true;

    this.tick();
  }

  private tick = (): void => {
    if (!this.isRunning || this.currentStrokeIndex >= this.queue.length) {
      this.finish();
      return;
    }

    const currentStroke = this.queue[this.currentStrokeIndex];
    const totalPoints = currentStroke.segments.reduce((acc, s) => acc + s.points.length, 0);

    // Dynamic speed based on character and points — snappy inking

    const stepSize = Math.max(0.20, (0.36 * this.speedMultiplier) / Math.max(1, totalPoints * 0.04));
    this.currentProgress = Math.min(1.0, this.currentProgress + stepSize);

    this.onUpdate({
      isAnimating: true,
      currentStrokeId: currentStroke.id,
      progress: this.currentProgress
    });

    if (this.currentProgress >= 1.0) {
      this.currentStrokeIndex++;
      this.currentProgress = 0;

      const isWordBreak = currentStroke.char === ' ' || currentStroke.char === '\n';
      const pauseDuration = isWordBreak ? 16 / Math.max(1, this.speedMultiplier) : 0;

      if (pauseDuration > 0) {
        setTimeout(() => {
          if (this.isRunning) {
            this.animFrameId = requestAnimationFrame(this.tick);
          }
        }, pauseDuration);
      } else {
        this.animFrameId = requestAnimationFrame(this.tick);
      }
    } else {
      this.animFrameId = requestAnimationFrame(this.tick);
    }
  };

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.queue = [];
  }

  private finish(): void {
    this.isRunning = false;
    this.animFrameId = null;
    this.onUpdate({
      isAnimating: false,
      currentStrokeId: null,
      progress: 1.0
    });
    this.onFinish?.();
  }
}
