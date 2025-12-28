import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('zui-card')
export class ZuiCard extends LitElement {
  @property({ type: Boolean, reflect: true })
  hover = false;

  static styles = css`
    :host { 
      display: block; 
    }
    .card {
      padding: var(--spacing-6, 24px);
      border-radius: var(--radius-md, 12px);
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      background: var(--card-bg, #1e1e1e);
      color: var(--text-main, inherit);
      box-shadow: var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.1));
      transition: all 0.3s ease;
    }

    :host([hover]) .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05));
      border-color: var(--color-primary, #3b82f6);
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