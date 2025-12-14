import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/theme-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('theme-check-demo')
export class ThemeCheckDemo extends LitElement {
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

    zui-theme-check {
      width: 100%;
    }
  `;

  render() {
    const basicHtml = `<zui-theme-check></zui-theme-check>`;

    const basicReact = `import { ZuiThemeCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiThemeCheck />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-theme-check></zui-theme-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-theme-check />
</template>`;

    return html`
      <demo-page
        name="Theme Check"
        description="Detects system color scheme preference (Dark/Light) and monitors changes."
      >
        <demo-example
          header="Default Usage"
          description="Visual theme indicator."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-theme-check></zui-theme-check>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
