import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { ZuiRadio } from './zui-radio';

@customElement('zui-radio-group')
export class ZuiRadioGroup extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';
  @property({ type: String, reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';

  @queryAssignedElements({ selector: 'zui-radio' })
  radios!: ZuiRadio[];

  static styles = css`
    :host {
      display: block;
    }

    .group-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-main, currentColor);
    }

    .radio-group {
      display: flex;
      gap: 12px;
    }

    :host([orientation="vertical"]) .radio-group {
      flex-direction: column;
    }

    :host([orientation="horizontal"]) .radio-group {
      flex-direction: row;
      flex-wrap: wrap;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('zui-radio-change', this._handleRadioChange as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('zui-radio-change', this._handleRadioChange as EventListener);
  }

  private _handleRadioChange(e: CustomEvent) {
    e.stopPropagation();
    const target = e.target as ZuiRadio;
    if (target.checked) {
      this.value = target.value;
      this._updateRadios();
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      }));
    }
  }

  private _updateRadios() {
    if (this.radios) {
      this.radios.forEach(radio => {
        radio.checked = radio.value === this.value;
        if (this.name) radio.name = this.name;
      });
    }
  }

  // Handle slot changes to initialize state
  private _handleSlotChange() {
    this._updateRadios();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('value') || changedProperties.has('name')) {
      this._updateRadios();
    }
  }

  render() {
    return html`
      ${this.label ? html`<div class="group-label">${this.label}</div>` : ''}
      <div class="radio-group" role="radiogroup" aria-label=${this.label}>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-radio-group': ZuiRadioGroup;
  }
}
