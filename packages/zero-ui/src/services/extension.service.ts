export interface ExtensionDefinition {
  id: string;
  name: string;
  type: 'wallet' | 'devtool' | 'adblock' | 'other';
  checkMethod: 'resource' | 'dom' | 'window';
  resourcePath?: string; // For resource check: chrome-extension://<id>/<path>
  domSelector?: string; // For DOM check
  windowProperty?: string; // For window object check
}

export interface DetectionResult {
  id: string;
  name: string;
  detected: boolean;
  timestamp: number;
}

export class ExtensionCheckService {
  /**
   * Checks if a single extension is installed based on the provided definition.
   */
  static async checkExtension(ext: ExtensionDefinition): Promise<boolean> {
    try {
      if (ext.checkMethod === 'window' && ext.windowProperty) {
        return this._checkWindowProperty(ext.windowProperty);
      } else if (ext.checkMethod === 'dom' && ext.domSelector) {
        return this._checkDOM(ext.domSelector);
      } else if (ext.checkMethod === 'resource' && ext.resourcePath) {
        // Resource checking is restricted in modern browsers often due to CORS/Privacy
        // return await this._checkResource(ext.resourcePath);
        return false;
      }
    } catch (e) {
      console.warn(`Failed to check extension ${ext.name}`, e);
    }
    return false;
  }

  /**
   * Checks a list of extensions.
   */
  static async checkExtensions(extensions: ExtensionDefinition[]): Promise<DetectionResult[]> {
    // Slight delay to allow content scripts to inject if called immediately after load
    await new Promise(resolve => setTimeout(resolve, 500));

    const results: DetectionResult[] = [];

    for (const ext of extensions) {
      const detected = await this.checkExtension(ext);
      results.push({
        id: ext.id,
        name: ext.name,
        detected,
        timestamp: Date.now()
      });
    }

    return results;
  }

  private static _checkWindowProperty(path: string): boolean {
    const parts = path.split('.');
    let current: any = window;
    
    for (const part of parts) {
      if (current === undefined || current === null) return false;
      current = current[part];
    }
    
    return current !== undefined && current !== null && current !== false;
  }

  private static _checkDOM(selector: string): boolean {
    return !!document.querySelector(selector);
  }
}
