export interface NetworkInfo {
  online: boolean;
  type?: string;        // 'wifi', 'cellular', 'bluetooth', 'ethernet', etc.
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number;    // Mb/s
  rtt?: number;         // ms
}

type NetworkChangeCallback = (info: NetworkInfo) => void;

interface NavigatorConnection {
  effectiveType?: string;
  type?: string;
  downlink?: number;
  rtt?: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

export class NetworkCheckService {
  private static _listeners: Set<NetworkChangeCallback> = new Set();
  private static _initialized = false;

  private static _handleOnline = () => {
    this._notify();
  };

  private static _handleOffline = () => {
    this._notify();
  };

  private static _handleChange = () => {
    this._notify();
  };

  static getNetworkInfo(): NetworkInfo {
    const online = navigator.onLine;
    const connection = (navigator as any).connection as NavigatorConnection | undefined;

    return {
      online,
      type: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    };
  }

  static subscribe(callback: NetworkChangeCallback): void {
    this._listeners.add(callback);
    this._initListeners();
    // Immediate callback with current state
    callback(this.getNetworkInfo());
  }

  static unsubscribe(callback: NetworkChangeCallback): void {
    this._listeners.delete(callback);
    if (this._listeners.size === 0) {
      this._cleanupListeners();
    }
  }

  private static _notify() {
    const info = this.getNetworkInfo();
    this._listeners.forEach(cb => cb(info));
  }

  private static _initListeners() {
    if (this._initialized) return;

    window.addEventListener('online', this._handleOnline);
    window.addEventListener('offline', this._handleOffline);
    
    const connection = (navigator as any).connection as NavigatorConnection | undefined;
    if (connection) {
      connection.addEventListener('change', this._handleChange);
    }

    this._initialized = true;
  }

  private static _cleanupListeners() {
    if (!this._initialized) return;

    window.removeEventListener('online', this._handleOnline);
    window.removeEventListener('offline', this._handleOffline);

    const connection = (navigator as any).connection as NavigatorConnection | undefined;
    if (connection) {
      connection.removeEventListener('change', this._handleChange);
    }

    this._initialized = false;
  }
}
