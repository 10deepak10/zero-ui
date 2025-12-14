import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/browser-check';
import '../components/demo-page';
import '../components/demo-example';
import { BrowserCheckService } from '@deepverse/zero-ui';

@customElement('browser-check-demo')
export class BrowserCheckDemo extends LitElement {
  @state() private _detectedBrowser: any = null;
  @state() private _serviceInfo: any = null;

  connectedCallback() {
    super.connectedCallback();
    this._serviceInfo = BrowserCheckService.getBrowserInfo();
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

  private _handleBrowserDetected(e: CustomEvent) {
    this._detectedBrowser = e.detail;
  }

  render() {
    const properties = [
      { name: 'showVersion', type: 'boolean', default: 'false', description: 'Display browser version.' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Display browser icon.' },
    ];

    const basicHtml = `<zui-browser-check 
  @browser-detected="\${handleDetection}"
></zui-browser-check>`;

    const basicReact = `import { ZuiBrowserCheck } from '@deepverse/zero-ui/react';

function App() {
  const handleDetection = (e) => {
    console.log('Detected Browser:', e.detail);
  };

  return <ZuiBrowserCheck onBrowserDetected={handleDetection} />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-browser-check (browser-detected)="handleDetection($event)"></zui-browser-check>\`
})
export class AppComponent {
  handleDetection(e: any) {
    console.log('Detected Browser:', e.detail);
  }
}`;

    const basicVue = `<template>
  <zui-browser-check @browser-detected="handleDetection" />
</template>

<script setup>
const handleDetection = (e) => {
  console.log('Detected Browser:', e.detail);
};
</script>`;

    const versionHtml = `<zui-browser-check showVersion></zui-browser-check>`;
    const noIconHtml = `<zui-browser-check ?showIcon="\${false}"></zui-browser-check>`;

    const serviceReact = `import { BrowserCheckService } from '@deepverse/zero-ui';

// Get Browser info directly
const info = BrowserCheckService.getBrowserInfo();`;
    const serviceAngular = `import { BrowserCheckService } from '@deepverse/zero-ui';

const info = BrowserCheckService.getBrowserInfo();`;
    const serviceVue = `import { BrowserCheckService } from '@deepverse/zero-ui';

const info = BrowserCheckService.getBrowserInfo();`;

    return html`
      <demo-page
        name="Browser Check"
        description="Detects the user's browser, version, and platform."
        .properties=${properties}
      >
        <demo-example
          header="Basic Detection"
          description="Standard browser detection badge."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-browser-check 
              @browser-detected=${this._handleBrowserDetected}
            ></zui-browser-check>
          </div>
          ${this._detectedBrowser ? html`
             <div style="margin-top: 16px; background: #1e1e1e; padding: 16px; border-radius: 8px; width: 100%;">
                <zui-code-editor .value=${"// Detected Browser:\n" + JSON.stringify(this._detectedBrowser, null, 2)} readonly language="json"></zui-code-editor>
             </div>
          ` : ''}
        </demo-example>

        <demo-example
          header="With Version"
          description="Displays the specific browser version."
          .html=${versionHtml}
          .react=${basicReact.replace('<ZuiBrowserCheck', '<ZuiBrowserCheck showVersion')}
          .angular=${basicAngular.replace('<zui-browser-check', '<zui-browser-check showVersion')}
          .vue=${basicVue.replace('<zui-browser-check', '<zui-browser-check showVersion')}
        >
          <div class="preview">
            <zui-browser-check showVersion></zui-browser-check>
          </div>
        </demo-example>

        <demo-example
          header="Without Icon"
          description="Text-only display."
          .html=${noIconHtml}
          .react=${basicReact.replace('<ZuiBrowserCheck', '<ZuiBrowserCheck showIcon={false}')}
          .angular=${basicAngular.replace('<zui-browser-check', '<zui-browser-check [showIcon]="false"')}
          .vue=${basicVue.replace('<zui-browser-check', '<zui-browser-check :showIcon="false"')}
        >
          <div class="preview">
            <zui-browser-check ?showIcon=${false}></zui-browser-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing browser info."
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
