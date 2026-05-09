import { css } from 'lit';

export const primitiveStyles = css`
  :root {
    --zui-white: #ffffff;
    --zui-black: #000000;
    --zui-transparent: transparent;
    --zui-current: currentColor;

    --zui-blue-50: #eff6ff;
    --zui-blue-100: #dbeafe;
    --zui-blue-200: #bfdbfe;
    --zui-blue-300: #93c5fd;
    --zui-blue-400: #60a5fa;
    --zui-blue-500: #3b82f6;
    --zui-blue-600: #2563eb;
    --zui-blue-700: #1d4ed8;
    --zui-blue-800: #1e40af;
    --zui-blue-900: #1e3a8a;

    --zui-slate-50: #f8fafc;
    --zui-slate-100: #f1f5f9;
    --zui-slate-200: #e2e8f0;
    --zui-slate-300: #cbd5e1;
    --zui-slate-400: #94a3b8;
    --zui-slate-500: #64748b;
    --zui-slate-600: #475569;
    --zui-slate-700: #334155;
    --zui-slate-800: #1e293b;
    --zui-slate-900: #0f172a;
    --zui-slate-950: #020617;

    --zui-gray-50: #f9fafb;
    --zui-gray-100: #f3f4f6;
    --zui-gray-200: #e5e7eb;
    --zui-gray-300: #d1d5db;
    --zui-gray-400: #9ca3af;
    --zui-gray-500: #6b7280;
    --zui-gray-600: #4b5563;
    --zui-gray-700: #374151;
    --zui-gray-800: #1f2937;
    --zui-gray-900: #111827;
    --zui-gray-950: #030712;

    --zui-red-50: #fef2f2;
    --zui-red-100: #fee2e2;
    --zui-red-200: #fecaca;
    --zui-red-300: #fca5a5;
    --zui-red-400: #f87171;
    --zui-red-500: #ef4444;
    --zui-red-600: #dc2626;
    --zui-red-700: #b91c1c;
    --zui-red-800: #991b1b;
    --zui-red-900: #7f1d1d;

    --zui-green-50: #f0fdf4;
    --zui-green-100: #dcfce7;
    --zui-green-200: #bbf7d0;
    --zui-green-300: #86efac;
    --zui-green-400: #4ade80;
    --zui-green-500: #22c55e;
    --zui-green-600: #16a34a;
    --zui-green-700: #15803d;
    --zui-green-800: #166534;
    --zui-green-900: #14532d;

    --zui-yellow-50: #fefce8;
    --zui-yellow-100: #fef9c3;
    --zui-yellow-200: #fef08a;
    --zui-yellow-300: #fde047;
    --zui-yellow-400: #facc15;
    --zui-yellow-500: #eab308;
    --zui-yellow-600: #ca8a04;
    --zui-yellow-700: #a16207;
    --zui-yellow-800: #854d0e;
    --zui-yellow-900: #713f12;

    --zui-orange-50: #fff7ed;
    --zui-orange-100: #ffedd5;
    --zui-orange-200: #fed7aa;
    --zui-orange-300: #fdba74;
    --zui-orange-400: #fb923c;
    --zui-orange-500: #f97316;
    --zui-orange-600: #ea580c;
    --zui-orange-700: #c2410c;
    --zui-orange-800: #9a3412;
    --zui-orange-900: #7c2d12;

    --zui-purple-50: #faf5ff;
    --zui-purple-100: #f3e8ff;
    --zui-purple-200: #e9d5ff;
    --zui-purple-300: #d8b4fe;
    --zui-purple-400: #c084fc;
    --zui-purple-500: #a855f7;
    --zui-purple-600: #9333ea;
    --zui-purple-700: #7e22ce;
    --zui-purple-800: #6b21a8;
    --zui-purple-900: #581c87;

    --zui-teal-50: #f0fdfa;
    --zui-teal-100: #ccfbf1;
    --zui-teal-200: #99f6e4;
    --zui-teal-300: #5eead4;
    --zui-teal-400: #2dd4bf;
    --zui-teal-500: #14b8a6;
    --zui-teal-600: #0d9488;
    --zui-teal-700: #0f766e;
    --zui-teal-800: #115e59;
    --zui-teal-900: #134e4a;

    --zui-pink-50: #fdf2f8;
    --zui-pink-100: #fce7f3;
    --zui-pink-200: #fbcfe8;
    --zui-pink-300: #f9a8d4;
    --zui-pink-400: #f472b6;
    --zui-pink-500: #ec4899;
    --zui-pink-600: #db2777;
    --zui-pink-700: #be185d;
    --zui-pink-800: #9d174d;
    --zui-pink-900: #831843;

    --zui-indigo-50: #eef2ff;
    --zui-indigo-100: #e0e7ff;
    --zui-indigo-200: #c7d2fe;
    --zui-indigo-300: #a5b4fc;
    --zui-indigo-400: #818cf8;
    --zui-indigo-500: #6366f1;
    --zui-indigo-600: #4f46e5;
    --zui-indigo-700: #4338ca;
    --zui-indigo-800: #3730a3;
    --zui-indigo-900: #312e81;

    --zui-amber-50: #fffbeb;
    --zui-amber-100: #fef3c7;
    --zui-amber-200: #fde68a;
    --zui-amber-300: #fcd34d;
    --zui-amber-400: #fbbf24;
    --zui-amber-500: #f59e0b;
    --zui-amber-600: #d97706;
    --zui-amber-700: #b45309;
    --zui-amber-800: #92400e;
    --zui-amber-900: #78350f;

    --zui-cyan-50: #ecfeff;
    --zui-cyan-100: #cffafe;
    --zui-cyan-200: #a5f3fc;
    --zui-cyan-300: #67e8f9;
    --zui-cyan-400: #22d3ee;
    --zui-cyan-500: #06b6d4;
    --zui-cyan-600: #0891b2;
    --zui-cyan-700: #0e7490;
    --zui-cyan-800: #155e75;
    --zui-cyan-900: #164e63;

    --zui-rose-50: #fff1f2;
    --zui-rose-100: #ffe4e6;
    --zui-rose-200: #fecdd3;
    --zui-rose-300: #fda4af;
    --zui-rose-400: #fb7185;
    --zui-rose-500: #f43f5e;
    --zui-rose-600: #e11d48;
    --zui-rose-700: #be123c;
    --zui-rose-800: #9f1239;
    --zui-rose-900: #881337;

    --zui-neutral-50: #fafafa;
    --zui-neutral-100: #f5f5f5;
    --zui-neutral-200: #e5e5e5;
    --zui-neutral-300: #d4d4d4;
    --zui-neutral-400: #a3a3a3;
    --zui-neutral-500: #737373;
    --zui-neutral-600: #525252;
    --zui-neutral-700: #404040;
    --zui-neutral-800: #262626;
    --zui-neutral-900: #171717;
    --zui-neutral-950: #0a0a0a;

    --zui-zinc-50: #fafafa;
    --zui-zinc-100: #f4f4f5;
    --zui-zinc-200: #e4e4e7;
    --zui-zinc-300: #d4d4d8;
    --zui-zinc-400: #a1a1aa;
    --zui-zinc-500: #71717a;
    --zui-zinc-600: #52525b;
    --zui-zinc-700: #3f3f46;
    --zui-zinc-800: #27272a;
    --zui-zinc-900: #18181b;
    --zui-zinc-950: #09090b;

    --zui-stone-50: #fafaf9;
    --zui-stone-100: #f5f5f4;
    --zui-stone-200: #e7e5e4;
    --zui-stone-300: #d6d3d1;
    --zui-stone-400: #a8a29e;
    --zui-stone-500: #78716c;
    --zui-stone-600: #57534e;
    --zui-stone-700: #44403c;
    --zui-stone-800: #292524;
    --zui-stone-900: #1c1917;
    --zui-stone-950: #0c0a09;

    --zui-space-0: 0px;
    --zui-space-px: 1px;
    --zui-space-0-5: 2px;
    --zui-space-1: 4px;
    --zui-space-1-5: 6px;
    --zui-space-2: 8px;
    --zui-space-2-5: 10px;
    --zui-space-3: 12px;
    --zui-space-3-5: 14px;
    --zui-space-4: 16px;
    --zui-space-5: 20px;
    --zui-space-6: 24px;
    --zui-space-7: 28px;
    --zui-space-8: 32px;
    --zui-space-9: 36px;
    --zui-space-10: 40px;
    --zui-space-11: 44px;
    --zui-space-12: 48px;
    --zui-space-14: 56px;
    --zui-space-16: 64px;
    --zui-space-20: 80px;
    --zui-space-24: 96px;
    --zui-space-28: 112px;
    --zui-space-32: 128px;
    --zui-space-36: 144px;
    --zui-space-40: 160px;
    --zui-space-44: 176px;
    --zui-space-48: 192px;
    --zui-space-52: 208px;
    --zui-space-56: 224px;
    --zui-space-60: 240px;
    --zui-space-64: 256px;
    --zui-space-72: 288px;
    --zui-space-80: 320px;
    --zui-space-96: 384px;

    --zui-font-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --zui-font-serif: Georgia, 'Times New Roman', serif;
    --zui-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

    --zui-text-xs: 0.75rem;
    --zui-text-sm: 0.875rem;
    --zui-text-md: 1rem;
    --zui-text-lg: 1.125rem;
    --zui-text-xl: 1.25rem;
    --zui-text-2xl: 1.5rem;
    --zui-text-3xl: 1.875rem;
    --zui-text-4xl: 2.25rem;
    --zui-text-5xl: 3rem;
    --zui-text-6xl: 3.75rem;

    --zui-font-thin: 100;
    --zui-font-extralight: 200;
    --zui-font-light: 300;
    --zui-font-regular: 400;
    --zui-font-medium: 500;
    --zui-font-semibold: 600;
    --zui-font-bold: 700;
    --zui-font-extrabold: 800;
    --zui-font-black: 900;

    --zui-leading-none: 1;
    --zui-leading-tight: 1.25;
    --zui-leading-snug: 1.375;
    --zui-leading-normal: 1.5;
    --zui-leading-relaxed: 1.625;
    --zui-leading-loose: 2;

    --zui-tracking-tighter: -0.05em;
    --zui-tracking-tight: -0.025em;
    --zui-tracking-normal: 0em;
    --zui-tracking-wide: 0.025em;
    --zui-tracking-wider: 0.05em;
    --zui-tracking-widest: 0.1em;

    --zui-radius-none: 0px;
    --zui-radius-xs: 2px;
    --zui-radius-sm: 4px;
    --zui-radius-md: 6px;
    --zui-radius-lg: 8px;
    --zui-radius-xl: 12px;
    --zui-radius-2xl: 16px;
    --zui-radius-3xl: 24px;
    --zui-radius-full: 9999px;

    --zui-shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --zui-shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --zui-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --zui-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --zui-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --zui-shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --zui-shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    --zui-shadow-none: 0 0 rgb(0 0 0 / 0);

    --zui-duration-fast: 150ms;
    --zui-duration-normal: 300ms;
    --zui-duration-slow: 500ms;
    --zui-duration-slower: 700ms;

    --zui-easing-linear: linear;
    --zui-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
    --zui-easing-decelerate: cubic-bezier(0.0, 0, 0.2, 1);
    --zui-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
  }
`;

export const brandStyles = css`
  :root {
    --zui-brand-primary: var(--zui-blue-500);
    --zui-brand-primary-light: var(--zui-blue-400);
    --zui-brand-primary-dark: var(--zui-blue-600);
    --zui-brand-secondary: var(--zui-slate-500);
    --zui-brand-secondary-light: var(--zui-slate-400);
    --zui-brand-secondary-dark: var(--zui-slate-600);
    --zui-brand-accent: var(--zui-purple-500);
    --zui-brand-accent-light: var(--zui-purple-400);
    --zui-brand-accent-dark: var(--zui-purple-600);
    --zui-brand-tertiary: var(--zui-teal-500);
  }
`;

export const semanticLightStyles = css`
  :root,
  [data-theme='light'],
  .light {
    --zui-color-bg-primary: var(--zui-white);
    --zui-color-bg-secondary: var(--zui-gray-50);
    --zui-color-bg-tertiary: var(--zui-gray-100);
    --zui-color-bg-inverse: var(--zui-gray-900);
    --zui-color-bg-brand: var(--zui-brand-primary);
    --zui-color-bg-brand-secondary: var(--zui-brand-secondary);
    --zui-color-bg-elevated: var(--zui-white);
    --zui-color-bg-tooltip: var(--zui-gray-900);
    --zui-color-bg-disabled: var(--zui-gray-100);
    --zui-color-bg-overlay: rgb(0 0 0 / 0.5);

    --zui-color-text-primary: var(--zui-gray-900);
    --zui-color-text-secondary: var(--zui-gray-600);
    --zui-color-text-tertiary: var(--zui-gray-400);
    --zui-color-text-muted: var(--zui-gray-500);
    --zui-color-text-inverse: var(--zui-white);
    --zui-color-text-brand: var(--zui-brand-primary);
    --zui-color-text-brand-on: var(--zui-white);
    --zui-color-text-disabled: var(--zui-gray-300);
    --zui-color-text-placeholder: var(--zui-gray-400);
    --zui-color-text-link: var(--zui-brand-primary);
    --zui-color-text-link-hover: var(--zui-blue-600);
    --zui-color-text-success: var(--zui-green-600);
    --zui-color-text-warning: var(--zui-amber-600);
    --zui-color-text-error: var(--zui-red-600);
    --zui-color-text-info: var(--zui-blue-600);

    --zui-color-border-default: var(--zui-gray-200);
    --zui-color-border-subtle: var(--zui-gray-100);
    --zui-color-border-muted: var(--zui-gray-300);
    --zui-color-border-brand: var(--zui-brand-primary);
    --zui-color-border-focus: var(--zui-brand-primary);
    --zui-color-border-success: var(--zui-green-500);
    --zui-color-border-warning: var(--zui-amber-500);
    --zui-color-border-error: var(--zui-red-500);
    --zui-color-border-disabled: var(--zui-gray-200);

    --zui-color-action-primary: var(--zui-brand-primary);
    --zui-color-action-primary-hover: var(--zui-blue-600);
    --zui-color-action-primary-active: var(--zui-blue-700);
    --zui-color-action-primary-text: var(--zui-white);
    --zui-color-action-secondary: var(--zui-brand-secondary);
    --zui-color-action-secondary-hover: var(--zui-slate-600);
    --zui-color-action-secondary-active: var(--zui-slate-700);
    --zui-color-action-secondary-text: var(--zui-white);
    --zui-color-action-ghost-hover: var(--zui-gray-100);
    --zui-color-action-ghost-active: var(--zui-gray-200);
    --zui-color-action-danger: var(--zui-red-500);
    --zui-color-action-danger-hover: var(--zui-red-600);
    --zui-color-action-danger-active: var(--zui-red-700);
    --zui-color-action-danger-text: var(--zui-white);
    --zui-color-action-disabled: var(--zui-gray-100);
    --zui-color-action-disabled-text: var(--zui-gray-300);

    --zui-color-surface-primary: var(--zui-white);
    --zui-color-surface-secondary: var(--zui-gray-50);
    --zui-color-surface-tertiary: var(--zui-gray-100);
    --zui-color-surface-elevated: var(--zui-white);
    --zui-color-surface-brand: var(--zui-brand-primary);
    --zui-color-surface-brand-secondary: var(--zui-brand-secondary);
    --zui-color-surface-success: var(--zui-green-50);
    --zui-color-surface-warning: var(--zui-amber-50);
    --zui-color-surface-error: var(--zui-red-50);
    --zui-color-surface-info: var(--zui-blue-50);

    --zui-color-feedback-success: var(--zui-green-500);
    --zui-color-feedback-success-bg: var(--zui-green-50);
    --zui-color-feedback-success-text: var(--zui-green-700);
    --zui-color-feedback-warning: var(--zui-amber-500);
    --zui-color-feedback-warning-bg: var(--zui-amber-50);
    --zui-color-feedback-warning-text: var(--zui-amber-700);
    --zui-color-feedback-error: var(--zui-red-500);
    --zui-color-feedback-error-bg: var(--zui-red-50);
    --zui-color-feedback-error-text: var(--zui-red-700);
    --zui-color-feedback-info: var(--zui-blue-500);
    --zui-color-feedback-info-bg: var(--zui-blue-50);
    --zui-color-feedback-info-text: var(--zui-blue-700);

    --zui-color-focus-ring: var(--zui-brand-primary);
    --zui-color-focus-ring-alpha: rgb(59 130 246 / 0.35);

    --zui-font-family-primary: var(--zui-font-sans);
    --zui-font-family-mono: var(--zui-font-mono);

    --zui-font-size-xs: var(--zui-text-xs);
    --zui-font-size-sm: var(--zui-text-sm);
    --zui-font-size-md: var(--zui-text-md);
    --zui-font-size-lg: var(--zui-text-lg);
    --zui-font-size-xl: var(--zui-text-xl);
    --zui-font-size-2xl: var(--zui-text-2xl);
    --zui-font-size-3xl: var(--zui-text-3xl);
    --zui-font-size-4xl: var(--zui-text-4xl);
    --zui-font-size-5xl: var(--zui-text-5xl);
    --zui-font-size-6xl: var(--zui-text-6xl);

    --zui-font-weight-regular: var(--zui-font-regular);
    --zui-font-weight-medium: var(--zui-font-medium);
    --zui-font-weight-semibold: var(--zui-font-semibold);
    --zui-font-weight-bold: var(--zui-font-bold);
  }
`;

export const semanticDarkStyles = css`
  [data-theme='dark'],
  .dark {
    --zui-color-bg-primary: var(--zui-slate-950);
    --zui-color-bg-secondary: var(--zui-slate-900);
    --zui-color-bg-tertiary: var(--zui-slate-800);
    --zui-color-bg-inverse: var(--zui-white);
    --zui-color-bg-brand: var(--zui-brand-primary);
    --zui-color-bg-brand-secondary: var(--zui-brand-secondary);
    --zui-color-bg-elevated: var(--zui-slate-800);
    --zui-color-bg-tooltip: var(--zui-gray-100);
    --zui-color-bg-disabled: var(--zui-slate-800);
    --zui-color-bg-overlay: rgb(0 0 0 / 0.7);

    --zui-color-text-primary: var(--zui-gray-50);
    --zui-color-text-secondary: var(--zui-gray-300);
    --zui-color-text-tertiary: var(--zui-gray-500);
    --zui-color-text-muted: var(--zui-gray-400);
    --zui-color-text-inverse: var(--zui-slate-950);
    --zui-color-text-brand: var(--zui-blue-400);
    --zui-color-text-brand-on: var(--zui-white);
    --zui-color-text-disabled: var(--zui-gray-600);
    --zui-color-text-placeholder: var(--zui-gray-500);
    --zui-color-text-link: var(--zui-blue-400);
    --zui-color-text-link-hover: var(--zui-blue-300);
    --zui-color-text-success: var(--zui-green-400);
    --zui-color-text-warning: var(--zui-amber-400);
    --zui-color-text-error: var(--zui-red-400);
    --zui-color-text-info: var(--zui-blue-400);

    --zui-color-border-default: var(--zui-gray-700);
    --zui-color-border-subtle: var(--zui-gray-800);
    --zui-color-border-muted: var(--zui-gray-600);
    --zui-color-border-brand: var(--zui-brand-primary);
    --zui-color-border-focus: var(--zui-blue-400);
    --zui-color-border-success: var(--zui-green-400);
    --zui-color-border-warning: var(--zui-amber-400);
    --zui-color-border-error: var(--zui-red-400);
    --zui-color-border-disabled: var(--zui-gray-700);

    --zui-color-action-primary: var(--zui-blue-500);
    --zui-color-action-primary-hover: var(--zui-blue-400);
    --zui-color-action-primary-active: var(--zui-blue-300);
    --zui-color-action-primary-text: var(--zui-white);
    --zui-color-action-secondary: var(--zui-slate-500);
    --zui-color-action-secondary-hover: var(--zui-slate-400);
    --zui-color-action-secondary-active: var(--zui-slate-300);
    --zui-color-action-secondary-text: var(--zui-white);
    --zui-color-action-ghost-hover: var(--zui-gray-800);
    --zui-color-action-ghost-active: var(--zui-gray-700);
    --zui-color-action-danger: var(--zui-red-500);
    --zui-color-action-danger-hover: var(--zui-red-400);
    --zui-color-action-danger-active: var(--zui-red-300);
    --zui-color-action-danger-text: var(--zui-white);
    --zui-color-action-disabled: var(--zui-slate-800);
    --zui-color-action-disabled-text: var(--zui-gray-600);

    --zui-color-surface-primary: var(--zui-slate-900);
    --zui-color-surface-secondary: var(--zui-slate-800);
    --zui-color-surface-tertiary: var(--zui-slate-700);
    --zui-color-surface-elevated: var(--zui-slate-800);
    --zui-color-surface-brand: var(--zui-brand-primary);
    --zui-color-surface-brand-secondary: var(--zui-brand-secondary);
    --zui-color-surface-success: var(--zui-green-900);
    --zui-color-surface-warning: var(--zui-amber-900);
    --zui-color-surface-error: var(--zui-red-900);
    --zui-color-surface-info: var(--zui-blue-900);

    --zui-color-feedback-success: var(--zui-green-400);
    --zui-color-feedback-success-bg: var(--zui-green-900);
    --zui-color-feedback-success-text: var(--zui-green-200);
    --zui-color-feedback-warning: var(--zui-amber-400);
    --zui-color-feedback-warning-bg: var(--zui-amber-900);
    --zui-color-feedback-warning-text: var(--zui-amber-200);
    --zui-color-feedback-error: var(--zui-red-400);
    --zui-color-feedback-error-bg: var(--zui-red-900);
    --zui-color-feedback-error-text: var(--zui-red-200);
    --zui-color-feedback-info: var(--zui-blue-400);
    --zui-color-feedback-info-bg: var(--zui-blue-900);
    --zui-color-feedback-info-text: var(--zui-blue-200);

    --zui-color-focus-ring: var(--zui-blue-400);
    --zui-color-focus-ring-alpha: rgb(96 165 250 / 0.35);
  }
`;

export const componentStyles = css`
  :root {
    --zui-button-primary-bg: var(--zui-color-action-primary);
    --zui-button-primary-bg-hover: var(--zui-color-action-primary-hover);
    --zui-button-primary-bg-active: var(--zui-color-action-primary-active);
    --zui-button-primary-text: var(--zui-color-action-primary-text);
    --zui-button-primary-border: transparent;

    --zui-button-secondary-bg: var(--zui-color-action-secondary);
    --zui-button-secondary-bg-hover: var(--zui-color-action-secondary-hover);
    --zui-button-secondary-bg-active: var(--zui-color-action-secondary-active);
    --zui-button-secondary-text: var(--zui-color-action-secondary-text);
    --zui-button-secondary-border: transparent;

    --zui-button-outline-bg: transparent;
    --zui-button-outline-bg-hover: var(--zui-gray-100);
    --zui-button-outline-bg-active: var(--zui-gray-200);
    --zui-button-outline-text: var(--zui-color-action-primary);
    --zui-button-outline-border: var(--zui-color-action-primary);

    --zui-button-ghost-bg: transparent;
    --zui-button-ghost-bg-hover: var(--zui-color-action-ghost-hover);
    --zui-button-ghost-bg-active: var(--zui-color-action-ghost-active);
    --zui-button-ghost-text: var(--zui-color-text-primary);
    --zui-button-ghost-border: transparent;

    --zui-button-danger-bg: var(--zui-color-action-danger);
    --zui-button-danger-bg-hover: var(--zui-color-action-danger-hover);
    --zui-button-danger-bg-active: var(--zui-color-action-danger-active);
    --zui-button-danger-text: var(--zui-color-action-danger-text);
    --zui-button-danger-border: transparent;

    --zui-button-disabled-bg: var(--zui-color-action-disabled);
    --zui-button-disabled-text: var(--zui-color-action-disabled-text);
    --zui-button-disabled-border: transparent;

    --zui-card-bg: var(--zui-color-surface-primary);
    --zui-card-bg-hover: var(--zui-color-surface-secondary);
    --zui-card-text: var(--zui-color-text-primary);
    --zui-card-text-secondary: var(--zui-color-text-secondary);
    --zui-card-border: var(--zui-color-border-subtle);
    --zui-card-border-hover: var(--zui-color-border-default);
    --zui-card-radius: var(--zui-radius-lg);
    --zui-card-shadow: var(--zui-shadow-sm);
    --zui-card-shadow-hover: var(--zui-shadow-lg);
    --zui-card-padding: var(--zui-space-6);

    --zui-input-bg: var(--zui-color-surface-primary);
    --zui-input-bg-hover: var(--zui-color-surface-primary);
    --zui-input-bg-focus: var(--zui-color-surface-primary);
    --zui-input-bg-disabled: var(--zui-color-surface-secondary);
    --zui-input-text: var(--zui-color-text-primary);
    --zui-input-text-placeholder: var(--zui-color-text-placeholder);
    --zui-input-text-disabled: var(--zui-color-text-disabled);
    --zui-input-border: var(--zui-color-border-default);
    --zui-input-border-hover: var(--zui-color-border-muted);
    --zui-input-border-focus: var(--zui-color-border-focus);
    --zui-input-border-disabled: var(--zui-color-border-disabled);
    --zui-input-border-error: var(--zui-color-border-error);
    --zui-input-radius: var(--zui-radius-md);
    --zui-input-shadow-focus: 0 0 0 3px var(--zui-color-focus-ring-alpha);
    --zui-input-padding-x: var(--zui-space-3);
    --zui-input-padding-y: var(--zui-space-2-5);

    --zui-dropdown-bg: var(--zui-color-surface-elevated);
    --zui-dropdown-text: var(--zui-color-text-primary);
    --zui-dropdown-border: var(--zui-color-border-default);
    --zui-dropdown-shadow: var(--zui-shadow-lg);
    --zui-dropdown-radius: var(--zui-radius-lg);
    --zui-dropdown-option-bg-hover: var(--zui-color-action-ghost-hover);
    --zui-dropdown-option-bg-selected: rgb(59 130 246 / 0.15);
    --zui-dropdown-option-text-selected: var(--zui-color-action-primary);
    --zui-dropdown-option-text-muted: var(--zui-color-text-muted);

    --zui-checkbox-size: 18px;
    --zui-checkbox-color: var(--zui-color-action-primary);
    --zui-checkbox-border-color: var(--zui-color-border-default);
    --zui-checkbox-border-radius: var(--zui-radius-xs);
    --zui-checkbox-check-color: var(--zui-color-action-primary-text);
    --zui-checkbox-disabled-opacity: 0.5;
    --zui-checkbox-focus-ring: 0 0 0 3px var(--zui-color-focus-ring-alpha);

    --zui-toggle-width: 44px;
    --zui-toggle-height: 24px;
    --zui-toggle-thumb-size: 20px;
    --zui-toggle-bg-off: var(--zui-color-border-default);
    --zui-toggle-bg-on: var(--zui-color-action-primary);
    --zui-toggle-thumb-color: var(--zui-color-action-primary-text);
    --zui-toggle-disabled-opacity: 0.5;
    --zui-toggle-focus-ring: 0 0 0 3px var(--zui-color-focus-ring-alpha);
    --zui-toggle-transition: 0.2s ease;

    --zui-slider-height: 6px;
    --zui-slider-thumb-size: 20px;
    --zui-slider-track-color: var(--zui-color-border-default);
    --zui-slider-fill-color: var(--zui-color-action-primary);
    --zui-slider-thumb-color: var(--zui-color-action-primary-text);
    --zui-slider-thumb-border: 2px solid var(--zui-color-action-primary);
    --zui-slider-disabled-opacity: 0.5;

    --zui-select-bg: var(--zui-input-bg);
    --zui-select-border: var(--zui-input-border);
    --zui-select-border-hover: var(--zui-input-border-hover);
    --zui-select-border-focus: var(--zui-input-border-focus);
    --zui-select-text: var(--zui-input-text);
    --zui-select-text-placeholder: var(--zui-input-text-placeholder);
    --zui-select-radius: var(--zui-input-radius);
    --zui-select-focus-ring: var(--zui-input-shadow-focus);
    --zui-select-tag-bg: rgb(59 130 246 / 0.2);
    --zui-select-tag-text: var(--zui-color-text-primary);
    --zui-select-tag-border: rgb(59 130 246 / 0.3);

    --zui-radio-size: 18px;
    --zui-radio-color: var(--zui-color-action-primary);
    --zui-radio-border-color: var(--zui-color-border-default);
    --zui-radio-bg: transparent;
    --zui-radio-dot-size: 8px;
    --zui-radio-disabled-opacity: 0.5;
  }
`;

export const allTokenStyles = [
  primitiveStyles,
  brandStyles,
  semanticLightStyles,
  semanticDarkStyles,
  componentStyles
];
