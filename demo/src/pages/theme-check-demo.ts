import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/theme-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('theme-check-demo')
export class ThemeCheckDemo extends LitElement {
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

    zui-theme-check {
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
    const basicHtml = `<zui-theme-check></zui-theme-check>`;

    const basicReact = `import { ZuiThemeCheck } from '@deepverse/zero-ui/theme-check';

function App() {
  return <ZuiThemeCheck />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-theme-check></zui-theme-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-theme-check />
</template>`;

    const apiHtml = html`
      <div slot="api">
        <h3>ThemeCheckService (System Preference)</h3>
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
              <td><code>getTheme</code></td>
              <td><code>-</code></td>
              <td><code>'light' | 'dark'</code></td>
              <td>Get current system color scheme preference.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (theme) => void</code></td>
              <td><code>void</code></td>
              <td>Listen for system theme changes.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (theme) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Theme Check"
        description="Detects system color scheme preference (Dark/Light) and monitors changes."
      >
        <demo-example
          header="Default Usage"
          description="Visual theme indicator."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-theme-check></zui-theme-check>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
