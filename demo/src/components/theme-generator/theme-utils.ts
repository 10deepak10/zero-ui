
import type { ThemeConfig } from './theme-models.js';

export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function generateCssVariables(theme: ThemeConfig, mode: 'light' | 'dark' = 'light'): string {
    const lines: string[] = [];
    const palette = theme.colors[mode];

    // Colors
    Object.entries(palette).forEach(([key, value]) => {
        lines.push(`--color-${key}: ${value};`);
        const rgb = hexToRgb(value);
        if (rgb) {
            lines.push(`--rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`);
        }
    });

    // Typography
    lines.push(`--font-family: ${theme.typography.fontFamily};`);
    
    // Spacing
    theme.spacing.scale.forEach(multiplier => {
        lines.push(`--spacing-${multiplier}: ${theme.spacing.base * multiplier}px;`);
    });

    // Border Radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
        lines.push(`--radius-${key}: ${value};`);
    });

    return lines.join('\n');
}

export function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 0;
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastColor(hex: string): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#ffffff';
}
