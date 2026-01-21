import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/notification-check/zui-notification-check.js';
import '../components/demo-page';
import '../components/demo-example';

@customElement('notification-check-demo')
export class NotificationCheckDemo extends LitElement {
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

    zui-notification-check {
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
    const basicHtml = `<zui-notification-check></zui-notification-check>`;
    const basicReact = `import { ZuiNotificationCheck } from '../components/notification-check/zui-notification-check.js';

function App() {
  return <ZuiNotificationCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-notification-check></zui-notification-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-notification-check />
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
              <td><code>getPermission</code></td>
              <td><code>-</code></td>
              <td><code>NotificationPermission</code></td>
              <td>Get current notification permission.</td>
            </tr>
            <tr>
              <td><code>requestPermission</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;NotificationPermission&gt;</code></td>
              <td>Request notification permission.</td>
            </tr>
            <tr>
              <td><code>sendNotification</code></td>
              <td><code>title: string, options?: NotificationOptions</code></td>
              <td><code>boolean</code></td>
              <td>Send a notification if permitted.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Notification Check"
        description="Manages System Notification permissions and allows sending test notifications."
      >
        <demo-example
          header="Default Usage"
          description="Notification permission and tester."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-notification-check></zui-notification-check>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
