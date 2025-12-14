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
      background: var(--zui-input-bg, var(--card-bg, #1e1e1e));
      color: var(--text-main, #d4d4d4);
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
      background: var(--bg-muted, #252526);
      color: var(--text-muted, #858585);
      text-align: right;
      padding: 10px 8px 10px 0;
      user-select: none;
      border-right: 1px solid var(--card-border, #333);
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
      caret-color: var(--text-main, #d4d4d4);
    }

    /* Highlight layer sits below */
    pre {
      z-index: 1;
      pointer-events: none; /* Let clicks pass through to textarea */
    }

    textarea:focus {
      outline: none;
    }

    .suggestions-popup {
      position: absolute;
      z-index: 10;
      background: var(--card-bg, #252526);
      backdrop-filter: blur(8px);
      border: 1px solid var(--card-border, #454545);
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      max-height: 200px;
      overflow-y: auto;
      min-width: 150px;
    }

    .suggestion-item {
      padding: 4px 8px;
      cursor: pointer;
      color: var(--text-main, #cccccc);
    }

    .suggestion-item:hover, .suggestion-item.active {
      background: var(--zui-primary, #094771);
      color: #ffffff;
    }

    /* Syntax Highlighting Tokens */
    .token-comment { color: var(--code-comment, #6a9955); font-style: italic; }
    .token-string { color: var(--code-string, #ce9178); }
    .token-keyword { color: var(--code-keyword, #569cd6); }
    .token-number { color: var(--code-number, #b5cea8); }
    .token-tag { color: var(--code-tag, #569cd6); }
    .token-attribute { color: var(--code-attribute, #9cdcfe); }
    .token-operator { color: var(--code-operator, #d4d4d4); }
    .token-default { color: var(--code-default, #d4d4d4); }
  `;

  @property({ type: String }) value = '';
  @property({ type: Boolean }) readonly = false;
  @property({ type: String }) language = 'javascript';

  @query('textarea') private _textarea!: HTMLTextAreaElement;
  @query('.gutter') private _gutter!: HTMLDivElement;
  @query('#highlight-layer') private _highlightLayer!: HTMLPreElement;

  @state() private _lineCount = 1;
  @state() private _suggestions: string[] = [];
  @state() private _showSuggestions = false;
  @state() private _suggestionIndex = 0;
  @state() private _suggestionCoords = { top: 0, left: 0 };
  @state() private _pendingSelection: { start: number, end: number } | null = null;

  @state() private _history: { value: string; selectionStart: number; selectionEnd: number }[] = [];
  @state() private _redoStack: { value: string; selectionStart: number; selectionEnd: number }[] = [];
  private _historyDebounce: any = null;

  protected firstUpdated() {
    this._updateLineCount();
    // Initial state for undo
    this._addToHistory();
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value')) {
      this._updateLineCount();
      // Also update highlighting when value changes externally

      // Restore cursor if pending
      if (this._pendingSelection && this._textarea) {
        this._textarea.selectionStart = this._pendingSelection.start;
        this._textarea.selectionEnd = this._pendingSelection.end;
        this._pendingSelection = null;
      }

      this.requestUpdate();
    }
  }

  private _addToHistory() {
    // Don't add if same as top
    const current = {
      value: this.value,
      selectionStart: this._textarea.selectionStart,
      selectionEnd: this._textarea.selectionEnd
    };

    if (this._history.length > 0) {
      const last = this._history[this._history.length - 1];
      if (last.value === current.value) return;
    }

    this._history.push(current);
    if (this._history.length > 100) this._history.shift(); // Limit history size
    this._redoStack = []; // Clear redo on new action
  }

  private _handleInput(e: InputEvent) {
    const target = e.target as HTMLTextAreaElement;

    // Auto-closing logic
    // We check e.inputType to ensure we are typing text
    if (e.inputType === 'insertText' && e.data) {
      this._handleAutoClose(e.data, target);
    } else {
    // Just update value normally if not handling auto-close specific logic that alters value
      this.value = target.value;
    }

    // Debounce history recording for typing
    if (this._historyDebounce) clearTimeout(this._historyDebounce);
    this._historyDebounce = setTimeout(() => {
      this._addToHistory();
    }, 1000); // Save state after 1 second of no typing

    // Check for suggestions
    if (this._showSuggestions) {
      this._updateSuggestions();
    } else if (e.inputType === 'insertText' && e.data && !e.data.match(/\s/)) {
      // Trigger suggestions on typing non-whitespace
      this._triggerSuggestions();
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  private _handleAutoClose(char: string, target: HTMLTextAreaElement) {
    let newValue = target.value;
    let selectionStart = target.selectionStart;
    let selectionEnd = target.selectionEnd;
    let newCursorPos = selectionStart;

    // Pairs
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[char]) {
      // Insert closing char
      const closing = pairs[char];
      // The 'value' from target already includes 'char' at selectionStart-1
      // So we insert the closing char at the current selectionStart
      newValue = newValue.substring(0, selectionStart) + closing + newValue.substring(selectionStart);
      newCursorPos = selectionStart; // Cursor stays between the typed char and the inserted closing char
    } else if (char === '>' && this.language === 'html') {
      // HTML Auto-close
      // Scan back to see if we just closed a tag
      const beforeCursor = newValue.substring(0, selectionStart);
      // Look for <tagName ... >
      const tagMatch = beforeCursor.match(/<([a-zA-Z0-9-]+)(?:\s[^>]*)?>$/);

      if (tagMatch) {
        const tagName = tagMatch[1];
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        if (!voidElements.includes(tagName.toLowerCase())) {
          const closingTag = `</${tagName}>`;
          newValue = newValue.substring(0, selectionStart) + closingTag + newValue.substring(selectionStart);
          newCursorPos = selectionStart; // Cursor stays after the opening tag, before the closing tag
        }
      }
    }

    // Only update if the value actually changed due to auto-close
    if (newValue !== this.value) {
      this.value = newValue;
      this._pendingSelection = { start: newCursorPos, end: newCursorPos };
    } else {
      // If no auto-close happened, just update the value normally
      this.value = target.value;
    }
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

      // Close suggestions on scroll to keep it simple and avoid floating dislocated popup
      if (this._showSuggestions) {
        this._showSuggestions = false;
        this.requestUpdate();
      }
    }
  }

  private _undo() {
    if (this._history.length === 0) return;

    // Save current state to redo
    const current = {
      value: this.value,
      selectionStart: this._textarea.selectionStart,
      selectionEnd: this._textarea.selectionEnd
    };
    this._redoStack.push(current);

    let prev = this._history.pop()!;

    // If the top of history is identical to current state (e.g. from debounce save),
    // we need to step back one more to actually change something.
    if (prev.value === this.value && this._history.length > 0) {
      prev = this._history.pop()!;
    }

    this.value = prev.value;
    this.requestUpdate();

    setTimeout(() => {
      if (this._textarea) {
        this._textarea.selectionStart = prev.selectionStart;
        this._textarea.selectionEnd = prev.selectionEnd;
        this._textarea.focus();
      }
    }, 0);
  }

  private _redo() {
    if (this._redoStack.length === 0) return;

    const current = {
      value: this.value,
      selectionStart: this._textarea.selectionStart,
      selectionEnd: this._textarea.selectionEnd
    };
    this._history.push(current);

    const next = this._redoStack.pop()!;
    this.value = next.value;
    this.requestUpdate();

    setTimeout(() => {
      if (this._textarea) {
        this._textarea.selectionStart = next.selectionStart;
        this._textarea.selectionEnd = next.selectionEnd;
        this._textarea.focus();
      }
    }, 0);
  }

  private async _handleKeyDown(e: KeyboardEvent) {
    // Shortcuts handling
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    const isShift = e.shiftKey;

    // Undo/Redo
    if (isCmdOrCtrl && e.key === 'z') {
      e.preventDefault();
      if (isShift) {
        this._redo();
      } else {
        this._undo();
      }
      return;
    }
    // Redo alternative (Ctrl+Y usually on Windows)
    if (isCmdOrCtrl && e.key === 'y') {
      e.preventDefault();
      this._redo();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this._addToHistory(); // Save state before tab
      this._insertText('  ');
    } else if (isCmdOrCtrl && e.key === 'x') {
      // Cut line if no selection
      if (this._textarea.selectionStart === this._textarea.selectionEnd) {
        e.preventDefault();
        this._addToHistory(); // Save state before cut
        this._cutCurrentLine();
      }
    } else if (isCmdOrCtrl && e.key === 'c') {
      // Copy line if no selection
      if (this._textarea.selectionStart === this._textarea.selectionEnd) {
        e.preventDefault();
        this._copyCurrentLine();
      }
    } else if (isCmdOrCtrl && (e.key === '/' || e.code === 'Slash')) {
      // Toggle comment
      e.preventDefault();
      this._addToHistory(); // Save state before comment toggle
      this._toggleComment();
    } else if (e.key === ' ' && e.ctrlKey) {
      // Trigger suggestions
      e.preventDefault();
      this._triggerSuggestions();
    } else if (this._showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._suggestionIndex = (this._suggestionIndex + 1) % this._suggestions.length;
        this.requestUpdate();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this._suggestionIndex = (this._suggestionIndex - 1 + this._suggestions.length) % this._suggestions.length;
        this.requestUpdate();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this._addToHistory(); // Accepting suggestion changes text
        this._selectSuggestion(this._suggestions[this._suggestionIndex]);
      } else if (e.key === 'Escape') {
        this._showSuggestions = false;
      }
    }
  }

  private _insertText(text: string) {
    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;
    const newValue = this.value.substring(0, start) + text + this.value.substring(end);
    this.value = newValue;
    setTimeout(() => {
      if (this._textarea) {
        this._textarea.selectionStart = this._textarea.selectionEnd = start + text.length;
        this._textarea.focus();
      }
    }, 0);
    this._emitChange();
  }

  private _getLineInfo(index: number) {
    const beforeCursor = this.value.substring(0, index);
    const afterCursor = this.value.substring(index);

    const lastNewLine = beforeCursor.lastIndexOf('\n');
    const nextNewLine = afterCursor.indexOf('\n');

    const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
    const lineEnd = nextNewLine === -1 ? this.value.length : index + nextNewLine;

    return { lineStart, lineEnd, text: this.value.substring(lineStart, lineEnd) };
  }

  private async _cutCurrentLine() {
    const { lineStart, lineEnd } = this._getLineInfo(this._textarea.selectionStart);
    // Include the newline character if it exists
    const cutEnd = Math.min(this.value.length, lineEnd + 1);
    const lineText = this.value.substring(lineStart, cutEnd);

    await navigator.clipboard.writeText(lineText);

    const newValue = this.value.substring(0, lineStart) + this.value.substring(cutEnd);
    this.value = newValue;

    // Move cursor to start of where line was
    setTimeout(() => {
      if (this._textarea) {
        this._textarea.selectionStart = this._textarea.selectionEnd = lineStart;
      }
    }, 0);
    this._emitChange();
  }

  private async _copyCurrentLine() {
    const { text } = this._getLineInfo(this._textarea.selectionStart);
    await navigator.clipboard.writeText(text + '\n');
  }

  private _toggleComment() {
    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;

    // Find start of the first line
    const startLineStart = Math.max(0, this.value.lastIndexOf('\n', start - 1) + 1);

    // Find end of the last line
    let endLineEnd = this.value.indexOf('\n', end);
    if (endLineEnd === -1) endLineEnd = this.value.length;

    const [startSymbol, endSymbol] = this._getCommentSymbol();

    // If we have an end symbol (like --> or */), we prefer block commenting for multi-line selections
    // or if the selection is within a single line but we want to treat it as a block? 
    // The user request specifically mentioned multi-line behavior.

    const textToProcess = this.value.substring(startLineStart, endLineEnd);

    // Check if we should use block comment mode
    // Block mode is used if we have an endSymbol AND (it's multiple lines OR it's a specific block selection paradigm)
    // For simplicity and matching user request: if endSymbol exists, we treat the whole range as one block.

    if (endSymbol) {
      this._toggleBlockComment(startLineStart, endLineEnd, textToProcess, startSymbol, endSymbol);
    } else {
      this._toggleLineComment(startLineStart, endLineEnd, textToProcess, startSymbol);
    }
  }

  private _toggleBlockComment(startIndex: number, endIndex: number, text: string, startSymbol: string, endSymbol: string) {
    // Check if the block is already surrounded by comments
    const trimmed = text.trim();
    const isCommented = trimmed.startsWith(startSymbol) && trimmed.endsWith(endSymbol);

    let newText = '';

    if (isCommented) {
      // Unwrap
      // We need to be careful to remove exactly what we added or reasonable variation
      // Implementation: Regex match the wrapping
      const regex = new RegExp(`^(\\s*)${this._escapeRegExp(startSymbol)}\\s?([\\s\\S]*?)\\s?${this._escapeRegExp(endSymbol)}(\\s*)$`);
      const match = text.match(regex);

      if (match) {
        // Preserves leading/trailing whitespace of the line structure if they existed outside the comment chars
        const leading = match[1];
        const content = match[2];
        const trailing = match[3];
        newText = leading + content + trailing;
      } else {
        // Fallback if regex doesn't match perfectly (e.g. mixed content), just try to strip known symbols
        // This is a naive unwrap
        let content = " " + trimmed.substring(startSymbol.length, trimmed.length - endSymbol.length) + " ";
        // Logic to try to respect original indentation is hard without the regex, but let's try
        // to just replace the trim part
        const leadingSpace = text.substring(0, text.indexOf(startSymbol));
        const trailingSpace = text.substring(text.lastIndexOf(endSymbol) + endSymbol.length);

        // Remove one level of spacing if present
        if (content.startsWith(' ')) content = content.substring(1);
        if (content.endsWith(' ')) content = content.substring(0, content.length - 1);

        newText = leadingSpace + content + trailingSpace;
      }
    } else {
      // Wrap
      // Find common indentation to put the comment start nicely? 
      // Or just wrap the whole blob?
      // User example:
      /*
        <h1>Hello</h1>
        <!-- <p>...</p> 
             <button>...</button> -->
      */
      // It seems they want the `<!--` at the start of the block (after indentation?) and `-->` at the end.

      const match = text.match(/^(\s*)([\s\S]*)/);
      const leadingSpace = match ? match[1] : '';
      const content = match ? match[2] : text;

      // If there are multiple lines, we usually want the closure to align or float?
      // User's example:
      /*
      <!-- <p>Start editing to see changes!</p> 
           <button id="btn">Click Me</button> -->
      */
      // This implies: INDENT + START + SPACE + CONTENT + SPACE + END

      newText = `${leadingSpace}${startSymbol} ${content} ${endSymbol}`;
    }

    this._applyTextChange(startIndex, endIndex, newText);
  }

  private _toggleLineComment(startIndex: number, endIndex: number, text: string, startSymbol: string) {
    const lines = text.split('\n');

    // Decide whether to comment or uncomment
    // Uncomment only if ALL non-empty lines appear commented
    const allCommented = lines.length > 0 && lines.every(line => {
      const trimmed = line.trim();
      if (trimmed.length === 0) return true; // Ignore empty lines
      return trimmed.startsWith(startSymbol);
    });

    const newLines = lines.map(line => {
      const trimmedMatch = line.match(/^(\s*)(.*)/);
      if (!trimmedMatch) return line;

      const leadingSpace = trimmedMatch[1];
      const content = trimmedMatch[2];

      if (allCommented) {
        // Uncomment
        if (content.trim().length === 0) return line;

        let newContent = content;
        // Remove start
        if (newContent.startsWith(startSymbol)) {
          newContent = newContent.substring(startSymbol.length);
        }
        // Remove optional spacing
        if (newContent.startsWith(' ')) newContent = newContent.substring(1);

        return leadingSpace + newContent;
      } else {
        // Comment
        if (content.trim().length === 0) return line;
        return leadingSpace + startSymbol + ' ' + content;
      }
    });

    this._applyTextChange(startIndex, endIndex, newLines.join('\n'));
  }

  private _applyTextChange(start: number, end: number, newText: string) {
    const newValue = this.value.substring(0, start) + newText + this.value.substring(end);
      this.value = newValue;

      setTimeout(() => {
        if (this._textarea) {
          this._textarea.selectionStart = start;
          this._textarea.selectionEnd = start + newText.length;
        }
      }, 0);
    this._emitChange();
  }

  private _escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  private _getCommentSymbol(): [string, string] {
    switch (this.language) {
      case 'html': return ['<!--', '-->'];
      case 'css': return ['/*', '*/'];
      case 'python': return ['#', ''];
      default: return ['//', ''];
    }
  }

  private _triggerSuggestions() {
    // Find current word
    const cursor = this._textarea.selectionStart;
    const textBefore = this.value.substring(0, cursor);
    const match = textBefore.match(/[\w-]*$/); // Allow hyphen for css/html
    const currentWord = match ? match[0] : '';

    // Don't trigger if empty or just whitespace
    if (!currentWord.trim()) {
      this._showSuggestions = false;
      return;
    }

    let candidates: string[] = [];

    if (this.language === 'html') {
      candidates = [
        'div', 'span', 'p', 'a', 'button', 'input', 'form', 'label', 'h1', 'h2', 'h3', 'ul', 'li', 'section', 'header', 'footer', 'main', 'nav', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'style', 'script', 'link', 'meta', 'img'
      ];
    } else if (this.language === 'css') {
      candidates = [
        'color', 'background', 'margin', 'padding', 'width', 'height', 'display', 'flex-direction', 'justify-content', 'align-items', 'border', 'border-radius', 'font-size', 'font-family', 'text-align', 'position', 'top', 'left', 'right', 'bottom', 'z-index', 'opacity', 'transition', 'transform', 'box-shadow', 'overflow', 'cursor'
      ];
    } else {
      // JS/TS
      const baseKeywords = ['function', 'const', 'let', 'var', 'import', 'export', 'class', 'return', 'if', 'else', 'for', 'while', 'null', 'true', 'false', 'new', 'this', 'async', 'await', 'try', 'catch'];
      // Extract unique words from document
      const docWords = [...new Set(this.value.match(/\b\w+\b/g) || [])];
      candidates = [...new Set([...baseKeywords, ...docWords])];
    }

    this._suggestions = candidates
      .filter(w => w.startsWith(currentWord) && w !== currentWord)
      .sort();

    if (this._suggestions.length > 0) {
      this._showSuggestions = true;
      this._suggestionIndex = 0;

      // Calculate coordinates
      const lines = textBefore.split('\n');
      const row = lines.length;
      const col = lines[lines.length - 1].length;
      const charWidth = 8.4;
      const lineHeight = 21;
      const scrollTop = this._textarea.scrollTop;
      const scrollLeft = this._textarea.scrollLeft;

      this._suggestionCoords = {
        top: 10 + (row * lineHeight) - scrollTop,
        left: 30 + (col * charWidth) - scrollLeft
      };
    } else {
      this._showSuggestions = false;
    }
    this.requestUpdate();
  }

  private _updateSuggestions() {
    // Re-trigger to filter list
    this._triggerSuggestions();
  }

  private _selectSuggestion(text: string) {
    const cursor = this._textarea.selectionStart;
    const textBefore = this.value.substring(0, cursor);
    const match = textBefore.match(/[\w-]*$/);
    const partial = match ? match[0] : '';

    // We replace the partial word with the full suggestion
    const start = cursor - partial.length;

    const newValue = this.value.substring(0, start) + text + this.value.substring(cursor);
    this.value = newValue;

    this._showSuggestions = false;

    // Move cursor to end of inserted
    this._pendingSelection = {
      start: start + text.length,
      end: start + text.length
    };
    this.requestUpdate();
  }

  private _emitChange() {
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }));
    this.requestUpdate();
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
            @blur=${() => setTimeout(() => this._showSuggestions = false, 200)}
            spellcheck="false"
          ></textarea>
          ${this._showSuggestions ? html`
            <div class="suggestions-popup" style="top: ${this._suggestionCoords.top}px; left: ${this._suggestionCoords.left}px">
                ${this._suggestions.map((s, i) => html`
                    <div class="suggestion-item ${i === this._suggestionIndex ? 'active' : ''}"
                         @mousedown=${(e: Event) => {
                    e.preventDefault(); // Prevent blur
                    this._selectSuggestion(s);
                  }}
                    >
                        ${s}
                    </div>
                `)}
            </div>
          ` : ''}
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