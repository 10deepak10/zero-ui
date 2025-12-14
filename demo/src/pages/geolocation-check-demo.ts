import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/geolocation-check';
import '../components/demo-page';
import '../components/demo-example';

@customElement('geolocation-check-demo')
export class GeolocationCheckDemo extends LitElement {
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

    zui-geolocation-check {
      width: 100%;
    }
  `;

  render() {
    const basicHtml = `<zui-geolocation-check></zui-geolocation-check>`;
    const basicReact = `import { ZuiGeolocationCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiGeolocationCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-geolocation-check></zui-geolocation-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-geolocation-check />
</template>`;

    return html`
      <demo-page
        name="Geolocation Check"
        description="Retrieves current position using the Geolocation API, handling permissions and errors."
      >
        <demo-example
          header="Default Usage"
          description="Geolocation service integration test."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-geolocation-check></zui-geolocation-check>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
