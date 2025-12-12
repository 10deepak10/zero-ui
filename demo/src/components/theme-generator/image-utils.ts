
import { type ThemeConfig, DEFAULT_THEME } from './theme-models.js';
import { hexToRgb } from './theme-utils.js';

// --- Types ---
interface Rgb { r: number; g: number; b: number; }
interface Hsl { h: number; s: number; l: number; }

// --- Helpers ---

function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  let r, g, b;
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getLuminance(r: number, g: number, b: number) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// --- Extraction Logic ---

export async function extractColorsFromImage(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No context');

      // Resize to speed up processing
      const MAX_SIZE = 200;
      let w = img.width;
      let h = img.height;
      if (w > h) {
          if (w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; }
      } else {
          if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h).data;

      
      const colorMap = new Map<string, number>();

      // Quantization: bucket similar colors (round to nearest ~16)
      const QUANTIZE = 24; 
      
      for (let i = 0; i < imageData.length; i += 4) {
          if (imageData[i + 3] < 128) continue; // Skip transparent
          
          const r = Math.round(imageData[i] / QUANTIZE) * QUANTIZE;
          const g = Math.round(imageData[i + 1] / QUANTIZE) * QUANTIZE;
          const b = Math.round(imageData[i + 2] / QUANTIZE) * QUANTIZE;
          
          const key = `${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency
      const sorted = [...colorMap.entries()].sort((a, b) => b[1] - a[1]);
      
      // Convert back to Hex and take top 10 unique-ish colors
      const colors: string[] = [];
      const minDistance = 50; // Minimum Euclidean distance to be considered disparate

      for (const [key] of sorted) {
          const [r, g, b] = key.split(',').map(Number);
          
          // Check if too close to existing colors
          let tooClose = false;
          for (const c of colors) {
              const cRgb = hexToRgb(c);
              if (cRgb) {
                  const dist = Math.sqrt((r - cRgb.r)**2 + (g - cRgb.g)**2 + (b - cRgb.b)**2);
                  if (dist < minDistance) {
                      tooClose = true;
                      break;
                  }
              }
          }
          
          if (!tooClose) {
              colors.push(rgbToHex({ r, g, b }));
              if (colors.length >= 8) break;
          }
      }

      resolve(colors);
    };
    
    img.onerror = reject;
    img.src = url;
  });
}

// --- Mapping Logic ---

export function mapPaletteToTheme(palette: string[]): ThemeConfig {
    if (palette.length === 0) return JSON.parse(JSON.stringify(DEFAULT_THEME));

    // Analyze colors
    const analyzed = palette.map(hex => {
        const rgb = hexToRgb(hex)!;
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const lum = getLuminance(rgb.r, rgb.g, rgb.b);
        return { hex, hsl, lum, rgb };
    });

    // Sort by luminance
    analyzed.sort((a, b) => a.lum - b.lum);
    
    // Identifiable ranges
    const darks = analyzed.filter(c => c.lum < 50);
    const lights = analyzed.filter(c => c.lum > 200);

    // Filter for neutral tones for background/surface (saturation < 30)
    const neutralLights = lights.filter(c => c.hsl.s < 30);
    const neutralDarks = darks.filter(c => c.hsl.s < 30);

    // --- Light Palette ---
    let lightBg = '#ffffff';
    if (neutralLights.length > 0) {
        lightBg = neutralLights[neutralLights.length - 1].hex;
    } else if (lights.length > 0) {
        // Fallback: use lightest but desaturate
        const c = lights[lights.length - 1];
        lightBg = rgbToHex(hslToRgb(c.hsl.h, 5, 98));
    }

    let lightSurface = '#f8fafc';
    if (neutralLights.length > 1) {
        lightSurface = neutralLights[neutralLights.length - 2].hex;
    } else {
        lightSurface = darken(lightBg, 4);
    }

    let lightText = darks.length > 0 ? darks[0].hex : '#0f172a';
    
    // Primary for Light: Vibrant, distinct from bg. prefer mid-range luminance.
    const sortedBySat = [...analyzed].sort((a, b) => b.hsl.s - a.hsl.s);
    const vibrant = sortedBySat.find(c => c.lum > 40 && c.lum < 180) || analyzed.find(c => c.lum > 40 && c.lum < 180) || sortedBySat[0];
    const lightPrimary = vibrant ? vibrant.hex : '#3b82f6';
    const lightSecondary = sortedBySat.find(c => c.hex !== lightPrimary)?.hex || rotateHue(lightPrimary, 30);

    // --- Dark Palette ---
    let darkBg = '#0f172a';
    if (neutralDarks.length > 0) {
        darkBg = neutralDarks[0].hex;
    } else if (darks.length > 0) {
        const c = darks[0];
        darkBg = rgbToHex(hslToRgb(c.hsl.h, 10, 10));
    }

    let darkSurface = '#1e293b';
    if (neutralDarks.length > 1) {
        darkSurface = neutralDarks[1].hex;
    } else {
        darkSurface = lighten(darkBg, 5);
    }

    let darkText = lights.length > 0 ? lights[0].hex : '#f1f5f9';

    // Primary for Dark
    let darkPrimary = lightPrimary;
    const pLum = getLuminance(...Object.values(hexToRgb(darkPrimary)!) as [number, number, number]);
    if (pLum < 60) {
        darkPrimary = lighten(darkPrimary, 20);
    }
    
    let darkSecondary = lightSecondary;
    
    return {
        ...DEFAULT_THEME,
        colors: {
            light: {
                ...DEFAULT_THEME.colors.light,
                background: lightBg,
                surface: lightSurface,
                text: lightText,
                primary: lightPrimary,
                secondary: lightSecondary
            },
            dark: {
                ...DEFAULT_THEME.colors.dark,
                background: darkBg,
                surface: darkSurface,
                text: darkText,
                primary: darkPrimary,
                secondary: darkSecondary
            }
        }
    };

}

// Simple color manipulators for fallback
function lighten(hex: string, percent: number): string {
    const rgb = hexToRgb(hex)!;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, hsl.l + percent);
    return rgbToHex(hslToRgb(hsl.h, hsl.s, hsl.l));
}

function darken(hex: string, percent: number): string {
    const rgb = hexToRgb(hex)!;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.max(0, hsl.l - percent);
    return rgbToHex(hslToRgb(hsl.h, hsl.s, hsl.l));
}

function rotateHue(hex: string, degrees: number): string {
    const rgb = hexToRgb(hex)!;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + degrees) % 360;
    return rgbToHex(hslToRgb(hsl.h, hsl.s, hsl.l));
}
