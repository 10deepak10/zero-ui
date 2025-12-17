import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/notification-check';
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
  `;

  render() {
    const basicHtml = `<zui-notification-check></zui-notification-check>`;
    const basicReact = `import { ZuiNotificationCheck } from '@deepverse/zero-ui/notification-check';

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
      </demo-page>
    `;
  }
}
