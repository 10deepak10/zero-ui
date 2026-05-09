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
      padding: var(--zui-card-padding);
      border-radius: var(--zui-card-radius);
      border: 1px solid var(--zui-card-border);
      background: var(--zui-card-bg);
      color: var(--zui-card-text);
      box-shadow: var(--zui-card-shadow);
      transition: background-color var(--zui-duration-normal) var(--zui-easing-standard),
                  box-shadow var(--zui-duration-normal) var(--zui-easing-standard),
                  border-color var(--zui-duration-normal) var(--zui-easing-standard),
                  transform var(--zui-duration-normal) var(--zui-easing-decelerate);
    }

    :host([hover]) .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--zui-card-shadow-hover);
      border-color: var(--zui-card-border-hover);
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