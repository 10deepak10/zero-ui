
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/theme-generator/zui-theme-generator.js';
import '@deepverse/zero-ui/card';

@customElement('theme-generator-demo')
export class ThemeGeneratorDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      padding: 16px;
      box-sizing: border-box;
    }
  `;

  render() {
    return html`
        <zui-theme-generator
            @change=${(e: CustomEvent) => console.log('Theme changed:', e.detail)}
        ></zui-theme-generator>
    `;
  }
}
