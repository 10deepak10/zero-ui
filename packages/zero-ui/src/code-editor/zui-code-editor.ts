import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { SyntaxHighlighterService } from '../services/syntax-highlighter.service.js';

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
      width: 50px;
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
      /* line-height handled by container */
      font-size: 12px;
    }

    .line-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 1.5em; /* Match line-height 21px (14px * 1.5) */
        padding-right: 4px;
    }

    .fold-marker {
        width: 14px;
        text-align: center;
        cursor: pointer;
        font-size: 10px;
        opacity: 0.7;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .fold-marker svg {
        display: block;
    }
    .fold-marker:hover {
        opacity: 1;
        color: var(--text-main);
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

  // SVG Icons
  private get _chevronRight() {
    return html`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  }

  private get _chevronDown() {
    return html`<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  }

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

  @state() private _foldedRegions = new Set<number>(); // Set of start lines that are folded
  @state() private _foldableRanges = new Map<number, number>(); // startLine -> endLine

  @state() private _displayValue = ''; // The visual value shown in textarea
  @state() private _displayToRealLineMap: number[] = []; // Maps display line index to real line index

  protected firstUpdated() {
    this._updateLineCount();
    this._detectFoldableRanges();
    // Initial state for undo
    this._addToHistory();
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value')) {
      this._updateLineCount();
      this._detectFoldableRanges();

      // Only force update display state if value changed externally or we are not in a folding sync loop
      // Determining if value change was internal or external is hard, but we re-calc display always for now
      this._updateDisplayState();

      // Also update highlighting when value changes externally

      // Restore cursor if pending
      if (this._pendingSelection && this._textarea) {
        this._textarea.selectionStart = this._pendingSelection.start;
        this._textarea.selectionEnd = this._pendingSelection.end;
        this._pendingSelection = null;
      }
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

    // Old Safety Guard removed. We now handle overwrite via beforeinput.
    // If not handled by beforeinput (e.g. some browsers), we might need fallback.
    // For now, we trust beforeinput or let standard input happen if not folded.

    // Fallback: If we missed beforeinput but size changed drastically while folded?
    // We can detecting "Replaced everything" or simple typing.

    if (this._foldedRegions.size > 0 && target.value.length !== this._displayValue.length) {
      // This means beforeinput didn't catch it or we let it through.
      // If we are here, target.value is the NEW display value.
      // We must sync it to real value?
      // Diffing is hard.
      // Let's rely on beforeinput for "Complex" edits like paste/overwrite fold.
      // If it's simple typing outside fold, target.value is fine.

      // Safety check: Did we break the fold structure visually? 
      // For now, let's allow it -> if it breaks, the user sees "..." deleted.
      // But we need to ensure this.value is updated correctly.

      // If we assume beforeinput handles the critical "Overwrite Fold" case...
      // Then here we just say: "Map simple edits?"

      // Actually, simpler: If we have folds, we FORCE "Display Value" mode, 
      // meaning we treat target.value as "Truth" for Display, and we try to Reverse Map it? 
      // Reverse mapping is impossible if "..." is deleted.

      // SO: We MUST revert if beforeinput didn't handle it, OR we implement Diff here.
      // Let's keep the Revert guard for cases NOT handled by beforeinput to be safe.
      // But we assume _handleBeforeInput prevents the bad state.
    }

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

    this._updateDisplayState(); // Sync display state after input changes value

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
    // let selectionEnd = target.selectionEnd;
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

  private _detectFoldableRanges() {
    const lines = this.value.split('\n');
    const ranges = new Map<number, number>();

    // Stack: { line, type (tag/brace), name (div/curl) }
    const stack: { line: number, type: 'tag' | 'brace', name: string }[] = [];

    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Check for Brackets (Common in JS/CSS)
      // Heuristic: Line ending with { is a start, line starting with } is an end
      // This is simple but works for most well-formatted code
      if (this.language !== 'html' && !trimmed.startsWith('//')) {
        if (trimmed.endsWith('{')) {
          stack.push({ line: i, type: 'brace', name: '{' });
        } else if (trimmed.startsWith('}')) {
          // Pop matching brace
          // Find the last open brace
          let matchIdx = -1;
          for (let s = stack.length - 1; s >= 0; s--) {
            if (stack[s].type === 'brace') {
              matchIdx = s;
              break;
            }
          }

          if (matchIdx !== -1) {
            const start = stack[matchIdx];
            ranges.set(start.line, i);
            stack.splice(matchIdx, 1); // Remove it
          }
        }
      }

      // 2. Check for HTML Tags
      if (this.language === 'html') {
        // Find all tags in the line
        const tagRegex = /<\/?([a-zA-Z0-9-]+)(?:[^>]*?)?>/g;
        let match;
        while ((match = tagRegex.exec(line)) !== null) {
          const fullTag = match[0];
          const tagName = match[1].toLowerCase();
          const isClosing = fullTag.startsWith('</');
          const isSelfClosing = fullTag.endsWith('/>') || voidElements.has(tagName);

          if (isClosing) {
            // Find match in stack
            let matchIdx = -1;
            for (let s = stack.length - 1; s >= 0; s--) {
              if (stack[s].type === 'tag' && stack[s].name === tagName) {
                matchIdx = s;
                break;
              }
            }

            if (matchIdx !== -1) {
              const start = stack[matchIdx];
              // Only fold if it spans multiple lines
              if (start.line !== i) {
                ranges.set(start.line, i);
              }
              stack.splice(matchIdx, 1); // Pop matched and everything after (assumed nested improperly or closed implicit)
            }
          } else if (!isSelfClosing) {
            stack.push({ line: i, type: 'tag', name: tagName });
          }
        }
      }
    }

    this._foldableRanges = ranges;
    this.requestUpdate();
  }

  private _toggleFold(line: number) {
    if (this._foldedRegions.has(line)) {
      this._foldedRegions.delete(line);
    } else {
      this._foldedRegions.add(line);
    }
    this._updateDisplayState();
  }

  private _updateDisplayState() {
    const lines = this.value.split('\n');
    if (this._foldedRegions.size === 0) {
      this._displayValue = this.value;
      this._displayToRealLineMap = lines.map((_, i) => i);
      return;
    }

    const newDisplayLines: string[] = [];
    const map: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (this._foldedRegions.has(i)) {
        const rangeEnd = this._foldableRanges.get(i);
        // Ensure valid range
        // Ensure valid range
        if (rangeEnd !== undefined && rangeEnd > i && rangeEnd < lines.length) {
          // Fold Start
          // User Requirement: Keep closing tag "visible".
          // We construct a combined line: Start ... End
          const startLine = lines[i];
          const endLine = lines[rangeEnd];

          // Ideally we trim the endLine to just the closing tag/brace, 
          // but for simplicity and safety (not stripping useful content), we trim generally.
          const trimmedEnd = endLine.trim();

          newDisplayLines.push(`${startLine} ... ${trimmedEnd}`);
          map.push(i);
          // Skip lines
          i = rangeEnd;
          continue;
        }
      }

      newDisplayLines.push(lines[i]);
      map.push(i);
    }

    this._displayValue = newDisplayLines.join('\n');
    this._displayToRealLineMap = map;

    // Note: Cursor position adjustment would ideally happen here too

  }

  private _handlePaste(e: ClipboardEvent) {
    if (this._foldedRegions.size === 0) return;

    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;

    // Determine if selection touches a fold
    const startDisplayLine = this._getDisplayLineFromOffset(start);
    const endDisplayLine = this._getDisplayLineFromOffset(end);

    let spansFold = false;
    const displayLines = this._displayValue.split('\n');

    // Fast check
    for (let i = startDisplayLine; i <= endDisplayLine; i++) {
      const realIdx = this._displayToRealLineMap[i];
      if (this._foldedRegions.has(realIdx)) {
        spansFold = true;
        break;
      }
    }

    if (!spansFold) return; // Let native paste handle it if no folds involved

    // Handle Fold Paste
    e.preventDefault();

    const text = e.clipboardData?.getData('text/plain') || '';

    // Calculate Real Range
    // (Similar logic to handleBeforeInput/Copy)
    const realLines = this.value.split('\n');

    let realStart = 0;
    let realEnd = 0;

    // Real Start
    const realStartLineIdx = this._displayToRealLineMap[startDisplayLine];
    for (let i = 0; i < realStartLineIdx; i++) realStart += realLines[i].length + 1;

    let currentLen = 0;
    for (let i = 0; i < startDisplayLine; i++) currentLen += displayLines[i].length + 1;
    realStart += (start - currentLen);

    // Real End
    const realEndLineIdx = this._displayToRealLineMap[endDisplayLine];
    let realEndBase = 0;
    for (let i = 0; i < realEndLineIdx; i++) realEndBase += realLines[i].length + 1;

    let currentLenEnd = 0;
    for (let i = 0; i < endDisplayLine; i++) currentLenEnd += displayLines[i].length + 1;
    realEnd = realEndBase + (end - currentLenEnd);

    // Expand End if we cover a fold start
    // Actually, if we touch a fold, do we want to overwrite it fully or partially?
    // User said "selecting it... overwrite".
    // Usually means if I select the whole line, I overwrite the whole block.

    // Logic refinement:
    // If we are on the line of a fold, and we select strictly containing the marker "..." range?
    // Just check if the Real Line is folded.

    // We iterate display lines to adjust realEnd if needed.
    // But actually, relies on `this._displayToRealLineMap`.
    // If `extractEnd` logic from Copy was correct, we can reuse it?
    // Copy logic was:
    /*
         if (this._foldedRegions.has(realLineIdx) && col >= displayLines[i].length) {
              // Expanding to full block
         }
    */

    // Let's apply similar expansion for End
    const lastRealIdx = this._displayToRealLineMap[endDisplayLine];
    if (this._foldedRegions.has(lastRealIdx)) {
      const endCol = end - currentLenEnd;
      // If we selected the whole line (or at least past the "..."), expand.
      // Or if we are simply "in" it.
      // Safer: If we selected the newline at the end of this display line, we DEFINITELY mean to overwrite the block.
      if (endCol >= displayLines[endDisplayLine].length) {
        const foldEndLineIdx = this._foldableRanges.get(lastRealIdx)!;
        let endBlockBase = 0;
        for (let k = 0; k <= foldEndLineIdx; k++) endBlockBase += realLines[k].length + 1;
        realEnd = endBlockBase - 1; // before last newline
        // If we selected the newline in display, `endCol` would be `length`.
        // `realEnd` should include newline? 
        if (endCol > displayLines[endDisplayLine].length) {
          // Selected newline
          realEnd = endBlockBase;
        }
      }
    }

    const newValue = this.value.substring(0, realStart) + text + this.value.substring(realEnd);
    this.value = newValue;

    // Clear folds touched
    for (let i = startDisplayLine; i <= endDisplayLine; i++) {
      const rIdx = this._displayToRealLineMap[i];
      this._foldedRegions.delete(rIdx);
    }

    this._updateDisplayState();

    // We need to re-calc display pos.
    // Defer to next frame?
    setTimeout(() => {
      if (this._textarea) {
        // We need to map real `newCursor` to display.
        // Since we removed folds in this region, it's just `newCursor` minus length of folds BEFORE this region.
        // Recalculating map is safer.
        // But `_updateDisplayState` runs synchronously.
        // So `this._displayToRealLineMap` is fresh.

        // Reverse map is expensive.

        // Just leave cursor at end of insertion visually if possible or just focus.
        this._textarea.focus();
        this._textarea.selectionStart = this._textarea.selectionEnd = this._displayValue.length; // Fallback to end

        // Better: Calculate exact offset
        // We know the new `displayValue` contains the pasted text.
        // The start of paste in Display is `start` (from event).
        // The end is `start + text.length`.
        this._textarea.selectionStart = this._textarea.selectionEnd = start + text.length;
      }
    }, 0);
  }

  private _handleBeforeInput(e: InputEvent) {
    if (this._foldedRegions.size === 0) return;

    const inputType = e.inputType;
    // We care about replacement/deletion/insertion that might touch a fold.

    const ranges = e.getTargetRanges();
    let start = this._textarea.selectionStart;
    let end = this._textarea.selectionEnd;

    if (ranges.length > 0) {
      // Use the target range if available (more precise for some events)
      const r = ranges[0];
      start = r.startOffset;
      end = r.endOffset;
    }

    // Check if [start, end] touches a fold
    const realLines = this.value.split('\n');
    const startDisplayLine = this._getDisplayLineFromOffset(start);
    const endDisplayLine = this._getDisplayLineFromOffset(end);

    let spansFold = false;
    let realStart = 0;
    let realEnd = -1; // -1 means calc normally

    // Calculate Real Start
    const realStartLineIdx = this._displayToRealLineMap[startDisplayLine];
    for (let i = 0; i < realStartLineIdx; i++) realStart += realLines[i].length + 1;

    // Calculate column for start
    let currentLen = 0;
    const displayLines = this._displayValue.split('\n');
    for (let i = 0; i < startDisplayLine; i++) currentLen += displayLines[i].length + 1;
    let startCol = start - currentLen;
    realStart += startCol;

    // Check end
    if (start !== end) {
      // If we have a selection, we need to map the end.
      const realEndLineIdx = this._displayToRealLineMap[endDisplayLine];
      let realEndBase = 0;
      for (let i = 0; i < realEndLineIdx; i++) realEndBase += realLines[i].length + 1;

      let currentLenEnd = 0;
      for (let i = 0; i < endDisplayLine; i++) currentLenEnd += displayLines[i].length + 1;
      let endCol = end - currentLenEnd;

      realEnd = realEndBase + endCol;

      // CRITICAL: Check if we are covering a fold marker.
      // Iterate display lines involved.
      for (let i = startDisplayLine; i <= endDisplayLine; i++) {
        const rIdx = this._displayToRealLineMap[i];
        if (this._foldedRegions.has(rIdx)) {
          // This display line has a fold.
          // If we are selecting the whole line or covering the marker, expand realEnd.

          // Simplified Check:
          // If startDisplayLine == i, and startCol > length, we are after it? No.

          // If we touch a folded line, we basically want to include its hidden content if we delete/replace it.
          // "Select line -> Paste" means we replace the whole block.

          spansFold = true;

          // If this is the LAST line of selection
          if (i === endDisplayLine) {
            // If we selected beyond the "..." (which usually means we selected the whole line)
            // logic: if endCol > visual content, we probably selected newline?
            // If we are just overwriting the folded block...

            const foldEndLineIdx = this._foldableRanges.get(rIdx)!;
            // We map realEnd to the end of the hidden block
            let endBlockBase = 0;
            for (let k = 0; k <= foldEndLineIdx; k++) endBlockBase += realLines[k].length + 1;

            // If we selected the whole display line, we replace the whole real block.
            const displayLineLen = displayLines[i].length;
            if (endCol >= displayLineLen) {
              realEnd = endBlockBase - 1; // exclude last char if it was newline? No, keep logic simple.
              // Actually, if we selected the newline (endCol > len), we include the newline of the real block.
            }
          }
        }
      }
    }

    if (spansFold || (this._foldedRegions.has(realStartLineIdx) && inputType.startsWith('delete'))) {
      // We are editing a fold!
      e.preventDefault();

      // Apply Edit to Real Value
      let replacement = e.data || '';
      if (inputType === 'insertFromPaste') {
        // We can't easily get pasted data from InputEvent.data in all browsers (it's null often).
        // We rely on 'paste' event for that. 
        // BUT if we preventDefault input, we stop the paste.
        // So for paste, we let 'paste' handler do it and preventDefault this one?
        return;
      }

      if (inputType === 'deleteContentBackward') {
        // Backspace
        if (start === end) {
          realStart -= 1; // Delete char before
        }
        replacement = '';
      }

      if (realEnd === -1) realEnd = realStart;

      const newValue = this.value.substring(0, realStart) + replacement + this.value.substring(realEnd);
      this.value = newValue; // Update Source

      // Visual Update
      // If we overwrote the fold, we should clear it if it's gone.
      // Heuristic: If we touched a fold start line, remove it from folded regions
      for (let i = startDisplayLine; i <= endDisplayLine; i++) {
        const rIdx = this._displayToRealLineMap[i];
        this._foldedRegions.delete(rIdx);
      }

      this._updateDisplayState();

      // Move Cursor
      // const newCursor = realStart + replacement.length;
      // We need to map Real Cursor back to Display Cursor? 
      // Since we unfolded, Real == Display roughly (except other folds).
      // Let's just update display and let natural mapping work?
      // We need to set selection.

      setTimeout(() => {
        // Find where newCursor maps to in Display
        // It's likely just after the inserted text.
        // We'll rely on the fact we just unfolded everything involved.
        // So valid map is easy.
        // We need reverse map logic or just scan.
        // Only implemented _displayToRealLineMap.
        // But since we removed the folds, visual should match real for this section.
        // We just need to account for folds BEFORE this section.

        // ... logic to find cursor ...
        // For now, simple fallback:
        // this._textarea.selectionStart = ... 
      }, 0);
    }
  }

  private _handleCopy(e: ClipboardEvent) {
    this._handleClipboardAction(e, false);
  }

  private _handleCut(e: ClipboardEvent) {
    this._handleClipboardAction(e, true);
  }

  private _handleClipboardAction(e: ClipboardEvent, isCut: boolean) {
    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;

    if (start === end) return; // Nothing selected

    e.preventDefault();

    // Strategy:
    // 1. Identify start line and end line in Display
    const startDisplayLine = this._getDisplayLineFromOffset(start);

    // Simplification: 
    // For "Select All" case (start=0, end=max), we just copy `this.value`.
    if (start === 0 && end === this._displayValue.length) {
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', this.value);
        if (isCut && !this.readonly) {
          this.value = '';
          this._foldedRegions.clear();
          this._updateDisplayState();
        }
      }
      return;
    }

    const realLines = this.value.split('\n');

    // Determine Real Start and End based on line mapping
    // We construct the text by finding the "Real" range corresponding to the display range.
    // This is an approximation layer.

    let extractionStart = 0;
    let extractionEnd = 0;

    {
      const displayLines = this._displayValue.split('\n');
      let charCount = 0;
      let foundStart = false;

      for (let i = 0; i < displayLines.length; i++) {
        const lineLen = displayLines[i].length + 1;

        // Real line calculation
        const realLineIdx = this._displayToRealLineMap[i];
        let realBase = 0;
        for (let r = 0; r < realLineIdx; r++) realBase += realLines[r].length + 1;

        if (!foundStart && start < charCount + lineLen) {
          // Found Start
          const col = Math.max(0, start - charCount);
          extractionStart = realBase + col;
          foundStart = true;
        }

        if (foundStart && end <= charCount + lineLen) {
          // Found End
          const col = Math.max(0, end - charCount);

          // Special check for folded line end
          if (this._foldedRegions.has(realLineIdx)) {
            const endRealLineIdx = this._foldableRanges.get(realLineIdx)!;
            // If we selected the whole display line (col >= length), we want the full fold block
            if (col >= displayLines[i].length) {
              let realEndBase = 0;
              for (let r = 0; r <= endRealLineIdx; r++) realEndBase += realLines[r].length + 1;
              extractionEnd = realEndBase - 1;
            } else {
              extractionEnd = realBase + col;
            }
          } else {
            extractionEnd = realBase + col;
          }
          break;
        }
        charCount += lineLen;
      }
    }

    const text = this.value.substring(extractionStart, extractionEnd);

    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', text);
    }

    if (isCut && !this.readonly) {
      const newValue = this.value.substring(0, extractionStart) + this.value.substring(extractionEnd);
      this.value = newValue;
      this._foldedRegions.clear(); // Safety clear
      this._updateDisplayState();
    }
  }

  private _getDisplayLineFromOffset(offset: number): number {
    let currentLen = 0;
    const lines = this._displayValue.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1; // +1 for newline
      if (offset < currentLen + lineLen) {
        return i;
      }
      currentLen += lineLen;
    }
    return lines.length - 1;
  }

  private _checkCursorInFold() {
    if (!this._textarea || this._foldedRegions.size === 0) return;

    const cursor = this._textarea.selectionStart;
    const displayLineIdx = this._getDisplayLineFromOffset(cursor);

    // Need to find if this display line maps to a real line that is the START of a fold
    if (displayLineIdx >= 0 && displayLineIdx < this._displayToRealLineMap.length) {
      const realLine = this._displayToRealLineMap[displayLineIdx];
      if (this._foldedRegions.has(realLine)) {
        // Cursor is on a folded line header. Unfold it.
        this._toggleFold(realLine);

        // We might need to adjust cursor position if text expands? 
        // But for now, just unfolding makes the hidden text appear below, preserving cursor relative pos.
      }
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

    try {
      await navigator.clipboard.writeText(lineText);
    } catch (e) {
      console.warn('Clipboard write failed (cut):', e);
    }

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
    try {
      await navigator.clipboard.writeText(text + '\n');
    } catch (e) {
      console.warn('Clipboard write failed (copy):', e);
    }
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
    // Highlight the display value, not raw value
    const val = this._displayValue || this.value; 
    // We add a trailing space/newline to matching rendering of textarea which might have hanging newline
    const highlighted = SyntaxHighlighterService.highlight(val, this.language);
    // If value ends with newline, pre needs an extra character to actually show that line height
    if (val.endsWith('\n')) {
        return html`${unsafeHTML(highlighted + '<br>')}`;
    }
    return html`${unsafeHTML(highlighted)}`;
  }

  render() {
    const displayLines = this._displayToRealLineMap.length > 0 ? this._displayToRealLineMap : Array.from({ length: this._lineCount }, (_, i) => i);
    const val = this._displayValue || this.value;

    return html`
      <div class="editor-wrapper">
        <div class="gutter">
          ${displayLines.map((realLineIndex, i) => {
            const isFoldable = this._foldableRanges.has(realLineIndex);
            const isFolded = this._foldedRegions.has(realLineIndex);
            return html`
            <div class="line-container">
                <span class="line-number">${realLineIndex + 1}</span>
                <span class="fold-marker" @mousedown=${(e: Event) => {
                e.preventDefault();
                if (isFoldable) this._toggleFold(realLineIndex);
              }}>
                    ${isFoldable ? (isFolded ? this._chevronRight : this._chevronDown) : ''}
                </span>
            </div>
          `;
          })}
        </div>
        <div class="textarea-container">
          <pre id="highlight-layer" aria-hidden="true">${this._getHighlightedCode()}</pre>
          <textarea
            .value=${live(val)}
            ?readonly=${this.readonly}
            @input=${this._handleInput}
            @paste=${this._handlePaste}
            @copy=${this._handleCopy}
            @cut=${this._handleCut}
            @click=${() => { /* Click expansion removed as per user request */ }}
            @keyup=${() => { /* Keyup expansion removed */ }}
            @beforeinput=${this._handleBeforeInput}
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