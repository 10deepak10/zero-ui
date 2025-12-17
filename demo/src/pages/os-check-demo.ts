import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/os-check';
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

    const basicReact = `import { ZuiOsCheck } from '@deepverse/zero-ui/os-check';

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
      </demo-page>
    `;
  }
}
