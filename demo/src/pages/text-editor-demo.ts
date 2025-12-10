import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/text-editor';

@customElement('text-editor-demo')
export class TextEditorDemo extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      margin: 0;
      color: var(--text-main);
    }

    .demo-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .output-preview {
      margin-top: 16px;
      padding: 16px;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      border: 1px solid var(--card-border);
      font-family: monospace;
      color: var(--text-muted);
      white-space: pre-wrap;
      font-size: 0.85rem;
    }
    
    label {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `;

  @state() private _content = '<p>Welcome to the <b>Rich Text Editor</b>!</p><p>Try editing this content...</p>';

  render() {
    return html`
      <h2>Rich Text Editor</h2>
      
      <div class="demo-card">
        <zui-text-editor
          .value=${this._content}
          placeholder="Start typing your masterpiece..."
          @change=${(e: CustomEvent) => this._content = e.detail.html}
        ></zui-text-editor>

        <div>
           <label>Live HTML Output:</label>
           <div class="output-preview">${this._content}</div>
        </div>
      </div>
    `;
  }
}
