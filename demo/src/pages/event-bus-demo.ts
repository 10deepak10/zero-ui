import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/event-bus/zui-event-bus.js';
import '../components/demo-page';
import '../components/demo-example';
import { EventBusService } from '@deepverse/zero-ui';

@customElement('event-bus-demo')
export class EventBusDemo extends LitElement {
  static styles = css`
    .controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 24px;
    }

    button {
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      color: white;
      transition: opacity 0.2s;
      font-family: inherit;
      font-size: 0.875rem;
    }

    button:hover {
      opacity: 0.9;
    }

    .btn-user { background: #3b82f6; }
    .btn-system { background: #f59e0b; }
    .btn-notif { background: #10b981; }
    .btn-error { background: #ef4444; }

    .preview {
      flex: 1;
      height: 400px;
      background: #0f172a;
      border-radius: 12px;
      border: 1px solid var(--card-border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    zui-event-bus {
      width: 100%;
      height: 100%;
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

  private _emitUserEvent() {
    EventBusService.emit('user:action', { action: 'click', target: 'button#123' }, 'UserModule');
  }

  private _emitSystemEvent() {
    EventBusService.emit('system:status', { cpu: 45, memory: '1.2GB', online: true }, 'SystemMonitor');
  }

  private _emitNotification() {
    EventBusService.emit('notification:new', { 
        title: 'New Message', 
        body: 'You have a new message from Alice',
        read: false
    }, 'NotificationService');
  }
  
  private _emitError() {
      EventBusService.emit('app:error', { code: 500, message: 'Internal Server Error' }, 'ApiGateway');
  }

  render() {
    const basicHtml = `<zui-event-bus></zui-event-bus>`;

    const basicReact = `import { ZuiEventBus } from '../components/event-bus/zui-event-bus.js';
import { EventBusService } from '@deepverse/zero-ui/services/event-bus';

function App() {
  const emitEvent = () => {
    EventBusService.emit('user:action', { type: 'click' }, 'Source');
  };

  return (
    <div>
      <button onClick={emitEvent}>Emit Event</button>
      <div style={{ height: '400px' }}>
        <ZuiEventBus />
      </div>
    </div>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';
import { EventBusService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`
    <button (click)="emitEvent()">Emit Event</button>
    <div style="height: 400px">
      <zui-event-bus></zui-event-bus>
    </div>
  \`
})
export class AppComponent {
  emitEvent() {
    EventBusService.emit('user:action', { type: 'click' }, 'Source');
  }
}`;

    const basicVue = `<template>
  <button @click="emitEvent">Emit Event</button>
  <div style="height: 400px">
    <zui-event-bus />
  </div>
</template>

<script setup>
import { EventBusService } from '@deepverse/zero-ui';

const emitEvent = () => {
  EventBusService.emit('user:action', { type: 'click' }, 'Source');
};
</script>`;

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
              <td><code>emit&lt;T&gt;</code></td>
              <td><code>name: string, data: T, source?: string</code></td>
              <td><code>void</code></td>
              <td>Dispatch a new event.</td>
            </tr>
            <tr>
              <td><code>subscribe&lt;T&gt;</code></td>
              <td><code>name: string, callback: EventCallback&lt;T&gt;</code></td>
              <td><code>void</code></td>
              <td>Listen for specific events.</td>
            </tr>
            <tr>
              <td><code>subscribeAll</code></td>
              <td><code>callback: EventCallback</code></td>
              <td><code>void</code></td>
              <td>Listen for ALL events.</td>
            </tr>
            <tr>
              <td><code>unsubscribe&lt;T&gt;</code></td>
              <td><code>name: string, callback: EventCallback&lt;T&gt;</code></td>
              <td><code>void</code></td>
              <td>Remove a specific event listener.</td>
            </tr>
            <tr>
              <td><code>unsubscribeAll</code></td>
              <td><code>callback: EventCallback</code></td>
              <td><code>void</code></td>
              <td>Remove a global listener.</td>
            </tr>
            <tr>
              <td><code>getHistory</code></td>
              <td><code>-</code></td>
              <td><code>EventBusEvent[]</code></td>
              <td>Get recent event history.</td>
            </tr>
            <tr>
              <td><code>clearHistory</code></td>
              <td><code>-</code></td>
              <td><code>void</code></td>
              <td>Clear event history.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Event Bus Utility"
        description="Global messaging bus for decoupled communication. Includes a visual inspector."
      >
        <demo-example
          header="Interactive Inspector"
          description="Visualizes events passing through the global event bus."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div>
            <div class="controls">
              <button class="btn-user" @click=${this._emitUserEvent}>Emit User Event</button>
              <button class="btn-system" @click=${this._emitSystemEvent}>Emit System Event</button>
              <button class="btn-notif" @click=${this._emitNotification}>Emit Notification</button>
              <button class="btn-error" @click=${this._emitError}>Emit Error</button>
            </div>

            <div class="preview">
              <zui-event-bus></zui-event-bus>
            </div>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
