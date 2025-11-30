import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'zui-star-rating': ZuiStarRating;
  }
}

@customElement('zui-star-rating')
export class ZuiStarRating extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
    }

    .stars {
      display: flex;
      gap: 4px;
      cursor: pointer;
    }

    .stars.readonly {
      cursor: default;
    }

    .star {
      width: 24px;
      height: 24px;
      transition: transform 0.1s;
    }

    .star:not(.readonly):hover {
      transform: scale(1.1);
    }
  `;

  @property({ type: Number })
  max = 5;

  @property({ type: Number })
  value = 0;

  @property({ type: Boolean })
  readonly = false;

  private _handleStarClick(index: number) {
    if (this.readonly) return;
    
    this.value = index + 1;
    this.dispatchEvent(new CustomEvent('zui-rating-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _getFillPercentage(index: number): number {
    const value = this.value;
    if (value >= index + 1) return 100;
    if (value <= index) return 0;
    return (value - index) * 100;
  }

  render() {
    // Generate a unique ID prefix for gradients to avoid conflicts
    const uniqueId = Math.random().toString(36).substr(2, 9);

    return html`
      <div class="stars ${this.readonly ? 'readonly' : ''}">
        ${Array.from({ length: this.max }, (_, i) => {
          const fill = this._getFillPercentage(i);
          const gradientId = `grad-${uniqueId}-${i}`;
          
          return html`
            <svg
              class="star ${this.readonly ? 'readonly' : ''}"
              viewBox="0 0 24 24"
              @click=${() => this._handleStarClick(i)}
            >
              <defs>
                <linearGradient id=${gradientId}>
                  <stop offset="${fill}%" stop-color="#fbbf24" />
                  <stop offset="${fill}%" stop-color="#d1d5db" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#${gradientId})" 
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
              />
            </svg>
          `;
        })}
      </div>
    `;
  }
}
