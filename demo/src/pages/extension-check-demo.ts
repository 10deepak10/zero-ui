import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/extension-check';
import '../components/demo-page';
import '../components/demo-example';
import { type ExtensionDefinition } from '@deepverse/zero-ui';

@customElement('extension-check-demo')
export class ExtensionCheckDemo extends LitElement {
  @state()
  private extensions: ExtensionDefinition[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      type: 'wallet',
      checkMethod: 'window',
      windowProperty: 'ethereum.isMetaMask'
    },
    {
      id: 'react-devtools',
      name: 'React DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__REACT_DEVTOOLS_GLOBAL_HOOK__'
    },
    {
      id: 'redux-devtools',
      name: 'Redux DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__REDUX_DEVTOOLS_EXTENSION__'
    },
    {
      id: 'vue-devtools',
      name: 'Vue.js DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__VUE_DEVTOOLS_GLOBAL_HOOK__'
    },
    {
      id: 'phantom',
      name: 'Phantom Wallet',
      type: 'wallet',
      checkMethod: 'window',
      windowProperty: 'solana.isPhantom'
    },
    {
      id: 'grammarly',
      name: 'Grammarly',
      type: 'other',
      checkMethod: 'dom',
      domSelector: 'grammarly-extension'
    }
  ];

  static styles = css`
    .preview {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .preview {
        padding: 16px;
      }
    }

    zui-extension-check {
      width: 100%;
    }

    h3 {
      margin-top: 0;
      color: var(--text-main);
      font-size: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 0.9rem;
    }

    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text-main);
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
    }

    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: var(--code-string);
    }
  `;

  render() {
    const basicHtml = `<zui-extension-check .extensions="\${customExtensions}"></zui-extension-check>`;
    const basicReact = `import { ZuiExtensionCheck } from '@deepverse/zero-ui/extension-check';

const extensions = [ ... ]; // See JSON tab for config

function App() {
  return <ZuiExtensionCheck extensions={extensions} />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-extension-check [extensions]="extensions"></zui-extension-check>\`
})
export class AppComponent {
  extensions = [ ... ]; // See JSON tab for config
}`;
    const basicVue = `<template>
  <zui-extension-check :extensions="extensions" />
</template>

<script setup>
const extensions = [ ... ]; // See JSON tab for config
</script>`;

    const properties = [
      { name: 'extensions', type: 'ExtensionDefinition[]', default: '[]', description: 'List of extensions to check for.' }
    ];

    const apiHtml = html`
      <div slot="api">
        <h3>Properties</h3>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
             ${properties.map(p => html`
              <tr>
                <td><code>${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td><code>${p.default}</code></td>
                <td>${p.description}</td>
              </tr>
            `)}
          </tbody>
        </table>

        <h3>Static Methods (ExtensionCheckService)</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Parameters</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>checkExtension</code></td>
              <td><code>ext: ExtensionDefinition</code></td>
              <td><code>Promise&lt;boolean&gt;</code></td>
              <td>Check if a specific extension is installed.</td>
            </tr>
            <tr>
              <td><code>checkExtensions</code></td>
              <td><code>extensions: ExtensionDefinition[]</code></td>
              <td><code>Promise&lt;DetectionResult[]&gt;</code></td>
              <td>Check multiple extensions.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Extension Check"
        description="Detects common browser extensions and tools (Wallets, DevTools, etc)."
      >
        <demo-example
          header="Extension Detection"
          description="Customizable extension detector."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div>
              <div class="preview" style="margin-bottom: 24px;">
                <zui-extension-check .extensions=${this.extensions}></zui-extension-check>
              </div>

               <div style="background: #1e1e1e; border-radius: 8px; overflow-x: auto; padding: 16px; border: 1px solid var(--card-border); max-width: 100%; box-sizing: border-box;">
                   <pre style="margin:0; color: #d4d4d4; font-family: monospace; font-size: 0.85rem;">// Config used:
${JSON.stringify(this.extensions, null, 2)}</pre>
               </div>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
