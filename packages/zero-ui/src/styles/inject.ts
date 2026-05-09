import { primitiveStyles, brandStyles, semanticLightStyles, semanticDarkStyles, componentStyles } from './tokens.js';
import { baseStyles, themeTransitionStyles } from './theme.js';

let injected = false;

export function injectTokenStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  const style = document.createElement('style');
  style.setAttribute('data-zui-tokens', '');
  style.textContent = `
${primitiveStyles.cssText}
${brandStyles.cssText}
${semanticLightStyles.cssText}
${semanticDarkStyles.cssText}
${componentStyles.cssText}
  `;
  document.head.prepend(style);
}

let baseInjected = false;

export function injectBaseStyles() {
  if (baseInjected || typeof document === 'undefined') return;
  baseInjected = true;

  const style = document.createElement('style');
  style.setAttribute('data-zui-base', '');
  style.textContent = `
${baseStyles.cssText}
  `;
  document.head.appendChild(style);

  const transitionStyle = document.createElement('style');
  transitionStyle.setAttribute('data-zui-transitions', '');
  transitionStyle.textContent = `
${themeTransitionStyles.cssText}
  `;
  document.head.appendChild(transitionStyle);
}
