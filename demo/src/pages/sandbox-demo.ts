import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LoggerService, FormatterService } from '@deepverse/zero-ui';
import '@deepverse/zero-ui/logger';
import '@deepverse/zero-ui/split';
import '@deepverse/zero-ui/toggle';
import '@deepverse/zero-ui/code-editor';

const DEFAULT_HTML = '<h1>Hello Sandbox</h1>\n<p>Start editing to see changes!</p>\n<button id="btn">Click Me</button>';
const DEFAULT_CSS = 'body {\n  font-family: sans-serif;\n  padding: 20px;\n}\n\nh1 {\n  color: #3b82f6;\n}\n\nbutton {\n  padding: 8px 16px;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}';
const DEFAULT_JS = 'document.getElementById("btn").addEventListener("click", () => {\n  console.log("Button clicked at " + new Date().toLocaleTimeString());\n});\n\nconsole.info("Sandbox initialized");\nconsole.warn("This is a warning example");';

@customElement('sandbox-demo')
export class SandboxDemo extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
      box-sizing: border-box;
      gap: 16px;
      color: var(--text-main);
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .container {
      display: block;
      flex: 1;
      min-height: 0;
      /* Remove grid styles as we use zui-split now */
    }

    .editors {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      padding-right: 8px;
    }

    .editor-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    label {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-muted);
    }



    .preview {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%; /* Ensure it fills the split pane */
    }

    /* Prevent iframe from stealing mouse events during resize */
    zui-split[resizing] iframe {
      pointer-events: none;
    }

    .preview-header {
      background: #f1f5f9;
      padding: 8px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #475569;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    iframe {
      flex: 1;
      border: none;
      width: 100%;
      height: 100%;
      background: white;
    }

    .run-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .run-btn:hover {
      background: #2563eb;
    }
    
    .run-btn:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .reset-btn {
      background: transparent;
      color: #ef4444;
      border: 1px solid #ef4444;
      padding: 5px 11px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .reset-btn:hover {
      background: #ef4444;
      color: white;
    }

    .action-btn {
      background: transparent;
      border: 1px solid var(--card-border, #e2e8f0);
      color: var(--text-muted, #94a3b8);
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--card-border, #e2e8f0);
      color: var(--text-main, #334155);
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
    if (e.data && e.data.type === 'sandbox-log') {
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
      <h2>HTML/CSS/JS Sandbox</h2>
      
      <div class="container">
        <zui-split direction="horizontal" initialSplit="50%">
          
            <!-- Code Editors Pane -->
          <div class="editors" slot="one">
            <div class="editor-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label>HTML</label>
                <button class="action-btn" @click=${() => this._handleInput('html', FormatterService.formatHtml(this._html))}>Format</button>
              </div>
              <zui-code-editor
                .value=${this._html}
                language="html"
                @change=${(e: CustomEvent) => this._handleInput('html', e.detail.value)}
              ></zui-code-editor>
            </div>

            <div class="editor-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label>CSS</label>
                <button class="action-btn" @click=${() => this._handleInput('css', FormatterService.formatCss(this._css))}>Format</button>
              </div>
              <zui-code-editor
                .value=${this._css}
                language="css"
                @change=${(e: CustomEvent) => this._handleInput('css', e.detail.value)}
              ></zui-code-editor>
            </div>

            <div class="editor-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label>JavaScript</label>
                <button class="action-btn" @click=${() => this._handleInput('js', FormatterService.formatJs(this._js))}>Format</button>
              </div>
              <zui-code-editor
                .value=${this._js}
                language="javascript"
                @change=${(e: CustomEvent) => this._handleInput('js', e.detail.value)}
              ></zui-code-editor>
            </div>
          </div>

          <!-- Preview & Logs Pane -->
          <div class="preview" slot="two">
            <zui-split direction="vertical" initialSplit="70%">
              
              <div class="preview-content" slot="one" style="height: 100%; display: flex; flex-direction: column;">
                <div class="preview-header">
                  Preview
                  <div style="display: flex; gap: 12px; align-items: center;">
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
                <iframe .srcdoc=${this._srcDoc} sandbox="allow-scripts allow-modals"></iframe>
              </div>

              <div class="logs-content" slot="two" style="height: 100%;">
                <zui-logger style="--logger-bg: #1e293b; height: 100%; border: none; border-top: 1px solid var(--card-border);"></zui-logger>
              </div>

            </zui-split>
          </div>

        </zui-split>
      </div>
    `;
  }
}
