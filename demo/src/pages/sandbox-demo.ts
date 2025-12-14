import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LoggerService, FormatterService, EventBusService } from '@deepverse/zero-ui';
import '@deepverse/zero-ui/logger';
import '@deepverse/zero-ui/event-bus';
import '@deepverse/zero-ui/split';
import '@deepverse/zero-ui/toggle';
import '@deepverse/zero-ui/code-editor';
import '@deepverse/zero-ui/tabs';

const DEFAULT_HTML = '<h1>Hello Sandbox</h1>\n<p>Start editing to see changes!</p>\n<button id="btn">Click Me</button>';
const DEFAULT_CSS = 'body {\n  font-family: sans-serif;\n  padding: 20px;\n}\n\nh1 {\n  color: #3b82f6;\n}\n\nbutton {\n  padding: 8px 16px;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}';
const DEFAULT_JS = 'document.getElementById("btn").addEventListener("click", () => {\n  console.log("Button clicked at " + new Date().toLocaleTimeString());\n  EventBus.emit("user:click", { btnId: "btn", time: Date.now() });\n});\n\nconsole.info("Sandbox initialized");\nEventBus.emit("sandbox:init", { ready: true });';

@customElement('sandbox-demo')
export class SandboxDemo extends LitElement {
  static styles = css`
    :host {
      * {
        box-sizing: border-box;
      }

      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
      /* box-sizing: border-box; redundant with * rule but kept for host */
      box-sizing: border-box; 
      gap: 16px;
      color: var(--text-main);
      --sandbox-border: var(--card-border, rgba(255, 255, 255, 0.1));
      --sandbox-bg: var(--sandbox-bg, #1e1e1e);
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .container {
      display: block; // Flex handled by split
      flex: 1;
      min-height: 0;
      border: 1px solid var(--sandbox-border);
      border-radius: 12px;
      overflow: hidden;
      overflow: hidden;
      overflow: hidden;
      background: var(--sandbox-bg, var(--card-bg));
    }

    /* Common Section Styles */
    .section {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--sandbox-bg);
    }
    
    .section-header {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        background: var(--sandbox-header-bg, var(--bg-muted));
        border-bottom: 1px solid var(--sandbox-border);
        font-size: 0.8rem;
        font-family: 'Monaco', 'Menlo', monospace;
        font-weight: 600;
        font-weight: 600;
        color: var(--sandbox-header-text, #94a3b8);
        letter-spacing: 0.05em;
        flex-shrink: 0;
        /* Default accent */
        border-left: 3px solid transparent; 
    }
    
    .section-header.html { border-left-color: #e44d26; }
    .section-header.css { border-left-color: #2965f1; }
    .section-header.js { border-left-color: #f0db4f; }
    .section-header.preview { border-left-color: #3b82f6; }

    .editors {
      display: block;
      height: 100%;
      overflow: hidden; /* Split handles scrolling inside panes */
    }

    .editor-group {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      /* Border handled by split gutter now */
    }
    
    .editor-group:last-child {
        border-bottom: none;
    }

    /* Remove individual editor borders as the group handles it */
    zui-code-editor {
        border: none;
        border-radius: 0;
        height: 100%;
    }

    .preview {
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%; 
    }
    
    .preview-iframe-wrapper {
        flex: 1;
        background: white;
        position: relative;
    }

    /* Prevent iframe from stealing mouse events during resize */
    zui-split[resizing] iframe {
      pointer-events: none;
    }

    iframe {
      border: none;
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Controls in header */
    .controls {
        display: flex;
        gap: 8px; 
        align-items: center;
        white-space: nowrap;
    }
    
    .controls zui-toggle {
        font-size: 0.8rem;
        margin-right: 8px;
    }

    .run-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
      transition: background 0.2s;
    }

    .run-btn:hover {
      background: #2563eb;
    }
    
    .run-btn:disabled {
      background: #334155;
      color: #94a3b8;
      cursor: not-allowed;
    }

    .reset-btn {
      background: transparent;
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .reset-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border-color: #ef4444;
    }

    .action-btn {
      background: transparent;
      border: 1px solid var(--sandbox-border);
      color: #94a3b8;
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    
    /* Tabs Integration */
    zui-tabs {
       height: 100%;
       display: flex;
       display: flex;
       flex-direction: column;
       --card-border: var(--sandbox-border);
       background: var(--sandbox-bg, var(--card-bg));
    }

    zui-tabs::part(tabs-header) {
      margin-bottom: 0;
        border-bottom: 1px solid var(--sandbox-border);
        background: var(--sandbox-header-bg, var(--bg-muted));
    }
    
    /* Unified Tab Style matching Section Headers */
    zui-tabs::part(tabs-content) {
      flex: 1;
      overflow: hidden;
    }

    /* Custom premium tab styles */
    zui-tab {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 48px; /* Match section header height */
      padding: 0 24px;
      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 600;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--sandbox-tab-text, #64748b);
      position: relative;
      background: transparent;
      user-select: none;
      border-bottom: 2px solid transparent;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    zui-tab:hover {
      color: var(--sandbox-tab-hover, #cbd5e1);
      background: var(--bg-hover, rgba(255, 255, 255, 0.02));
    }
    
    zui-tab[active] {
       color: var(--zui-primary, #60a5fa);
       background: rgba(59, 130, 246, 0.05);
       border-bottom-color: var(--zui-primary, #60a5fa);
    }
    
    zui-tab-panel {
      height: 100%;
      padding: 0;
    }
  `;

  @state() private _html = DEFAULT_HTML;
  @state() private _css = DEFAULT_CSS;
  @state() private _js = DEFAULT_JS;

  // Active state (what is currently running)
  @state() private _activeHtml = '';
  @state() private _activeCss = '';
  @state() private _activeJs = '';

  @state() private _liveReload = true;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('message', this._handleMessage);
    // Init active state
    this._runCode();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('message', this._handleMessage);
  }

  private _handleInput(type: 'html' | 'css' | 'js', value: string) {
    if (type === 'html') this._html = value;
    if (type === 'css') this._css = value;
    if (type === 'js') this._js = value;

    if (this._liveReload) {
      this._runCode();
    }
  }

  private _runCode() {
    this._activeHtml = this._html;
    this._activeCss = this._css;
    this._activeJs = this._js;
  }
  
  private _resetCode() {
    this._html = DEFAULT_HTML;
    this._css = DEFAULT_CSS;
    this._js = DEFAULT_JS;
    this._runCode();
  }

  private _toggleLiveReload(e: CustomEvent) {
    this._liveReload = e.detail.checked;
    if (this._liveReload) {
      this._runCode();
    }
  }

  private _handleMessage = (e: MessageEvent) => {
    if (!e.data) return;

    if (e.data.type === 'sandbox-log') {
      const { level, args } = e.data;
      const message = args.join(' ');
      
      switch (level) {
        case 'log': LoggerService.info(message, 'Sandbox'); break;
        case 'info': LoggerService.info(message, 'Sandbox'); break;
        case 'warn': LoggerService.warn(message, 'Sandbox'); break;
        case 'error': LoggerService.error(message, 'Sandbox'); break;
        default: LoggerService.debug(message, 'Sandbox');
      }
    }

    if (e.data.type === 'sandbox-event') {
      const { name, data } = e.data;
      EventBusService.emit(name, data, 'Sandbox');
    }
  };

  private get _srcDoc() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${this._activeCss}</style>
          <script>
            (function() {
              const originalLog = console.log;
              const originalInfo = console.info;
              const originalWarn = console.warn;
              const originalError = console.error;
              
              function sendLog(level, args) {
                try {
                  // serialize args to string to avoid clone errors
                  const safeArgs = args.map(arg => {
                    if (typeof arg === 'object') {
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }
                    return String(arg);
                  });
                  window.parent.postMessage({ type: 'sandbox-log', level, args: safeArgs }, '*');
                } catch (e) {
                  originalError.call(console, 'Failed to send log to parent', e);
                }
              }

              console.log = (...args) => { originalLog.apply(console, args); sendLog('log', args); };
              console.info = (...args) => { originalInfo.apply(console, args); sendLog('info', args); };
              console.warn = (...args) => { originalWarn.apply(console, args); sendLog('warn', args); };
              console.error = (...args) => { originalError.apply(console, args); sendLog('error', args); };
              
              window.onerror = function(msg, url, line, col, error) {
                // Route global errors (including SyntaxErrors) to our logger
                // msg is usually the error string
                sendLog('error', [msg]);
                return false; // Let it bubble to browser console too if needed, or true to suppress
              };
              
              const EventBus = {
                emit: (name, data) => {
                    window.parent.postMessage({ type: 'sandbox-event', name, data }, '*');
                }
              };
              window.EventBus = EventBus;
            })();
          </script>
        </head>
        <body>
          ${this._activeHtml}
          <script>
            ${this._activeJs}
          </script>
        </body>
      </html>
    `;
  }

  render() {
    return html`
      <div class="container">
        <zui-split direction="horizontal" initialSplit="50%">
          
          <!-- Code Editors Pane -->
          <div class="editors" slot="one">

            <zui-split direction="vertical" initialSplit="33%">
                <div class="editor-group" slot="one">
                  <div class="section-header html">
                    <span>HTML</span>
                    <button class="action-btn" @click=${() => this._handleInput('html', FormatterService.formatHtml(this._html))}>Format</button>
                  </div>
                  <zui-code-editor
                    .value=${this._html}
                    language="html"
                    @change=${(e: CustomEvent) => this._handleInput('html', e.detail.value)}
                  ></zui-code-editor>
                </div>

                <div slot="two" style="height: 100%">
                    <zui-split direction="vertical" initialSplit="50%">
                        <div class="editor-group" slot="one">
                          <div class="section-header css">
                            <span>CSS</span>
                            <button class="action-btn" @click=${() => this._handleInput('css', FormatterService.formatCss(this._css))}>Format</button>
                          </div>
                          <zui-code-editor
                            .value=${this._css}
                            language="css"
                            @change=${(e: CustomEvent) => this._handleInput('css', e.detail.value)}
                          ></zui-code-editor>
                        </div>
        
                        <div class="editor-group" slot="two">
                          <div class="section-header js">
                            <span>JavaScript</span>
                            <button class="action-btn" @click=${() => this._handleInput('js', FormatterService.formatJs(this._js))}>Format</button>
                          </div>
                          <zui-code-editor
                            .value=${this._js}
                            language="javascript"
                            @change=${(e: CustomEvent) => this._handleInput('js', e.detail.value)}
                          ></zui-code-editor>
                        </div>
                    </zui-split>
                </div>
            </zui-split>
            
          </div>

          <!-- Preview & Logs Pane -->
          <div class="preview" slot="two">
            <zui-split direction="vertical" initialSplit="70%">
              
              <div class="section" slot="one">
                <div class="section-header">
                  <span>Preview</span>
                  <div class="controls">
                    <zui-toggle 
                      ?checked=${this._liveReload}
                      @change=${this._toggleLiveReload}
                      label="Auto-Run"
                    ></zui-toggle>
                    <button class="reset-btn" @click=${this._resetCode}>Reset</button>
                    <button 
                      class="run-btn" 
                      @click=${this._runCode}
                      ?disabled=${this._liveReload}
                      title=${this._liveReload ? 'Auto-Run is enabled' : 'Run code'}
                    >Run</button>
                  </div>
                </div>
                <div class="preview-iframe-wrapper">
                     <iframe .srcdoc=${this._srcDoc} sandbox="allow-scripts allow-modals"></iframe>
                </div>
              </div>

              <div class="section" slot="two">
                <zui-tabs style="flex: 1; display: flex; flex-direction: column;">
                    <zui-tab slot="tabs">Console</zui-tab>
                    <zui-tab slot="tabs">Events</zui-tab>
                    
                    <zui-tab-panel slot="panels">
                         <zui-logger style="height: 100%; border: none; --logger-radius: 0; --logger-border: none; --bg-muted: var(--sandbox-header-bg, var(--bg-muted));"></zui-logger>
                    </zui-tab-panel>
                    <zui-tab-panel slot="panels">
                        <zui-event-bus style="height: 100%; border: none; --event-bus-radius: 0; --event-bus-border: none; --bg-muted: var(--sandbox-header-bg, var(--bg-muted));"></zui-event-bus>
                    </zui-tab-panel>
                </zui-tabs>
              </div>

            </zui-split>
          </div>

        </zui-split>
      </div>
    `;
  }
}
