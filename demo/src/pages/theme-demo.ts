
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ThemeService, type Theme } from '@deepverse/zero-ui';
import '@deepverse/zero-ui/theme-provider';
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';

@customElement('theme-demo')
export class ThemeDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    }
    
    .demo-content {
        padding: 16px;
        background: var(--bg-surface, #fff);
        color: var(--text-main, #333);
        border-radius: 8px;
        border: 1px solid var(--card-border, #ddd);
        transition: all 0.3s;
    }
    
    :host-context([data-theme="dark"]) .demo-content {
        /* These should ideally be handled by CSS variables provided by the theme */
        /* But for demonstration, we show how it adapts if vars aren't set globally yet */
    }

    h2 {
      margin: 0;
      color: var(--text-main);
    }
    
    p {
        color: var(--text-muted);
        line-height: 1.6;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    
    .status {
        padding: 12px;
        background: rgba(59, 130, 246, 0.1);
        border-left: 4px solid #3b82f6;
        border-radius: 4px;
        font-family: monospace;
        margin-top: 12px;
    }
  `;

  @state() private _currentTheme: Theme = 'system';
  @state() private _resolvedTheme: 'light' | 'dark' = 'light';

  connectedCallback() {
    super.connectedCallback();
    this._currentTheme = ThemeService.getTheme();
    ThemeService.subscribe(this._handleThemeChange);
    // Force update to get initial resolved state potentially
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ThemeService.unsubscribe(this._handleThemeChange);
  }

  private _handleThemeChange = (theme: Theme, resolved: 'light' | 'dark') => {
    this._currentTheme = theme;
    this._resolvedTheme = resolved;
  };

  private _setTheme(theme: Theme) {
    ThemeService.setTheme(theme);
  }

  render() {
    return html`
      <div class="container">
        <zui-card>
            <h2>Theme System</h2>
            <p>
                The <code>ThemeService</code> manages the application's global theme state, supporting Light, Dark, and System preferences.
                The <code>zui-theme-provider</code> component acts as a controller and visual toggle.
            </p>
            
            <div class="status">
                Current Mode: <strong>${this._currentTheme}</strong><br>
                Resolved: <strong>${this._resolvedTheme}</strong>
            </div>

            <div class="controls">
                <zui-button 
                    variant=${this._currentTheme === 'light' ? 'primary' : 'secondary'}
                    @click=${() => this._setTheme('light')}
                >
                    Light
                </zui-button>
                <zui-button 
                    variant=${this._currentTheme === 'dark' ? 'primary' : 'secondary'}
                    @click=${() => this._setTheme('dark')}
                >
                    Dark
                </zui-button>
                <zui-button 
                    variant=${this._currentTheme === 'system' ? 'primary' : 'secondary'}
                    @click=${() => this._setTheme('system')}
                >
                    System
                </zui-button>
            </div>
        </zui-card>

        <div class="section">
            <h3>Visual Test</h3>
            <p>Components should automatically adapt to the active theme.</p>
            
            <div class="card-grid">
                <zui-card>
                   <h3>Card 1</h3>
                   <p>This is a standard card component.</p>
                   <div style="display: flex; gap: 8px; margin-top: 12px;">
                      <zui-button size="sm">Action</zui-button>
                      <zui-button size="sm" variant="secondary">Cancel</zui-button>
                   </div>
                </zui-card>
                
                <zui-card>
                   <h3>Card 2</h3>
                   <p>This is another card to show grid layout.</p>
                </zui-card>
            </div>
            
            <br>
            <h3>Header Toggle</h3>
            <p>The toggle below is the <code>zui-theme-provider</code> component itself.</p>
            <zui-theme-provider></zui-theme-provider>
        </div>
      </div>
    `;
  }
}
