export interface BatteryInfo {
  supported: boolean;
  level: number;       // 0 to 1
  charging: boolean;
  chargingTime: number;    // seconds, or Infinity
  dischargingTime: number; // seconds, or Infinity
}

type BatteryChangeCallback = (info: BatteryInfo) => void;

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: EventListener | null;
  onchargingtimechange: EventListener | null;
  ondischargingtimechange: EventListener | null;
  onlevelchange: EventListener | null;
}

export class BatteryCheckService {
  private static _listeners: Set<BatteryChangeCallback> = new Set();
  private static _battery: BatteryManager | null = null;
  private static _initialized = false;

  private static _handleUpdate = () => {
    this._notify();
  };

  static async getBatteryInfo(): Promise<BatteryInfo> {
    if (!this._battery) {
      if ('getBattery' in navigator) {
        try {
          this._battery = await (navigator as any).getBattery();
        } catch (e) {
          console.warn('Battery API failed:', e);
        }
      }
    }

    if (!this._battery) {
      return {
        supported: false,
        level: 1,
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity
      };
    }

    return {
      supported: true,
      level: this._battery.level,
      charging: this._battery.charging,
      chargingTime: this._battery.chargingTime,
      dischargingTime: this._battery.dischargingTime
    };
  }

  static async subscribe(callback: BatteryChangeCallback): Promise<void> {
    this._listeners.add(callback);
    
    // Ensure we have the battery manager
    if (!this._battery && 'getBattery' in navigator) {
      try {
        this._battery = await (navigator as any).getBattery();
        this._initListeners();
      } catch (e) {
        console.warn('Battery API failed', e);
      }
    } else if (this._battery) {
       this._initListeners();
    }

    // Immediate callback
    callback(await this.getBatteryInfo());
  }

  static unsubscribe(callback: BatteryChangeCallback): void {
    this._listeners.delete(callback);
    // We optionally could remove listeners if size is 0,
    // but the battery promise is resolved once, so keeping listeners is cheap 
    // vs re-requesting. However, for cleanliness:
    if (this._listeners.size === 0) {
      this._cleanupListeners();
    }
  }

  private static async _notify() {
    const info = await this.getBatteryInfo();
    this._listeners.forEach(cb => cb(info));
  }

  private static _initListeners() {
    if (this._initialized || !this._battery) return;

    this._battery.addEventListener('levelchange', this._handleUpdate);
    this._battery.addEventListener('chargingchange', this._handleUpdate);
    this._battery.addEventListener('chargingtimechange', this._handleUpdate);
    this._battery.addEventListener('dischargingtimechange', this._handleUpdate);

    this._initialized = true;
  }

  private static _cleanupListeners() {
    if (!this._initialized || !this._battery) return;

    this._battery.removeEventListener('levelchange', this._handleUpdate);
    this._battery.removeEventListener('chargingchange', this._handleUpdate);
    this._battery.removeEventListener('chargingtimechange', this._handleUpdate);
    this._battery.removeEventListener('dischargingtimechange', this._handleUpdate);

    this._initialized = false;
  }
}
