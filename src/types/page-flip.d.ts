declare module 'page-flip' {
  export interface FlipSetting {
    startPage?: number;
    size?: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export type FlipCorner = 'top' | 'bottom';

  export interface FlipEvent {
    data: number;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSetting);
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    loadFromImages(imagesHref: string[]): void;
    destroy(): void;
    update(): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    flip(pageIndex: number, corner?: FlipCorner): void;
    turnToPage(pageIndex: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    on(event: 'flip' | 'changeState' | 'changeOrientation' | 'init', callback: (e: FlipEvent) => void): PageFlip;
    off(event: string): void;
  }
}
