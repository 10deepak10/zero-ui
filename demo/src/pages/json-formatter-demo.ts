import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/json-formatter/zui-json-formatter.js';

@customElement('json-formatter-demo')
export class JsonFormatterDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      padding: 16px;
      box-sizing: border-box;
      background: #0f172a;
    }
    
    h1 {
        color: #fff;
        font-family: sans-serif;
        margin-top: 0;
    }
  `;

  render() {
    return html`
      <div style="height: 100%; display: flex; flex-direction: column;">
        <h1>JSON Formatter & Explorer</h1>
        <div style="flex: 1; min-height: 0;">
            <zui-json-formatter></zui-json-formatter>
        </div>
      </div>
    `;
  }
}
