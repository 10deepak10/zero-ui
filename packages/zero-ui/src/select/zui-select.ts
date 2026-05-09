import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../dropdown/zui-dropdown.js';

export interface SelectOption {
  label: string;
  value: string;
  keywords?: string[];
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-select': ZuiSelect;
  }
}

@customElement('zui-select')
export class ZuiSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--zui-font-family-primary);
    }

    .wrapper {
      position: relative;
    }

    label {
      display: block;
      font-size: var(--zui-font-size-sm);
      font-weight: var(--zui-font-weight-medium);
      color: var(--zui-color-text-primary);
      margin-bottom: var(--zui-space-1-5);
    }

    .trigger-button {
      width: 100%;
      background-color: var(--zui-select-bg);
      border: 1px solid var(--zui-select-border);
      border-radius: var(--zui-select-radius);
      padding: var(--zui-input-padding-y) var(--zui-space-10) var(--zui-input-padding-y) var(--zui-input-padding-x);
      font-size: var(--zui-font-size-md);
      line-height: var(--zui-leading-normal);
      color: var(--zui-select-text);
      cursor: pointer;
      transition: border-color var(--zui-duration-fast) var(--zui-easing-standard),
                  box-shadow var(--zui-duration-fast) var(--zui-easing-standard);
      text-align: left;
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--zui-space-2);
    }

    .trigger-button:hover:not(.disabled) {
      border-color: var(--zui-select-border-hover);
    }

    .trigger-button:focus {
      outline: none;
      border-color: var(--zui-select-border-focus);
      box-shadow: var(--zui-select-focus-ring);
    }

    .trigger-button.disabled {
      background-color: var(--zui-input-bg-disabled);
      color: var(--zui-input-text-disabled);
      cursor: not-allowed;
    }

    .trigger-button.placeholder {
      color: var(--zui-select-text-placeholder);
    }

    .chevron {
      position: relative;
      right: var(--zui-space-3);
      pointer-events: none;
      color: var(--zui-color-text-muted);
      width: 1.25rem;
      height: 1.25rem;
      transition: transform var(--zui-duration-fast) var(--zui-easing-standard);
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    .dropdown-content {
      min-width: 200px;
      max-height: 300px;
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
    }

    zui-dropdown[data-placement="top"] .dropdown-content {
      flex-direction: column-reverse;
    }

    .options-list {
      overflow-y: auto;
      flex: 1;
      padding: var(--zui-space-2) 0;
      min-height: 0;
    }

    .search-container {
      padding: var(--zui-space-2);
      background-color: inherit;
      flex-shrink: 0;
      border-bottom: 1px solid var(--zui-dropdown-border);
    }
    
    zui-dropdown[data-placement="top"] .search-container {
      border-bottom: none;
      border-top: 1px solid var(--zui-dropdown-border);
    }

    .search-input {
      width: 100%;
      padding: var(--zui-space-2) var(--zui-space-3);
      border: 1px solid var(--zui-select-border);
      border-radius: var(--zui-radius-sm);
      font-size: var(--zui-font-size-sm);
      color: var(--zui-select-text);
      box-sizing: border-box;
      background-color: var(--zui-select-bg);
      transition: border-color var(--zui-duration-fast) var(--zui-easing-standard),
                  box-shadow var(--zui-duration-fast) var(--zui-easing-standard);
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--zui-select-border-focus);
      box-shadow: var(--zui-select-focus-ring);
      background-color: var(--zui-select-bg);
    }

    .option {
      display: flex;
      align-items: center;
      padding: var(--zui-space-2) var(--zui-space-4);
      cursor: pointer;
      color: var(--zui-dropdown-text);
      font-size: var(--zui-font-size-sm);
      transition: background-color var(--zui-duration-fast) var(--zui-easing-standard);
      gap: var(--zui-space-2);
    }

    .option:hover {
      background-color: var(--zui-dropdown-option-bg-hover);
    }

    .option.selected {
      background-color: var(--zui-dropdown-option-bg-selected);
      color: var(--zui-dropdown-option-text-selected);
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      border: 1px solid var(--zui-checkbox-border-color);
      border-radius: var(--zui-checkbox-border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .checkbox.checked {
      background-color: var(--zui-checkbox-color);
      border-color: var(--zui-checkbox-color);
      color: var(--zui-checkbox-check-color);
    }

    .no-results {
      padding: var(--zui-space-4);
      text-align: center;
      color: var(--zui-color-text-muted);
      font-size: var(--zui-font-size-sm);
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--zui-space-1);
    }

    .tag {
      background: var(--zui-select-tag-bg);
      color: var(--zui-select-tag-text);
      padding: 2px var(--zui-space-2);
      border: 1px solid var(--zui-select-tag-border);
      border-radius: var(--zui-radius-sm);
      font-size: var(--zui-text-xs);
      font-weight: var(--zui-font-weight-medium);
      line-height: var(--zui-leading-normal);
    }
  `;

  @property({ type: Array })
  options: SelectOption[] = [];

  @property({ type: String })
  value = '';

  @property({ type: Array })
  values: string[] = [];

  @property({ type: String })
  label = '';

  @property({ type: String })
  placeholder = 'Select an option';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean })
  searchable = false;

  @state()
  private _open = false;

  @state()
  private _searchQuery = '';

  private get _selectedValues(): string[] {
    return this.multiple ? this.values : (this.value ? [this.value] : []);
  }

  private get _filteredOptions(): SelectOption[] {
    if (!this.searchable || !this._searchQuery) {
      return this.options;
    }
    const query = this._searchQuery.toLowerCase();
    return this.options.filter(opt => 
      opt.label.toLowerCase().includes(query) ||
      opt.keywords?.some(k => k.toLowerCase().includes(query))
    );
  }

  private _handleOptionClick(e: Event, option: SelectOption) {
    if (this.multiple) {
      e.stopPropagation();
      const index = this.values.indexOf(option.value);
      if (index > -1) {
        this.values = this.values.filter(v => v !== option.value);
      } else {
        this.values = [...this.values, option.value];
      }
      this._emitChange();
    } else {
      this.value = option.value;
      this._emitChange();
      this._open = false;
      this._searchQuery = '';
    }
  }

  private _emitChange() {
    this.dispatchEvent(new CustomEvent('zui-change', {
      detail: { 
        value: this.multiple ? this.values : this.value,
        values: this.multiple ? this.values : [this.value]
      },
      bubbles: true,
      composed: true
    }));
  }

  private _getTriggerText(): string {
    const selected = this._selectedValues;
    if (selected.length === 0) return this.placeholder;
    
    if (this.multiple) {
      if (selected.length === 1) {
        const opt = this.options.find(o => o.value === selected[0]);
        return opt?.label || selected[0];
      }
      return `${selected.length} items selected`;
    } else {
      const opt = this.options.find(o => o.value === this.value);
      return opt?.label || this.value;
    }
  }

  private _renderTrigger() {
    const hasSelection = this._selectedValues.length > 0;
    
    return html`
      <div
        class="trigger-button ${!hasSelection ? 'placeholder' : ''} ${this.disabled ? 'disabled' : ''}"
        role="button"
        tabindex="${this.disabled ? -1 : 0}"
        part="trigger"
        aria-disabled="${this.disabled}"
        @click=${(e: Event) => {
          if (this.disabled) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        ${this.multiple && this._selectedValues.length > 1 ? html`
          <div class="selected-tags">
            ${this._selectedValues.slice(0, 2).map(val => {
              const opt = this.options.find(o => o.value === val);
              return html`<span class="tag">${opt?.label || val}</span>`;
            })}
            ${this._selectedValues.length > 2 ? html`
              <span class="tag">+${this._selectedValues.length - 2}</span>
            ` : ''}
          </div>
        ` : this._getTriggerText()}
        <svg part="chevron" class="chevron ${this._open ? 'open' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    `;
  }



  render() {
    return html`
      <div class="wrapper">
        ${this.label ? html`<label>${this.label}</label>` : ''}
        <zui-dropdown
          @zui-dropdown-change=${(e: CustomEvent) => {
            this._open = e.detail.open;
            if (!this._open) {
              this._searchQuery = '';
            }
          }}
        >
          <div slot="trigger">
            ${this._renderTrigger()}
          </div>
          <div slot="content" class="dropdown-content">
            ${this.searchable ? html`
              <div class="search-container">
                <input
                  type="text"
                  class="search-input"
                  placeholder="Search..."
                  .value=${this._searchQuery}
                  @input=${(e: InputEvent) => this._searchQuery = (e.target as HTMLInputElement).value}
                  @click=${(e: Event) => e.stopPropagation()}
                />
              </div>
            ` : ''}
            <div class="options-list">
              ${this._filteredOptions.length === 0 ? html`
                <div class="no-results">No results found</div>
              ` : this._filteredOptions.map(option => {
                const isSelected = this._selectedValues.includes(option.value);
                return html`
                  <div
                    class="option ${isSelected && !this.multiple ? 'selected' : ''}"
                    @click=${(e: Event) => this._handleOptionClick(e, option)}
                  >
                    ${this.multiple ? html`
                      <div class="checkbox ${isSelected ? 'checked' : ''}">
                        ${isSelected ? html`
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        ` : ''}
                      </div>
                    ` : ''}
                    ${option.label}
                  </div>
                `;
              })}
            </div>
          </div>
        </zui-dropdown>
      </div>
    `;
  }
}
