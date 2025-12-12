
export interface ColorToken {
  name: string;
  value: string; // Hex
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

export interface SpacingToken {
  name: string;
  value: string;
}

export interface ThemeColorPalette {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    background: string;
    surface: string;
    text: string;
}

export interface ThemeConfig {
  colors: {
    light: ThemeColorPalette;
    dark: ThemeColorPalette;
  };
  typography: {
    fontFamily: string;
    headings: {
        h1: TypographyToken;
        h2: TypographyToken;
        h3: TypographyToken;
    };
    body: TypographyToken;
  };
  spacing: {
    base: number; // e.g. 4px
    scale: number[]; // multipliers
  };
  borderRadius: {
      sm: string;
      md: string;
      lg: string;
  };
}

const DEFAULT_PALETTE_LIGHT: ThemeColorPalette = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#0ea5e9',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a'
};

const DEFAULT_PALETTE_DARK: ThemeColorPalette = {
    primary: '#60a5fa', // lighter for dark mode
    secondary: '#94a3b8',
    success: '#4ade80',
    danger: '#f87171',
    warning: '#fbbf24',
    info: '#38bdf8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9'
};

export const DEFAULT_THEME: ThemeConfig = {
  colors: {
      light: DEFAULT_PALETTE_LIGHT,
      dark: DEFAULT_PALETTE_DARK
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headings: {
        h1: { fontFamily: 'inherit', fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
        h2: { fontFamily: 'inherit', fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
        h3: { fontFamily: 'inherit', fontSize: '1.75rem', fontWeight: '600', lineHeight: '1.3' }
    },
    body: { fontFamily: 'inherit', fontSize: '1rem', fontWeight: '400', lineHeight: '1.5' }
  },
  spacing: {
    base: 4,
    scale: [0, 1, 2, 4, 6, 8, 12, 16]
  },
  borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
  }
};
