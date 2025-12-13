
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
    @state() private _baseTheme: ThemeConfig = { ...DEFAULT_THEME };
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
      // "Smart Reset":
      // 1. If an image was uploaded, we revert to the extracted theme (stored in _baseTheme).
      // 2. We ONLY reset the colors for the CURRENT mode.

      const currentMode = this._previewMode;
      const baseColors = this._baseTheme.colors[currentMode];

      this._theme = {
          ...this._theme,
          colors: {
              ...this._theme.colors,
              [currentMode]: { ...baseColors }
          }
      };

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
          this._baseTheme = JSON.parse(JSON.stringify(newTheme));
          
          // Switch to Dark mode if the auto-extracted dark background is very dominant? 
          // For now, stick to light or user preference.
          
          this._updateTheme();
      } catch (err) {
          console.error('Failed to extract theme from image', err);
          alert('Failed to extract theme from image');
      }
  }

    private _copyCss() {
        const cssContent = `:root {
${this._generatedCss}
}`;
        navigator.clipboard.writeText(cssContent);
        alert('CSS Variables copied to clipboard!');
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

    private _renderTypoInput(label: string, path: string[]) {
        // Helper to access nested property
        let target: any = this._theme.typography;
        for (let i = 0; i < path.length - 1; i++) {
            target = target[path[i]];
        }
        const finalKey = path[path.length - 1];
        const value = target[finalKey];

        return html`
        <div class="form-group" style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <label class="form-label" style="width: 120px; margin: 0;">${label}</label>
            <input type="text" 
                .value=${value}
                @change=${(e: any) => {
                target[finalKey] = e.target.value;
                this._updateTheme();
                this.requestUpdate();
            }}
            >
        </div>
      `;
    }

    private _renderTextInput(label: string, section: 'shadows' | 'animations', key: string) {
        const value = (this._theme[section] as any)[key];
        return html`
        <div class="form-group" style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <label class="form-label" style="width: 120px; margin: 0;">${label}</label>
            <input type="text" 
                .value=${value}
                @change=${(e: any) => {
                (this._theme[section] as any)[key] = e.target.value;
                this._updateTheme();
                this.requestUpdate();
            }}
            >
        </div>
      `;
    }

    private _downloadConfig() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this._theme, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "theme-config.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
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

                        <div class="section-title">Headings (Font Size)</div>
                        ${this._renderTypoInput('H1 Size', ['headings', 'h1', 'fontSize'])}
                        ${this._renderTypoInput('H2 Size', ['headings', 'h2', 'fontSize'])}
                        ${this._renderTypoInput('H3 Size', ['headings', 'h3', 'fontSize'])}
                        ${this._renderTypoInput('H4 Size', ['headings', 'h4', 'fontSize'])}
                        ${this._renderTypoInput('H5 Size', ['headings', 'h5', 'fontSize'])}
                        ${this._renderTypoInput('H6 Size', ['headings', 'h6', 'fontSize'])}

                        <div class="section-title">Body & Caption</div>
                        ${this._renderTypoInput('Body Size', ['body', 'fontSize'])}
                        ${this._renderTypoInput('Caption Size', ['caption', 'fontSize'])}
                        <!-- Note: Caption specific color not supported in standard model yet, 
                             but user asked for size. I'll stick to size for now to avoid breaking model contract/utils 
                             unless I add it to model. User asked for "settings for all heading size, subtext size". 
                             So Size is sufficient. Remove color input. -->
                    </zui-tab-panel>

                    <zui-tab-panel slot="panels">
                        <div class="section-title">Border Radius</div>
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
                         <div class="form-group">
                            <label class="form-label">Large (lg)</label>
                            <input type="text"
                                .value=${this._theme.borderRadius.lg} 
                                @change=${(e: any) => { this._theme.borderRadius.lg = e.target.value; this._updateTheme(); }}
                            >
                         </div>

                        <div class="section-title">Shadows</div>
                        ${this._renderTextInput('Small', 'shadows', 'sm')}
                        ${this._renderTextInput('Medium', 'shadows', 'md')}
                        ${this._renderTextInput('Large', 'shadows', 'lg')}

                        <div class="section-title">Animations (Duration)</div>
                        ${this._renderTextInput('Fast', 'animations', 'fast')}
                        ${this._renderTextInput('Normal', 'animations', 'normal')}
                        ${this._renderTextInput('Slow', 'animations', 'slow')}
                    </zui-tab-panel>
                 </zui-tabs>
            </div>
            
            <div style="padding: 16px; border-top: 1px solid var(--card-border); display: flex; gap: 8px;">
                <zui-button size="sm" variant="secondary" @click=${this._resetToDefault}>Reset</zui-button>
                <zui-button size="sm" @click=${this._copyJson}>Copy JSON</zui-button>
                <zui-button size="sm" @click=${this._copyCss} variant="primary">Copy CSS</zui-button>
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
                <zui-button size="sm" @click=${this._downloadConfig}>Download Config</zui-button>
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

                    <div style="
                        padding: 48px 24px;
                        max-width: 1200px; margin: 0 auto; width: 100%;
                    ">
                        <!-- Realistic Typography Examples -->
                         <div style="margin-bottom: 64px;">
                            <h2 style="font-size: 1.5rem; margin-bottom: 24px; opacity: 0.5; text-transform: uppercase; letter-spacing: 2px;">Typography in Context</h2>
                            
                            <div style="
                                display: grid; 
                                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                                gap: 24px;
                            ">
                                <!-- Blog Post Card Example -->
                                <div style="
                                    background: var(--color-surface);
                                    border-radius: var(--radius-md);
                                    padding: 32px;
                                    box-shadow: var(--shadow-sm);
                                    border: 1px solid var(--card-border, rgba(255,255,255,0.05));
                                ">
                                    <span style="font-size: var(--font-size-caption); color: var(--color-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Design Trends</span>
                                    <h1 style="margin: 12px 0; color: var(--color-text); line-height: 1.1;">The Future of UI Design</h1>
                                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 24px;">
                                        <div style="width: 32px; height: 32px; border-radius: 99px; background: var(--color-secondary);"></div>
                                        <div style="font-size: var(--font-size-caption); color: var(--text-muted, #94a3b8);">
                                            <span>Jane Doe</span> • <span>Oct 24, 2025</span>
                                        </div>
                                    </div>
                                    
                                    <h2 style="margin: 0 0 12px; color: var(--color-text);">Understanding Color Theory</h2>
                                    <p style="margin: 0 0 16px; color: var(--color-text); line-height: 1.6; opacity: 0.9;">
                                        Colors aren't just visual decoration; they evoke emotion and guide user behavior. 
                                        When building a design system, your primary palette defines your brand's voice.
                                    </p>
                                    <a href="#" style="color: var(--color-primary); text-decoration: none; font-weight: 600;">Read more →</a>
                                </div>

                                <!-- Dashboard Widget Example -->
                                <div style="
                                    background: var(--color-surface);
                                    border-radius: var(--radius-md);
                                    padding: 32px;
                                    box-shadow: var(--shadow-sm);
                                    border: 1px solid var(--card-border, rgba(255,255,255,0.05));
                                    display: flex; flex-direction: column;
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px;">
                                        <div>
                                            <h3 style="margin: 0; color: var(--color-text);">Revenue Overview</h3>
                                            <span style="font-size: var(--font-size-caption); opacity: 0.6; color: var(--color-text);">Last 30 days performance</span>
                                        </div>
                                        <button style="padding: 4px 12px; border-radius: 99px; background: rgba(255,255,255,0.1); border: none; color: var(--color-text); cursor: pointer;">Export</button>
                                    </div>

                                    <div style="margin-bottom: 32px;">
                                        <h4 style="font-size: 3rem; margin: 0; color: var(--color-text); line-height: 1;">$45,231.89</h4>
                                        <div style="color: var(--color-success); margin-top: 8px; font-weight: 600;">+20.1% <span style="font-weight: 400; opacity: 0.7; color: var(--color-text);">vs last month</span></div>
                                    </div>

                                    <h5 style="margin: 0 0 16px; color: var(--color-text); text-transform: uppercase; font-size: 0.75rem; opacity: 0.7;">Top Channels</h5>

                                    <div style="display: flex; flex-direction: column; gap: 12px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border, rgba(255,255,255,0.05)); padding-bottom: 8px;">
                                            <h6 style="margin: 0; color: var(--color-text);">Organic Search</h6>
                                            <span style="font-weight: 600; color: var(--color-text);">65%</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--card-border, rgba(255,255,255,0.05)); padding-bottom: 8px;">
                                            <h6 style="margin: 0; color: var(--color-text);">Direct Traffic</h6>
                                            <span style="font-weight: 600; color: var(--color-text);">22%</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <h6 style="margin: 0; color: var(--color-text);">Social Media</h6>
                                            <span style="font-weight: 600; color: var(--color-text);">13%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>

                        <!-- Real Life Example: Pricing -->
                        <div>
                            <h2 style="font-size: 1.5rem; margin-bottom: 32px; opacity: 0.5; text-transform: uppercase; letter-spacing: 2px;">Pricing</h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                                <!-- Standard Plan -->
                                <div style="
                                    background: var(--color-surface);
                                    border-radius: var(--radius-md);
                                    padding: 32px;
                                    box-shadow: var(--shadow-sm);
                                    border: 1px solid var(--card-border, rgba(255,255,255,0.05));
                                    transition: transform var(--animate-normal);
                                "
                                @mouseenter=${(e: any) => e.target.style.transform = 'translateY(-5px)'}
                                @mouseleave=${(e: any) => e.target.style.transform = 'translateY(0)'}
                                >
                                    <h3 style="color: var(--color-text); margin-top: 0;">Standard</h3>
                                    <div style="font-size: 3rem; font-weight: 800; color: var(--color-text); margin-bottom: 16px;">$19<span style="font-size: 1rem; opacity: 0.6; font-weight: 400;">/mo</span></div>
                                    <p style="color: var(--color-text); opacity: 0.8; margin-bottom: 24px;">Perfect for individual developers.</p>
                                    <button style="
                                        width: 100%;
                                        padding: 12px;
                                        border-radius: var(--radius-sm);
                                        background: transparent;
                                        border: 1px solid var(--color-text);
                                        color: var(--color-text);
                                        cursor: pointer;
                                        font-weight: 600;
                                        transition: all var(--animate-fast);
                                    "
                                    onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-surface)'"
                                    onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'"
                                    >Get Started</button>
                                </div>

                                <!-- Pro Plan (Highlighted) -->
                                <div style="
                                    background: var(--color-surface);
                                    border-radius: var(--radius-lg);
                                    padding: 40px 32px;
                                    box-shadow: var(--shadow-lg);
                                    border: 2px solid var(--color-primary);
                                    position: relative;
                                    transform: scale(1.05);
                                ">
                                    <div style="
                                        position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
                                        background: var(--color-primary); color: #fff;
                                        padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;
                                    ">MOST POPULAR</div>
                                    <h3 style="color: var(--color-primary); margin-top: 0;">Professional</h3>
                                    <div style="font-size: 3rem; font-weight: 800; color: var(--color-text); margin-bottom: 16px;">$49<span style="font-size: 1rem; opacity: 0.6; font-weight: 400;">/mo</span></div>
                                    <p style="color: var(--color-text); opacity: 0.8; margin-bottom: 24px;">For growing teams and businesses.</p>
                                    <ul style="list-style: none; padding: 0; margin: 0 0 24px; color: var(--color-text); opacity: 0.8; font-size: 0.9rem;">
                                        <li style="margin-bottom: 8px;">✓ All Standard features</li>
                                        <li style="margin-bottom: 8px;">✓ Unlimited projects</li>
                                        <li>✓ Priority support</li>
                                    </ul>
                                    <button style="
                                        width: 100%;
                                        padding: 12px;
                                        border-radius: var(--radius-md);
                                        background: var(--color-primary);
                                        border: none;
                                        color: #fff;
                                        cursor: pointer;
                                        font-weight: 600;
                                        box-shadow: var(--shadow-md);
                                        transition: transform var(--animate-normal), box-shadow var(--animate-normal);
                                    "
                                    onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='var(--shadow-lg)'"
                                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='var(--shadow-md)'"
                                    >Get Pro Now</button>
                                </div>

                                <!-- Enterprise Plan -->
                                <div style="
                                    background: var(--color-surface);
                                    border-radius: var(--radius-md);
                                    padding: 32px;
                                    box-shadow: var(--shadow-sm);
                                    border: 1px solid var(--card-border, rgba(255,255,255,0.05));
                                    opacity: 0.8;
                                ">
                                    <h3 style="color: var(--color-text); margin-top: 0;">Enterprise</h3>
                                    <div style="font-size: 3rem; font-weight: 800; color: var(--color-text); margin-bottom: 16px;">Custom</div>
                                    <p style="color: var(--color-text); opacity: 0.8; margin-bottom: 24px;">For large scale organizations.</p>
                                    <button style="
                                        width: 100%;
                                        padding: 12px;
                                        border-radius: var(--radius-sm);
                                        background: transparent;
                                        border: 1px solid var(--card-border, #ccc);
                                        color: var(--color-text);
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">Contact Sales</button>
                                </div>
                            </div>
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
