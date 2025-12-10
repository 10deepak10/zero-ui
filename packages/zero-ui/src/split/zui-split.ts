import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('zui-split')
export class ZuiSplit extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .container {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .container.vertical {
      flex-direction: column;
    }

    .pane {
      overflow: auto;
      min-width: 0;
      min-height: 0;
    }

    .gutter {
      flex: 0 0 auto;
      background: var(--split-gutter-bg, rgba(255, 255, 255, 0.1));
      position: relative;
      z-index: 10;
      transition: background 0.2s;
    }

    .gutter::after {
      content: '';
      position: absolute;
      background: var(--split-handle-color, rgba(255, 255, 255, 0.3));
      border-radius: 99px;
    }

    .gutter:hover, .gutter.active {
      background: var(--split-gutter-hover-bg, rgba(59, 130, 246, 0.5));
    }

    /* Horizontal styles */
    .container:not(.vertical) .gutter {
      width: var(--gutter-size, 8px);
      cursor: col-resize;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container:not(.vertical) .gutter::after {
      width: 4px;
      height: 24px;
    }

    /* Vertical styles */
    .container.vertical .gutter {
      height: var(--gutter-size, 8px);
      cursor: row-resize;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container.vertical .gutter::after {
      width: 24px;
      height: 4px;
    }

    .pane-1 {
      /* Flex basis will be controlled via style map or inline styles */
    }

    .pane-2 {
      flex: 1; /* Take remaining space */
    }

    /* Disable selection while dragging */
    :host([resizing]) {
      user-select: none;
      -webkit-user-select: none;
      cursor: col-resize; 
    }
    
    :host([resizing][direction="vertical"]) {
      cursor: row-resize;
    }
    
    :host([resizing]) iframe {
      pointer-events: none; /* Prevent iframes from stealing mouse events */
    }
  `;

  @property({ type: String, reflect: true }) 
  direction: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: Number }) 
  gutterSize = 8;

  @property({ type: String })
  initialSplit = '50%';

  @property({ type: Boolean, reflect: true })
  resizing = false;

  @state() private _splitSize: string = '50%';
  @query('.container') private _container!: HTMLElement;

  protected firstUpdated() {
    this._splitSize = this.initialSplit;
  }

  private _startResize(e: PointerEvent) {
    e.preventDefault();
    this.resizing = true;
    
    // We can't rely just on _splitSize because it might be % but we are moving pixels
    // So we calculate the initial pixel size
    const containerRect = this._container.getBoundingClientRect();
    const isVertical = this.direction === 'vertical';
    const totalSize = isVertical ? containerRect.height : containerRect.width;

    // Capturing initial pointer capture is good practice
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      if (!this.resizing) return;
      
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      
      let newSize: number;
      
      if (isVertical) {
        const offset = currentY - containerRect.top;
        newSize = offset; // This is the new height of pane 1
      } else {
        const offset = currentX - containerRect.left;
        newSize = offset; // This is the new width of pane 1
      }

      // Constrain
      newSize = Math.max(0, Math.min(newSize, totalSize - this.gutterSize));

      // Convert back to percentage for responsiveness? 
      // Or keep as pixels? Pixels feel more stable during drag.
      // But percentage is better for window resize. 
      // Let's stick to percentage for the state.
      const percentage = (newSize / totalSize) * 100;
      this._splitSize = `${percentage}%`;
    };

    const onUp = () => {
      this.resizing = false;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  render() {
    const isVertical = this.direction === 'vertical';
    
    const pane1Style = isVertical 
      ? `height: ${this._splitSize}` 
      : `width: ${this._splitSize}; flex: 0 0 ${this._splitSize}`;

    return html`
      <div 
        class="container ${isVertical ? 'vertical' : ''}"
        style="--gutter-size: ${this.gutterSize}px"
      >
        <div class="pane pane-1" style="${pane1Style}">
          <slot name="one"></slot>
          <!-- Fallback if no named slots used? -->
          <slot></slot>
        </div>
        
        <div 
          class="gutter ${this.resizing ? 'active' : ''}"
          @pointerdown=${this._startResize}
        ></div>
        
        <div class="pane pane-2">
          <slot name="two"></slot>
        </div>
      </div>
    `;
  }
}
