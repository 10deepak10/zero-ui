import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/split';
import '../components/demo-page';
import '../components/demo-example';

@customElement('split-demo')
export class SplitDemo extends LitElement {
  static styles = css`
    .demo-box {
      height: 400px;
      width: 100%;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      background: var(--card-bg, rgba(255, 255, 255, 0.05));
    }

    .content-box {
      padding: 20px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    /* Use semi-transparent theme colors that work on both light/dark */
    .box-1 { background: var(--link-active-bg, rgba(59, 130, 246, 0.1)); color: var(--zui-primary, #60a5fa); }
    .box-2 { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .box-3 { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
    
    /* Adjust text colors for light mode specifically if needed, but these usually work on white too if not too light */
    :host-context([theme="light"]) .box-1 { color: #2563eb; }
    :host-context([theme="light"]) .box-2 { color: #059669; }
    :host-context([theme="light"]) .box-3 { color: #d97706; }
  `;

  render() {
    const properties = [
      { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the split.' },
      { name: 'initialSplit', type: 'string', default: "'50%'", description: 'Initial size of the first pane (e.g. "30%", "200px").' },
      { name: 'minSize', type: 'string', default: "'0px'", description: 'Minimum size for panes.' },
    ];

    const horizontalHtml = `<div style="height: 400px; border: 1px solid #333;">
  <zui-split direction="horizontal" initialSplit="30%">
    <div slot="one">Sidebar</div>
    <div slot="two">Main Content</div>
  </zui-split>
</div>`;

    const verticalHtml = `<div style="height: 400px; border: 1px solid #333;">
  <zui-split direction="vertical" initialSplit="70%">
    <div slot="one">Top Section</div>
    <div slot="two">Bottom Console</div>
  </zui-split>
</div>`;

    const nestedHtml = `<div style="height: 400px;">
  <zui-split direction="horizontal" initialSplit="250px">
    <div slot="one">Navigation</div>
    <div slot="two" style="height: 100%">
      <zui-split direction="vertical" initialSplit="60%">
        <div slot="one">Editor</div>
        <div slot="two">Terminal</div>
      </zui-split>
    </div>
  </zui-split>
</div>`;

    const basicReact = `import { ZuiSplit } from '@deepverse/zero-ui/split';

function App() {
  return (
    <div style={{ height: '400px' }}>
      <ZuiSplit direction="horizontal" initialSplit="30%">
        <div slot="one">Sidebar</div>
        <div slot="two">Main Content</div>
      </ZuiSplit>
    </div>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div style="height: 400px">
      <zui-split direction="horizontal" initialSplit="30%">
        <div slot="one">Sidebar</div>
        <div slot="two">Main Content</div>
      </zui-split>
    </div>
  \`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <div style="height: 400px">
    <zui-split direction="horizontal" initialSplit="30%">
      <div slot="one">Sidebar</div>
      <div slot="two">Main Content</div>
    </zui-split>
  </div>
</template>`;

    return html`
      <demo-page
        name="Split Pane"
        description="Resizable split views for flexible layouts. Supports nested splits and different orientations."
        .properties=${properties}
      >
        <demo-example
          header="Horizontal Split"
          description="Split content left and right."
          .html=${horizontalHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="demo-box">
            <zui-split direction="horizontal" initialSplit="30%">
              <div class="content-box box-1" slot="one">
                <h3>Sidebar</h3>
                <p>Drag gutter ➔</p>
              </div>
              <div class="content-box box-2" slot="two">
                <h3>Main Content</h3>
                <p>Flexible Area</p>
              </div>
            </zui-split>
          </div>
        </demo-example>

        <demo-example
          header="Vertical Split"
          description="Split content top and bottom."
          .html=${verticalHtml}
          .react=${basicReact.replace('horizontal', 'vertical')}
          .angular=${basicAngular.replace('horizontal', 'vertical')}
          .vue=${basicVue.replace('horizontal', 'vertical')}
        >
          <div class="demo-box">
            <zui-split direction="vertical" initialSplit="70%">
              <div class="content-box box-1" slot="one">
                <h3>Top Section</h3>
                <p>Drag gutter ⬇</p>
              </div>
              <div class="content-box box-3" slot="two">
                <h3>Bottom Console</h3>
                <p>Terminal output, etc.</p>
              </div>
            </zui-split>
          </div>
        </demo-example>

        <demo-example
          header="Nested Layout"
          description="Complex layouts with nested splits."
          .html=${nestedHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="demo-box">
            <zui-split direction="horizontal" initialSplit="250px">
              <div class="content-box box-1" slot="one">
                <h3>Navigation</h3>
              </div>
              <div slot="two" style="height: 100%">
                <zui-split direction="vertical" initialSplit="60%">
                  <div class="content-box box-2" slot="one">
                    <h3>Editor</h3>
                  </div>
                  <div class="content-box box-3" slot="two">
                    <h3>Terminal</h3>
                  </div>
                </zui-split>
              </div>
            </zui-split>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
