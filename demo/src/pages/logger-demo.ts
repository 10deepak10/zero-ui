import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/logger';
import { LoggerService } from '@deepverse/zero-ui';

@customElement('logger-demo')
export class LoggerDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }

    .demo-section {
      margin-bottom: 40px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      color: var(--text-main);
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    button {
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      color: white;
      transition: opacity 0.2s;
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
      margin-top: 24px;
    }

    zui-logger {
      width: 100%;
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
    return html`
      <h1>Logger Utility</h1>
      <p>System-wide logging service with a built-in terminal visualizer.</p>

      <div class="demo-section">
        <h2>Interactive Demo</h2>
        
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
    `;
  }
}
