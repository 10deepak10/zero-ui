import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('dv-card')
export class DvCard extends LitElement {
static styles = css`
:host { display: block; }
.card {
padding: 12px;
border-radius: 8px;
box-shadow: 0 1px 4px rgba(0,0,0,0.1);
background: var(--dv-surface, #fff);
}
`;


render() {
return html`<div class="card"><slot></slot></div>`;
}
}

declare global {
  interface HTMLElementTagNameMap {
    'dv-card': DvCard;
  }
}