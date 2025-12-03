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
import './pages/placeholder-demo';

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

      display: flex;
      height: 100vh;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: var(--text-main);
      background: var(--bg-body);
      transition: background 0.3s ease, color 0.3s ease;
    }

    :host([theme="light"]) {
      --bg-body: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(255, 255, 255, 0.5);
      --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      --card-bg: rgba(255, 255, 255, 0.6);
      --card-border: rgba(255, 255, 255, 0.4);
      --sidebar-bg: rgba(255, 255, 255, 0.4);
      --sidebar-border: rgba(255, 255, 255, 0.5);
      --link-hover-bg: rgba(255, 255, 255, 0.5);
      --link-active-bg: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
      --brand-bg: rgba(255, 255, 255, 0.5);
    }

    aside {
      width: 280px;
      backdrop-filter: blur(25px);
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      flex-shrink: 0;
      box-shadow: 4px 0 30px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .brand {
      padding: 0 24px 24px;
      font-size: 1.6rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;

      /* glass effect background */
      background: var(--brand-bg);
      border-radius: 14px;
      padding: 14px 20px;
      margin: 0 16px 26px;
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);

      /* vivid neon gradient text */
      background-clip: padding-box;
      color: var(--text-main);

      /* glow */
      text-shadow: 
        0 0 8px rgba(59,130,246,0.6),
        0 0 12px rgba(139,92,246,0.6);
    }

/* Apply gradient only to the logo icon */
.brand .logo {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow: 
    0 0 10px rgba(59,130,246,0.5),
    0 0 16px rgba(139,92,246,0.5);
}


  nav {
    flex: 1;
    overflow-y: auto;
    padding: 24px 16px;
  }

  .nav-group {
    margin-bottom: 24px;
  }

    .nav-header {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
      padding: 0 12px;
      margin-bottom: 10px;
      opacity: 0.7;
    }

    a {
      display: block;
      padding: 10px 14px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      cursor: pointer;
      margin-bottom: 4px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(8px);
    }

    a:hover {
      background: var(--link-hover-bg);
      border-color: var(--glass-border);
      color: var(--text-main);
      box-shadow: 0 6px 20px rgba(59,130,246,0.2);
      transform: translateX(4px);
    }

    a.active {
      background: var(--link-active-bg);
      border-color: rgba(59,130,246,0.6);
      color: var(--text-main);
      box-shadow: 0 6px 30px rgba(59,130,246,0.4);
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
      case '/': return html`<intro-page></intro-page>`;

      // General UI
      case '/button': return html`<button-demo></button-demo>`;
      case '/card': return html`<card-demo></card-demo>`;
      case '/dropdown': return html`<dropdown-demo></dropdown-demo>`;

      // Form Elements
      case '/file-upload': return html`<file-upload-demo></file-upload-demo>`;
      case '/otp-input': return html`<otp-input-demo></otp-input-demo>`;
      case '/phone-input': return html`<phone-input-demo></phone-input-demo>`;
      case '/star-rating': return html`<star-rating-demo></star-rating-demo>`;
      case '/select': return html`<select-demo></select-demo>`;
      case '/checkbox': return html`<checkbox-demo></checkbox-demo>`;
      case '/radio-group': return html`<placeholder-demo componentName="Radio Group"></placeholder-demo>`;
      case '/toggle': return html`<placeholder-demo componentName="Toggle"></placeholder-demo>`;
      case '/slider': return html`<placeholder-demo componentName="Slider"></placeholder-demo>`;
      case '/pin-input': return html`<placeholder-demo componentName="Pin Input"></placeholder-demo>`;

      // Browser & Device
      case '/os-check': return html`<placeholder-demo componentName="OS Check"></placeholder-demo>`;
      case '/browser-check': return html`<placeholder-demo componentName="Browser Check"></placeholder-demo>`;
      case '/screen-check': return html`<placeholder-demo componentName="Screen Check"></placeholder-demo>`;
      case '/storage-check': return html`<placeholder-demo componentName="Storage Check"></placeholder-demo>`;
      case '/gpu-check': return html`<placeholder-demo componentName="GPU Check"></placeholder-demo>`;
      case '/network-check': return html`<placeholder-demo componentName="Network Check"></placeholder-demo>`;
      case '/battery-check': return html`<placeholder-demo componentName="Battery Check"></placeholder-demo>`;
      case '/online-status': return html`<placeholder-demo componentName="Online Status"></placeholder-demo>`;

      // Permissions & Media
      case '/camera-check': return html`<placeholder-demo componentName="Camera Check"></placeholder-demo>`;
      case '/mic-check': return html`<placeholder-demo componentName="Microphone Check"></placeholder-demo>`;
      case '/geolocation-check': return html`<placeholder-demo componentName="Geolocation Check"></placeholder-demo>`;
      case '/notification-check': return html`<placeholder-demo componentName="Notification Check"></placeholder-demo>`;
      case '/clipboard-check': return html`<placeholder-demo componentName="Clipboard Check"></placeholder-demo>`;

      // Extensions
      case '/extension-check': return html`<placeholder-demo componentName="Extension Check"></placeholder-demo>`;
      case '/wallet-check': return html`<placeholder-demo componentName="Wallet Check"></placeholder-demo>`;

      // Proctoring
      case '/tab-switch-check': return html`<placeholder-demo componentName="Tab Switch Check"></placeholder-demo>`;
      case '/devtools-check': return html`<placeholder-demo componentName="DevTools Check"></placeholder-demo>`;
      case '/incognito-check': return html`<placeholder-demo componentName="Incognito Check"></placeholder-demo>`;
      case '/fullscreen-check': return html`<placeholder-demo componentName="Fullscreen Check"></placeholder-demo>`;
      case '/copy-paste-test': return html`<placeholder-demo componentName="Copy Paste Test"></placeholder-demo>`;
      case '/face-detection-check': return html`<placeholder-demo componentName="Face Detection Check"></placeholder-demo>`;
      case '/multi-monitor-check': return html`<placeholder-demo componentName="Multi-Monitor Check"></placeholder-demo>`;

      // Utilities
      case '/logger': return html`<placeholder-demo componentName="Logger"></placeholder-demo>`;
      case '/event-bus': return html`<placeholder-demo componentName="Event Bus"></placeholder-demo>`;
      case '/theme-provider': return html`<placeholder-demo componentName="Theme Provider"></placeholder-demo>`;

      default: return html`<intro-page></intro-page>`;
    }
  }

  private _renderNavLink(path: string, label: string) {
    return html`
      <a 
        href="${path}" 
        class="${this._route === path ? 'active' : ''}"
        @click="${(e: Event) => this._navigate(e, path)}"
      >${label}</a>
    `;
  }

  render() {
    return html`
      <aside>
        <div class="brand">⚡️ Zero UI</div>
        <nav>
          <div class="nav-group">
            <div class="nav-header">Overview</div>
            ${this._renderNavLink('/', 'Introduction')}
          </div>
          
          <div class="nav-group">
            <div class="nav-header">General UI</div>
            ${this._renderNavLink('/button', 'Button')}
            ${this._renderNavLink('/card', 'Card')}
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
            ${this._renderNavLink('/pin-input', 'Pin Input')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Browser & Device</div>
            ${this._renderNavLink('/os-check', 'OS Check')}
            ${this._renderNavLink('/browser-check', 'Browser Check')}
            ${this._renderNavLink('/screen-check', 'Screen Check')}
            ${this._renderNavLink('/storage-check', 'Storage Check')}
            ${this._renderNavLink('/gpu-check', 'GPU Check')}
            ${this._renderNavLink('/network-check', 'Network Check')}
            ${this._renderNavLink('/battery-check', 'Battery Check')}
            ${this._renderNavLink('/online-status', 'Online Status')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Permissions & Media</div>
            ${this._renderNavLink('/camera-check', 'Camera Check')}
            ${this._renderNavLink('/mic-check', 'Mic Check')}
            ${this._renderNavLink('/geolocation-check', 'Geolocation Check')}
            ${this._renderNavLink('/notification-check', 'Notification Check')}
            ${this._renderNavLink('/clipboard-check', 'Clipboard Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Extensions</div>
            ${this._renderNavLink('/extension-check', 'Extension Check')}
            ${this._renderNavLink('/wallet-check', 'Wallet Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Proctoring</div>
            ${this._renderNavLink('/tab-switch-check', 'Tab Switch Check')}
            ${this._renderNavLink('/devtools-check', 'DevTools Check')}
            ${this._renderNavLink('/incognito-check', 'Incognito Check')}
            ${this._renderNavLink('/fullscreen-check', 'Fullscreen Check')}
            ${this._renderNavLink('/copy-paste-test', 'Copy Paste Test')}
            ${this._renderNavLink('/face-detection-check', 'Face Detection Check')}
            ${this._renderNavLink('/multi-monitor-check', 'Multi-Monitor Check')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Utilities</div>
            ${this._renderNavLink('/logger', 'Logger')}
            ${this._renderNavLink('/event-bus', 'Event Bus')}
            ${this._renderNavLink('/theme-provider', 'Theme Provider')}
          </div>
        </nav>
      </aside>
      <main>${this._renderPage()}</main>
    `;
  }
}
