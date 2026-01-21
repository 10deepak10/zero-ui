
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { EventBusService, type EventBusEvent } from '@deepverse/zero-ui/event-bus';

@customElement('zui-event-bus')
export class ZuiEventBus extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      height: 100%;
      box-sizing: border-box;
    }

    * { box-sizing: border-box; }

    .container {
      background: var(--event-bus-bg, #0f172a);
      border: 1px solid var(--event-bus-border, #1e293b);
      border-radius: var(--event-bus-radius, 12px);
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
      border-bottom: 1px solid var(--event-bus-border, #1e293b);
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

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

    .list-container {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      scroll-behavior: smooth;
    }

    .event-item {
      display: grid;
      grid-template-columns: 80px 120px 1fr auto; /* Time, Source, Name, Details toggle */
      gap: 12px;
      padding: 8px 16px;
      font-size: 0.85rem;
      line-height: 1.4;
      font-size: 0.85rem;
      line-height: 1.4;
      border-bottom: 1px solid var(--card-border, rgba(255, 255, 255, 0.02));
      align-items: center;
      cursor: pointer;
    }

    .event-item:hover {
      background: var(--bg-hover, rgba(255, 255, 255, 0.02));
    }

    .timestamp {
      color: #64748b;
      font-size: 0.75rem;
    }

    .source {
      color: #d8b4fe;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      color: #60a5fa;
      font-weight: 600;
      word-break: break-all;
    }

    .details {
      background: var(--zui-input-bg, rgba(0, 0, 0, 0.2));
      padding: 8px 16px;
      font-size: 0.8rem;
      color: var(--text-muted, #94a3b8);
      overflow-x: auto;
      white-space: pre-wrap;
      border-bottom: 1px solid var(--card-border, rgba(255, 255, 255, 0.02));
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #64748b;
      font-style: italic;
    }
    
    .sys-event {
       opacity: 0.6;
    }
  `;

  @state() private _events: EventBusEvent[] = [];
  @state() private _filterText = '';
  @state() private _autoScroll = true;
  @state() private _expandedEvents: Set<string> = new Set();

  @query('.list-container') private _listContainer!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this._events = EventBusService.getHistory();
    EventBusService.subscribeAll(this._handleEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    EventBusService.unsubscribeAll(this._handleEvent);
  }

  updated() {
    if (this._autoScroll && this._listContainer) {
      this._listContainer.scrollTop = this._listContainer.scrollHeight;
    }
  }

  private _handleEvent = (event: EventBusEvent) => {
    if (event.name === 'sys:clear_history' && event.source === 'EventBusService') {
        this._events = [];
        return;
    }
    this._events = [...this._events, event];
  };

  private _handleSearch(e: Event) {
    this._filterText = (e.target as HTMLInputElement).value.toLowerCase();
  }

  private _clearEvents() {
    EventBusService.clearHistory();
    // The service emits sys:clear_history which will clear our local state in _handleEvent
  }

  private _toggleAutoScroll() {
    this._autoScroll = !this._autoScroll;
  }
  
  private _toggleExpand(id: string) {
    const newExpanded = new Set(this._expandedEvents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    this._expandedEvents = newExpanded;
  }

  private get _filteredEvents() {
    return this._events.filter(event => {
      if (this._filterText) {
        const text = `${event.name} ${event.source || ''}`.toLowerCase();
        return text.includes(this._filterText);
      }
      return true;
    });
  }

  render() {
    return html`
      <div class="container">
        <div class="toolbar">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Filter events..." 
            @input=${this._handleSearch}
            .value=${this._filterText}
          >
          
          <button class="action-btn" @click=${this._toggleAutoScroll} style="opacity: ${this._autoScroll ? '1' : '0.5'}">
            ${this._autoScroll ? 'Scroll: ON' : 'Scroll: OFF'}
          </button>
          
          <button class="action-btn" @click=${this._clearEvents}>
            Clear
          </button>
        </div>

        <div class="list-container">
          ${this._filteredEvents.length === 0 ? html`
            <div class="empty-state">No events captured</div>
          ` : this._filteredEvents.map(event => html`
            <div 
               class="event-item ${event.name.startsWith('sys:') ? 'sys-event' : ''}" 
               @click=${() => this._toggleExpand(event.id)}
            >
              <span class="timestamp">${new Date(event.timestamp).toLocaleTimeString()}</span>
              <span class="source" title=${event.source || ''}>${event.source || '-'}</span>
              <span class="name" title=${event.name}>${event.name}</span>
              <span class="expand-icon">${this._expandedEvents.has(event.id) ? '▼' : '▶'}</span>
            </div>
            ${this._expandedEvents.has(event.id) ? html`
              <div class="details">
                <pre>${JSON.stringify(event.data, null, 2)}</pre>
              </div>
            ` : ''}
          `)}
        </div>
      </div>
    `;
  }
}
