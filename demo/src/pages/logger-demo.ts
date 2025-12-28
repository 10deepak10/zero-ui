import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/logger';
import '../components/demo-page';
import '../components/demo-example';
import { LoggerService } from '@deepverse/zero-ui';

@customElement('logger-demo')
export class LoggerDemo extends LitElement {
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

    .btn-info { background: #3b82f6; }
    .btn-warn { background: #f59e0b; }
    .btn-error { background: #ef4444; }
    .btn-debug { background: #64748b; }
    .btn-spam { background: #8b5cf6; }

    .preview {
      margin-top: 0px;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      height: 400px;
    }

    zui-logger {
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

  private _logInfo() {
    LoggerService.info('User clicked the info button', 'LoggerDemo', { x: 1, y: 2 });
  }

  private _logWarn() {
    LoggerService.warn('Potential issue detected', 'LoggerDemo');
  }

  private _logError() {
    LoggerService.error('Failed to save data', 'StorageService', { error: 'QuotaExceeded' });
  }

  private _logDebug() {
    LoggerService.debug('Component re-rendered', 'RenderLoop');
  }

  private _startSpam() {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 20) clearInterval(interval);
      
      const levels = ['INFO', 'DEBUG', 'WARN'] as const;
      const level = levels[Math.floor(Math.random() * levels.length)];
      
      if (level === 'INFO') LoggerService.info(`Background process #${count}`, 'Worker');
      if (level === 'DEBUG') LoggerService.debug(`Received heartbeat ${Date.now()}`, 'Network');
      if (level === 'WARN') LoggerService.warn(`High memory usage: ${50 + count}%`, 'Performance');
    }, 200);
  }

  render() {
    const basicHtml = `<zui-logger></zui-logger>`;

    const basicReact = `import { ZuiLogger } from '@deepverse/zero-ui/logger';
import { LoggerService } from '@deepverse/zero-ui/services/logger';

  function App() {
    const logInfo = () => {
      LoggerService.info('Hello Info', 'Category', { meta: 'data' });
    };

    return (
      <div>
        <button onClick={logInfo}>Log Info</button>
        <ZuiLogger />
      </div>
    );
  }`;

    const basicAngular = `import { Component } from '@angular/core';
import { LoggerService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`
    <button (click)="logInfo()">Log Info</button>
    <zui-logger></zui-logger>
  \`
})
export class AppComponent {
  logInfo() {
    LoggerService.info('Hello Info', 'Category', { meta: 'data' });
  }
}`;

    const basicVue = `<template>
  <button @click="logInfo">Log Info</button>
  <zui-logger />
</template>

<script setup>
import { LoggerService } from '@deepverse/zero-ui';

const logInfo = () => {
  LoggerService.info('Hello Info', 'Category', { meta: 'data' });
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
              <td><code>debug</code></td>
              <td><code>message: string, module?: string, data?: any</code></td>
              <td><code>void</code></td>
              <td>Log a debug message.</td>
            </tr>
            <tr>
              <td><code>info</code></td>
              <td><code>message: string, module?: string, data?: any</code></td>
              <td><code>void</code></td>
              <td>Log an informational message.</td>
            </tr>
            <tr>
              <td><code>warn</code></td>
              <td><code>message: string, module?: string, data?: any</code></td>
              <td><code>void</code></td>
              <td>Log a warning message.</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>message: string, module?: string, data?: any</code></td>
              <td><code>void</code></td>
              <td>Log an error message.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>listener: (entry: LogEntry) => void</code></td>
              <td><code>void</code></td>
              <td>Subscribe to new log entries.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>listener: (entry: LogEntry) => void</code></td>
              <td><code>void</code></td>
              <td>Unsubscribe from log updates.</td>
            </tr>
            <tr>
              <td><code>getHistory</code></td>
              <td><code>-</code></td>
              <td><code>LogEntry[]</code></td>
              <td>Retrieve current log history (max 1000).</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td><code>-</code></td>
              <td><code>void</code></td>
              <td>Clear all history.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Logger Utility"
        description="System-wide logging service with a built-in terminal-like visualizer."
      >
        <demo-example
          header="Interactive Demo"
          description="Visual log explorer and service integration."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div>
            <div class="controls">
              <button class="btn-info" @click=${this._logInfo}>Log Info</button>
              <button class="btn-warn" @click=${this._logWarn}>Log Warning</button>
              <button class="btn-error" @click=${this._logError}>Log Error</button>
              <button class="btn-debug" @click=${this._logDebug}>Log Debug</button>
              <button class="btn-spam" @click=${this._startSpam}>Generate Traffic</button>
            </div>

            <div class="preview">
              <zui-logger></zui-logger>
            </div>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
