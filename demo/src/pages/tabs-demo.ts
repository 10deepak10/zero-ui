import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui';
import '@deepverse/zero-ui/code-editor';

@customElement('tabs-demo')
export class TabsDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }
    .demo-section {
      margin-bottom: 40px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 0px;
      font-weight: 600;
      color: var(--text-main);
    }
    .preview {
      display: block;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
    }
    .code-block {
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      background: #1e1e1e;
    }
  `;

  render() {
    const basicUsage = `<zui-tabs>
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

    return html`
      <h1>Tabs</h1>
      <p>Organize content into separate views where only one view can be visible at a time.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
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
        <div class="code-block">
          <zui-code-editor
            .value=${basicUsage}
            readonly
            language="html"
          ></zui-code-editor>
        </div>
      </div>
    `;
  }
}
