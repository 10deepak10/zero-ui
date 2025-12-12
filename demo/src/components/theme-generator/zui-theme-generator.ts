
import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { type ThemeConfig, DEFAULT_THEME } from './theme-models.js';
import { generateCssVariables, getContrastRatio } from './theme-utils.js';
import { extractColorsFromImage, mapPaletteToTheme } from './image-utils.js';
import '@deepverse/zero-ui/tabs';
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/split';

@customElement('zui-theme-generator')
export class ZuiThemeGenerator extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      --sidebar-width: 350px;
      box-sizing: border-box;
    }
    
    *, *:before, *:after {
        box-sizing: border-box;
    }

    .container {
      display: flex;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      background: var(--card-bg, #1e1e1e);
      color: var(--text-main, #fff);
    }

    .sidebar {
      width: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      background: var(--sidebar-bg, rgba(255, 255, 255, 0.04));
      flex-shrink: 0;
    }

    .preview-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
      background: var(--bg-body, #0f172a);
      overflow: hidden;
    }

    .toolbar {
        height: 60px;
        border-bottom: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        background: var(--sidebar-bg, rgba(255, 255, 255, 0.04));
        flex-shrink: 0;
    }

    .preview-content {
        flex: 1;
        overflow-y: auto;
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .config-panel {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
    }

    .form-group {
        margin-bottom: 16px;
    }

    .form-label {
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 8px;
        display: block;
        color: var(--text-muted, #94a3b8);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .color-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }
    
    input[type="color"] {
        -webkit-appearance: none;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        padding: 0;
        background: none;
    }
    
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    
    input[type="color"]::-webkit-color-swatch {
        border: 1px solid var(--card-border, #ccc);
        border-radius: 6px;
    }

    input[type="text"] {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--card-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        background: rgba(255,255,255,0.05); /* Slightly lighter than bg */
        color: var(--text-main, #fff);
        font-family: monospace;
    }
    
    input[type="text"]:focus {
        outline: none;
        border-color: var(--color-primary, #3b82f6);
        background: rgba(255,255,255,0.1);
    }

    h3 {
        margin: 0 0 16px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-main, #fff);
    }
    
    .section-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text-main, #fff);
        margin: 24px 0 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--card-border, rgba(255,255,255,0.1));
    }

    /* Preview component overrides to avoid system theme leakage */
    .preview-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: var(--font-family);
    }
    .preview-btn-primary {
        background: var(--color-primary);
        color: #fff; /* Assuming primary is dark/vibrant enough */
    }
    .preview-btn-secondary {
        background: var(--color-secondary);
        color: #fff;
    }
    .preview-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
  `;

  @property({ type: Object }) defaultTheme: ThemeConfig = DEFAULT_THEME;
  @property({ type: Boolean }) showPreview = true;

  @state() private _theme: ThemeConfig = { ...DEFAULT_THEME };
  @state() private _generatedCss = '';
  @state() private _previewImage: string = '';
  @state() private _previewMode: 'light' | 'dark' = 'light';

  updated(changedProperties: Map<string, any>) {
      if (changedProperties.has('_previewMode')) {
          this._updateTheme();
      }
  }

  /* Scaling State */
  @state() private _scale = 1;
  private _resizeObserver: ResizeObserver | null = null;

  connectedCallback() {
      super.connectedCallback();
      this._updateTheme();
      
      // Default to Light mode or System
      this._previewMode = 'light';
      
      // Setup ResizeObserver for scaling
      setTimeout(() => {
          const container = this.shadowRoot?.querySelector('.preview-wrapper');
          if (container) {
              this._resizeObserver = new ResizeObserver((entries) => {
                  for (let entry of entries) {
                       const width = entry.contentRect.width;
                       // Target desktop width approx 1200px (or 100% if wider)
                       // If container is smaller than 1024px, we scale down.
                       const targetWidth = 1200;
                       if (width < targetWidth) {
                           this._scale = width / targetWidth;
                       } else {
                           this._scale = 1;
                       }
                  }
              });
              this._resizeObserver.observe(container);
          }
      }, 0);
  }

  disconnectedCallback() {
      super.disconnectedCallback();
      if (this._resizeObserver) {
          this._resizeObserver.disconnect();
      }
  }

  private _updateTheme() {
       // We now generate CSS based on the ACTIVE preview mode's palette.
       // This ensures "What You See Is What You Edit".
       
       this._generatedCss = generateCssVariables(this._theme, this._previewMode);
      
       this.dispatchEvent(new CustomEvent('change', { 
          detail: { theme: this._theme, css: this._generatedCss } 
       }));
  }

  private _handleColorChange(key: string, value: string) {
       // We update the specific palette for the current mode
       const currentPalette = { ...this._theme.colors[this._previewMode] };
       
       // @ts-ignore - dynamic key access
       currentPalette[key] = value;

       this._theme = {
           ...this._theme,
           colors: {
               ...this._theme.colors,
               [this._previewMode]: currentPalette
           }
       };
       
       this._updateTheme();
  }
  
  // Removed legacy _handleColorChange duplicate or old signature



  private _resetToDefault() {
      this._theme = JSON.parse(JSON.stringify(DEFAULT_THEME));
      this._updateTheme();
  }

  private async _handleImageUpload(file: File) {
      try {
          // Create URL for preview
          this._previewImage = URL.createObjectURL(file);
          
          const colors = await extractColorsFromImage(file);
          console.log('Extracted Colors:', colors);
          const newTheme = mapPaletteToTheme(colors);
          this._theme = newTheme;
          
          // Switch to Dark mode if the auto-extracted dark background is very dominant? 
          // For now, stick to light or user preference.
          
          this._updateTheme();
      } catch (err) {
          console.error('Failed to extract theme from image', err);
          alert('Failed to extract theme from image');
      }
  }

  private _copyJson() {
      navigator.clipboard.writeText(JSON.stringify(this._theme, null, 2));
      alert('JSON copied to clipboard!');
  }

  private _renderColorInput(label: string, key: string) {
      const palette = this._theme.colors[this._previewMode] as any;
      const value = palette[key];
      
      let contrastMsg = '';
      if (key === 'text' || key === 'background') {
          const otherKey = key === 'text' ? 'background' : 'text';
          const otherValue = palette[otherKey];
          const ratio = getContrastRatio(value, otherValue);
          if (ratio < 4.5) {
              contrastMsg = `⚠️ Low Contrast: ${ratio.toFixed(2)}`;
          }
      }

      return html`
        <div class="color-row">
            <input 
                type="color" 
                .value=${value}
                @input=${(e: Event) => this._handleColorChange(key, (e.target as HTMLInputElement).value)}
            >
            <input 
                type="text" 
                .value=${value}
                @change=${(e: Event) => this._handleColorChange(key, (e.target as HTMLInputElement).value)}
            >
            <span style="min-width: 80px; font-size: 0.9rem;">${label}</span>
            ${contrastMsg ? html`<span style="color: var(--color-danger, #ef4444); font-size: 0.75rem; margin-left: auto;">${contrastMsg}</span>` : ''}
        </div>
      `;
  }

  render() {
    return html`
      <div class="container">
        <!-- Configuration Panel -->
        <div class="sidebar">
            <div style="padding: 16px; border-bottom: 1px solid var(--card-border, rgba(255,255,255,0.1));">
                 <h3>Theme Config</h3>
                 <p style="font-size: 0.8rem; color: var(--text-muted, #94a3b8); margin: 0 0 16px;">Customize application tokens</p>
                 
                 <!-- Image Upload -->
                 <div style="
                    border: 2px dashed var(--card-border, rgba(255,255,255,0.1)); 
                    border-radius: 8px; 
                    padding: 16px; 
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: rgba(255,255,255,0.02);
                 "
                 @click=${() => this.shadowRoot?.getElementById('fileInput')?.click()}
                 @dragover=${(e: DragEvent) => { e.preventDefault(); e.dataTransfer!.dropEffect = 'copy'; }}
                 @drop=${(e: DragEvent) => {
                     e.preventDefault();
                     const file = e.dataTransfer?.files[0];
                     if (file) this._handleImageUpload(file);
                 }}
                 >
                    <input type="file" id="fileInput" accept="image/*" style="display: none" 
                        @change=${(e: any) => {
                            const file = e.target.files[0];
                            if (file) this._handleImageUpload(file);
                        }}
                    >
                    <div style="font-size: 1.5rem; margin-bottom: 8px;">📷</div>
                    <div style="font-size: 0.85rem; color: var(--text-main, #fff);">Drop image to extract theme</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">Supports PNG, JPG, WEBP</div>
                 </div>
            </div>
            
            <div class="config-panel">
                 <zui-tabs>
                    <zui-tab slot="tabs">Colors</zui-tab>
                    <zui-tab slot="tabs">Typography</zui-tab>
                    <zui-tab slot="tabs">More</zui-tab>

                    <zui-tab-panel slot="panels">
                        <div style="
                            background: rgba(255,255,255,0.05); 
                            padding: 8px 12px; 
                            border-radius: 6px; 
                            margin-bottom: 16px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            border: 1px solid var(--color-primary, #3b82f6);
                        ">
                            <span style="font-size: 1.2rem;">${this._previewMode === 'light' ? '☀️' : '🌙'}</span>
                            <div>
                                <div style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; font-weight: 700;">Editing Mode</div>
                                <div style="font-weight: 600; text-transform: capitalize;">${this._previewMode} Theme</div>
                            </div>
                        </div>

                        <div class="section-title">Brand Colors</div>
                        ${this._renderColorInput('Primary', 'primary')}
                        ${this._renderColorInput('Secondary', 'secondary')}
                        
                        <div class="section-title">Semantic Colors</div>
                        ${this._renderColorInput('Success', 'success')}
                        ${this._renderColorInput('Danger', 'danger')}
                        ${this._renderColorInput('Warning', 'warning')}
                        ${this._renderColorInput('Info', 'info')}
                        
                        <div class="section-title">Base Colors</div>
                        ${this._renderColorInput('Background', 'background')}
                        ${this._renderColorInput('Surface', 'surface')}
                        ${this._renderColorInput('Text', 'text')}
                    </zui-tab-panel>

                    <zui-tab-panel slot="panels">
                        <div class="form-group">
                            <label class="form-label">Font Family</label>
                            <input type="text" style="width: 100%" 
                                .value=${this._theme.typography.fontFamily}
                                @change=${(e: any) => {
                                    this._theme.typography.fontFamily = e.target.value;
                                    this._updateTheme();
                                    this.requestUpdate();
                                }}
                            >
                        </div>
                    </zui-tab-panel>

                    <zui-tab-panel slot="panels">
                        <div class="section-title">Border Radius</div>
                        <!-- Add fields here -->
                         <div class="form-group">
                            <label class="form-label">Small (sm)</label>
                            <input type="text" 
                                .value=${this._theme.borderRadius.sm} 
                                @change=${(e: any) => { this._theme.borderRadius.sm = e.target.value; this._updateTheme(); }}
                            >
                         </div>
                         <div class="form-group">
                            <label class="form-label">Medium (md)</label>
                            <input type="text" 
                                .value=${this._theme.borderRadius.md} 
                                @change=${(e: any) => { this._theme.borderRadius.md = e.target.value; this._updateTheme(); }}
                            >
                         </div>
                    </zui-tab-panel>
                 </zui-tabs>
            </div>
            
            <div style="padding: 16px; border-top: 1px solid var(--card-border); display: flex; gap: 8px;">
                <zui-button size="sm" variant="secondary" @click=${this._resetToDefault}>Reset</zui-button>
                <zui-button size="sm" @click=${this._copyJson}>Copy JSON</zui-button>
            </div>
        </div>

        <!-- Live Preview -->
        <div class="preview-area">
            <div class="toolbar">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <span class="form-label" style="margin: 0">Live Preview</span>
                    <!-- Light/Dark Toggle -->
                    <div style="display: flex; background: rgba(0,0,0,0.2); padding: 2px; border-radius: 99px;">
                        <button 
                            @click=${() => this._previewMode = 'light'}
                            style="
                                border: none; 
                                background: ${this._previewMode === 'light' ? '#fff' : 'transparent'}; 
                                color: ${this._previewMode === 'light' ? '#000' : '#888'};
                                border-radius: 99px; 
                                padding: 2px 8px; 
                                font-size: 12px; 
                                cursor: pointer;
                                transition: all 0.2s;
                            ">☀️</button>
                        <button 
                            @click=${() => this._previewMode = 'dark'}
                            style="
                                border: none; 
                                background: ${this._previewMode === 'dark' ? '#333' : 'transparent'}; 
                                color: ${this._previewMode === 'dark' ? '#fff' : '#888'};
                                border-radius: 99px; 
                                padding: 2px 8px; 
                                font-size: 12px; 
                                cursor: pointer;
                                transition: all 0.2s;
                            ">🌙</button>
                    </div>
                </div>
                <zui-button size="sm">Download Config</zui-button>
            </div>
            
            <!-- We apply the generated CSS variables to this container -->
            <!-- We also overlay a class for light/dark if we were generating both sets, but for now we depend on the extraction. -->
            <!-- To support the requirement "Light mode = lighter backgrounds", we might need to tweak variables via js in _updateTheme, or just rely on the extraction logic to be perfect. -->
            <!-- Since we don't have a dual-generator yet, let's trust the current theme state for now, but apply opacity/filters if needed? No, let's keep it clean. -->
            
            <!-- Scaling Wrapper -->
            <!-- We use a wrapper with overflow hidden to contain the scaled content -->
            <div class="preview-wrapper" style="flex: 1; overflow: hidden; position: relative; background: var(--bg-body, #0f172a);">
                 <div class="preview-content" style="
                    ${this._generatedCss} 
                    padding: 0; 
                    width: 1200px; 
                    height: ${100 / this._scale}%; 
                    transform: scale(${this._scale}); 
                    transform-origin: top left; 
                    border: none;
                    margin: auto;
                 ">
                     <div style="
                        background: var(--color-background); 
                        color: var(--color-text); 
                        min-height: 100%; 
                        height: 100%;
                        font-family: var(--font-family);
                        display: flex; flex-direction: column;
                        overflow-y: auto;
                     ">
                    <!-- Banner (Conditional) -->
                    ${this._previewImage ? html`
                    <div style="
                        position: relative;
                        height: 300px;
                        background-color: var(--color-surface);
                        background-image: url('${this._previewImage}');
                        background-size: cover;
                        background-position: center;
                    ">
                        <!-- Gradient Overlay -->
                        <div style="
                            position: absolute; inset: 0;
                            background: linear-gradient(135deg, 
                                var(--rgb-primary), 
                                var(--rgb-secondary)
                            );
                            opacity: 0.85;
                            mix-blend-mode: multiply;
                        "></div>
                        
                        <div style="
                            position: relative; z-index: 10;
                            height: 100%;
                            display: flex; flex-direction: column;
                            align-items: center; justify-content: center;
                            text-align: center; color: #fff;
                            padding: 24px;
                        ">
                            <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0 0 16px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                                Welcome to Your Theme
                            </h1>
                            <p style="font-size: 1.1rem; opacity: 0.9; max-width: 600px; margin: 0 0 32px;">
                                Auto-generated from your image. This landing page demonstrates your extraction results.
                            </p>
                            <button class="preview-btn preview-btn-primary" style="--color-text: #fff; border: 1px solid rgba(255,255,255,0.2);">Get Started</button>
                        </div>
                    </div>
                    ` : html`
                         <div style="padding: 48px 24px; text-align: center; border-bottom: 1px solid var(--card-border, rgba(255,255,255,0.1));">
                            <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0 0 16px; color: var(--color-text);">Welcome to Your Theme</h1>
                            <p style="font-size: 1.1rem; opacity: 0.7; max-width: 600px; margin: 0 auto 32px; color: var(--color-text);">
                                Upload an image to generate a custom banner and theme.
                            </p>
                         </div>
                    `}

                    <!-- Features -->
                    <div style="
                        padding: 48px 24px;
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                        gap: 24px;
                        max-width: 1200px; margin: 0 auto; width: 100%;
                    ">
                        
                       <!-- ... cards ... -->
                       ${/* Cards logic already replaced in previous step, keep them */ ''}
                        
                       <div style="background: var(--color-surface); border-radius: var(--radius-md); padding: 24px; height: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <div style="font-size: 2rem; margin-bottom: 16px;">✨</div>
                            <h3 style="margin: 0 0 8px; color: var(--color-text);">Auto Extraction</h3>
                            <p style="opacity: 0.7; line-height: 1.5; color: var(--color-text);">Colors are pulled directly from your image using advanced quantization.</p>
                        </div>
                        <div style="background: var(--color-surface); border-radius: var(--radius-md); padding: 24px; height: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <div style="font-size: 2rem; margin-bottom: 16px;">🎨</div>
                            <h3 style="margin: 0 0 8px; color: var(--color-text);">Semantic Mapping</h3>
                            <p style="opacity: 0.7; line-height: 1.5; color: var(--color-text);">We intelligently assign primary, secondary, and semantic tokens.</p>
                        </div>
                         <div style="background: var(--color-surface); border-radius: var(--radius-md); padding: 24px; height: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <div style="font-size: 2rem; margin-bottom: 16px;">🚀</div>
                            <h3 style="margin: 0 0 8px; color: var(--color-text);">Production Ready</h3>
                            <p style="opacity: 0.7; line-height: 1.5; color: var(--color-text);">Export to JSON or CSS variables and drop into your app immediately.</p>
                        </div>
                    </div>

                    <!-- CTA -->
                    <div style="
                        background: var(--color-surface);
                        padding: 64px 24px;
                        text-align: center;
                        margin-top: auto;
                        border-top: 1px solid var(--card-border, rgba(255,255,255,0.1));
                    ">
                        <h2 style="font-size: 2rem; margin: 0 0 16px; color: var(--color-primary);">Ready to Build?</h2>
                        <p style="opacity: 0.7; margin: 0 0 32px; color: var(--color-text);">Start creating amazing interfaces with your new theme.</p>
                        <div style="display: flex; gap: 16px; justify-content: center;">
                            <button class="preview-btn preview-btn-primary">Export Theme</button>
                            <button class="preview-btn preview-btn-secondary">View Docs</button>
                        </div>
                    </div>

                 </div>
            </div>
        </div>
      </div>
    `;
  }
}
