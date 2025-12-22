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
      width: 100%;
    }

    .trigger {
      cursor: pointer;
      display: block;
      width: 100%;
    }

    .content {
      position: fixed;
      z-index: 50;
      min-width: 200px;
      background: var(--zui-dropdown-bg, var(--card-bg, #ffffff));
      color: var(--zui-dropdown-color, var(--text-main, inherit));
      border: 1px solid var(--zui-dropdown-border, var(--card-border, #e5e7eb));
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
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
    this.addEventListener('click', this._handleContentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
    document.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('zui-dropdown-close', this._handleCloseRequest);
    this.removeEventListener('click', this._handleContentClick);
    this._stopPositionTracking();
  }

  private _handleContentClick = (e: MouseEvent) => {
    if (!this.open) return;

    // Check if the click target is an input or interactive element that shouldn't close the dropdown
    const path = e.composedPath();
    const target = path[0] as HTMLElement;

    // Don't close if clicking input or textarea (e.g. search box)
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Don't close if explicit "keep-open" attribute is present
    if (target.hasAttribute('data-keep-open') || target.closest('[data-keep-open]')) {
      return;
    }

    // Don't close if clicking independent scrollbar or container background
    // Logic: if click is on a "item" or "action", close.
    // For now, simpler heuristic: if it's NOT the trigger, close it. 
    // Wait, the event listener is on `this`. 
    // We want to avoid closing if clicking the trigger (handled by toggle) or the whitespace of the panel?
    // User request: "if item got click".

    // Check if click is inside the content area
    const content = this.shadowRoot?.querySelector('.content');
    if (path.includes(content as EventTarget)) {
      this.close();
    }
  };

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

    // Check availability space
    const spaceBelow = viewportHeight - triggerRect.bottom - 16; // 16px padding
    const spaceAbove = triggerRect.top - 16;
    const height = contentRect.height;

    let isAbove = false;

    // If it doesn't fit below, and fits above OR there is more space above, put it above
    if (height > spaceBelow && (height <= spaceAbove || spaceAbove > spaceBelow)) {
      isAbove = true;
    }

    if (isAbove) {
      // Position above: anchor to bottom
      // bottom value is distance from bottom of viewport
      const bottom = viewportHeight - triggerRect.top + 8;
      content.style.bottom = `${bottom}px`;
      content.style.top = '';
      this.setAttribute('data-placement', 'top');

      // Constrain height if needed
      if (height > spaceAbove) {
        content.style.maxHeight = `${spaceAbove}px`;
      } else {
        // Restore default max-height if it fits now (or let CSS handle it)
        content.style.maxHeight = '300px';
      }
    } else {
      // Position below: anchor to top
      content.style.top = `${top}px`;
      content.style.bottom = '';
      this.setAttribute('data-placement', 'bottom');

      // Constrain height if needed
      if (height > spaceBelow) {
        content.style.maxHeight = `${spaceBelow}px`;
      } else {
        content.style.maxHeight = '300px';
      }
    }

    // Check horizontal overflow
    if (left + contentRect.width > viewportWidth - 16) {
      left = viewportWidth - contentRect.width - 16;
    }
    if (left < 16) {
      left = 16;
    }

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
