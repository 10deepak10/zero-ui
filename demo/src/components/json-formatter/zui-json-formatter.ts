import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('zui-json-formatter')
export class ZuiJsonFormatter extends LitElement {
  static styles = css`
    :host {
      display: flex;
      height: 100%;
      flex-direction: column;
      font-family: monospace;
      background: var(--card-bg, #1e1e1e);
      color: var(--text-main, #d4d4d4);
      overflow: hidden;
      border: 1px solid var(--card-border, #333);
      border-radius: 6px;
    }

    .toolbar {
      display: flex;
      padding: 8px;
      gap: 8px;
      border-bottom: 1px solid var(--card-border, #333);
      background: var(--bg-muted, #252526);
      align-items: center;
    }

    .split-view {
      display: flex;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }

    .input-pane, .output-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .output-pane {
      border-left: 1px solid var(--card-border, #333);
      padding: 8px;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .split-view {
        flex-direction: column;
      }
      .output-pane {
        border-left: none;
        border-top: 1px solid var(--card-border, #333);
      }
      .toolbar {
        flex-wrap: wrap;
      }
    }

    textarea {
      flex: 1;
      background: transparent;
      color: var(--code-default, var(--text-main, #d4d4d4));
      border: none;
      resize: none;
      padding: 8px;
      font-family: inherit;
      outline: none;
    }

    .error-msg {
      padding: 8px;
      background: var(--color-danger, #5a1d1d);
      color: #fff;
      font-size: 0.8rem;
    }
    
    .tree-row {
        display: flex; 
        align-items: center;
        padding: 2px 0;
    }
    .tree-row:hover .copy-btn {
        opacity: 1;
    }
    .copy-btn {
        opacity: 0;
        cursor: pointer;
        padding: 0 4px;
        font-size: 10px;
        color: #888;
        transition: opacity 0.2s;
        border: none;
        background: transparent;
        user-select: none;
    }
    .copy-btn:hover {
        color: #fff;
    }

    .btn {
      background: transparent;
      border: 1px solid var(--card-border, #333);
      color: var(--text-main, #d4d4d4);
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn:hover:not(:disabled) {
      background: var(--bg-hover, rgba(255,255,255,0.05));
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .search-input {
      background: var(--zui-input-bg, rgba(255,255,255,0.05));
      border: 1px solid var(--card-border, #444);
      color: var(--text-main, #ddd);
      padding: 4px 8px;
      border-radius: 4px;
      font-family: inherit;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--color-primary, #3b82f6);
    }
  `;

  @state() private _input = '';
  @state() private _parsedData: any = null;
  @state() private _error: string | null = null;
  
  @state() private _searchQuery = '';
  @state() private _searchResults: string[] = []; // Paths of matched nodes
  @state() private _currentMatchIndex = -1;
  @state() private _expanded = new Set<string>(['root']);

  updated(changedProperties: Map<string, any>) {
      if (changedProperties.has('_searchQuery')) {
          this._performSearch();
      }
  }

  private _copyPath(path: string) {
      if (path === 'root') return;
      const cleanPath = path.replace(/^root\./, '');
      navigator.clipboard.writeText(cleanPath);
      // Ideally show a toast
  }

  private _expandAll() {
      const allPaths = new Set<string>();
      const traverse = (data: any, path: string) => {
          allPaths.add(path);
          if (typeof data === 'object' && data !== null) {
              Object.keys(data).forEach(key => traverse(data[key], `${path}.${key}`));
          }
      };
      if (this._parsedData) {
          traverse(this._parsedData, 'root');
          this._expanded = allPaths;
      }
  }

  private _collapseAll() {
      this._expanded = new Set(['root']);
  }

  render() {
    return html`
      <div class="toolbar">
        <button class="btn" @click=${this._format}>Format</button>
        <button class="btn" @click=${() => { this._input = ''; this._parsedData = null; }}>Clear</button>
        <div style="width: 1px; height: 16px; background: #444; margin: 0 4px;"></div>
        <button class="btn" @click=${this._expandAll} ?disabled=${!this._parsedData} title="Expand All">+</button>
        <button class="btn" @click=${this._collapseAll} ?disabled=${!this._parsedData} title="Collapse All">-</button>
        
        <div style="flex: 1"></div>
        <div class="search-box" style="display: flex; gap: 4px; align-items: center;">
             <input 
                type="text" 
                class="search-input"
                placeholder="Search keys or values..." 
                .value=${this._searchQuery}
                @input=${(e: any) => this._searchQuery = e.target.value}
             >
             ${this._searchResults.length > 0 ? html`
                <span style="font-size: 0.8rem; color: #888;">
                    ${this._currentMatchIndex + 1}/${this._searchResults.length}
                </span>
                <button class="btn" style="padding: 2px 8px;" @click=${this._prevMatch}>↑</button>
                <button class="btn" style="padding: 2px 8px;" @click=${this._nextMatch}>↓</button>
             ` : ''}
        </div>
      </div>
      <div class="split-view">
        <div class="input-pane">
            <textarea 
                .value=${this._input}
                @input=${(e: any) => this._input = e.target.value}
                placeholder="Paste JSON here..."
            ></textarea>
            ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
        </div>
        <div class="output-pane">
            ${this._parsedData ? this._renderTree(this._parsedData, 'root') : html`<div style="opacity: 0.5;">Tree view will appear here</div>`}
        </div>
      </div>
    `;
  }

  private _format() {
    try {
        if (!this._input.trim()) {
            this._parsedData = null;
            this._error = null;
            return;
        }
        this._parsedData = JSON.parse(this._input);
        this._error = null;
        this._expanded = new Set(['root']);
        this._performSearch(); // Re-run search if query exists
    } catch (e: any) {
        this._error = e.message;
        this._parsedData = null;
    }
  }

  // ... _performSearch, _nextMatch, _prevMatch, _revealPath ...

  private _performSearch() {
      if (!this._parsedData || !this._searchQuery.trim()) {
          this._searchResults = [];
          this._currentMatchIndex = -1;
          return;
      }

      const query = this._searchQuery.toLowerCase();
      const results: string[] = [];
      
      const traverse = (data: any, path: string) => {
          // Check Key match (not for root)
          if (path !== 'root') {
              const key = path.split('.').pop() || '';
              // Match Key OR Full Path
              // Note: We strip 'root.' prefix from path for cleaner matching if the user expects 'data...'
              const cleanPath = path.replace(/^root\./, '');
              if (key.toLowerCase().includes(query) || cleanPath.toLowerCase().includes(query) || path.toLowerCase().includes(query)) {
                  results.push(path);
              }
          }

          // Check Value match (primitives)
          if (typeof data !== 'object' || data === null) {
              if (String(data).toLowerCase().includes(query)) {
                  if (results[results.length - 1] !== path) {
                      results.push(path);
                  }
              }
              return;
          }

          // Recursion
          const isArray = Array.isArray(data);
          Object.entries(data).forEach(([key, value]) => {
              const newPath = isArray ? `${path}[${key}]` : `${path}.${key}`;
              traverse(value, newPath);
          });
      };

      traverse(this._parsedData, 'root');
      this._searchResults = results;
      this._currentMatchIndex = results.length > 0 ? 0 : -1;

      if (this._searchResults.length > 0) {
          this._revealPath(this._searchResults[0]);
      }
  }

  private _nextMatch() {
      if (this._searchResults.length === 0) return;
      this._currentMatchIndex = (this._currentMatchIndex + 1) % this._searchResults.length;
      this._revealPath(this._searchResults[this._currentMatchIndex]);
  }

  private _prevMatch() {
      if (this._searchResults.length === 0) return;
      this._currentMatchIndex = (this._currentMatchIndex - 1 + this._searchResults.length) % this._searchResults.length;
      this._revealPath(this._searchResults[this._currentMatchIndex]);
  }

  private async _revealPath(fullPath: string) {
      let temp = fullPath;
      while (temp.length > 0) {
           this._expanded.add(temp);
           const lastDot = temp.lastIndexOf('.');
           const lastBracket = temp.lastIndexOf('[');
           
           if (lastDot === -1 && lastBracket === -1) break;
           
           if (lastDot > lastBracket) {
               temp = temp.substring(0, lastDot);
           } else {
               temp = temp.substring(0, lastBracket);
           }
      }
      
      this.requestUpdate();
      await this.updateComplete;
      this._scrollToCurrentMatch();
  }

  private _scrollToCurrentMatch() {
      if (this._currentMatchIndex === -1) return;
      const path = this._searchResults[this._currentMatchIndex];
      const el = this.shadowRoot?.querySelector(`[data-path="${path.replace(/"/g, '\\"')}"]`);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }

  private _handleCopy(e: Event, path: string, data: any, isExpanded: boolean) {
      e.stopPropagation();
      if (!isExpanded && typeof data === 'object' && data !== null) {
          navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } else {
          this._copyPath(path);
      }
  }

  private _renderKeyLabel(key: string) {
      // Split by array indices e.g. "data[0][1]" -> ["data", "[0]", "", "[1]", ""]
      const parts = key.split(/(\[\d+\])/g);
      return parts.map(part => {
          if (part.match(/^\[\d+\]$/)) {
              return html`<span style="user-select: none; opacity: 0.8;">${part}</span>`;
          }
          return html`<span>${part}</span>`;
      });
  }

  private _renderTree(data: any, path: string): any {
     if (data === null) return this._renderPrimitive(data, path, 'null');
     if (typeof data === 'boolean') return this._renderPrimitive(data, path, 'boolean');
     if (typeof data === 'number') return this._renderPrimitive(data, path, 'number');
     if (typeof data === 'string') return this._renderPrimitive(`"${data}"`, path, 'string');

     const isArray = Array.isArray(data);
     const isExpanded = this._expanded.has(path);
     const key = path.split('.').pop();
     
     const isMatch = this._searchResults[this._currentMatchIndex] === path;
     const isResult = this._searchResults.includes(path);
     
     return html`
        <div style="font-family: 'Menlo', 'Monaco', monospace; font-size: 13px; line-height: 1.5;">
            <div 
                class="tree-row" 
                data-path="${path}"
                style="${isMatch ? 'background: rgba(255, 255, 0, 0.2);' : isResult ? 'background: rgba(255, 255, 0, 0.1);' : ''}"
            >
                <span 
                    @click=${(e: Event) => { e.stopPropagation(); this._toggleExpand(path); }}
                    style="margin-right: 4px; user-select: none; width: 14px; display: inline-block; text-align: center; cursor: pointer;"
                >
                    ${isExpanded ? '▼' : '▶'}
                </span>
                
                ${key && key !== 'root' ? html`
                    <span style="color: var(--code-attribute, #9cdcfe); margin-right: 4px;">${this._renderKeyLabel(key)}:</span>
                    <button 
                        class="copy-btn" 
                        title="${isExpanded ? 'Copy path' : 'Copy JSON'}" 
                        @click=${(e: Event) => this._handleCopy(e, path, data, isExpanded)}
                    >📋</button>
                ` : ''}
                
                <span style="opacity: 0.7; cursor: pointer;" @click=${() => this._toggleExpand(path)}>
                    ${isArray ? '[' : '{'} 
                    ${!isExpanded ? html`... ${isArray ? data.length + ' items' : Object.keys(data).length + ' keys'} ${isArray ? ']' : '}'}` : ''}
                </span>
            </div>

            ${isExpanded ? html`
                <div style="padding-left: 18px; border-left: 1px solid #333; margin-left: 6px;">
                    ${Object.entries(data).map(([k, v]) => 
                        // Use brackets for array children, dots for object children
                        this._renderTree(v, isArray ? `${path}[${k}]` : `${path}.${k}`)
                    )}
                    <div>${isArray ? ']' : '}'}</div>
                </div>
            ` : ''}
        </div>
     `;
  }

  private _renderPrimitive(value: any, path: string, type: 'string'|'number'|'boolean'|'null') {
      const key = path.split('.').pop();
      const isMatch = this._searchResults[this._currentMatchIndex] === path;
      const isResult = this._searchResults.includes(path);

      const colorMap = {
          string: 'var(--code-string, #ce9178)',
          number: 'var(--code-number, #b5cea8)',
          boolean: 'var(--code-keyword, #569cd6)',
          null: 'var(--code-keyword, #569cd6)'
      };

      return html`
        <div 
            class="tree-row" 
            data-path="${path}"
            style="
                margin-left: 24px; 
                font-family: 'Menlo', 'Monaco', monospace; 
                font-size: 13px;
                ${isMatch ? 'background: rgba(255, 255, 0, 0.2); outline: 1px solid rgba(255, 255, 0, 0.5);' : isResult ? 'background: rgba(255, 255, 0, 0.1);' : ''}
        ">
            ${key !== 'root' && key ? html`
                <span style="color: var(--code-attribute, #9cdcfe); margin-right: 4px;">${this._renderKeyLabel(key)}:</span>
                <button class="copy-btn" title="Copy path" @click=${(e: Event) => { e.stopPropagation(); this._copyPath(path); }}>📋</button>
            ` : ''}
            <span style="color: ${colorMap[type]};">${value}</span>
        </div>
      `;
  }

  private _toggleExpand(path: string) {
      if (this._expanded.has(path)) {
          this._expanded.delete(path);
      } else {
          this._expanded.add(path);
      }
      this.requestUpdate();
  }
}
