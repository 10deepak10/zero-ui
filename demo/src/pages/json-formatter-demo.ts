import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/json-formatter/zui-json-formatter.js';

@customElement('json-formatter-demo')
export class JsonFormatterDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100dvh;
      padding: 16px;
      box-sizing: border-box;
      box-sizing: border-box;
      /* background: #0f172a; removed for theme support */
    }
    
    h1 {
        color: var(--text-main);
        font-family: sans-serif;
        margin-top: 0;
    }
  `;

  render() {
    return html`
      <div style="height: 100%; display: flex; flex-direction: column;">
        <div style="flex: 1; min-height: 0;">
            <zui-json-formatter></zui-json-formatter>
        </div>
      </div>
    `;
  }
}
