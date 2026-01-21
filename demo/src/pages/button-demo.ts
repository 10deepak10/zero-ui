import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/button';
import '../components/code-editor/zui-code-editor.js';
import '../components/demo-page';

@customElement('button-demo')
export class ButtonDemo extends LitElement {
  static styles = css`
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
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
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
    const properties = [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'The visual style of the button.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The size of the button.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is disabled.' },
    ];

    const basicHtml = `<zui-button>Default Button</zui-button>
<zui-button variant="primary">Primary</zui-button>
<zui-button variant="secondary">Secondary</zui-button>`;

    const basicReact = `import { ZuiButton } from '@deepverse/zero-ui/button';

function App() {
  return (
    <>
      <ZuiButton>Default Button</ZuiButton>
      <ZuiButton variant="primary">Primary</ZuiButton>
      <ZuiButton variant="secondary">Secondary</ZuiButton>
    </>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`
    <zui-button>Default Button</zui-button>
    <zui-button variant="primary">Primary</zui-button>
    <zui-button variant="secondary">Secondary</zui-button>
  \`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-button>Default Button</zui-button>
  <zui-button variant="primary">Primary</zui-button>
  <zui-button variant="secondary">Secondary</zui-button>
</template>`;

    const variantsHtml = `<zui-button variant="primary">Primary</zui-button>
<zui-button variant="secondary">Secondary</zui-button>
<zui-button variant="outline">Outline</zui-button>
<zui-button variant="ghost">Ghost</zui-button>
<zui-button variant="danger">Danger</zui-button>`;

    const sizesHtml = `<zui-button size="sm">Small</zui-button>
<zui-button size="md">Medium</zui-button>
<zui-button size="lg">Large</zui-button>`;

    return html`
      <demo-page
        name="Button"
        description="Buttons allow users to take actions, and make choices, with a single tap. They are used to trigger actions or navigate to other pages."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard buttons for common actions."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <zui-button>Default Button</zui-button>
            <zui-button variant="primary">Primary</zui-button>
            <zui-button variant="secondary">Secondary</zui-button>
          </div>
        </demo-example>

        <demo-example
          header="Variants"
          description="Different visual styles to convey hierarchy."
          .html=${variantsHtml}
          .react=${basicReact.replace('Default Button', 'Primary').replace('variant="secondary"', 'variant="danger"')} 
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <zui-button variant="primary">Primary</zui-button>
            <zui-button variant="secondary">Secondary</zui-button>
            <zui-button variant="outline">Outline</zui-button>
            <zui-button variant="ghost">Ghost</zui-button>
            <zui-button variant="danger">Danger</zui-button>
          </div>
        </demo-example>

        <demo-example
          header="Sizes"
          description="Available in small, medium, and large sizes."
          .html=${sizesHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
           <div style="display: flex; gap: 16px; align-items: center;">
            <zui-button size="sm">Small</zui-button>
            <zui-button size="md">Medium</zui-button>
            <zui-button size="lg">Large</zui-button>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
