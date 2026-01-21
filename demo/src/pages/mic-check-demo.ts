import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/mic-check/zui-mic-check.js';
import '../components/demo-page';
import '../components/demo-example';

@customElement('mic-check-demo')
export class MicCheckDemo extends LitElement {
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

    zui-mic-check {
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
    const properties = [
      { name: 'showVisualizer', type: 'boolean', default: 'false', description: 'Show audio visualizer when active.' }
    ];

    const basicHtml = `<zui-mic-check showVisualizer></zui-mic-check>`;

    const basicReact = `import { ZuiMicCheck } from '../components/mic-check/zui-mic-check.js';

function App() {
  return <ZuiMicCheck showVisualizer />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-mic-check showVisualizer></zui-mic-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-mic-check showVisualizer />
</template>`;

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

        <h3>Static Methods (MicCheckService)</h3>
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
              <td><code>checkPermission</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;PermissionStatus&gt;</code></td>
              <td>Check microphone permission status.</td>
            </tr>
            <tr>
              <td><code>requestAccess</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;boolean&gt;</code></td>
              <td>Request microphone access.</td>
            </tr>
            <tr>
              <td><code>getDevices</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;MediaDeviceInfo[]&gt;</code></td>
              <td>List available audio input devices.</td>
            </tr>
            <tr>
              <td><code>getStream</code></td>
              <td><code>deviceId?: string</code></td>
              <td><code>Promise&lt;MediaStream&gt;</code></td>
              <td>Get media stream for a device.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (status) => void</code></td>
              <td><code>void</code></td>
              <td>Listen for permission changes.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (status) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Microphone Check"
        description="Manages microphone permissions and verifies audio input with an optional visualizer."
      >
        <demo-example
          header="Default Usage"
          description="Microphone test with visualizer."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-mic-check showVisualizer></zui-mic-check>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
