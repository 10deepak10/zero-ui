export interface OSInfo {
  name: string;
  version: string;
  platform: string;
}

export class OsCheckService {
  static getOSInfo(): OSInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    let osName = 'Unknown';
    let osVersion = '';
    let osPlatform = platform;

    // Windows
    if (/Windows NT 10.0/.test(userAgent)) {
      osName = 'Windows';
      osVersion = '10/11';
    } else if (/Windows NT 6.3/.test(userAgent)) {
      osName = 'Windows';
      osVersion = '8.1';
    } else if (/Windows NT 6.2/.test(userAgent)) {
      osName = 'Windows';
      osVersion = '8';
    } else if (/Windows NT 6.1/.test(userAgent)) {
      osName = 'Windows';
      osVersion = '7';
    } else if (/Windows/.test(userAgent)) {
      osName = 'Windows';
    }
    // macOS
    else if (/Mac OS X/.test(userAgent)) {
      osName = 'macOS';
      const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      }
    }
    // iOS
    else if (/iPhone|iPad|iPod/.test(userAgent)) {
      osName = 'iOS';
      const match = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      }
    }
    // Android
    else if (/Android/.test(userAgent)) {
      osName = 'Android';
      const match = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
      if (match) {
        osVersion = match[1];
      }
    }
    // Linux
    else if (/Linux/.test(platform) || /Linux/.test(userAgent)) {
      osName = 'Linux';
      if (/Ubuntu/.test(userAgent)) {
        osVersion = 'Ubuntu';
      } else if (/Fedora/.test(userAgent)) {
        osVersion = 'Fedora';
      }
    }
    // ChromeOS
    else if (/CrOS/.test(userAgent)) {
      osName = 'ChromeOS';
    }

    return {
      name: osName,
      version: osVersion,
      platform: osPlatform
    };
  }
}
