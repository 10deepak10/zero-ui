import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/notification-check';

@customElement('notification-check-demo')
export class NotificationCheckDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      color: white;
    }

    h1 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .description {
      margin-bottom: 30px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .demo-container {
      max-width: 500px;
    }
  `;

  render() {
    return html`
      <h1>Notification Check Component</h1>
      <p class="description">
        The <code>&lt;zui-notification-check&gt;</code> component manages System Notification permissions.
        It allows users to request permission and verify functionality by sending a local test notification.
      </p>

      <div class="demo-container">
        <zui-notification-check></zui-notification-check>
      </div>
    `;
  }
}
