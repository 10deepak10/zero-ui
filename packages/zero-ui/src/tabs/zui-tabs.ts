
import { LitElement, html, css } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { ZuiTab } from './zui-tab.js';
import { ZuiTabPanel } from './zui-tab-panel.js';

@customElement('zui-tabs')
export class ZuiTabs extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--card-border, #334155);
      margin-bottom: 16px;
      gap: 2px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none; /* Firefox */
    }
    .tabs-header::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
  `;

  @queryAssignedElements({ slot: 'tabs' }) private _tabs!: ZuiTab[];
  @queryAssignedElements({ slot: 'panels' }) private _panels!: ZuiTabPanel[];

  protected firstUpdated() {
    this._handleSlotChange();
  }

  private _handleSlotChange() {
    // If no tab is active, activate the first one
    const activeTab = this._tabs.find(t => t.active);
    if (!activeTab && this._tabs.length > 0) {
      this._selectTab(0);
    }
    
    // Add click listeners
    this._tabs.forEach((tab, index) => {
      tab.onclick = () => {
        if (!tab.disabled) {
          this._selectTab(index);
        }
      };
    });
  }

  private _selectTab(index: number) {
    this._tabs.forEach((tab, i) => {
      tab.active = i === index;
    });

    this._panels.forEach((panel, i) => {
      panel.active = i === index;
    });
  }

  render() {
    return html`
      <div class="tabs-header" part="tabs-header">
        <slot name="tabs" @slotchange=${this._handleSlotChange}></slot>
      </div>
      <div class="tabs-content" part="tabs-content">
        <slot name="panels" @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-tabs': ZuiTabs;
  }
}
