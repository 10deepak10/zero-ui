export interface ProctoringConfig {
  preventCopyPaste?: boolean;
  preventContextMenu?: boolean;
  forceFullscreen?: boolean;
  detectTabSwitch?: boolean;
  detectDevTools?: boolean;
}

export interface ViolationEvent {
  type: 'tab-switch' | 'fullscreen-exit' | 'copy-paste' | 'context-menu' | 'devtools' | 'window-blur';
  timestamp: number;
  message: string;
}

type ViolationListener = (violation: ViolationEvent) => void;

export class ProctoringService {
  private static _config: ProctoringConfig = {
    preventCopyPaste: false,
    preventContextMenu: false,
    forceFullscreen: false,
    detectTabSwitch: false,
    detectDevTools: false,
  };
  
  private static _isActive = false;
  private static _listeners: Set<ViolationListener> = new Set();
  private static _violationCount = 0;

  static startSession(config: ProctoringConfig) {
    if (this._isActive) return;
    
    this._config = { ...this._config, ...config };
    this._isActive = true;
    this._violationCount = 0;

    this._attachListeners();
  }

  static endSession() {
    this._isActive = false;
    this._detachListeners();
  }

  static subscribe(listener: ViolationListener) {
    this._listeners.add(listener);
  }

  static unsubscribe(listener: ViolationListener) {
    this._listeners.delete(listener);
  }

  private static _notify(type: ViolationEvent['type'], message: string) {
    if (!this._isActive) return;

    this._violationCount++;
    const event: ViolationEvent = {
      type,
      timestamp: Date.now(),
      message
    };

    this._listeners.forEach(l => l(event));
  }

  // --- Event Handlers ---

  private static _handleVisibilityChange = () => {
    if (document.hidden && this._config.detectTabSwitch) {
      this._notify('tab-switch', 'User switched tabs or minimized window.');
    }
  };

  private static _handleWindowBlur = () => {
    if (this._config.detectTabSwitch) {
      this._notify('window-blur', 'Window lost focus.');
    }
  };

  private static _handleFullscreenChange = () => {
    if (!document.fullscreenElement && this._config.forceFullscreen) {
      this._notify('fullscreen-exit', 'User exited fullscreen mode.');
    }
  };

  private static _handleCopy = (e: ClipboardEvent) => {
    if (this._config.preventCopyPaste) {
      e.preventDefault();
      this._notify('copy-paste', 'Copy action prevented.');
    }
  };

  private static _handlePaste = (e: ClipboardEvent) => {
    if (this._config.preventCopyPaste) {
      e.preventDefault();
      this._notify('copy-paste', 'Paste action prevented.');
    }
  };

  private static _handleContextMenu = (e: MouseEvent) => {
    if (this._config.preventContextMenu) {
      e.preventDefault();
      this._notify('context-menu', 'Right-click context menu prevented.');
    }
  };

  private static _attachListeners() {
    if (this._config.detectTabSwitch) {
      document.addEventListener('visibilitychange', this._handleVisibilityChange);
      window.addEventListener('blur', this._handleWindowBlur);
    }

    if (this._config.forceFullscreen) {
      document.addEventListener('fullscreenchange', this._handleFullscreenChange);
    }

    if (this._config.preventCopyPaste) {
      document.addEventListener('copy', this._handleCopy);
      document.addEventListener('cut', this._handleCopy);
      document.addEventListener('paste', this._handlePaste);
    }

    if (this._config.preventContextMenu) {
      document.addEventListener('contextmenu', this._handleContextMenu);
    }
    
    // DevTools detection is more complex and often relies on window resize loop tricks or debugger statements
    // Simplified placeholder logic for now or we can implement a basic resize check
    if (this._config.detectDevTools) {
       window.addEventListener('resize', this._checkResizeForDevTools);
    }
  }

  private static _detachListeners() {
    document.removeEventListener('visibilitychange', this._handleVisibilityChange);
    window.removeEventListener('blur', this._handleWindowBlur);
    document.removeEventListener('fullscreenchange', this._handleFullscreenChange);
    document.removeEventListener('copy', this._handleCopy);
    document.removeEventListener('cut', this._handleCopy);
    document.removeEventListener('paste', this._handlePaste);
    document.removeEventListener('contextmenu', this._handleContextMenu);
    window.removeEventListener('resize', this._checkResizeForDevTools);
  }

  private static _checkResizeForDevTools = () => {
    // Very basic heuristic: if window inner vs outer width changes significantly
    // strict devtools detection is a cat-and-mouse game
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
       this._notify('devtools', 'Potential DevTools detected (window resize anomaly).');
    }
  };
}
