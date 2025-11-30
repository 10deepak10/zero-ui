import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/select';

@customElement('select-demo')
export class SelectDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }

    .demo-section {
      margin-bottom: 2rem;
      padding: 2rem;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
      max-width: 400px;
      padding: 2rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
    }

    .output {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  `;

  @state()
  private _value1 = '';

  @state()
  private _value2 = '';

  @state()
  private _values1: string[] = [];

  @state()
  private _values2: string[] = [];

  private _options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
  ];

  render() {
    return html`
      <h1>Select</h1>
      <p>An advanced select component with search and multi-select capabilities.</p>

      <div class="demo-section">
        <h2>Single Select</h2>
        <div class="preview">
          <zui-select
            label="Choose a fruit"
            .options=${this._options}
            .value=${this._value1}
            @zui-change=${(e: CustomEvent) => this._value1 = e.detail.value}
          ></zui-select>
          <div class="output">Selected: ${this._value1 || 'None'}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Single Select with Search</h2>
        <div class="preview">
          <zui-select
            label="Search and select"
            searchable
            .options=${this._options}
            .value=${this._value2}
            @zui-change=${(e: CustomEvent) => this._value2 = e.detail.value}
          ></zui-select>
          <div class="output">Selected: ${this._value2 || 'None'}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Multi-Select</h2>
        <div class="preview">
          <zui-select
            label="Choose multiple fruits"
            multiple
            .options=${this._options}
            .values=${this._values1}
            @zui-change=${(e: CustomEvent) => this._values1 = e.detail.values}
          ></zui-select>
          <div class="output">
            Selected: ${this._values1.length > 0 ? this._values1.join(', ') : 'None'}
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Multi-Select with Search</h2>
        <div class="preview">
          <zui-select
            label="Search and select multiple"
            multiple
            searchable
            .options=${this._options}
            .values=${this._values2}
            @zui-change=${(e: CustomEvent) => this._values2 = e.detail.values}
          ></zui-select>
          <div class="output">
            Selected: ${this._values2.length > 0 ? this._values2.join(', ') : 'None'}
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Disabled</h2>
        <div class="preview">
          <zui-select
            label="Disabled select"
            disabled
            .options=${this._options}
            value="apple"
          ></zui-select>
        </div>
      </div>
    `;
  }
}
