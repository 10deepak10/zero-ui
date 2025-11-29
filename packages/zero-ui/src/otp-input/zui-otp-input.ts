import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'zui-otp-input': ZuiOtpInput;
  }
}

@customElement('zui-otp-input')
export class ZuiOtpInput extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      gap: 8px;
    }

    input {
      width: 40px;
      height: 48px;
      font-size: 1.25rem;
      text-align: center;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: #111827;
      outline: none;
      transition: all 0.2s;
    }

    input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input:disabled {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }
  `;

  @property({ type: Number })
  length = 6;

  @property({ type: String })
  value = '';

  @state()
  private _inputs: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._inputs = new Array(this.length).fill('');
    if (this.value) {
      this._fillFromValue(this.value);
    }
  }

  private _fillFromValue(val: string) {
    const chars = val.split('').slice(0, this.length);
    this._inputs = this._inputs.map((_, i) => chars[i] || '');
    this.requestUpdate();
  }

  private _handleInput(e: InputEvent, index: number) {
    const input = e.target as HTMLInputElement;
    const val = input.value;

    // Handle number only
    if (!/^\d*$/.test(val)) {
      input.value = this._inputs[index];
      return;
    }

    const newInputs = [...this._inputs];
    newInputs[index] = val.slice(-1); // Take last char
    this._inputs = newInputs;
    this._emitChange();

    // Auto focus next
    if (val && index < this.length - 1) {
      const nextInput = this.shadowRoot?.querySelectorAll('input')[index + 1];
      nextInput?.focus();
    }
  }

  private _handleKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === 'Backspace') {
      if (!this._inputs[index] && index > 0) {
        // Focus previous if current is empty
        const prevInput = this.shadowRoot?.querySelectorAll('input')[index - 1];
        prevInput?.focus();
      }
    }
  }

  private _handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text/plain') || '';
    if (!/^\d+$/.test(pastedData)) return;

    this._fillFromValue(pastedData);
    this._emitChange();
    
    // Focus last filled
    const focusIndex = Math.min(pastedData.length, this.length) - 1;
    if (focusIndex >= 0) {
      const inputs = this.shadowRoot?.querySelectorAll('input');
      inputs?.[focusIndex]?.focus();
    }
  }

  private _emitChange() {
    const newValue = this._inputs.join('');
    this.value = newValue;
    this.dispatchEvent(new CustomEvent('zui-otp-change', {
      detail: { value: newValue },
      bubbles: true,
      composed: true
    }));

    if (newValue.length === this.length) {
      this.dispatchEvent(new CustomEvent('zui-otp-complete', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    return html`
      ${this._inputs.map((val, i) => html`
        <input
          type="text"
          inputmode="numeric"
          maxlength="1"
          .value=${val}
          @input=${(e: InputEvent) => this._handleInput(e, i)}
          @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, i)}
          @paste=${this._handlePaste}
        />
      `)}
    `;
  }
}
