import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './pages/intro-page';
import './pages/button-demo';
import './pages/card-demo';
import './pages/file-upload-demo';
import './pages/otp-input-demo';
import './pages/phone-input-demo';
import './pages/star-rating-demo';
import './pages/select-demo';
import './pages/dropdown-demo';
import './pages/checkbox-demo';
import './pages/radio-group-demo';
import './pages/toggle-demo';
import './pages/slider-demo';
import './pages/os-check-demo';
import './pages/browser-check-demo';
import './pages/screen-check-demo';
import './pages/storage-check-demo';
import './pages/gpu-check-demo';
import './pages/network-check-demo';
import './pages/battery-check-demo';
import './pages/camera-check-demo';
import './pages/placeholder-demo';
import './pages/sandbox-demo';
import './pages/split-demo';

@customElement('demo-app')
export class DemoApp extends LitElement {
  @state() private _route = window.location.pathname;
  @state() private _theme: 'dark' | 'light' = 'dark';

  static styles = css`
    :host {
      --bg-body: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1e 100%);
      --text-main: #fff;
      --text-muted: #8b9dc3;
      --glass-bg: rgba(255, 255, 255, 0.04);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      --card-bg: rgba(255, 255, 255, 0.02);
      --card-border: rgba(255, 255, 255, 0.05);
      --sidebar-bg: rgba(255, 255, 255, 0.04);
      --sidebar-border: rgba(255, 255, 255, 0.08);
      --link-hover-bg: rgba(255, 255, 255, 0.08);
      --link-active-bg: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3));
      --brand-bg: rgba(255, 255, 255, 0.06);
      --bg-muted: rgba(255, 255, 255, 0.03);
      --bg-hover: rgba(255, 255, 255, 0.05);

      display: flex;
      height: 100vh;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: var(--text-main);
      background: var(--bg-body);
      transition: background 0.3s ease, color 0.3s ease;
      --gradient-text: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      
      /* Code Editor Syntax (Dark) */
      --code-comment: #6a9955;
      --code-string: #ce9178;
      --code-keyword: #569cd6;
      --code-number: #b5cea8;
      --code-tag: #569cd6;
      --code-attribute: #9cdcfe;
      --code-operator: #d4d4d4;
      --code-default: #d4d4d4;
      --code-default: #d4d4d4;
      --zui-input-bg: rgba(0, 0, 0, 0.2);

      /* Terminal/Sandbox (Dark Mode specific) */
      --logger-bg: #0f172a;
      --logger-border: #1e293b;
      --sandbox-bg: #0f172a;
      --sandbox-header-bg: #1e293b;
      --event-bus-bg: #0f172a;
      --event-bus-border: #1e293b;
      
      /* Sandbox Text Restored (Slate defaults) */
      --sandbox-header-text: #94a3b8;
      --sandbox-tab-text: #cbd5e1;
      --sandbox-tab-hover: #f1f5f9;
    }

    :host([theme="light"]) {
      --bg-body: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%); /* Slightly cooler/crisper grey-blue */
      --text-main: #102a43;
      --text-muted: #486581;
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(0, 0, 0, 0.08);
      --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --card-bg: #ffffff;
      --card-border: rgba(0, 0, 0, 0.1); /* Darker border for contrast against light body */
      --sidebar-bg: rgba(255, 255, 255, 0.85); /* More opaque */
      --sidebar-border: rgba(0, 0, 0, 0.1);
      --link-hover-bg: rgba(16, 42, 67, 0.05); /* darker hover tint */
      --link-active-bg: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15));
      --brand-bg: rgba(255, 255, 255, 0.8);
      --bg-muted: #f3f4f6;
      --bg-hover: #e5e7eb;
      --gradient-text: linear-gradient(135deg, #102a43 0%, #6366f1 100%);
      
      /* Code Editor Syntax (Light) */
      --code-comment: #008000;
      --code-string: #a31515;
      --code-keyword: #0000ff;
      --code-number: #098658;
      --code-tag: #800000;
      --code-attribute: #ff0000;
      --code-operator: #333333;
      --code-default: #111111;
      --code-default: #111111;
      --zui-input-bg: #f9fafb;

      /* Terminal/Sandbox (Light Mode specific) */
      --logger-bg: #ffffff;
      --logger-border: #e2e8f0;
      --sandbox-bg: #ffffff;
      --sandbox-header-bg: #f1f5f9;
      --event-bus-bg: #ffffff;
      --event-bus-bg: #ffffff;
      --event-bus-border: #e2e8f0;
      
      /* Sandbox Text (Light Mode High Contrast) */
      --sandbox-header-text: #475569;
      --sandbox-tab-text: #64748b;
      --sandbox-tab-hover: #1e293b;
    }

    :host([theme="light"]) .brand-logo-img {
      filter: brightness(0);
      opacity: 1;
    }

    aside {
      width: 280px;
      backdrop-filter: blur(25px);
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: 4px 0 30px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .brand {
      padding: 24px 24px 12px;
      display: flex;
      align-items: center;
    }

    .brand-logo-img {
      width: 42px;
      height: 42px;
      object-fit: contain;
    }

    .brand-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main);
      font-family: system-ui, -apple-system, sans-serif;
      opacity: 0.9;
    }

    /* Apply gradient only to the logo icon */
    .brand .logo {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #3b82f6, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    nav {
      flex: 1;
      overflow-y: auto;
      padding: 0 16px 24px;
    }

    .nav-group {
      margin-bottom: 24px;
    }

    .nav-header {
      font-size: 0.7rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 700;
      padding: 0 12px;
      margin-bottom: 8px;
      opacity: 0.6;
      letter-spacing: 0.05em;
    }

    a {
      display: block;
      padding: 8px 12px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      cursor: pointer;
      margin-bottom: 2px;
      border: 1px solid transparent;
      font-weight: 500;
    }

    a:hover {
      background: var(--link-hover-bg);
      color: var(--text-main);
    }

    a.active {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa; /* Blue text for active state */
      font-weight: 600;
    }

    :host([theme="light"]) a.active {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }

    .experimental-badge {
      display: inline-block;
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 8px;
      letter-spacing: 0.03em;
    }

  main {
    flex: 1;
    overflow-y: auto;
    background: transparent; /* match intro page */
`;


  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._handlePopState);
    this.addEventListener('theme-toggle', this._handleThemeToggle as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handlePopState);
    this.removeEventListener('theme-toggle', this._handleThemeToggle as EventListener);
  }

  private _handleThemeToggle = () => {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    this.setAttribute('theme', this._theme);
  };

  private _handlePopState = () => {
    this._route = window.location.pathname;
  };

  private _navigate(e: Event, path: string) {
    e.preventDefault();
    window.history.pushState({}, '', path);
    this._route = path;
  }

  private _renderPage() {
    switch (this._route) {
      case '/': return html`<intro-page .theme=${this._theme}></intro-page>`;

      // General UI
      case '/button': return html`<button-demo></button-demo>`;
      case '/card': return html`<card-demo></card-demo>`;
      case '/split': return html`<split-demo></split-demo>`;
      case '/tabs':
        import('./pages/tabs-demo');
        return html`<tabs-demo></tabs-demo>`;
      case '/dropdown': return html`<dropdown-demo></dropdown-demo>`;

      // Form Elements
      case '/file-upload': return html`<file-upload-demo></file-upload-demo>`;
      case '/otp-input': return html`<otp-input-demo></otp-input-demo>`;
      case '/phone-input': return html`<phone-input-demo></phone-input-demo>`;
      case '/star-rating': return html`<star-rating-demo></star-rating-demo>`;
      case '/select': return html`<select-demo></select-demo>`;
      case '/checkbox': return html`<checkbox-demo></checkbox-demo>`;
      case '/radio-group': return html`<radio-group-demo></radio-group-demo>`;
      case '/toggle': return html`<toggle-demo></toggle-demo>`;
      case '/slider': return html`<slider-demo></slider-demo>`;

      // Browser & Device
      case '/os-check': return html`<os-check-demo></os-check-demo>`;
      case '/browser-check': return html`<browser-check-demo></browser-check-demo>`;
      case '/screen-check': return html`<screen-check-demo></screen-check-demo>`;
      case '/storage-check': return html`<storage-check-demo></storage-check-demo>`;
      case '/gpu-check':
        return html`<gpu-check-demo></gpu-check-demo>`;
      case '/network-check':
        import('./pages/network-check-demo');
        return html`<network-check-demo></network-check-demo>`;
      case '/theme-check':
        import('./pages/theme-check-demo');
        return html`<theme-check-demo></theme-check-demo>`;
      case '/mic-check':
        import('./pages/mic-check-demo');
        return html`<mic-check-demo></mic-check-demo>`;
      case '/battery-check':
        return html`<battery-check-demo></battery-check-demo>`;
      case '/online-status':
        return html`<placeholder-demo componentName="Online Status"></placeholder-demo>`;

      // Permissions & Media
      case '/camera-check':
        return html`<camera-check-demo></camera-check-demo>`;
      case '/geolocation-check':
        import('./pages/geolocation-check-demo');
        return html`<geolocation-check-demo></geolocation-check-demo>`;
      case '/clipboard-check':
        import('./pages/clipboard-check-demo');
        return html`<clipboard-check-demo></clipboard-check-demo>`;
      case '/notification-check':
        import('./pages/notification-check-demo');
        return html`<notification-check-demo></notification-check-demo>`;

      // Extensions
      case '/extension-check':
        import('./pages/extension-check-demo');
        return html`<extension-check-demo></extension-check-demo>`;
      case '/wallet-check': return html`<placeholder-demo componentName="Wallet Check"></placeholder-demo>`;

      // Proctoring
      case '/proctoring':
        import('./pages/proctoring-demo');
        return html`<proctoring-demo></proctoring-demo>`;

      // Utilities
      case '/logger':
        import('./pages/logger-demo');
        return html`<logger-demo></logger-demo>`;
      case '/text-editor':
        import('./pages/text-editor-demo');
        return html`<text-editor-demo></text-editor-demo>`;
      case '/code-editor':
        import('./pages/code-editor-demo');
        return html`<code-editor-demo></code-editor-demo>`;
      case '/event-bus':
        import('./pages/event-bus-demo');
        return html`<event-bus-demo></event-bus-demo>`;
      case '/theme-generator':
        import('./pages/theme-generator-demo');
        return html`<theme-generator-demo></theme-generator-demo>`;
      case '/json-formatter':
        import('./pages/json-formatter-demo');
        return html`<json-formatter-demo></json-formatter-demo>`;
      case '/theme-service':
        import('./pages/theme-service-demo');
        return html`<theme-service-demo></theme-service-demo>`;

      // Tools
      case '/sandbox': return html`<sandbox-demo></sandbox-demo>`;

      default: return html`<intro-page></intro-page>`;
    }
  }

  private _renderNavLink(path: string, label: string, isExperimental = false) {
    return html`
      <a
        href="${path}"
        class="${this._route === path ? 'active' : ''}"
        @click="${(e: Event) => this._navigate(e, path)}"
      >
        ${label}
        ${isExperimental ? html`<span class="experimental-badge">Experimenting</span>` : ''}
      </a>
    `;
  }

  render() {
    return html`
      <aside>
        <div class="brand">
          <img src="/brand-logo.png" alt="Zero UI" class="brand-logo-img" />
          <span class="brand-text">Zero UI</span>
        </div>
        <nav>
          <div class="nav-group">
            <div class="nav-header">Overview</div>
            ${this._renderNavLink('/', 'Introduction')}
          </div>
          
          <div class="nav-group">
            <div class="nav-header">General UI</div>
            ${this._renderNavLink('/button', 'Button')}
            ${this._renderNavLink('/card', 'Card')}
            ${this._renderNavLink('/split', 'Split')}
            ${this._renderNavLink('/tabs', 'Tabs')}
            ${this._renderNavLink('/dropdown', 'Dropdown')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Form Elements</div>
            ${this._renderNavLink('/file-upload', 'File Upload')}
            ${this._renderNavLink('/otp-input', 'OTP Input')}
            ${this._renderNavLink('/phone-input', 'Phone Input')}
            ${this._renderNavLink('/star-rating', 'Star Rating')}
            ${this._renderNavLink('/select', 'Select')}
            ${this._renderNavLink('/checkbox', 'Checkbox')}
            ${this._renderNavLink('/radio-group', 'Radio Group')}
            ${this._renderNavLink('/toggle', 'Toggle')}
            ${this._renderNavLink('/slider', 'Slider')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Browser & Device</div>
            ${this._renderNavLink('/os-check', 'OS Check')}
            ${this._renderNavLink('/browser-check', 'Browser Check')}
            ${this._renderNavLink('/screen-check', 'Screen Check')}
            ${this._renderNavLink('/storage-check', 'Storage Check')}
            ${this._renderNavLink('/gpu-check', 'GPU Check')}
            ${this._renderNavLink('/network-check', 'Network Check')}
            ${this._renderNavLink('/theme-check', 'Theme Check')}
            ${this._renderNavLink('/battery-check', 'Battery Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Permissions & Media</div>
            ${this._renderNavLink('/camera-check', 'Camera Check')}
            ${this._renderNavLink('/mic-check', 'Mic Check')}
            ${this._renderNavLink('/geolocation-check', 'Geolocation Check')}
            ${this._renderNavLink('/notification-check', 'Notification Check', true)}
            ${this._renderNavLink('/clipboard-check', 'Clipboard Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Extensions</div>
            ${this._renderNavLink('/extension-check', 'Extension Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Proctoring</div>
            ${this._renderNavLink('/proctoring', 'Proctoring Session')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Utilities</div>
            ${this._renderNavLink('/logger', 'Logger')}
            ${this._renderNavLink('/text-editor', 'Text Editor')}
            ${this._renderNavLink('/code-editor', 'Code Editor')}
            ${this._renderNavLink('/event-bus', 'Event Bus')}
            ${this._renderNavLink('/theme-service', 'Theme Service')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Tools</div>
            ${this._renderNavLink('/sandbox', 'Sandbox')}
            ${this._renderNavLink('/theme-generator', 'Theme Generator')}
            ${this._renderNavLink('/json-formatter', 'JSON Formatter')}
          </div>
        </nav>
      </aside>
      <main>${this._renderPage()}</main>
    `;
  }
}
