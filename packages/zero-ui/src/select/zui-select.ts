import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../dropdown/zui-dropdown.js';

export interface SelectOption {
  label: string;
  value: string;
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
      font-family: system-ui, -apple-system, sans-serif;
    }

    .wrapper {
      position: relative;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.375rem;
    }

    .trigger-button {
      width: 100%;
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.625rem 2.5rem 0.625rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #111827;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .trigger-button:hover:not(.disabled) {
      border-color: #9ca3af;
    }

    .trigger-button:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .trigger-button.disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .trigger-button.placeholder {
      color: #9ca3af;
    }

    .chevron {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #6b7280;
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.2s;
    }

    .chevron.open {
      transform: translateY(-50%) rotate(180deg);
    }

    .dropdown-content {
      min-width: 200px;
      max-height: 300px;
      overflow-y: auto;
      padding: 0.5rem 0;
    }

    .search-container {
      padding: 0.5rem 0.5rem 0.75rem 0.5rem;
      margin-bottom: 0.25rem;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #111827;
      box-sizing: border-box;
      background-color: #f9fafb;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background-color: #fff;
    }

    .option {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      cursor: pointer;
      color: #374151;
      font-size: 0.875rem;
      transition: background-color 0.15s;
      gap: 0.5rem;
    }

    .option:hover {
      background-color: #f3f4f6;
    }

    .option.selected {
      background-color: #e7f1ff;
      color: #0d6efd;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .checkbox.checked {
      background-color: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    .no-results {
      padding: 1rem;
      text-align: center;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .tag {
      background-color: #e7f1ff;
      color: #0d6efd;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
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
      opt.label.toLowerCase().includes(query)
    );
  }

  private _handleOptionClick(option: SelectOption) {
    if (this.multiple) {
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
        <svg class="chevron ${this._open ? 'open' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            ${this._filteredOptions.length === 0 ? html`
              <div class="no-results">No results found</div>
            ` : this._filteredOptions.map(option => {
              const isSelected = this._selectedValues.includes(option.value);
              return html`
                <div
                  class="option ${isSelected && !this.multiple ? 'selected' : ''}"
                  @click=${() => this._handleOptionClick(option)}
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
        </zui-dropdown>
      </div>
    `;
  }
}
