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
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      transition: all 0.2s ease;
      user-select: none;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Sizes */
    .sm {
      padding: 6px 12px;
      font-size: 12px;
      line-height: 16px;
      gap: 4px;
    }

    .md {
      padding: 8px 16px;
      font-size: 14px;
      line-height: 20px;
      gap: 8px;
    }

    .lg {
      padding: 12px 24px;
      font-size: 16px;
      line-height: 24px;
      gap: 12px;
    }

    /* Variants */
    .primary {
      background-color: var(--zui-primary, #3b82f6);
      color: white;
      border-color: transparent;
    }
    .primary:hover:not(:disabled) {
      background-color: var(--zui-primary-hover, #2563eb);
    }
    .primary:active:not(:disabled) {
      background-color: var(--zui-primary-active, #1d4ed8);
    }

    .secondary {
      background-color: var(--zui-secondary, #64748b);
      color: white;
      border-color: transparent;
    }
    .secondary:hover:not(:disabled) {
      background-color: var(--zui-secondary-hover, #475569);
    }

    .outline {
      background-color: transparent;
      color: var(--zui-primary, #3b82f6);
      border-color: var(--zui-primary, #3b82f6);
    }
    .outline:hover:not(:disabled) {
      background-color: rgba(59, 130, 246, 0.1);
    }

    .ghost {
      background-color: transparent;
      color: var(--text-main, #e2e8f0);
      border-color: transparent;
    }
    .ghost:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .danger {
      background-color: var(--zui-danger, #ef4444);
      color: white;
      border-color: transparent;
    }
    .danger:hover:not(:disabled) {
      background-color: var(--zui-danger-hover, #dc2626);
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