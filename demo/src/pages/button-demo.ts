import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/code-editor';

@customElement('button-demo')
export class ButtonDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }
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
    const basicUsage = `<zui-button>Default Button</zui-button>
<zui-button variant="primary">Primary</zui-button>
<zui-button variant="secondary">Secondary</zui-button>`;

    const variants = `<zui-button variant="primary">Primary</zui-button>
<zui-button variant="secondary">Secondary</zui-button>
<zui-button variant="outline">Outline</zui-button>
<zui-button variant="ghost">Ghost</zui-button>
<zui-button variant="danger">Danger</zui-button>`;

    const sizes = `<zui-button size="sm">Small</zui-button>
<zui-button size="md">Medium</zui-button>
<zui-button size="lg">Large</zui-button>`;

    return html`
      <h1>Button</h1>
      <p>Buttons allow users to take actions, and make choices, with a single tap.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-button>Default Button</zui-button>
          <zui-button variant="primary">Primary</zui-button>
          <zui-button variant="secondary">Secondary</zui-button>
        </div>
        <div class="code-block">
          <zui-code-editor
            .value=${basicUsage}
            readonly
            language="html"
          ></zui-code-editor>
        </div>
      </div>

      <div class="demo-section">
        <h2>Variants</h2>
        <div class="preview">
          <zui-button variant="primary">Primary</zui-button>
          <zui-button variant="secondary">Secondary</zui-button>
          <zui-button variant="outline">Outline</zui-button>
          <zui-button variant="ghost">Ghost</zui-button>
          <zui-button variant="danger">Danger</zui-button>
        </div>
        <div class="code-block">
          <zui-code-editor
            .value=${variants}
            readonly
            language="html"
          ></zui-code-editor>
        </div>
      </div>

      <div class="demo-section">
        <h2>Sizes</h2>
        <div class="preview">
          <zui-button size="sm">Small</zui-button>
          <zui-button size="md">Medium</zui-button>
          <zui-button size="lg">Large</zui-button>
        </div>
        <div class="code-block">
          <zui-code-editor
            .value=${sizes}
            readonly
            language="html"
          ></zui-code-editor>
        </div>
      </div>
    `;
  }
}
