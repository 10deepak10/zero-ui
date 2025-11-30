import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './pages/intro-page';
import './pages/button-demo';
import './pages/card-demo';
import './pages/file-upload-demo';
import './pages/otp-input-demo';
import './pages/phone-input-demo';

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
      width: 260px;
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
      padding: 10px 12px;
      color: #495057;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: all 0.2s;
      cursor: pointer;
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
      case '/':
        return html`<intro-page></intro-page>`;
      case '/button':
        return html`<button-demo></button-demo>`;
      case '/card':
        return html`<card-demo></card-demo>`;
      case '/file-upload':
        return html`<file-upload-demo></file-upload-demo>`;
      case '/otp-input':
        return html`<otp-input-demo></otp-input-demo>`;
        case '/phone-input':
            return html`<phone-input-demo></phone-input-demo>`;
      default:
        return html`<intro-page></intro-page>`;
    }
  }

  render() {
    return html`
      <aside>
        <div class="brand">⚡️ Zero UI</div>
        <nav>
          <div class="nav-group">
            <div class="nav-header">Overview</div>
            <a 
              href="/" 
              class="${this._route === '/' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/')}"
            >Introduction</a>
          </div>
          
          <div class="nav-group">
            <div class="nav-header">Components</div>
            <a 
              href="/button" 
              class="${this._route === '/button' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/button')}"
            >Button</a>
            <a 
              href="/card" 
              class="${this._route === '/card' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/card')}"
            >Card</a>
            <a 
              href="/file-upload" 
              class="${this._route === '/file-upload' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/file-upload')}"
            >File Upload</a>
            <a 
              href="/otp-input" 
              class="${this._route === '/otp-input' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/otp-input')}"
            >OTP Input</a>
            <a
              href="/phone-input"
              class="${this._route === '/phone-input' ? 'active' : ''}"
              @click="${(e: Event) => this._navigate(e, '/phone-input')}"
            >Phone Input</a>
          </div>
        </nav>
      </aside>
      <main>${this._renderPage()}</main>
    `;
  }
}
