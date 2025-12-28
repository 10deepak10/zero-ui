import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/button';
import '../components/demo-page';
import '../components/demo-example';

@customElement('card-demo')
export class CardDemo extends LitElement {
  static styles = css`
    zui-card {
      max-width: 400px;
      width: 100%;
    }
  `;

  render() {
    const properties = [
      { name: 'hover', type: 'boolean', default: 'false', description: 'Enable hover effect.' },
      { name: 'glass', type: 'boolean', default: 'false', description: 'Enable glassmorphism effect.' },
    ];

    const basicHtml = `<zui-card>
  <h3>Card Title</h3>
  <p>This is a simple card component. It can hold any content you want.</p>
  <div style="margin-top: 16px;">
    <zui-button>Action</zui-button>
  </div>
</zui-card>`;

    const basicReact = `import { ZuiCard } from '@deepverse/zero-ui/card';
import { ZuiButton } from '@deepverse/zero-ui/button';

function App() {
  return (
    <ZuiCard>
      <h3>Card Title</h3>
      <p>This is a simple card component.</p>
      <div style={{ marginTop: '16px' }}>
        <ZuiButton>Action</ZuiButton>
      </div>
    </ZuiCard>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-card>
      <h3>Card Title</h3>
      <p>This is a simple card component.</p>
      <div style="margin-top: 16px;">
        <zui-button>Action</zui-button>
      </div>
    </zui-card>
  \`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-card>
    <h3>Card Title</h3>
    <p>This is a simple card component.</p>
    <div style="margin-top: 16px;">
      <zui-button>Action</zui-button>
    </div>
  </zui-card>
</template>`;

    return html`
      <demo-page
        name="Card"
        description="Cards contain content and actions about a single subject. They are flexible containers for grouping related information."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Simple card layout with title, content, and action."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; justify-content: center;">
            <zui-card>
              <h3>Card Title</h3>
              <p>This is a simple card component. It can hold any content you want.</p>
              <div style="margin-top: 16px;">
                <zui-button>Action</zui-button>
              </div>
            </zui-card>
          </div>
        </demo-example>


      </demo-page>
    `;
  }
}
