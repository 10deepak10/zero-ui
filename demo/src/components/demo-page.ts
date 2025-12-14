import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@deepverse/zero-ui';
import './demo-example';

export interface ComponentProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
}

@customElement('demo-page')
export class DemoPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 40px;
    }

    h1 {
      margin: 0 0 16px 0;
      font-size: 2.5rem;
      font-weight: 700;
      background: var(--gradient-text, linear-gradient(135deg, #fff 0%, #a5b4fc 100%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-muted);
      max-width: 800px;
    }

    .api-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      background: var(--card-bg);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--card-border);
    }

    .api-table th,
    .api-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid var(--card-border);
    }

    .api-table th {
      background: rgba(255, 255, 255, 0.05);
      font-weight: 600;
      color: var(--text-main);
    }

    .api-table td {
      color: var(--text-muted);
    }

    .prop-name {
      color: var(--zui-primary, #60a5fa);
      font-family: monospace;
      font-weight: 600;
    }

    .prop-type {
      color: #a78bfa;
      font-family: monospace;
      font-size: 0.9em;
    }

    .prop-default {
      color: #34d399;
      font-family: monospace;
      font-size: 0.9em;
    }
  `;

  @property({ type: String }) name = '';
  @property({ type: String }) description = '';
  @property({ type: Array }) properties: ComponentProperty[] = [];

  render() {
    return html`
      <header>
        <h1>${this.name}</h1>
        <p class="description">${this.description}</p>
      </header>

      <zui-tabs>
        <zui-tab slot="tabs">Examples</zui-tab>
        <zui-tab slot="tabs">API</zui-tab>

        <zui-tab-panel slot="panels">
          <slot></slot>
        </zui-tab-panel>

        <zui-tab-panel slot="panels">
          <slot name="api"></slot>
          ${this.properties.length > 0 ? html`
            <table class="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${this.properties.map(prop => html`
                  <tr>
                    <td><span class="prop-name">${prop.name}</span></td>
                    <td><span class="prop-type">${prop.type}</span></td>
                    <td><span class="prop-default">${prop.default || '-'}</span></td>
                    <td>${prop.description}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          ` : ''}
        </zui-tab-panel>
      </zui-tabs>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page': DemoPage;
  }
}
