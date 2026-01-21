import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/os-check/zui-os-check.js';
import '../components/demo-page';
import '../components/demo-example';
import { OsCheckService } from '@deepverse/zero-ui';

@customElement('os-check-demo')
export class OsCheckDemo extends LitElement {
  @state() private _detectedOS: any = null;
  @state() private _serviceInfo: any = null;

  connectedCallback() {
    super.connectedCallback();
    this._serviceInfo = OsCheckService.getOSInfo();
  }

  static styles = css`
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

  private _handleOSDetected(e: CustomEvent) {
    this._detectedOS = e.detail;
  }

  render() {
    const properties = [
      { name: 'showVersion', type: 'boolean', default: 'false', description: 'Display OS version.' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Display OS icon.' },
    ];

    const basicHtml = `<zui-os-check 
  @os-detected="\${handleDetection}"
></zui-os-check>`;

    const basicReact = `import { ZuiOsCheck } from '../components/os-check/zui-os-check.js';

function App() {
  const handleDetection = (e) => {
    console.log('Detected OS:', e.detail);
  };

  return <ZuiOsCheck onOsDetected={handleDetection} />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-os-check (os-detected)="handleDetection($event)"></zui-os-check>\`
})
export class AppComponent {
  handleDetection(e: any) {
    console.log('Detected OS:', e.detail);
  }
}`;

    const basicVue = `<template>
  <zui-os-check @os-detected="handleDetection" />
</template>

<script setup>
const handleDetection = (e) => {
  console.log('Detected OS:', e.detail);
};
</script>`;

    const versionHtml = `<zui-os-check showVersion></zui-os-check>`;
    const noIconHtml = `<zui-os-check ?showIcon="\${false}"></zui-os-check>`;

    const serviceReact = `import { OsCheckService } from '@deepverse/zero-ui';

// Get OS info directly
const info = OsCheckService.getOSInfo();`;
    const serviceAngular = `import { OsCheckService } from '@deepverse/zero-ui';
    
const info = OsCheckService.getOSInfo();`;
    const serviceVue = `import { OsCheckService } from '@deepverse/zero-ui';
    
const info = OsCheckService.getOSInfo();`;

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

         <h3>Static Methods (OsCheckService)</h3>
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
              <td><code>getOSInfo</code></td>
              <td><code>-</code></td>
              <td><code>OSInfo</code></td>
              <td>Get OS name, version, and platform.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="OS Check"
        description="Detects the user's Operating System, version, and architecture."
        .properties=${properties}
      >
        <demo-example
          header="Basic Detection"
          description="Standard OS detection badge."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-os-check 
              @os-detected=${this._handleOSDetected}
            ></zui-os-check>
          </div>
          ${this._detectedOS ? html`
             <div style="margin-top: 16px; background: #1e1e1e; padding: 16px; border-radius: 8px; width: 100%;">
                <zui-code-editor .value=${"// Detected OS:\n" + JSON.stringify(this._detectedOS, null, 2)} readonly language="json"></zui-code-editor>
             </div>
          ` : ''}
        </demo-example>

        <demo-example
          header="With Version"
          description="Displays the specific OS version."
          .html=${versionHtml}
          .react=${basicReact.replace('<ZuiOsCheck', '<ZuiOsCheck showVersion')}
          .angular=${basicAngular.replace('<zui-os-check', '<zui-os-check showVersion')}
          .vue=${basicVue.replace('<zui-os-check', '<zui-os-check showVersion')}
        >
          <div class="preview">
            <zui-os-check showVersion></zui-os-check>
          </div>
        </demo-example>

        <demo-example
          header="Without Icon"
          description="Text-only display."
          .html=${noIconHtml}
          .react=${basicReact.replace('<ZuiOsCheck', '<ZuiOsCheck showIcon={false}')}
          .angular=${basicAngular.replace('<zui-os-check', '<zui-os-check [showIcon]="false"')}
          .vue=${basicVue.replace('<zui-os-check', '<zui-os-check :showIcon="false"')}
        >
          <div class="preview">
            <zui-os-check ?showIcon=${false}></zui-os-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing OS info."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
           <pre style="width: 100%; background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Result:
${JSON.stringify(this._serviceInfo, null, 2)}
           </pre>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
