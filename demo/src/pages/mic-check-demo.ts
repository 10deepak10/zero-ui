import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/mic-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('mic-check-demo')
export class MicCheckDemo extends LitElement {
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

    zui-mic-check {
      width: 100%;
    }
  `;

  render() {
    const properties = [
      { name: 'showVisualizer', type: 'boolean', default: 'false', description: 'Show audio visualizer when active.' }
    ];

    const basicHtml = `<zui-mic-check showVisualizer></zui-mic-check>`;

    const basicReact = `import { ZuiMicCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiMicCheck showVisualizer />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-mic-check showVisualizer></zui-mic-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-mic-check showVisualizer />
</template>`;

    return html`
      <demo-page
        name="Microphone Check"
        description="Manages microphone permissions and verifies audio input with an optional visualizer."
        .properties=${properties}
      >
        <demo-example
          header="Default Usage"
          description="Microphone test with visualizer."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-mic-check showVisualizer></zui-mic-check>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
