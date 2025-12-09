export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

type PermissionChangeCallback = (status: PermissionStatus) => void;

export class CameraCheckService {
  private static _listeners: Set<PermissionChangeCallback> = new Set();
  private static _permissionStatus: any | null = null;
  
  static async checkPermission(): Promise<PermissionStatus> {
    // 1. Try Permissions API (Chrome/Edge)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'camera' as any });
        if (result.state === 'granted' || result.state === 'denied') {
          return result.state as PermissionStatus;
        }
      } catch (e) {
        // Firefox/Safari might throw
      }
    }

    // 2. Fallback: Check if we can see device labels (indicates granted)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInput = devices.find(d => d.kind === 'videoinput');
        if (videoInput && videoInput.label.length > 0) {
          return 'granted';
        }
      }
    } catch (e) {
      // Ignore
    }

    return 'unknown';
  }

  static async getDevices(): Promise<CameraDevice[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`
        }));
    } catch (e) {
      console.error('Failed to enumerate devices:', e);
      return [];
    }
  }

  static async requestAccess(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (e) {
      console.error('Camera access denied:', e);
      return false;
    }
  }

  static async getStream(deviceId?: string): Promise<MediaStream | null> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      console.error('Failed to get stream:', e);
      return null;
    }
  }

  static async subscribe(callback: PermissionChangeCallback): Promise<void> {
    this._listeners.add(callback);
    
    // Listen for permission changes
    if (!this._permissionStatus && navigator.permissions && navigator.permissions.query) {
      try {
        this._permissionStatus = await navigator.permissions.query({ name: 'camera' as any });
        this._permissionStatus.onchange = () => {
          this._notify(this._permissionStatus.state);
        };
      } catch (e) {
        console.warn('Failed to subscribe to permission changes', e);
      }
    }

    // Listen for device changes (plug/unplug)
    if (navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = async () => {
        // When devices change, re-check permission/status effectively by notifying
        // The permission might not change, but the available devices might.
        // For simplicity in this service, we notify with current permission status.
        // Consumers (like the component) will reload devices when they get an update.
        const status = await this.checkPermission();
        this._notify(status);
      };
    }
  }

  static unsubscribe(callback: PermissionChangeCallback): void {
    this._listeners.delete(callback);
    if (this._listeners.size === 0 && this._permissionStatus) {
      this._permissionStatus.onchange = null;
      this._permissionStatus = null;
    }
  }

  private static _notify(status: PermissionStatus) {
    this._listeners.forEach(cb => cb(status));
  }
}
