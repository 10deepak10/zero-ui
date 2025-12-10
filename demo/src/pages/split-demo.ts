import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/split';

@customElement('split-demo')
export class SplitDemo extends LitElement {
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
      backdrop-filter: blur(12px);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      color: var(--text-main);
    }

    .demo-box {
      height: 400px;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.2);
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

    .box-1 { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
    .box-2 { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .box-3 { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
  `;

  render() {
    return html`
      <h1>Split Pane Component</h1>
      <p>Resizable split views for flexible layouts.</p>

      <div class="demo-section">
        <h2>Horizontal Split</h2>
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
      </div>

      <div class="demo-section">
        <h2>Vertical Split</h2>
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
      </div>

      <div class="demo-section">
        <h2>Nested Layout</h2>
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
      </div>
    `;
  }
}
