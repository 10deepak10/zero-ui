import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/code-editor';
import '../components/demo-page';
import '../components/demo-example';

@customElement('code-editor-demo')
export class CodeEditorDemo extends LitElement {
  static styles = css`
    h3 {
      margin: 0;
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .editor-container {
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      background: #1e1e1e;
      overflow-x: auto;
      max-width: 100%;
      box-sizing: border-box;
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
    const properties = [
      { name: 'value', type: 'string', default: '', description: 'The code content to display.' },
      { name: 'language', type: 'string', default: 'typescript', description: 'Language for syntax highlighting (html, css, javascript, typescript, json, etc).' },
      { name: 'readonly', type: 'boolean', default: 'false', description: 'If true, the editor is read-only.' },
      { name: 'lineNumbers', type: 'boolean', default: 'true', description: 'Whether to show line numbers.' },
    ];

    const basicHtml = `<zui-code-editor
  .value="\${code}"
  language="javascript"
  @change="\${handleCodeChange}"
></zui-code-editor>`;

    const basicReact = `import { ZuiCodeEditor } from '@deepverse/zero-ui/react';

function App() {
  const [code, setCode] = useState("console.log('Hello');");
  return (
    <ZuiCodeEditor
      value={code}
      language="javascript"
      onChange={(e) => setCode(e.detail.value)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-code-editor
      [value]="code"
      language="javascript"
      (change)="handleChange($event)">
    </zui-code-editor>
  \`
})
export class AppComponent {
  code = "console.log('Hello');";
  handleChange(e: any) {
    this.code = e.detail.value;
  }
}`;

    const basicVue = `<template>
  <zui-code-editor
    v-model="code"
    language="javascript"
  />
</template>

<script setup>
import { ref } from 'vue';
const code = ref("console.log('Hello');");
</script>`;

    return html`
      <demo-page
        name="Code Editor"
        description="A lightweight, syntax-highlighting code editor component."
        .properties=${properties}
      >
        <demo-example
          header="Examples"
          description="Support for various languages."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
              <h3>HTML</h3>
              <div class="editor-container" style="margin-top: 12px;">
                  <zui-code-editor
                  .value=${this._htmlCode}
                  language="html"
                  @change=${(e: CustomEvent) => this._htmlCode = e.detail.value}
                  ></zui-code-editor>
              </div>
            </div>

            <div>
              <h3>CSS</h3>
              <div class="editor-container" style="margin-top: 12px;">
                  <zui-code-editor
                  .value=${this._cssCode}
                  language="css"
                  @change=${(e: CustomEvent) => this._cssCode = e.detail.value}
                  ></zui-code-editor>
              </div>
            </div>

            <div>
              <h3>JavaScript</h3>
              <div class="editor-container" style="margin-top: 12px;">
                  <zui-code-editor
                  .value=${this._jsCode}
                  language="javascript"
                  @change=${(e: CustomEvent) => this._jsCode = e.detail.value}
                  ></zui-code-editor>
              </div>
            </div>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
