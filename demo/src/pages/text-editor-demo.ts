import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/text-editor';
import '../components/demo-page';
import '../components/demo-example';

@customElement('text-editor-demo')
export class TextEditorDemo extends LitElement {
    static styles = css`
    .preview {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 16px;
    }
  `;

    @state() private _value = '<p>Hello <b>World</b>!</p>';

    render() {
        return html`
      <demo-page
        name="Text Editor"
        description="A rich text editor component."
      >
        <demo-example
          header="Basic Usage"
          description="Simple rich text editor."
          .html=${`<zui-text-editor></zui-text-editor>`}
        >
          <div class="preview">
             <zui-text-editor
                .value=${this._value}
                @change=${(e: any) => this._value = e.detail.value}
             ></zui-text-editor>
          </div>
          <div style="margin-top: 16px;">
            <strong>Output:</strong>
            <pre>${this._value}</pre>
          </div>
        </demo-example>
      </demo-page>
    `;
    }
}