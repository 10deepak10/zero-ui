export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';
export type MicDevice = MediaDeviceInfo;
export type PermissionChangeCallback = (status: PermissionStatus) => void;

export class MicCheckService {
  private static _listeners: Set<PermissionChangeCallback> = new Set();
  private static _permissionStatus: any | null = null; // PermissionStatus object

  static async checkPermission(): Promise<PermissionStatus> {
    // 1. Try Permissions API (Chrome/Edge)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as any });
        if (result.state === 'granted' || result.state === 'denied') {
          return result.state as PermissionStatus;
        }
      } catch (e) {
        // Firefox/Safari might throw or return 'prompt' for everything
      }
    }

    // 2. Fallback: Check if we can see device labels (indicates granted)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInput = devices.find(d => d.kind === 'audioinput');
        if (audioInput && audioInput.label.length > 0) {
          return 'granted';
        }
      }
    } catch (e) {
      // Ignore
    }

    return 'unknown'; // effectively 'prompt' for most users
  }

  static async requestAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop immediately, we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.warn('Microphone access denied:', err);
      return false;
    }
  }

  static async getDevices(): Promise<MicDevice[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'audioinput');
    } catch (e) {
      return [];
    }
  }

  static async getStream(deviceId?: string): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      video: false
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  static async subscribe(callback: PermissionChangeCallback): Promise<void> {
    this._listeners.add(callback);
    
    // Listen for permission changes via API
    if (!this._permissionStatus && navigator.permissions && navigator.permissions.query) {
      try {
        this._permissionStatus = await navigator.permissions.query({ name: 'microphone' as any });
        this._permissionStatus.onchange = () => {
          this._notify(this._permissionStatus.state);
        };
      } catch (e) {
        console.warn('Failed to subscribe to mic permission changes', e);
      }
    }

    // Listen for device changes
    if (navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = async () => {
        const status = await this.checkPermission();
        this._notify(status);
      };
    }
  }

  static unsubscribe(callback: PermissionChangeCallback): void {
    this._listeners.delete(callback);
  }

  private static _notify(status: PermissionStatus) {
    this._listeners.forEach(cb => cb(status));
  }
}
