import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('zui-card')
export class ZuiCard extends LitElement {
static styles = css`
:host { display: block; }
.card {
padding: 12px;
border-radius: 8px;
box-shadow: 0 1px 4px rgba(0,0,0,0.1);
background: var(--zui-surface, #fff);
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