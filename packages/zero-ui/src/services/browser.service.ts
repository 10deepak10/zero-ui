export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
}

export class BrowserCheckService {
  static getBrowserInfo(): BrowserInfo {
    const userAgent = navigator.userAgent;
    
    let browserName = 'Unknown';
    let browserVersion = '';
    let browserEngine = '';

    // Edge (must check before Chrome)
    if (/Edg\//.test(userAgent)) {
      browserName = 'Edge';
      const match = userAgent.match(/Edg\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Chromium';
    }
    // Chrome
    else if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
      browserName = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    }
    // Firefox
    else if (/Firefox\//.test(userAgent)) {
      browserName = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Gecko';
    }
    // Safari (must check after Chrome/Edge)
    else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
      browserName = 'Safari';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'WebKit';
    }
    // Opera
    else if (/OPR\//.test(userAgent) || /Opera\//.test(userAgent)) {
      browserName = 'Opera';
      const match = userAgent.match(/OPR\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    }
    // Brave (harder to detect, uses Chrome UA)
    else if ((navigator as any).brave) {
      browserName = 'Brave';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
      browserEngine = 'Blink';
    }

    return {
      name: browserName,
      version: browserVersion,
      engine: browserEngine
    };
  }
}
