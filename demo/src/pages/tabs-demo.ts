import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui'; // Imports all components including tabs
import '../components/demo-page';
import '../components/demo-example';

@customElement('tabs-demo')
export class TabsDemo extends LitElement {
  static styles = css``;

  render() {
    const properties = [
      { name: 'active', type: 'boolean', default: 'false', description: 'Whether the tab or panel is active.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the tab is disabled (header only).' },
    ];

    const basicHtml = `<zui-tabs>
  <zui-tab slot="tabs">Account</zui-tab>
  <zui-tab slot="tabs">Password</zui-tab>
  <zui-tab slot="tabs" disabled>Settings</zui-tab>

  <zui-tab-panel slot="panels">
    <h3>Account Info</h3>
    <p>Manage your account details properly.</p>
  </zui-tab-panel>

  <zui-tab-panel slot="panels">
    <h3>Change Password</h3>
    <p>Secure your account with a strong password.</p>
  </zui-tab-panel>

  <zui-tab-panel slot="panels">
    <p>Settings are disabled.</p>
  </zui-tab-panel>
</zui-tabs>`;

    const basicReact = `import { ZuiTabs, ZuiTab, ZuiTabPanel } from '@deepverse/zero-ui/tabs';

function App() {
  return (
    <ZuiTabs>
      <ZuiTab slot="tabs">Account</ZuiTab>
      <ZuiTab slot="tabs">Password</ZuiTab>
      <ZuiTab slot="tabs" disabled>Settings</ZuiTab>

      <ZuiTabPanel slot="panels">
        <h3>Account Info</h3>
        <p>Manage your account details.</p>
      </ZuiTabPanel>
      <ZuiTabPanel slot="panels">
        <h3>Change Password</h3>
      </ZuiTabPanel>
      <ZuiTabPanel slot="panels">
        Settings are disabled
      </ZuiTabPanel>
    </ZuiTabs>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-tabs>
      <zui-tab slot="tabs">Account</zui-tab>
      <zui-tab slot="tabs">Password</zui-tab>
      <zui-tab slot="tabs" disabled>Settings</zui-tab>

      <zui-tab-panel slot="panels">
        <h3>Account Info</h3>
      </zui-tab-panel>
      <zui-tab-panel slot="panels">
        <h3>Change Password</h3>
      </zui-tab-panel>
      <zui-tab-panel slot="panels">
        Disabled
      </zui-tab-panel>
    </zui-tabs>
  \`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-tabs>
    <zui-tab slot="tabs">Account</zui-tab>
    <zui-tab slot="tabs">Password</zui-tab>
    <zui-tab slot="tabs" disabled>Settings</zui-tab>

    <zui-tab-panel slot="panels">
      <h3>Account Info</h3>
    </zui-tab-panel>
    <zui-tab-panel slot="panels">
      <h3>Change Password</h3>
    </zui-tab-panel>
    <zui-tab-panel slot="panels">
      Disabled
    </zui-tab-panel>
  </zui-tabs>
</template>`;

    return html`
      <demo-page
        name="Tabs"
        description="Organize content into separate views where only one view can be visible at a time."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard tabs with panels."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="background: var(--glass-bg); padding: 20px; border-radius: 8px;">
            <zui-tabs>
              <zui-tab slot="tabs">Account</zui-tab>
              <zui-tab slot="tabs">Password</zui-tab>
              <zui-tab slot="tabs" disabled>Settings</zui-tab>

              <zui-tab-panel slot="panels">
                <h3 style="margin-top:0">Account Info</h3>
                <p>Manage your account details properly.</p>
              </zui-tab-panel>

              <zui-tab-panel slot="panels">
                <h3 style="margin-top:0">Change Password</h3>
                <p>Secure your account with a strong password.</p>
              </zui-tab-panel>

              <zui-tab-panel slot="panels">
                <p>Settings are disabled.</p>
              </zui-tab-panel>
            </zui-tabs>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
