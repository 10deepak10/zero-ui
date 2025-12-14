import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/clipboard-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('clipboard-check-demo')
export class ClipboardCheckDemo extends LitElement {
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

    @media (max-width: 768px) {
      .preview {
        padding: 16px;
      }
    }

    zui-clipboard-check {
      width: 100%;
    }
  `;

  render() {
    const basicHtml = `<zui-clipboard-check></zui-clipboard-check>`;
    const basicReact = `import { ZuiClipboardCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiClipboardCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-clipboard-check></zui-clipboard-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-clipboard-check />
</template>`;

    return html`
      <demo-page
        name="Clipboard Check"
        description="Manages clipboard permissions and provides Copy/Paste functionality with legacy fallbacks."
      >
        <demo-example
          header="Default Usage"
          description="Clipboard operations handler."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-clipboard-check></zui-clipboard-check>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
