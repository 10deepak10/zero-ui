import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('zui-slider')
export class ZuiSlider extends LitElement {
  @property({ type: Object }) value: number | [number, number] = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  @state() private _activeThumb: 'min' | 'max' | null = null;

  static styles = css`
    :host {
      display: block;
      --zui-slider-height: 6px;
      --zui-slider-thumb-size: 20px;
      --zui-slider-track-color: #e5e7eb;
      --zui-slider-fill-color: #3b82f6;
      --zui-slider-thumb-color: #ffffff;
      --zui-slider-thumb-border: 2px solid #3b82f6;
      --zui-slider-disabled-opacity: 0.5;
    }

    :host([disabled]) {
      opacity: var(--zui-slider-disabled-opacity);
      pointer-events: none;
    }

    .slider-container {
      position: relative;
      padding: 10px 0;
    }

    .label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-main, currentColor);
    }

    .track-wrapper {
      position: relative;
      height: var(--zui-slider-height);
      border-radius: 999px;
      background-color: var(--zui-slider-track-color);
      cursor: pointer;
    }

    .track-fill {
      position: absolute;
      top: 0;
      height: 100%;
      background-color: var(--zui-slider-fill-color);
      border-radius: 999px;
      pointer-events: none;
    }

    .thumb {
      position: absolute;
      top: 50%;
      width: var(--zui-slider-thumb-size);
      height: var(--zui-slider-thumb-size);
      background-color: var(--zui-slider-thumb-color);
      border: var(--zui-slider-thumb-border);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      cursor: grab;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.1s, box-shadow 0.1s;
      z-index: 1;
    }

    .thumb:hover {
      transform: translate(-50%, -50%) scale(1.1);
      z-index: 2;
    }

    .thumb:active {
      cursor: grabbing;
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
      z-index: 3;
    }
  `;

  private get _isRange(): boolean {
    return Array.isArray(this.value);
  }

  private get _values(): [number, number] {
    if (this._isRange) {
      return this.value as [number, number];
    }
    return [this.min, this.value as number];
  }

  private _getPercentage(val: number): number {
    return ((val - this.min) / (this.max - this.min)) * 100;
  }

  private _getValueFromPercentage(percentage: number): number {
    const rawValue = this.min + (percentage / 100) * (this.max - this.min);
    return Math.round(rawValue / this.step) * this.step;
  }

  private _handleTrackClick(e: MouseEvent) {
    if (this.disabled) return;
    
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = this._getValueFromPercentage(percentage);

    if (this._isRange) {
      const [minVal, maxVal] = this._values;
      const distToMin = Math.abs(newValue - minVal);
      const distToMax = Math.abs(newValue - maxVal);
      
      if (distToMin < distToMax) {
        this.value = [Math.min(newValue, maxVal), maxVal];
      } else {
        this.value = [minVal, Math.max(newValue, minVal)];
      }
    } else {
      this.value = Math.max(this.min, Math.min(this.max, newValue));
    }

    this._emitChange();
  }

  private _handleThumbMouseDown(thumb: 'min' | 'max', e: MouseEvent) {
    if (this.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    this._activeThumb = thumb;
    
    const handleMouseMove = (e: MouseEvent) => {
      const track = this.shadowRoot!.querySelector('.track-wrapper') as HTMLElement;
      const rect = track.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const newValue = this._getValueFromPercentage(percentage);

      if (this._isRange) {
        const [minVal, maxVal] = this._values;
        if (thumb === 'min') {
          this.value = [Math.min(newValue, maxVal), maxVal];
        } else {
          this.value = [minVal, Math.max(newValue, minVal)];
        }
      } else {
        this.value = Math.max(this.min, Math.min(this.max, newValue));
      }

      this._emitInput();
    };

    const handleMouseUp = () => {
      this._activeThumb = null;
      this._emitChange();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private _emitInput() {
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private _emitChange() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  render() {
    const [minVal, maxVal] = this._values;
    const minPercentage = this._getPercentage(minVal);
    const maxPercentage = this._getPercentage(maxVal);

    return html`
      ${this.label ? html`<label class="label">${this.label}</label>` : ''}
      <div class="slider-container">
        <div class="track-wrapper" @click=${this._handleTrackClick}>
          <div 
            class="track-fill" 
            style="left: ${minPercentage}%; width: ${maxPercentage - minPercentage}%"
          ></div>
          ${this._isRange ? html`
            <div 
              class="thumb" 
              style="left: ${minPercentage}%"
              @mousedown=${(e: MouseEvent) => this._handleThumbMouseDown('min', e)}
            ></div>
          ` : ''}
          <div 
            class="thumb" 
            style="left: ${maxPercentage}%"
            @mousedown=${(e: MouseEvent) => this._handleThumbMouseDown('max', e)}
          ></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-slider': ZuiSlider;
  }
}
