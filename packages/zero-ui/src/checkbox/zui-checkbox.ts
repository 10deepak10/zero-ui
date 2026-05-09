import { LitElement, html, css, type PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('zui-checkbox')
export class ZuiCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) value = 'on';
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  @query('input') input!: HTMLInputElement;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: var(--zui-checkbox-disabled-opacity);
    }

    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      position: relative;
      gap: 8px;
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

    .checkbox-control {
      width: var(--zui-checkbox-size);
      height: var(--zui-checkbox-size);
      border: 2px solid var(--zui-checkbox-border-color);
      border-radius: var(--zui-checkbox-border-radius);
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color var(--zui-duration-fast) var(--zui-easing-standard),
                  border-color var(--zui-duration-fast) var(--zui-easing-standard),
                  box-shadow var(--zui-duration-fast) var(--zui-easing-standard),
                  transform var(--zui-duration-fast) var(--zui-easing-standard);
      flex-shrink: 0;
    }

    :host([checked]) .checkbox-control,
    :host([indeterminate]) .checkbox-control {
      background-color: var(--zui-checkbox-color);
      border-color: var(--zui-checkbox-color);
    }

    :host(:focus-within) .checkbox-control {
      box-shadow: var(--zui-checkbox-focus-ring);
    }

    .icon {
      color: var(--zui-checkbox-check-color);
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: scale(0.5);
      transition: opacity var(--zui-duration-fast) var(--zui-easing-standard),
                  transform var(--zui-duration-fast) var(--zui-easing-standard);
    }

    :host([checked]) .icon,
    :host([indeterminate]) .icon {
      opacity: 1;
      transform: scale(1);
    }

    .label-text {
      font-family: inherit;
      font-size: var(--zui-font-size-md);
      color: currentColor;
      user-select: none;
    }
  `;

  private _handleChange(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;

    this.checked = this.input.checked;
    this.indeterminate = false; // interacting always clears indeterminate

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { checked: this.checked }
    }));
  }

  updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    if (changedProperties.has('indeterminate')) {
      if (this.input) {
        this.input.indeterminate = this.indeterminate;
      }
    }
  }

  render() {
    return html`
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          .checked=${this.checked}
          .disabled=${this.disabled}
          .required=${this.required}
          .value=${this.value}
          .name=${this.name}
          @change=${this._handleChange}
        />
        <div class="checkbox-control">
          ${this.indeterminate
            ? html`
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              `
            : html`
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              `
          }
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
    'zui-checkbox': ZuiCheckbox;
  }
}
