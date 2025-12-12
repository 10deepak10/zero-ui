import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('zui-card')
export class ZuiCard extends LitElement {
static styles = css`
    :host { 
      display: block; 
    }
    .card {
      padding: var(--spacing-4, 16px);
      border-radius: var(--radius-md, 12px);
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      background: var(--card-bg, #1e1e1e);
      color: var(--text-main, inherit);
      box-shadow: var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.1));
      transition: all 0.3s ease;
    }
`;


render() {
return html`<div class="card"><slot></slot></div>`;
}
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-card': ZuiCard;
  }
}