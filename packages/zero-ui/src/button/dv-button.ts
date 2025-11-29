import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('dv-button')
export class DvButton extends LitElement {
static styles = css`
button {
padding: 8px 16px;
background: var(--dv-primary, #4a90e2);
color: white;
border: none;
border-radius: 6px;
cursor: pointer;
font-size: 14px;
}
`;


render() {
return html`<button><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dv-button': DvButton;
  }
}