import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('zui-toggle')
export class ZuiToggle extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) value = 'on';
  @property({ type: Boolean }) required = false;
  @property({ type: String }) label = '';

  @query('input') input!: HTMLInputElement;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      --zui-toggle-width: 44px;
      --zui-toggle-height: 24px;
      --zui-toggle-thumb-size: 20px;
      --zui-toggle-bg-off: #e5e7eb;
      --zui-toggle-bg-on: #3b82f6;
      --zui-toggle-thumb-color: #ffffff;
      --zui-toggle-disabled-opacity: 0.5;
      --zui-toggle-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.3);
      --zui-toggle-transition: 0.2s ease;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: var(--zui-toggle-disabled-opacity);
    }

    .toggle-wrapper {
      display: inline-flex;
      align-items: center;
      position: relative;
      gap: 12px;
    }

    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
      pointer-events: none;
    }

    .toggle-track {
      width: var(--zui-toggle-width);
      height: var(--zui-toggle-height);
      background-color: var(--zui-toggle-bg-off);
      border-radius: 9999px;
      position: relative;
      transition: background-color var(--zui-toggle-transition);
      flex-shrink: 0;
    }

    .toggle-thumb {
      width: var(--zui-toggle-thumb-size);
      height: var(--zui-toggle-thumb-size);
      background-color: var(--zui-toggle-thumb-color);
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform var(--zui-toggle-transition);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* Checked State */
    :host([checked]) .toggle-track {
      background-color: var(--zui-toggle-bg-on);
    }

    :host([checked]) .toggle-thumb {
      transform: translateX(calc(var(--zui-toggle-width) - var(--zui-toggle-thumb-size) - 4px));
    }

    /* Focus State */
    :host(:focus-within) .toggle-track {
      box-shadow: var(--zui-toggle-focus-ring);
    }

    .label-text {
      font-family: inherit;
      font-size: 1rem;
      color: currentColor;
      user-select: none;
    }
  `;

  private _handleChange(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;

    this.checked = this.input.checked;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { checked: this.checked }
    }));
  }

  render() {
    return html`
      <label class="toggle-wrapper">
        <input
          type="checkbox"
          .checked=${this.checked}
          .disabled=${this.disabled}
          .required=${this.required}
          .value=${this.value}
          .name=${this.name}
          @change=${this._handleChange}
        />
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>
        ${this.label
          ? html`<span class="label-text">${this.label}</span>`
          : html`<slot></slot>`
        }
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-toggle': ZuiToggle;
  }
}
