import { css } from 'lit';

export const themeTransitionStyles = css`
  *,
  *::before,
  *::after {
    transition: background-color 0.3s ease,
                color 0.15s ease,
                border-color 0.2s ease,
                box-shadow 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
    }
  }
`;

export const baseStyles = css`
  :root {
    color-scheme: light;
  }

  [data-theme='dark'] {
    color-scheme: dark;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    font-family: var(--zui-font-family-primary);
    font-size: var(--zui-font-size-md);
    font-weight: var(--zui-font-weight-regular);
    line-height: var(--zui-leading-normal);
    color: var(--zui-color-text-primary);
    background-color: var(--zui-color-bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
`;
