import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('zui-radio')
export class ZuiRadio extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';

  @query('input') input!: HTMLInputElement;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      --zui-radio-size: 18px;
      --zui-radio-color: #3b82f6;
      --zui-radio-border-color: #d1d5db;
      --zui-radio-bg: transparent;
      --zui-radio-dot-size: 8px;
      --zui-radio-disabled-opacity: 0.5;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: var(--zui-radio-disabled-opacity);
    }

    .radio-wrapper {
      display: inline-flex;
      align-items: center;
      position: relative;
      gap: 8px;
    }

    input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
      padding: 0;
      pointer-events: none;
    }

    .radio-control {
      width: var(--zui-radio-size);
      height: var(--zui-radio-size);
      border: 2px solid var(--zui-radio-border-color);
      border-radius: 50%;
      background-color: var(--zui-radio-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    /* Checked State */
    :host([checked]) .radio-control {
      border-color: var(--zui-radio-color);
    }

    .radio-dot {
      width: var(--zui-radio-dot-size);
      height: var(--zui-radio-dot-size);
      border-radius: 50%;
      background-color: var(--zui-radio-color);
      transform: scale(0);
      transition: transform 0.2s ease;
    }

    :host([checked]) .radio-dot {
      transform: scale(1);
    }

    /* Focus State */
    :host(:focus-within) .radio-control {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }

    .label-text {
      font-family: inherit;
      font-size: 1rem;
      color: currentColor;
      user-select: none;
    }
  `;

  private _handleChange(e: Event) {
    e.stopPropagation(); // Stop native change, let group handle it or emit custom
    if (this.disabled) return;

    this.checked = true;
    this.dispatchEvent(new CustomEvent('zui-radio-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, checked: this.checked }
    }));
  }

  render() {
    return html`
      <label class="radio-wrapper">
        <input
          type="radio"
          .checked=${this.checked}
          .disabled=${this.disabled}
          .value=${this.value}
          .name=${this.name}
          @change=${this._handleChange}
        />
        <div class="radio-control">
          <div class="radio-dot"></div>
        </div>
        <span class="label-text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-radio': ZuiRadio;
  }
}
