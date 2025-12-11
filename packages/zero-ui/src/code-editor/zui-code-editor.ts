import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { SyntaxHighlighterService } from '../services/index.js';

@customElement('zui-code-editor')
export class ZuiCodeEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      min-height: 200px;
      position: relative;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      background: #1e1e1e;
      color: #d4d4d4;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
    }

    .editor-wrapper {
      display: flex;
      height: 100%;
      position: relative;
    }

    .gutter {
      width: 40px;
      background: #252526;
      color: #858585;
      text-align: right;
      padding: 10px 8px 10px 0;
      user-select: none;
      border-right: 1px solid #333;
      overflow: hidden;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .line-number {
      height: 1.5em; /* Match line-height */
    }

    .textarea-container {
      flex: 1;
      position: relative;
      overflow: hidden; 
    }

    textarea, pre {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 10px;
      border: none;
      background: transparent;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      resize: none;
      outline: none;
      white-space: pre;
      overflow: auto;
      tab-size: 2;
      box-sizing: border-box;
    }

    /* Input layer needs to be transparent but allow caret */
    textarea {
      z-index: 2;
      color: transparent;
      caret-color: #d4d4d4;
    }

    /* Highlight layer sits below */
    pre {
      z-index: 1;
      pointer-events: none; /* Let clicks pass through to textarea */
    }

    textarea:focus {
      outline: none;
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: Boolean }) readonly = false;
  @property({ type: String }) language = 'javascript';

  @query('textarea') private _textarea!: HTMLTextAreaElement;
  @query('.gutter') private _gutter!: HTMLDivElement;
  @query('#highlight-layer') private _highlightLayer!: HTMLPreElement;

  @state() private _lineCount = 1;

  protected firstUpdated() {
    this._updateLineCount();
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value')) {
      this._updateLineCount();
      // Also update highlighting when value changes externally
      this.requestUpdate();
    }
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  private _updateLineCount() {
    const lines = this.value.split('\n').length;
    if (lines !== this._lineCount) {
      this._lineCount = lines;
    }
  }

  private _handleScroll() {
    if (this._textarea && this._gutter && this._highlightLayer) {
      const scrollTop = this._textarea.scrollTop;
      const scrollLeft = this._textarea.scrollLeft;
      
      this._gutter.scrollTop = scrollTop;
      this._highlightLayer.scrollTop = scrollTop;
      this._highlightLayer.scrollLeft = scrollLeft;
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this._textarea.selectionStart;
      const end = this._textarea.selectionEnd;

      const newValue = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.value = newValue;
      
      setTimeout(() => {
        if (this._textarea) {
             this._textarea.selectionStart = this._textarea.selectionEnd = start + 2;
        }
      }, 0);
      
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }));
      this.requestUpdate();
    }
  }

  private _getHighlightedCode() {
    // We add a trailing space/newline to matching rendering of textarea which might have hanging newline
    const highlighted = SyntaxHighlighterService.highlight(this.value, this.language);
    // If value ends with newline, pre needs an extra character to actually show that line height
    if (this.value.endsWith('\n')) {
        return html`${unsafeHTML(highlighted + '<br>')}`;
    }
    return html`${unsafeHTML(highlighted)}`;
  }

  render() {
    return html`
      <div class="editor-wrapper">
        <div class="gutter">
          ${Array.from({ length: this._lineCount }, (_, i) => html`
            <div class="line-number">${i + 1}</div>
          `)}
        </div>
        <div class="textarea-container">
          <pre id="highlight-layer" aria-hidden="true">${this._getHighlightedCode()}</pre>
          <textarea
            .value=${live(this.value)}
            ?readonly=${this.readonly}
            @input=${this._handleInput}
            @scroll=${this._handleScroll}
            @keydown=${this._handleKeyDown}
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-code-editor': ZuiCodeEditor;
  }
}