export interface GpuInfo {
  vendor: string;
  renderer: string;
  tier: 'High' | 'Medium' | 'Low' | 'Unknown';
  isHardwareAccelerated: boolean;
}

export class GpuCheckService {
  static getGpuInfo(): GpuInfo {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) {
      return {
        vendor: 'Unknown',
        renderer: 'Unknown',
        tier: 'Unknown',
        isHardwareAccelerated: false
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let vendor = 'Unknown';
    let renderer = 'Unknown';

    if (debugInfo) {
      vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    return {
      vendor,
      renderer,
      tier: this._estimateTier(renderer),
      isHardwareAccelerated: !!debugInfo
    };
  }

  private static _estimateTier(renderer: string): GpuInfo['tier'] {
    const lowerRenderer = renderer.toLowerCase();
    
    if (lowerRenderer.includes('nvidia') || lowerRenderer.includes('radeon') || lowerRenderer.includes('apple m')) {
      return 'High';
    }
    if (lowerRenderer.includes('intel') || lowerRenderer.includes('iris')) {
      return 'Medium';
    }
    if (lowerRenderer.includes('llvm') || lowerRenderer.includes('software')) {
      return 'Low';
    }
    
    return 'Unknown';
  }
}
