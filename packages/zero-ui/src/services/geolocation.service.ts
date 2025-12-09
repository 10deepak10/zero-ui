export type PermissionStatus = 'granted' | 'denied' | 'prompt';

export class GeolocationCheckService {
  static async checkPermission(): Promise<PermissionStatus> {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state as PermissionStatus;
      } catch (e) {
        // Fallback for browsers that might throw
      }
    }
    return 'prompt';
  }

  static getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  static watchPosition(
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ): number {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }
    return navigator.geolocation.watchPosition(successCallback, errorCallback, options);
  }

  static clearWatch(watchId: number): void {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}
