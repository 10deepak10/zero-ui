import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('zui-tab')
export class ZuiTab extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      padding: 10px 16px;
      cursor: pointer;
      color: var(--text-muted, #94a3b8);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      font-weight: 500;
      font-size: 14px;
    }

    :host(:hover) {
      color: var(--text-main, #e2e8f0);
    }

    :host([active]) {
      color: var(--zui-primary, #3b82f6);
      border-bottom-color: var(--zui-primary, #3b82f6);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-tab': ZuiTab;
  }
}
