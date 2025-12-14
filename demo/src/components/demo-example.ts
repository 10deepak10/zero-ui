import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@deepverse/zero-ui/tabs';
import '@deepverse/zero-ui/code-editor';

@customElement('demo-example')
export class DemoExample extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 40px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
    }

    .header {
      padding: 24px 32px 0;
    }

    h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .description {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.5;
      max-width: 800px;
    }
    
    .tabs-container {
      margin-top: 24px;
    }
    
    .preview-container {
      padding: 40px;
      background: var(--glass-bg);
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    zui-tabs {
       --zui-tabs-header-bg: transparent;
       --zui-tabs-border-color: var(--card-border);
    }
    

    zui-tab {
       padding: 12px 24px;
       display: flex; /* For alignment */
       align-items: center;
       gap: 8px;
    }
    
    .tab-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Ensure preview items aren't too small */
    ::slotted(*) {
      min-width: 50%;
    }
  `;

  @property() header = '';
  @property() description = '';
  
  @property() html = '';
  @property() angular = '';
  @property() react = '';
  @property() vue = '';

  render() {
    return html`
      <div class="header">
        ${this.header ? html`<h3>${this.header}</h3>` : ''}
        ${this.description ? html`<p class="description">${this.description}</p>` : ''}
      </div>

      <div class="tabs-container">
        <zui-tabs>
          <zui-tab slot="tabs">
            <span class="tab-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              HTML
            </span>
          </zui-tab>
          <zui-tab slot="tabs">
            <span class="tab-content">
              <svg width="16" height="16" viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>
              React
            </span>
          </zui-tab>
          <zui-tab slot="tabs">
            <span class="tab-content">
              <svg width="16" height="16" viewBox="0 0 250 250"><path fill="#DD0031" d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path fill="#C3002F" d="M125 30v22.2-.1V230l78.9-43.7 14.2-123.1L125 30z"/><path fill="#FFF" d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2h21.7L125 52.1zm17 83.3h-34l17-40.9 17 40.9z"/></svg>
              Angular
            </span>
          </zui-tab>
          <zui-tab slot="tabs">
            <span class="tab-content">
              <svg width="16" height="16" viewBox="0 0 196.32 170.02"><path fill="#41B883" d="M120.65 0H75.67L98.16 39.23 120.65 0zm75.67 0H157.9L98.16 103.5 38.42 0H0l98.16 170.02L196.32 0z"/><path fill="#35495E" d="M120.65 0H157.9L98.16 103.5 38.42 0h37.25l22.49 39.23L120.65 0z"/></svg>
              Vue
            </span>
          </zui-tab>

          <!-- Preview & HTML Tab -->
          <zui-tab-panel slot="panels">
            <div class="preview-container">
              <slot></slot>
            </div>
            ${this.html ? html`
              <div class="code-wrapper">
                <zui-code-editor .value=${this.html} readonly language="html"></zui-code-editor>
              </div>
            ` : ''}
          </zui-tab-panel>

          <!-- React Tab -->
          <zui-tab-panel slot="panels">
            <div class="code-wrapper">
              <zui-code-editor .value=${this.react} readonly language="typescript"></zui-code-editor>
            </div>
          </zui-tab-panel>

          <!-- Angular Tab -->
          <zui-tab-panel slot="panels">
             <div class="code-wrapper">
              <zui-code-editor .value=${this.angular} readonly language="typescript"></zui-code-editor>
            </div>
          </zui-tab-panel>

          <!-- Vue Tab -->
          <zui-tab-panel slot="panels">
             <div class="code-wrapper">
              <zui-code-editor .value=${this.vue} readonly language="html"></zui-code-editor>
            </div>
          </zui-tab-panel>
        </zui-tabs>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-example': DemoExample;
  }
}
