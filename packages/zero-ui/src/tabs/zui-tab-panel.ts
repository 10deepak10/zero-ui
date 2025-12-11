import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('zui-tab-panel')
export class ZuiTabPanel extends LitElement {
  static styles = css`
    :host {
      display: none;
      padding: 16px 0;
    }

    :host([active]) {
      display: block;
    }
  `;

  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-tab-panel': ZuiTabPanel;
  }
}
