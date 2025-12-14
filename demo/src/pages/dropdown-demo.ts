import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/dropdown';
import '@deepverse/zero-ui/button';
import '../components/demo-page';
import '../components/demo-example';

@customElement('dropdown-demo')
export class DropdownDemo extends LitElement {
  static styles = css`
    .menu-item {
      display: block;
      width: 100%;
      padding: 0.5rem 1rem;
      text-align: left;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-main);
      font-size: 0.875rem;
      transition: background 0.2s;
    }
    .menu-item:hover {
      background-color: var(--link-hover-bg);
    }
    .custom-content {
      padding: 1rem;
      color: var(--text-main);
    }
    input {
      display: block;
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid var(--glass-border);
      border-radius: 0.375rem;
      background: var(--glass-bg);
      color: var(--text-main);
      box-sizing: border-box;
    }
    zui-button {
        width: 100%;
    }
  `;

  render() {
    const properties = [
      { name: 'placement', type: "'bottom' | 'top' | 'left' | 'right'", default: "'bottom'", description: 'Preferred placement of the dropdown.' },
      { name: 'trigger', type: "'click' | 'hover'", default: "'click'", description: 'Event that triggers the dropdown.' },
      { name: 'closeOnScroll', type: 'boolean', default: 'false', description: 'Close dropdown when window scrolls.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the dropdown.' },
    ];

    const basicHtml = `<zui-dropdown>
  <zui-button slot="trigger">Options ▾</zui-button>
  <div slot="content">
    <button class="menu-item">Edit Profile</button>
    <button class="menu-item">Settings</button>
  </div>
</zui-dropdown>`;

    const customHtml = `<zui-dropdown placement="right">
  <zui-button variant="secondary" slot="trigger">Login Form ▾</zui-button>
  <div slot="content" class="custom-content">
    <div style="margin-bottom: 0.5rem; font-weight: 600;">Sign In</div>
    <input type="email" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <zui-button style="width: 100%; margin-top: 8px;">Login</zui-button>
  </div>
</zui-dropdown>`;

    const scrollHtml = `<zui-dropdown closeOnScroll>
  <zui-button slot="trigger">Scroll to Close ▾</zui-button>
  <div slot="content">
    <button class="menu-item">Action 1</button>
  </div>
</zui-dropdown>`;

    const basicReact = `import { ZuiDropdown, ZuiButton } from '@deepverse/zero-ui/react';

function App() {
  return (
    <ZuiDropdown>
      <ZuiButton slot="trigger">Options ▾</ZuiButton>
      <div slot="content">
        <button className="menu-item">Edit Profile</button>
        <button className="menu-item">Settings</button>
      </div>
    </ZuiDropdown>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-dropdown>
      <zui-button slot="trigger">Options ▾</zui-button>
      <div slot="content">
        <button class="menu-item">Edit Profile</button>
        <button class="menu-item">Settings</button>
      </div>
    </zui-dropdown>
  \`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-dropdown>
    <zui-button slot="trigger">Options ▾</zui-button>
    <div slot="content">
      <button class="menu-item">Edit Profile</button>
      <button class="menu-item">Settings</button>
    </div>
  </zui-dropdown>
</template>`;

    return html`
      <demo-page
        name="Dropdown"
        description="A generic dropdown component for menus, popovers, and more. Supports diverse content and placement."
        .properties=${properties}
      >
        <demo-example
          header="Basic Menu"
          description="Standard dropdown menu."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; justify-content: center; min-height: 200px;">
            <zui-dropdown>
              <zui-button slot="trigger">Options ▾</zui-button>
              <div slot="content">
                <button class="menu-item">Edit Profile</button>
                <button class="menu-item">Settings</button>
                <div style="border-top: 1px solid var(--glass-border); margin: 4px 0;"></div>
                <button class="menu-item" style="color: #ef4444;">Sign Out</button>
              </div>
            </zui-dropdown>
          </div>
        </demo-example>

        <demo-example
          header="Custom Content (Right Aligned)"
          description="Dropdown with custom content and placement."
          .html=${customHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; justify-content: center; min-height: 250px;">
            <zui-dropdown placement="right">
              <zui-button variant="secondary" slot="trigger">Login Form ▾</zui-button>
              <div slot="content" class="custom-content">
                <div style="margin-bottom: 0.5rem; font-weight: 600;">Sign In</div>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <div style="margin-top: 8px;">
                     <zui-button style="width: 100%;">Login</zui-button>
                </div>
              </div>
            </zui-dropdown>
          </div>
        </demo-example>

        <demo-example
          header="Close on Scroll"
          description="Automatically closes when scrolling the page."
          .html=${scrollHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; justify-content: center; min-height: 150px;">
            <zui-dropdown closeOnScroll>
              <zui-button slot="trigger">Scroll to Close ▾</zui-button>
              <div slot="content">
                <button class="menu-item">Action 1</button>
                <button class="menu-item">Action 2</button>
                <button class="menu-item">Action 3</button>
              </div>
            </zui-dropdown>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
