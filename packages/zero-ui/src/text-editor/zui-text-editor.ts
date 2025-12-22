import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../select/zui-select.js';

@customElement('zui-text-editor')
export class ZuiTextEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--text-main);
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .editor-container {
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      background: var(--card-bg);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: border-color 0.2s;
    }

    .editor-container:focus-within {
      border-color: var(--zui-primary, #3b82f6);
      box-shadow: 0 0 0 1px var(--zui-primary, #3b82f6);
    }

    .toolbar {
      display: flex;
      gap: 4px;
      padding: 8px;
      background: var(--bg-muted, rgba(0, 0, 0, 0.2));
      border-bottom: 1px solid var(--card-border);
      flex-wrap: wrap;
    }

    .toolbar-group {
      display: flex;
      gap: 2px;
      padding-right: 8px;
      margin-right: 8px;
      border-right: 1px solid var(--card-border);
      align-items: center;
    }

    .toolbar-group:last-child {
      border-right: none;
    }

    button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      width: 32px;
      height: 32px;
    }

    button:hover {
      background: var(--bg-hover, rgba(255, 255, 255, 0.1));
      color: var(--text-main);
    }

    button.active {
      background: var(--link-active-bg, rgba(59, 130, 246, 0.2));
      color: var(--zui-primary, #3b82f6);
    }

    .content-area {
      flex: 1;
      padding: 16px;
      outline: none;
      overflow-y: auto;
      min-height: 150px;
      line-height: 1.6;
    }

    .content-area:empty:before {
      content: attr(placeholder);
      color: var(--text-muted);
      opacity: 0.5;
      pointer-events: none;
    }

    /* Editor Content Styles */
    .content-area h1 { font-size: 1.8em; margin: 0.5em 0; }
    .content-area h2 { font-size: 1.5em; margin: 0.5em 0; }
    .content-area p { margin: 0.5em 0; }
    .content-area ul, .content-area ol { margin-left: 1.5em; }
      color: var(--link-color, #3b82f6); text-decoration: underline; }
    .content-area blockquote {
      border-left: 3px solid var(--text-muted);
      padding-left: 1rem;
      font-style: italic;
      color: var(--text-muted);
    }
    
    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    /* Toolbar Specifics */
    select {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 4px 8px;
      border-radius: 4px;
      height: 32px;
      outline: none;
      cursor: pointer;
    }
    
    select:hover {
        background: var(--bg-hover, rgba(255, 255, 255, 0.1));
    }

    option {
        background: var(--card-bg);
        color: var(--text-main);
    }
    
    input[type="color"] {
        -webkit-appearance: none;
        border: none;
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        cursor: pointer;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 4px;
    }
    input[type="color"]::-webkit-color-swatch {
        border-radius: 4px;
        border: 1px solid var(--card-border);
    }

    /* Compact Select for Toolbar */
    zui-select::part(trigger) {
      box-sizing: border-box;
      padding: 2px 8px;
      height: 32px;
      font-size: 0.9em;
      min-height: 32px;
      background: transparent;
      border: 1px solid var(--card-border);
    }
    
    zui-select::part(chevron) {
      width: 14px;
      height: 14px;
      right: 4px;
    }

    /* ... existing styles ... */
  `;

  @property({ type: String }) placeholder = 'Type something...';
  @property({ type: String }) value = '';
  
  @query('.content-area') private _editor!: HTMLDivElement;
  @state() private _activeFormats: Set<string> = new Set();
  @state() private _currentBlock: string = 'p';

  protected firstUpdated() {
    if (this.value) {
      this._editor.innerHTML = this.value;
    }
    document.addEventListener('selectionchange', this._handleSelectionChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('selectionchange', this._handleSelectionChange);
  }

  private _handleSelectionChange = () => {
    if (!this.shadowRoot?.activeElement || this.shadowRoot.activeElement !== this._editor) {
      return;
    }
    this._checkFormats();
  };

  private _checkFormats() {
    const formats = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
    const newFormats = new Set<string>();
    
    formats.forEach(format => {
      if (document.queryCommandState(format)) {
        newFormats.add(format);
      }
    });

    this._activeFormats = newFormats;
    this._checkBlock();
  }

  private _checkBlock() {
    const node = document.getSelection()?.anchorNode;
    if (node) {
      let parent = (node.nodeType === 3 ? node.parentElement : node) as HTMLElement;
      while (parent && parent !== this._editor) {
        const tag = parent.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].includes(tag)) {
          this._currentBlock = tag === 'div' ? 'p' : tag;
          return;
        }
        parent = parent.parentElement as HTMLElement;
      }
    }
    this._currentBlock = 'p';
  }

  private _execCmd(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
    this._editor.focus();
    this._checkFormats();
    this._emitChange();
  }

  private _handleInput() {
    this._emitChange();
  }

  private _emitChange() {
    const html = this._editor.innerHTML;
    this.value = html;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { html, value: html }, // Standardizing on value, keeping html for compat
      bubbles: true,
      composed: true
    }));
  }

  // Icons
  private _icons = {
    bold: html`<svg viewBox="0 0 24 24"><path d="M15.6 11.8c1-.7 1.6-1.8 1.6-2.8a4 4 0 0 0-4-4H7v14h7c2.1 0 3.8-1.7 3.8-3.8 0-1.5-.9-2.9-2.2-3.4zM10 7.5h3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"/></svg>`,
    italic: html`<svg viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>`,
    underline: html`<svg viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`,
    strikethrough: html`<svg viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>`,
    ul: html`<svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>`,
    ol: html`<svg viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>`,
    link: html`<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
    clean: html`<svg viewBox="0 0 24 24"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.55 5.27 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg>`,
    undo: html`<svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>`,
    redo: html`<svg viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>`,
    alignLeft: html`<svg viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>`,
    alignCenter: html`<svg viewBox="0 0 24 24"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>`,
    alignRight: html`<svg viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>`,
    alignJustify: html`<svg viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>`
  };

  private _btn(cmd: string, icon: any, activeCmd: string = cmd) {
    return html`
      <button 
        class="${this._activeFormats.has(activeCmd) ? 'active' : ''}"
        @mousedown=${(e: Event) => { e.preventDefault(); this._execCmd(cmd); }}
        title="${cmd}"
      >
        ${icon}
      </button>
    `;
  }

  render() {
    return html`
      <div class="editor-container">
        <div class="toolbar">

          <div class="toolbar-group">
             <button @mousedown=${(e: Event) => { e.preventDefault(); this._execCmd('undo'); }} title="Undo">${this._icons.undo}</button>
             <button @mousedown=${(e: Event) => { e.preventDefault(); this._execCmd('redo'); }} title="Redo">${this._icons.redo}</button>
          </div>

          <div class="toolbar-group">
            <zui-select
              .options=${[
        { label: 'Normal', value: 'p' },
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' }
      ]}
              .value=${this._currentBlock}
              placeholder="Format"
              @zui-change=${(e: CustomEvent) => {
        this._execCmd('formatBlock', e.detail.value);
      }}
              style="width: 105px;"
            ></zui-select>
          </div>

          <div class="toolbar-group">
             <input type="color" 
                title="Text Color"
                @input=${(e: Event) => {
        this._execCmd('foreColor', (e.target as HTMLInputElement).value);
      }}
             >
          </div>

          <div class="toolbar-group">
            ${this._btn('bold', this._icons.bold)}
            ${this._btn('italic', this._icons.italic)}
            ${this._btn('underline', this._icons.underline)}
            ${this._btn('strikeThrough', this._icons.strikethrough)}
          </div>
          
          <div class="toolbar-group">
            ${this._btn('justifyLeft', this._icons.alignLeft)}
            ${this._btn('justifyCenter', this._icons.alignCenter)}
            ${this._btn('justifyRight', this._icons.alignRight)}
            ${this._btn('justifyFull', this._icons.alignJustify)}
          </div>

          <div class="toolbar-group">
            ${this._btn('insertUnorderedList', this._icons.ul)}
            ${this._btn('insertOrderedList', this._icons.ol)}
          </div>

          <div class="toolbar-group">
             <button @mousedown=${(e: Event) => {
                e.preventDefault();
                const url = prompt('Enter link URL:');
                if (url) this._execCmd('createLink', url);
    }} title="Link">
               ${this._icons.link}
             </button>
             <button @mousedown=${(e: Event) => {
                e.preventDefault();
                this._execCmd('removeFormat');
    }} title="Clear Format">
               ${this._icons.clean}
             </button>
          </div>
        </div>
        
        <div 
          class="content-area" 
          contenteditable="true"
          placeholder="${this.placeholder}"
          @input=${this._handleInput}
        ></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-text-editor': ZuiTextEditor;
  }
}
