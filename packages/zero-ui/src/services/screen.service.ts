export interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  pixelRatio: number;
  orientation: string;
}

export class ScreenCheckService {
  private static _listeners: Set<(info: ScreenInfo) => void> = new Set();
  
  static getScreenInfo(): ScreenInfo {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: screen.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    };
  }

  static subscribe(callback: (info: ScreenInfo) => void): () => void {
    if (this._listeners.size === 0) {
      this._startListening();
    }
    
    this._listeners.add(callback);
    callback(this.getScreenInfo()); // Initial value

    return () => {
      this._listeners.delete(callback);
      if (this._listeners.size === 0) {
        this._stopListening();
      }
    };
  }

  private static _handleResize = () => {
    const info = this.getScreenInfo();
    this._listeners.forEach(listener => listener(info));
  };

  private static _startListening() {
    window.addEventListener('resize', this._handleResize);
    screen.orientation?.addEventListener('change', this._handleResize);
  }

  private static _stopListening() {
    window.removeEventListener('resize', this._handleResize);
    screen.orientation?.removeEventListener('change', this._handleResize);
  }
}
