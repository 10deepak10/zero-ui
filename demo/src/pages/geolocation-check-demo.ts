import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/geolocation-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('geolocation-check-demo')
export class GeolocationCheckDemo extends LitElement {
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

    zui-geolocation-check {
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
    const basicHtml = `<zui-geolocation-check></zui-geolocation-check>`;
    const basicReact = `import { ZuiGeolocationCheck } from '@deepverse/zero-ui/geolocation-check';

function App() {
  return <ZuiGeolocationCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-geolocation-check></zui-geolocation-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-geolocation-check />
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
              <td><code>checkPermission</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;PermissionStatus&gt;</code></td>
              <td>Check current geolocation permission status.</td>
            </tr>
            <tr>
              <td><code>getPosition</code></td>
              <td><code>options?: PositionOptions</code></td>
              <td><code>Promise&lt;GeolocationPosition&gt;</code></td>
              <td>One-time retrieval of current position.</td>
            </tr>
            <tr>
              <td><code>watchPosition</code></td>
              <td><code>success: (pos) => void, error?: (err) => void, options?</code></td>
              <td><code>number</code></td>
              <td>Subscribe to position updates. Returns watchId.</td>
            </tr>
            <tr>
              <td><code>clearWatch</code></td>
              <td><code>watchId: number</code></td>
              <td><code>void</code></td>
              <td>Stop watching position updates.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Geolocation Check"
        description="Retrieves current position using the Geolocation API, handling permissions and errors."
      >
        <demo-example
          header="Default Usage"
          description="Geolocation service integration test."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-geolocation-check></zui-geolocation-check>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
