import { LitElement, html, css, type PropertyValues } from 'lit';
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
import './pages/socket-demo';

@customElement('demo-app')
export class DemoApp extends LitElement {
  @state() private _route = window.location.pathname;
  @state() private _theme: 'dark' | 'light' = 'dark';

  static styles = css`
    :host {
      --bg-body: #000000;
      --text-main: #ffffff;
      --text-muted: #999999;
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.15);
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
      --card-bg: #0a0a0a;
      --card-border: #333333;
      --sidebar-bg: #050505;
      --sidebar-border: #333333;
      --link-hover-bg: rgba(255, 255, 255, 0.1);
      --link-active-bg: rgba(255, 255, 255, 0.2);
      --brand-bg: rgba(255, 255, 255, 0.1);
      --bg-muted: #111111;
      --bg-hover: #222222;


      display: flex;
      height: 100dvh;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: var(--text-main);
      background: var(--bg-body);
      transition: background 0.3s ease, color 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      --gradient-text: linear-gradient(135deg, #ffffff 0%, #999999 100%);
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
      
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
      --logger-bg: #000000;
      --logger-border: #333333;
      --sandbox-bg: #000000;
      --sandbox-header-bg: #111111;
      --event-bus-bg: #000000;
      --event-bus-border: #333333;
      
      /* Sandbox Text Restored (Slate defaults) */
      --sandbox-header-text: #999999;
      --sandbox-tab-text: #666666;
      --sandbox-tab-hover: #ffffff;
    }

    :host([theme="light"]) {
      --bg-body: #ffffff;
      --text-main: #000000;
      --text-muted: #666666;
      --glass-bg: rgba(255, 255, 255, 0.9);
      --glass-border: rgba(0, 0, 0, 0.1);
      --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --card-bg: #ffffff;
      --card-border: rgba(0, 0, 0, 0.1);
      --sidebar-bg: #f5f5f5;
      --sidebar-border: rgba(0, 0, 0, 0.1);
      --link-hover-bg: rgba(0, 0, 0, 0.05);
      --link-active-bg: rgba(0, 0, 0, 0.08);
      --brand-bg: rgba(0, 0, 0, 0.05);
      --bg-muted: #f3f4f6;
      --bg-hover: #e5e7eb;
      --gradient-text: linear-gradient(135deg, #000000 0%, #666666 100%);
      
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
      transition: transform 0.3s ease;
      z-index: 50;
    }

    .mobile-header {
      display: none;
      padding: 16px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
      background: var(--bg-body);
    }

    .menu-btn {
      background: none;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 8px;
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 40;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .overlay.open {
      opacity: 1;
    }

    @media (max-width: 768px) {
      aside {
        position: fixed;
        height: 100%;
        left: 0;
        top: 0;
        transform: translateX(-100%);
      }

      aside.open {
        transform: translateX(0);
      }

      .mobile-header {
        display: flex;
      }

      .overlay {
        display: block;
        pointer-events: none;
      }
      
      .overlay.open {
        pointer-events: auto;
      }
      
      .brand {
        display: none; /* Hide brand in sidebar on mobile as it is in header */
      }
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
      background: linear-gradient(135deg, #ffffff, #666666);
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
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-weight: 600;
    }

    :host([theme="light"]) a.active {
      background: rgba(0, 0, 0, 0.08);
      color: #000000;
    }

    .experimental-badge {
      display: inline-block;
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
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

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('_route')) {
      const main = this.shadowRoot?.querySelector('main');
      if (main) {
        main.scrollTop = 0;
      }
      this._updateMetadata();
    }
  }

  @state() private _sidebarOpen = false;

  private _handleThemeToggle = () => {
    this._theme = this._theme === 'dark' ? 'light' : 'dark';
    this.setAttribute('theme', this._theme);
  };

  private _updateMetadata() {
    const route = this._route;
    const baseTitle = 'Zero UI';
    const metadata: Record<string, { title: string; description: string }> = {
      '/': { title: 'Introduction', description: 'A lightweight, performant, and customizable web component library.' },
      '/button': { title: 'Button', description: 'Button component documentation and examples.' },
      '/card': { title: 'Card', description: 'Card component for displaying content in a box.' },
      '/split': { title: 'Split', description: 'Split pane layout component.' },
      '/tabs': { title: 'Tabs', description: 'Tabs component for organizing content.' },
      '/dropdown': { title: 'Dropdown', description: 'Dropdown menu component.' },
      '/file-upload': { title: 'File Upload', description: 'File upload component with drag and drop support.' },
      '/otp-input': { title: 'OTP Input', description: 'One-time password input component.' },
      '/phone-input': { title: 'Phone Input', description: 'International phone number input component.' },
      '/star-rating': { title: 'Star Rating', description: 'Star rating component.' },
      '/select': { title: 'Select', description: 'Select dropdown component.' },
      '/checkbox': { title: 'Checkbox', description: 'Checkbox component.' },
      '/radio-group': { title: 'Radio Group', description: 'Radio group component.' },
      '/toggle': { title: 'Toggle', description: 'Toggle switch component.' },
      '/slider': { title: 'Slider', description: 'Range slider component.' },
      '/os-check': { title: 'OS Check', description: 'Detect user operating system.' },
      '/browser-check': { title: 'Browser Check', description: 'Detect user browser information.' },
      '/screen-check': { title: 'Screen Check', description: 'Analyze screen properties.' },
      '/storage-check': { title: 'Storage Check', description: 'Check available storage.' },
      '/gpu-check': { title: 'GPU Check', description: 'Analyze GPU capabilities.' },
      '/network-check': { title: 'Network Check', description: 'Check network status and speed.' },
      '/theme-check': { title: 'Theme Check', description: 'Detect system theme preferences.' },
      '/battery-check': { title: 'Battery Check', description: 'Check battery status.' },
      '/camera-check': { title: 'Camera Check', description: 'Test camera and video input.' },
      '/mic-check': { title: 'Microphone Check', description: 'Test microphone audio input.' },
      '/geolocation-check': { title: 'Geolocation Check', description: 'Test geolocation services.' },
      '/notification-check': { title: 'Notification Check', description: 'Test system notifications.' },
      '/clipboard-check': { title: 'Clipboard Check', description: 'Test clipboard API interactions.' },
      '/extension-check': { title: 'Extension Check', description: 'Check for installed browser extensions.' },
      '/proctoring': { title: 'Proctoring', description: 'Proctoring session capabilities.' },
      '/logger': { title: 'Logger', description: 'Application logging utility.' },
      '/text-editor': { title: 'Text Editor', description: 'Rich text editor component.' },
      '/code-editor': { title: 'Code Editor', description: 'Code editor component.' },
      '/event-bus': { title: 'Event Bus', description: 'Event bus utility for messaging.' },
      '/theme-generator': { title: 'Theme Generator', description: 'Generate custom themes for your app.' },
      '/json-formatter': { title: 'JSON Formatter', description: 'Format and prettify JSON data.' },
      '/theme-service': { title: 'Theme Service', description: 'Manage application theming.' },
      '/sandbox': { title: 'Sandbox', description: 'Experimental sandbox for testing.' },
      '/socket-demo': { title: 'Socket Service', description: 'Real-time WebSocket communication demo.' },
    };

    const data = metadata[route] || metadata['/'];
    document.title = `${data.title} - ${baseTitle}`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.description);

    // Update Open Graph tags
    this._updateMetaTag('property', 'og:title', `${data.title} - ${baseTitle}`);
    this._updateMetaTag('property', 'og:description', data.description);
    this._updateMetaTag('property', 'og:url', window.location.href);

    // Update Twitter tags
    this._updateMetaTag('property', 'twitter:title', `${data.title} - ${baseTitle}`);
    this._updateMetaTag('property', 'twitter:description', data.description);
    this._updateMetaTag('property', 'twitter:url', window.location.href);
  }

  private _updateMetaTag(attributeName: string, attributeValue: string, content: string) {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  private _toggleSidebar() {
    this._sidebarOpen = !this._sidebarOpen;
  }

  private _closeSidebar() {
    this._sidebarOpen = false;
  }

  private _handlePopState = () => {
    this._route = window.location.pathname;
  };

  private _navigate(e: Event, path: string) {
    e.preventDefault();
    window.history.pushState({}, '', path);
    this._route = path;
    this._closeSidebar();
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
      case '/socket-demo':
        return html`<socket-demo></socket-demo>`;
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
      <div class="mobile-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="menu-btn" @click=${this._toggleSidebar} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="brand-text">Zero UI</div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <button class="menu-btn" @click=${this._handleThemeToggle} aria-label="Toggle theme">
            ${this._theme === 'light' ? html`
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ` : html`
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            `}
          </button>
        </div>
      </div>

      <div class="overlay ${this._sidebarOpen ? 'open' : ''}" @click=${this._closeSidebar}></div>

      <aside class="${this._sidebarOpen ? 'open' : ''}">
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
            <div class="nav-header">Utilities</div>
            ${this._renderNavLink('/theme-service', 'Theme Service')}
            ${this._renderNavLink('/text-editor', 'Text Editor')}
            ${this._renderNavLink('/code-editor', 'Code Editor')}
            ${this._renderNavLink('/logger', 'Logger')}
            ${this._renderNavLink('/event-bus', 'Event Bus')}
          </div>
      

          <div class="nav-group">
            <div class="nav-header">Permissions & Media</div>
            ${this._renderNavLink('/camera-check', 'Camera Check')}
            ${this._renderNavLink('/mic-check', 'Mic Check')}
            ${this._renderNavLink('/geolocation-check', 'Geolocation Check')}
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
            <div class="nav-header">General UI</div>
            ${this._renderNavLink('/button', 'Button')}
            ${this._renderNavLink('/card', 'Card')}
            ${this._renderNavLink('/split', 'Split')}
            ${this._renderNavLink('/tabs', 'Tabs')}
            ${this._renderNavLink('/dropdown', 'Dropdown')}
          </div>

          <div class="nav-group">
            <div class="nav-header">Tools</div>
            ${this._renderNavLink('/sandbox', 'Sandbox')}
            ${this._renderNavLink('/theme-generator', 'Theme Generator')}
            ${this._renderNavLink('/json-formatter', 'JSON Formatter')}
          </div>
        </nav>
      </aside>
      <main @click=${this._closeSidebar}>${this._renderPage()}</main>
    `;
  }
}
