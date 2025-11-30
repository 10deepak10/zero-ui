import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/dropdown';
import '@deepverse/zero-ui/button';

@customElement('dropdown-demo')
export class DropdownDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .preview {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      height: 200px; /* Ensure space for dropdown */
    }

    .menu-item {
      display: block;
      width: 100%;
      padding: 0.5rem 1rem;
      text-align: left;
      background: none;
      border: none;
      cursor: pointer;
      color: #374151;
      font-size: 0.875rem;
    }

    .menu-item:hover {
      background-color: #f3f4f6;
    }

    .custom-content {
      padding: 1rem;
    }

    input {
      display: block;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
    }
  `;

  render() {
    return html`
      <h1>Dropdown</h1>
      <p>A generic dropdown component for menus, popovers, and more.</p>

      <div class="demo-section">
        <h2>Basic Menu</h2>
        <div class="preview">
          <zui-dropdown>
            <zui-button slot="trigger">Options ▾</zui-button>
            <div slot="content">
              <button class="menu-item">Edit Profile</button>
              <button class="menu-item">Settings</button>
              <div style="border-top: 1px solid #e5e7eb; margin: 4px 0;"></div>
              <button class="menu-item" style="color: #ef4444;">Sign Out</button>
            </div>
          </zui-dropdown>
        </div>
      </div>

      <div class="demo-section">
        <h2>Custom Content (Right Aligned)</h2>
        <div class="preview">
          <zui-dropdown placement="right">
            <zui-button variant="secondary" slot="trigger">Login Form ▾</zui-button>
            <div slot="content" class="custom-content">
              <div style="margin-bottom: 0.5rem; font-weight: 600;">Sign In</div>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <zui-button style="width: 100%;">Login</zui-button>
            </div>
          </zui-dropdown>
        </div>
      </div>

      <div class="demo-section">
        <h2>Close on Scroll</h2>
        <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
          This dropdown will close when you scroll the page.
        </p>
        <div class="preview">
          <zui-dropdown closeOnScroll>
            <zui-button slot="trigger">Scroll to Close ▾</zui-button>
            <div slot="content">
              <button class="menu-item">Action 1</button>
              <button class="menu-item">Action 2</button>
              <button class="menu-item">Action 3</button>
            </div>
          </zui-dropdown>
        </div>
      </div>

      <div class="demo-section">
        <h2>Close from Inside Content</h2>
        <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
          Click any menu item to close the dropdown.
        </p>
        <div class="preview">
          <zui-dropdown>
            <zui-button slot="trigger">Auto-Close Menu ▾</zui-button>
            <div slot="content">
              <button 
                class="menu-item" 
                @click=${(e: Event) => {
                  const dropdown = (e.target as HTMLElement).closest('zui-dropdown');
                  dropdown?.close();
                }}
              >Close on Click</button>
              <button 
                class="menu-item"
                @click=${(e: Event) => {
                  const dropdown = (e.target as HTMLElement).closest('zui-dropdown');
                  dropdown?.dispatchEvent(new CustomEvent('zui-dropdown-close', { bubbles: true }));
                }}
              >Close via Event</button>
              <button class="menu-item">Stays Open</button>
            </div>
          </zui-dropdown>
        </div>
      </div>
    `;
  }
}
