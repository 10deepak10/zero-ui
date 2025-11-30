import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'zui-dropdown': ZuiDropdown;
  }
}

@customElement('zui-dropdown')
export class ZuiDropdown extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .trigger {
      cursor: pointer;
      display: inline-block;
    }

    .content {
      position: fixed;
      z-index: 50;
      min-width: 200px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.1s ease-out, transform 0.1s ease-out;
      pointer-events: none;
      visibility: hidden;
      max-height: 300px;
      overflow-y: auto;
    }

    .content.open {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
      visibility: visible;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  placement: 'left' | 'right' = 'left';

  @property({ type: Boolean })
  closeOnScroll = false;

  private _rafId: number | null = null;
  private _lastTriggerRect: DOMRect | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
    document.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('zui-dropdown-close', this._handleCloseRequest);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
    document.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('zui-dropdown-close', this._handleCloseRequest);
    this._stopPositionTracking();
  }

  private _handleCloseRequest = () => {
    this.close();
  };

  private _handleDocumentClick = (e: MouseEvent) => {
    if (!this.open) return;
    
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.close();
    }
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (this.open && e.key === 'Escape') {
      this.close();
    }
  };

  private _startPositionTracking() {
    this._stopPositionTracking();
    
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement;
    if (!trigger) return;

    this._lastTriggerRect = trigger.getBoundingClientRect();
    
    const trackPosition = () => {
      if (!this.open) {
        this._stopPositionTracking();
        return;
      }

      const currentRect = trigger.getBoundingClientRect();
      
      // Check if trigger has moved
      if (this._lastTriggerRect) {
        const moved = 
          Math.abs(currentRect.top - this._lastTriggerRect.top) > 1 ||
          Math.abs(currentRect.left - this._lastTriggerRect.left) > 1;
        
        if (moved) {
          if (this.closeOnScroll) {
            this.open = false;
            this._emitChange();
            return;
          } else {
            this._updatePosition();
          }
        }
      }
      
      this._lastTriggerRect = currentRect;
      this._rafId = requestAnimationFrame(trackPosition);
    };
    
    this._rafId = requestAnimationFrame(trackPosition);
  }

  private _stopPositionTracking() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._lastTriggerRect = null;
  }

  /**
   * Public method to close the dropdown
   */
  public close() {
    if (!this.open) return;
    this.open = false;
    this._emitChange();
    this._stopPositionTracking();
  }

  /**
   * Public method to open the dropdown
   */
  public openDropdown() {
    if (this.open) return;
    this.open = true;
    this._emitChange();
    requestAnimationFrame(() => {
      this._updatePosition();
      this._startPositionTracking();
    });
  }

  private _toggle() {
    this.open = !this.open;
    this._emitChange();
    
    if (this.open) {
      requestAnimationFrame(() => {
        this._updatePosition();
        this._startPositionTracking();
      });
    } else {
      this._stopPositionTracking();
    }
  }

  private _updatePosition = () => {
    if (!this.open) return;

    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement;
    const content = this.shadowRoot?.querySelector('.content') as HTMLElement;
    
    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = triggerRect.bottom + 8;
    let left = this.placement === 'right' 
      ? triggerRect.right - contentRect.width 
      : triggerRect.left;

    // Check if dropdown would overflow bottom
    if (top + contentRect.height > viewportHeight - 16) {
      // Try to position above
      const topAbove = triggerRect.top - contentRect.height - 8;
      if (topAbove > 16) {
        top = topAbove;
      } else {
        // If neither works, constrain height
        const maxHeight = viewportHeight - top - 16;
        content.style.maxHeight = `${maxHeight}px`;
      }
    }

    // Check if dropdown would overflow right
    if (left + contentRect.width > viewportWidth - 16) {
      left = viewportWidth - contentRect.width - 16;
    }

    // Check if dropdown would overflow left
    if (left < 16) {
      left = 16;
    }

    content.style.top = `${top}px`;
    content.style.left = `${left}px`;
  };

  private _emitChange() {
    this.dispatchEvent(new CustomEvent('zui-dropdown-change', {
      detail: { open: this.open },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="trigger" @click=${this._toggle}>
        <slot name="trigger"></slot>
      </div>
      <div class="content ${this.open ? 'open' : ''}">
        <slot name="content"></slot>
      </div>
    `;
  }
}
