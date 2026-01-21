import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { LoggerService, type LogEntry, type LogLevel } from '@deepverse/zero-ui/logger';

@customElement('zui-logger')
export class ZuiLogger extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      height: 100%;
      box-sizing: border-box;
    }
    
    * { box-sizing: border-box; }

    .terminal {
      background: var(--logger-bg, #0f172a);
      border: 1px solid var(--logger-border, #1e293b);
      border-radius: var(--logger-radius, 12px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .toolbar {
      background: var(--bg-muted, rgba(255, 255, 255, 0.03));
      padding: 8px 16px;
      background: var(--bg-muted, rgba(255, 255, 255, 0.03));
      padding: 8px 16px;
      border-bottom: 1px solid var(--logger-border, #1e293b);
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      gap: 4px;
      background: var(--zui-input-bg, rgba(0, 0, 0, 0.2));
      padding: 4px;
      border-radius: 6px;
    }

    .filter-btn {
      background: transparent;
      border: none;
      color: #64748b;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: inherit;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      color: #94a3b8;
    }

    .filter-btn.active.debug { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
    .filter-btn.active.info { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .filter-btn.active.warn { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .filter-btn.active.error { background: rgba(239, 68, 68, 0.2); color: #f87171; }

    .search-input {
      background: var(--zui-input-bg, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      color: var(--text-main, #e2e8f0);
      padding: 6px 10px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.8rem;
      flex: 1;
      min-width: 150px;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .action-btn {
      background: var(--bg-hover, rgba(255, 255, 255, 0.1));
      border: none;
      color: var(--text-main, #e2e8f0);
      padding: 6px 12px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .log-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      scroll-behavior: smooth;
    }

    .log-item {
      display: flex;
      gap: 12px;
      padding: 4px 0;
      font-size: 0.85rem;
      line-height: 1.4;
      border-bottom: 1px solid var(--card-border, rgba(255, 255, 255, 0.02));
    }

    .log-item:hover {
      background: var(--bg-hover, rgba(255, 255, 255, 0.02));
    }

    .timestamp {
      color: #64748b;
      min-width: 80px;
      font-size: 0.75rem;
    }

    .level {
      font-weight: 600;
      min-width: 50px;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .level.DEBUG { color: #94a3b8; }
    .level.INFO { color: #60a5fa; }
    .level.WARN { color: #fbbf24; }
    .level.ERROR { color: #f87171; }

    .module {
      color: #d8b4fe;
      font-weight: 500;
    }

    .message {
      color: var(--text-main, #e2e8f0);
      word-break: break-all;
      flex: 1;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #64748b;
      font-style: italic;
    }
  `;

  @state() private _logs: LogEntry[] = [];
  @state() private _filterText = '';
  @state() private _activeFilters: Set<LogLevel> = new Set(['INFO', 'WARN', 'ERROR', 'DEBUG']);
  @state() private _autoScroll = true;

  @query('.log-container') private _logContainer!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this._logs = LoggerService.getHistory();
    LoggerService.subscribe(this._handleLog);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    LoggerService.unsubscribe(this._handleLog);
  }

  updated() {
    if (this._autoScroll && this._logContainer) {
      this._logContainer.scrollTop = this._logContainer.scrollHeight;
    }
  }

  private _handleLog = (entry: LogEntry) => {
    this._logs = [...this._logs, entry];
  };

  private _toggleFilter(level: LogLevel) {
    const newFilters = new Set(this._activeFilters);
    if (newFilters.has(level)) {
      newFilters.delete(level);
    } else {
      newFilters.add(level);
    }
    this._activeFilters = newFilters;
  }

  private _handleSearch(e: Event) {
    this._filterText = (e.target as HTMLInputElement).value.toLowerCase();
  }

  private _clearLogs() {
    LoggerService.clear();
    this._logs = [];
  }

  private _toggleAutoScroll() {
    this._autoScroll = !this._autoScroll;
  }

  private get _filteredLogs() {
    return this._logs.filter(log => {
      if (!this._activeFilters.has(log.level)) return false;
      if (this._filterText) {
        const text = `${log.message} ${log.module || ''}`.toLowerCase();
        return text.includes(this._filterText);
      }
      return true;
    });
  }

  render() {
    return html`
      <div class="terminal">
        <div class="toolbar">
          <div class="filter-group">
            ${(['DEBUG', 'INFO', 'WARN', 'ERROR'] as LogLevel[]).map(level => html`
              <button 
                class="filter-btn ${this._activeFilters.has(level) ? 'active ' + level.toLowerCase() : ''}"
                @click=${() => this._toggleFilter(level)}
              >
                ${level}
              </button>
            `)}
          </div>
          
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search logs..." 
            @input=${this._handleSearch}
            .value=${this._filterText}
          >
          
          <button class="action-btn" @click=${this._toggleAutoScroll} style="opacity: ${this._autoScroll ? '1' : '0.5'}">
            ${this._autoScroll ? 'Scroll: ON' : 'Scroll: OFF'}
          </button>
          
          <button class="action-btn" @click=${this._clearLogs}>
            Clear
          </button>
        </div>

        <div class="log-container">
          ${this._filteredLogs.length === 0 ? html`
            <div class="empty-state">No logs to display</div>
          ` : this._filteredLogs.map(log => html`
            <div class="log-item">
              <span class="timestamp">${new Date(log.timestamp).toLocaleTimeString()}</span>
              <span class="level ${log.level}">${log.level}</span>
              ${log.module ? html`<span class="module">[${log.module}]</span>` : ''}
              <span class="message">${log.message}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
