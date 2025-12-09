export interface NetworkInfo {
  online: boolean;
  type?: string;        // 'wifi', 'cellular', 'bluetooth', 'ethernet', etc.
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number;    // Mb/s
  rtt?: number;         // ms
  measuredSpeed?: number; // Mb/s (Active test result)
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
  private static _lastMeasuredSpeed: number | undefined;

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
      rtt: connection?.rtt || 0,
      measuredSpeed: this._lastMeasuredSpeed
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

  /**
   * Measures connection speed by downloading files from Cloudflare.
   * Uses progressive sizing (100KB -> 1MB -> 10MB) for accuracy.
   * Returns speed in Mbps.
   */
  static async measureConnectionSpeed(): Promise<number> {
    const downloadFile = async (bytes: number): Promise<{ mbps: number, duration: number }> => {
      const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&t=${Date.now()}`;
      const startTime = performance.now();

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      await response.blob();

      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = bytes * 8;
      const mbps = (bitsLoaded / durationInSeconds) / 1_000_000;

      return { mbps, duration: durationInSeconds };
    };

    try {
      // 1. Initial test: 100KB
      let result = await downloadFile(100 * 1024);

      // If speed > 1 Mbps and test was too fast (< 0.5s), try 1MB
      if (result.mbps > 1 && result.duration < 0.5) {
        result = await downloadFile(1000 * 1024);
      }

      // If speed > 10 Mbps and still fast (< 1s), try 10MB
      if (result.mbps > 10 && result.duration < 1.0) {
        result = await downloadFile(10 * 1000 * 1024);
      }

      const finalSpeed = parseFloat(result.mbps.toFixed(2));
      this._lastMeasuredSpeed = finalSpeed;
      this._notify(); // Update subscribers with new measured speed

      return finalSpeed;
    } catch (error) {
      console.error('Speed test failed:', error);
      throw error;
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
