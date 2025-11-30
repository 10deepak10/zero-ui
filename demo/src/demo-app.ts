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
import './pages/placeholder-demo';

@customElement('demo-app')
export class DemoApp extends LitElement {
  @state() private _route = window.location.pathname;

  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #333;
    }

    aside {
      width: 280px;
      background: #f8f9fa;
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      flex-shrink: 0;
    }

    .brand {
      padding: 0 24px 24px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e9ecef;
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
      color: #6c757d;
      font-weight: 600;
      padding: 0 12px;
      margin-bottom: 8px;
    }

    a {
      display: block;
      padding: 8px 12px;
      color: #495057;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.2s;
      cursor: pointer;
      margin-bottom: 2px;
    }

    a:hover {
      background: #e9ecef;
      color: #212529;
    }

    a.active {
      background: #e7f1ff;
      color: #0d6efd;
      font-weight: 500;
    }

    main {
      flex: 1;
      overflow-y: auto;
      background: #fff;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._handlePopState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handlePopState);
  }

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
        case '/checkbox': return html`<placeholder-demo componentName="Checkbox"></placeholder-demo>`;
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
