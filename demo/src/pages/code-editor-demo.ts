import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/code-editor';

@customElement('code-editor-demo')
export class CodeEditorDemo extends LitElement {
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
    
    label {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `;

  @state() private _htmlCode = '<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>';
  @state() private _cssCode = `body {
  background: #1e1e1e;
  font-family: 'Inter', sans-serif;
}

.card {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`;

  @state() private _jsCode = `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

// Call the function
const user = "Deepverse";
greet(user);`;

  render() {
    return html`
      <h2>Code Editor</h2>
      
      <div class="demo-card">
        <h3>HTML</h3>
        <zui-code-editor
          .value=${this._htmlCode}
          language="html"
          @change=${(e: CustomEvent) => this._htmlCode = e.detail.value}
        ></zui-code-editor>
      </div>

      <div class="demo-card">
        <h3>CSS</h3>
        <zui-code-editor
          .value=${this._cssCode}
          language="css"
          @change=${(e: CustomEvent) => this._cssCode = e.detail.value}
        ></zui-code-editor>
      </div>

      <div class="demo-card">
        <h3>JavaScript</h3>
        <zui-code-editor
          .value=${this._jsCode}
          language="javascript"
          @change=${(e: CustomEvent) => this._jsCode = e.detail.value}
        ></zui-code-editor>
      </div>
    `;
  }
}
