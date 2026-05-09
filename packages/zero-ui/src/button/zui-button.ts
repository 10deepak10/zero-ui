import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('zui-button')
export class ZuiButton extends LitElement {
  @property({ type: String }) variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      white-space: nowrap;
      vertical-align: middle;
      outline: none;
      background: none;
      border: 1px solid transparent;
      border-radius: var(--zui-radius-md);
      cursor: pointer;
      font-family: inherit;
      font-weight: var(--zui-font-weight-medium);
      transition: background-color var(--zui-duration-fast) var(--zui-easing-standard),
                  color var(--zui-duration-fast) var(--zui-easing-standard),
                  border-color var(--zui-duration-fast) var(--zui-easing-standard),
                  box-shadow var(--zui-duration-fast) var(--zui-easing-standard);
      user-select: none;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .sm {
      padding: var(--zui-space-1-5) var(--zui-space-3);
      font-size: var(--zui-font-size-xs);
      line-height: var(--zui-leading-none);
      gap: var(--zui-space-1);
    }

    .md {
      padding: var(--zui-space-2) var(--zui-space-4);
      font-size: var(--zui-font-size-sm);
      line-height: var(--zui-leading-none);
      gap: var(--zui-space-2);
    }

    .lg {
      padding: var(--zui-space-3) var(--zui-space-6);
      font-size: var(--zui-font-size-md);
      line-height: var(--zui-leading-none);
      gap: var(--zui-space-3);
    }

    .primary {
      background-color: var(--zui-button-primary-bg);
      color: var(--zui-button-primary-text);
      border-color: var(--zui-button-primary-border);
    }
    .primary:hover:not(:disabled) {
      background-color: var(--zui-button-primary-bg-hover);
    }
    .primary:active:not(:disabled) {
      background-color: var(--zui-button-primary-bg-active);
    }

    .secondary {
      background-color: var(--zui-button-secondary-bg);
      color: var(--zui-button-secondary-text);
      border-color: var(--zui-button-secondary-border);
    }
    .secondary:hover:not(:disabled) {
      background-color: var(--zui-button-secondary-bg-hover);
    }
    .secondary:active:not(:disabled) {
      background-color: var(--zui-button-secondary-bg-active);
    }

    .outline {
      background-color: var(--zui-button-outline-bg);
      color: var(--zui-button-outline-text);
      border-color: var(--zui-button-outline-border);
    }
    .outline:hover:not(:disabled) {
      background-color: var(--zui-button-outline-bg-hover);
    }
    .outline:active:not(:disabled) {
      background-color: var(--zui-button-outline-bg-active);
    }

    .ghost {
      background-color: var(--zui-button-ghost-bg);
      color: var(--zui-button-ghost-text);
      border-color: var(--zui-button-ghost-border);
    }
    .ghost:hover:not(:disabled) {
      background-color: var(--zui-button-ghost-bg-hover);
    }
    .ghost:active:not(:disabled) {
      background-color: var(--zui-button-ghost-bg-active);
    }

    .danger {
      background-color: var(--zui-button-danger-bg);
      color: var(--zui-button-danger-text);
      border-color: var(--zui-button-danger-border);
    }
    .danger:hover:not(:disabled) {
      background-color: var(--zui-button-danger-bg-hover);
    }
    .danger:active:not(:disabled) {
      background-color: var(--zui-button-danger-bg-active);
    }
  `;

  render() {
    return html`
      <button 
        class="${this.variant} ${this.size}"
        ?disabled="${this.disabled}"
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-button': ZuiButton;
  }
}