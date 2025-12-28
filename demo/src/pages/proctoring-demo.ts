import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/proctoring';
import '@deepverse/zero-ui/checkbox';
import '../components/demo-page';
import '../components/demo-example';
import { type ProctoringConfig } from '@deepverse/zero-ui';

@customElement('proctoring-demo')
export class ProctoringDemo extends LitElement {
  static styles = css`
    .config-panel {
      background: var(--bg-muted, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.05));
      border-radius: 12px;
      padding: 20px;
    }
    
    .config-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-transform: uppercase;
      color: var(--text-muted, #9ca3af);
      letter-spacing: 0.05em;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }

    .preview {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      flex-wrap: wrap;
    }

    zui-proctoring {
      width: 100%;
      max-width: 600px;
    }
    
    .instruction {
       line-height: 1.6;
       opacity: 0.8;
       border-left: 3px solid #3b82f6;
       padding-left: 14px;
       color: var(--text-main);
       margin: 16px 0;
    }

    h3 {
      margin-top: 0;
      color: var(--text-main);
      font-size: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 0.9rem;
    }

    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text-main);
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
    }

    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: var(--code-string);
    }
  `;

  @state()
  private config: ProctoringConfig = {
    detectTabSwitch: true,
    forceFullscreen: true,
    preventCopyPaste: true,
    preventContextMenu: true,
    detectDevTools: true,
  };

  private _toggleConfig(key: keyof ProctoringConfig) {
    this.config = {
      ...this.config,
      [key]: !this.config[key]
    };
  }

  render() {
    const basicHtml = `<zui-proctoring .config="\${config}"></zui-proctoring>`;

    const basicReact = `import { ZuiProctoring } from '@deepverse/zero-ui/proctoring';

function App() {
  const config = {
    detectTabSwitch: true,
    forceFullscreen: true,
    preventCopyPaste: true,
    preventContextMenu: true,
    detectDevTools: true,
  };

  return <ZuiProctoring config={config} />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-proctoring [config]="config"></zui-proctoring>\`
})
export class AppComponent {
  config = {
    detectTabSwitch: true,
    forceFullscreen: true,
    preventCopyPaste: true,
    preventContextMenu: true,
    detectDevTools: true,
  };
}`;

    const basicVue = `<template>
  <zui-proctoring :config="config" />
</template>

<script setup>
const config = {
  detectTabSwitch: true,
  forceFullscreen: true,
  preventCopyPaste: true,
  preventContextMenu: true,
  detectDevTools: true,
};
</script>`;

    const properties = [
      { name: 'config', type: 'ProctoringConfig', default: '{}', description: 'Configuration for proctoring checks (tab switching, fullscreen, etc).' }
    ];

    const apiHtml = html`
      <div slot="api">
        <h3>Properties</h3>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
             ${properties.map(p => html`
              <tr>
                <td><code>${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td><code>${p.default}</code></td>
                <td>${p.description}</td>
              </tr>
            `)}
          </tbody>
        </table>

        <h3>Static Methods (ProctoringService)</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Parameters</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>startSession</code></td>
              <td><code>config: ProctoringConfig</code></td>
              <td><code>void</code></td>
              <td>Start a proctoring session with config.</td>
            </tr>
            <tr>
              <td><code>endSession</code></td>
              <td><code>-</code></td>
              <td><code>void</code></td>
              <td>End the current session.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (violation) => void</code></td>
              <td><code>void</code></td>
              <td>Listen for violation events.</td>
            </tr>
             <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (violation) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Proctoring Check"
        description="Simulates an exam environment with integrity checks (Tab switching, Fullscreen, Copy/Paste prevention)."
        .properties=${properties}
      >
        <demo-example
          header="Proctoring Session"
          description="Configure and launch a proctoring session."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="width: 100%">
            <div class="config-panel">
              <div class="config-title">Session Configuration</div>
              <div class="checkbox-grid">
                <zui-checkbox
                  ?checked=${this.config.detectTabSwitch}
                  @change=${() => this._toggleConfig('detectTabSwitch')}
                  label="Tab Monitoring"
                ></zui-checkbox>
                
                <zui-checkbox 
                  ?checked=${this.config.forceFullscreen}
                  @change=${() => this._toggleConfig('forceFullscreen')}
                  label="Force Fullscreen"
                ></zui-checkbox>
                
                <zui-checkbox 
                  ?checked=${this.config.preventCopyPaste}
                  @change=${() => this._toggleConfig('preventCopyPaste')}
                  label="Prevent Copy/Paste"
                ></zui-checkbox>
                
                <zui-checkbox 
                  ?checked=${this.config.preventContextMenu}
                  @change=${() => this._toggleConfig('preventContextMenu')}
                  label="Prevent Context Menu"
                ></zui-checkbox>
                
                <zui-checkbox 
                  ?checked=${this.config.detectDevTools}
                  @change=${() => this._toggleConfig('detectDevTools')}
                  label="Detect DevTools"
                ></zui-checkbox>
              </div>
            </div>

            <div class="instruction">
               <strong>Instructions:</strong> Configure the session above, then click Start Session.
               <br/>
               <em>Note: Changes to configuration only apply when starting a new session.</em>
            </div>

            <div class="preview">
              <zui-proctoring .config=${this.config}></zui-proctoring>
            </div>
          </div>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
