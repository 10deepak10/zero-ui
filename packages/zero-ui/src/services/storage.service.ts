export interface StorageQuota {
  quota: number;
  usage: number; // Global usage (usually IDB + Cache)
  localStorageUsage: number;
  sessionStorageUsage: number;
  usageDetails?: any;
}

export interface StorageAvailability {
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
}

export class StorageCheckService {
  static checkAvailability(): StorageAvailability {
    const ls = this._checkStorage('localStorage');
    const ss = this._checkStorage('sessionStorage');
    const idb = 'indexedDB' in window;
    
    return {
      localStorage: ls,
      sessionStorage: ss,
      indexedDB: idb
    };
  }

  static async getQuota(): Promise<StorageQuota | null> {
    const lsUsage = this._calculateStorageUsage('localStorage');
    const ssUsage = this._calculateStorageUsage('sessionStorage');

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
          localStorageUsage: lsUsage,
          sessionStorageUsage: ssUsage,
          usageDetails: (estimate as any).usageDetails
        };
      } catch (e) {
        console.error('Storage estimate failed:', e);
      }
    }
    
    // Fallback if Quota API fails or not supported
    return {
      quota: 0,
      usage: 0,
      localStorageUsage: lsUsage,
      sessionStorageUsage: ssUsage
    };
  }

  private static _checkStorage(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  private static _calculateStorageUsage(type: 'localStorage' | 'sessionStorage'): number {
    try {
      const storage = window[type];
      let total = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          const value = storage.getItem(key);
          total += (key.length + (value?.length || 0)) * 2; // Approx 2 bytes per char
        }
      }
      return total;
    } catch (e) {
      console.warn(`Failed to calculate ${type} usage`, e);
      return 0;
    }
  }
}
