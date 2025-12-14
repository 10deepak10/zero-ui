import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

export type UploadState = 'idle' | 'loading' | 'success' | 'error';

@customElement('zui-file-upload')
export class ZuiFileUpload extends LitElement {
  static formAssociated = true;

  static styles = css`
    :host {
      display: block;
      
      /* Color variables */
      --zui-border-color: var(--card-border, #e5e7eb);
      --zui-border-color-hover: var(--zui-primary, #3b82f6);
      --zui-border-color-loading: var(--zui-primary, #3b82f6);
      --zui-border-color-success: #10b981;
      --zui-border-color-error: #ef4444;
      
      --zui-bg-color: var(--card-bg, #ffffff);
      --zui-bg-color-loading: var(--bg-muted, #eff6ff);
      --zui-bg-color-success: rgba(16, 185, 129, 0.1);
      --zui-bg-color-error: rgba(239, 68, 68, 0.1);
      
      --zui-icon-bg: var(--bg-muted, #f0f9ff);
      --zui-icon-bg-alt: var(--bg-hover, #f3f4f6);
      --zui-icon-color: var(--zui-primary, #3b82f6);
      
      --zui-text-primary: var(--text-main, #111827);
      --zui-text-secondary: var(--text-muted, #6b7280);
      --zui-link-color: var(--zui-primary, #3b82f6);
      --zui-error-color: #ef4444;
      
      --zui-file-bg: var(--bg-muted, #f9fafb);
      --zui-progress-bg: var(--card-border, #e5e7eb);
      --zui-progress-bar: var(--zui-primary, #3b82f6);
      
      /* Spacing variables */
      --zui-padding: 32px;
      --zui-border-width: 2px;
      --zui-border-radius: 12px;
      --zui-gap: 16px;
      
      /* Size variables */
      --zui-icon-size: 56px;
      --zui-icon-size-loading: 48px;
      --zui-max-width: 100%;
      
      /* Typography */
      --zui-label-size: 18px;
      --zui-label-weight: 600;
      --zui-hint-size: 14px;
      --zui-info-size: 13px;
      --zui-filename-size: 14px;
      --zui-filename-weight: 500;
      --zui-meta-size: 12px;
      --zui-error-size: 13px;
      
      /* Effects */
      --zui-transition-speed: 0.2s;
      --zui-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      --zui-disabled-opacity: 0.6;
    }

    .upload-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--zui-padding);
      border: var(--zui-border-width) dashed var(--zui-border-color);
      border-radius: var(--zui-border-radius);
      transition: border-color var(--zui-transition-speed);
      background: var(--zui-bg-color);
      cursor: pointer;
    }

    .upload-wrapper:hover {
      border-color: var(--zui-border-color-hover);
    }

    .upload-wrapper.loading {
      border-color: var(--zui-border-color-loading);
      background: var(--zui-bg-color-loading);
      cursor: default;
    }

    .upload-wrapper.success {
      border-color: var(--zui-border-color-success);
      background: var(--zui-bg-color-success);
    }

    .upload-wrapper.error {
      border-color: var(--zui-border-color-error);
      background: var(--zui-bg-color-error);
    }

    .upload-wrapper.disabled {
      opacity: var(--zui-disabled-opacity);
      cursor: not-allowed;
    }

    .content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--zui-gap);
      width: 100%;
      max-width: var(--zui-max-width);
    }

    input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    input[type="file"]:disabled {
      cursor: not-allowed;
    }

    .icon {
      width: var(--zui-icon-size);
      height: var(--zui-icon-size);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zui-icon-bg);
      color: var(--zui-icon-color);
      transition: all var(--zui-transition-speed);
    }

    .loading .icon {
      width: var(--zui-icon-size-loading);
      height: var(--zui-icon-size-loading);
    }

    .success .icon {
      background: #d1fae5;
      color: #059669;
    }

    .error .icon {
      background: #fee2e2;
      color: #dc2626;
    }

    .icon svg {
      width: 24px;
      height: 24px;
    }

    .label {
      font-size: var(--zui-label-size);
      font-weight: var(--zui-label-weight);
      color: var(--zui-text-primary);
    }

    .hint {
      color: var(--zui-text-secondary);
      font-size: var(--zui-hint-size);
      margin: 0;
      text-align: center;
      font-weight: 400;
    }

    .link {
      color: var(--zui-link-color);
    }

    .info {
      font-size: var(--zui-info-size);
      color: var(--zui-text-secondary);
    }

    .file-display {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--zui-gap) 16px;
      background: var(--zui-file-bg);
      border-radius: var(--zui-border-radius);
      box-shadow: var(--zui-shadow);
    }

    .file-info {
      flex: 1;
      min-width: 0;
    }

    .filename {
      font-size: var(--zui-filename-size);
      font-weight: var(--zui-filename-weight);
      color: var(--zui-text-primary);
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      font-size: var(--zui-meta-size);
      color: var(--zui-text-secondary);
      text-transform: uppercase;
      margin-top: 2px;
    }

    .progress {
      width: 100%;
      height: 4px;
      background: var(--zui-progress-bg);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 8px;
    }

    .progress-bar {
      height: 100%;
      background: var(--zui-progress-bar);
      transition: width var(--zui-transition-speed);
      border-radius: 2px;
    }

    .btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      background: transparent;
      padding: 0;
      margin-left: var(--zui-gap);
      flex-shrink: 0;
    }

    .btn:hover {
      background: var(--zui-icon-bg-alt);
    }

    .btn svg {
      width: 20px;
      height: 20px;
    }

    .error-msg {
      color: var(--zui-error-color);
      font-size: var(--zui-error-size);
      margin-top: 8px;
    }
  `;

  private _internals: ElementInternals;
  private _file: File | null = null;

  @query('input[type="file"]') private _input!: HTMLInputElement;

  @property({ type: String }) name = '';
  @property({ type: String }) accept = '*/*';
  @property({ type: Number }) maxSize = 10; // MB
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: Number }) progress = 0;

  @state() private _state: UploadState = 'idle';
  @state() private _errorMsg = '';
  @state() private _filename = '';
  @state() private _filesize = 0;
  @state() private _extension = '';

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Form integration
  get form() {
    return this._internals.form;
  }

  get value() {
    return this._file;
  }

  set value(file: File | null) {
    this._file = file;
    this._updateFormValue();
  }

  get validity() {
    return this._internals.validity;
  }

  get validationMessage() {
    return this._internals.validationMessage;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }

  // Lifecycle
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dragover', this._handleDragOver);
    this.addEventListener('drop', this._handleDrop);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dragover', this._handleDragOver);
    this.removeEventListener('drop', this._handleDrop);
  }

  // Methods
  private _updateFormValue() {
    const formData = new FormData();
    if (this._file) {
      formData.append(this.name || 'file', this._file);
    }
    this._internals.setFormValue(this._file ? formData : null);
    this._validate();
  }

  private _validate() {
    if (this.required && !this._file) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please select a file',
        this._input
      );
    } else {
      this._internals.setValidity({});
    }
  }

  private _formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  private _getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot + 1).toUpperCase() : '';
  }

  private _getAcceptType(): string {
    const val = this.accept.toLowerCase();
    if (val.includes('zip')) return 'zip';
    if (val.includes('pdf')) return 'pdf';
    if (val.includes('csv')) return 'csv';
    return 'file';
  }

  private _handleDragOver = (e: DragEvent) => {
    if (this.disabled) return;
    e.preventDefault();
  };

  private _handleDrop = (e: DragEvent) => {
    if (this.disabled) return;
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) this._processFile(file);
  };

  private _handleChange(e: Event) {
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this._processFile(file);
    input.value = '';
  }

  private _processFile(file: File) {
    this._state = 'loading';
    this._errorMsg = '';

    // Validate type
    const acceptedTypes = this.accept.split(',').map(t => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    const isValid = acceptedTypes.includes('*/*') || acceptedTypes.some(type => {
      if (type.startsWith('.')) return fileName.endsWith(type);
      if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
      return fileType === type;
    });

    if (!isValid && this.accept !== '*/*') {
      this._handleError('Invalid file type');
      return;
    }

    // Validate size
    const maxBytes = this.maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      this._handleError(`File size exceeds ${this.maxSize} MB`);
      return;
    }

    // Success
    this._file = file;
    this._filename = file.name;
    this._filesize = file.size;
    this._extension = this._getExtension(file.name);
    this._state = 'success';
    this._updateFormValue();

    this.dispatchEvent(new CustomEvent('change', { 
      detail: { file },
      bubbles: true,
      composed: true 
    }));
  }

  private _handleError(message: string) {
    this._state = 'error';
    this._errorMsg = message;
    this._file = null;
    this._updateFormValue();
    
    this.dispatchEvent(new CustomEvent('error', { 
      detail: { message },
      bubbles: true,
      composed: true 
    }));

    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this._file = null;
    this._filename = '';
    this._filesize = 0;
    this._extension = '';
    this._state = 'idle';
    this._errorMsg = '';
    this._updateFormValue();

    this.dispatchEvent(new CustomEvent('clear', { 
      bubbles: true,
      composed: true 
    }));
  }

  private _renderIcon() {
    const type = this._getAcceptType();
    const paths: Record<string, string> = {
      zip: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9 13v6h6v-6H9zm0-2h6V9H9v2z',
      pdf: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 11h-2v2h-1v-2H8v-1h2v-2h1v2h2v1z',
      csv: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9 15h2v2H9v-2zm4 0h2v2h-2v-2zM9 11h2v2H9v-2zm4 0h2v2h-2v-2z',
      file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 6V3.5L18.5 8H14z'
    };

    return html`
      <div class="icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="${paths[type] || paths.file}" />
        </svg>
      </div>
    `;
  }

  render() {
    const hasFile = this._state !== 'idle';
    const isLoading = this._state === 'loading';

    return html`
      <div class="upload-wrapper ${this._state} ${this.disabled ? 'disabled' : ''}">
        <div class="content">
          ${this._renderIcon()}
          
          <input
            type="file"
            accept="${this.accept}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            @change="${this._handleChange}"
          />

          ${hasFile ? html`
            <div class="file-display">
              <div class="file-info">
                <span class="filename">${this._filename}</span>
                ${this._filesize ? html`
                  <div class="meta">${this._extension} ${this._formatSize(this._filesize)}</div>
                ` : ''}
                ${isLoading && this.progress > 0 ? html`
                  <div class="progress">
                    <div class="progress-bar" style="width: ${this.progress}%"></div>
                  </div>
                ` : ''}
              </div>

              ${!isLoading ? html`
                <button 
                  type="button"
                  class="btn" 
                  @click="${this.clear}"
                  ?disabled="${this.disabled}"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${this._state === 'error' ? html`
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    ` : html`
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    `}
                  </svg>
                </button>
              ` : ''}
            </div>
          ` : html`
            ${this.label ? html`<span class="label">${this.label}</span>` : ''}
            <p class="hint">
              Drop file or <span class="link">click here</span> to choose
            </p>
            <span class="info">${this._getAcceptType()} up to ${this.maxSize} MB</span>
          `}

          ${this._errorMsg ? html`
            <div class="error-msg">${this._errorMsg}</div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'zui-file-upload': ZuiFileUpload;
  }
}