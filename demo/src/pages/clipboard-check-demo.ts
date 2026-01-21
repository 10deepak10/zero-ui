import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/clipboard-check/zui-clipboard-check.js';
import '../components/demo-page';
import '../components/demo-example';

@customElement('clipboard-check-demo')
export class ClipboardCheckDemo extends LitElement {
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

    zui-clipboard-check {
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
    const basicHtml = `<zui-clipboard-check></zui-clipboard-check>`;
    const basicReact = `import { ZuiClipboardCheck } from '../components/clipboard-check/zui-clipboard-check.js';

function App() {
  return <ZuiClipboardCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-clipboard-check></zui-clipboard-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-clipboard-check />
</template>`;

    const apiHtml = html`
      <div slot="api">
        <h3>Static Methods</h3>
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
              <td><code>isSupported</code></td>
              <td><code>-</code></td>
              <td><code>boolean</code></td>
              <td>Check if Clipboard API is available.</td>
            </tr>
            <tr>
              <td><code>checkPermission</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;ClipboardPermissionStatus&gt;</code></td>
              <td>Check clipboard read permission.</td>
            </tr>
            <tr>
              <td><code>readText</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;string&gt;</code></td>
              <td>Read text from clipboard (requires permission).</td>
            </tr>
            <tr>
              <td><code>writeText</code></td>
              <td><code>text: string</code></td>
              <td><code>Promise&lt;void&gt;</code></td>
              <td>Write text to clipboard.</td>
            </tr>
             <tr>
              <td><code>getHistory</code></td>
              <td><code>-</code></td>
              <td><code>ClipboardHistoryItem[]</code></td>
              <td>Get recent clipboard actions history.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Clipboard Check"
        description="Manages clipboard permissions and provides Copy/Paste functionality with legacy fallbacks."
      >
        <demo-example
          header="Default Usage"
          description="Clipboard operations handler."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-clipboard-check></zui-clipboard-check>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
