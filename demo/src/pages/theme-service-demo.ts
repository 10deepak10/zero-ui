
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/demo-page';
import '../components/demo-example';
import { ThemeGeneratorService, type ThemeConfig } from '@deepverse/zero-ui';

@customElement('theme-service-demo')
export class ThemeServiceDemo extends LitElement {
  static styles = css`
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 16px;
    }
    
    h3 {
      margin-top: 0;
      color: var(--text-main);
      font-size: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 0.9rem;
    }

    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text-main);
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
    }

    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: var(--code-string);
    }
    
    .input-group {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    
    input[type="text"] {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--card-border);
      background: var(--bg-muted);
      color: var(--text-main);
      width: 100%;
      box-sizing: border-box;
      font-family: monospace;
    }

    .result-box {
      font-family: monospace;
      font-size: 0.9rem;
      color: var(--code-string);
      background: rgba(0,0,0,0.2);
      padding: 8px;
      border-radius: 4px;
      margin-top: 8px;
      overflow-x: auto;
    }

    @media (max-width: 600px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
      .input-group > div {
        flex-direction: column;
      }
      
      /* Target the generated theme preview grid */
      .input-group > div[style*="grid-template-columns: 1fr 1fr"] {
        grid-template-columns: 1fr !important;
      }
      
      /* Target the result box flex container */
      .result-box[style*="display: flex"] {
         flex-direction: column;
         align-items: flex-start !important;
         gap: 8px;
      }

      table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
    }
  `;

  @state() private _hex1 = '#3b82f6';
  @state() private _hex2 = '#ffffff';
  @state() private _contrastRatio = 0;
  @state() private _extractedPalette: string[] = [];
  @state() private _generatedTheme: ThemeConfig | null = null;

  constructor() {
      super();
      this._updateContrast();
  }

  private _updateContrast() {
      this._contrastRatio = ThemeGeneratorService.getContrastRatio(this._hex1, this._hex2);
  }

  private async _handleFileUpload(e: Event) {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files[0]) {
          const file = input.files[0];
          this._extractedPalette = await ThemeGeneratorService.extractColorsFromImage(file);
          this._generatedTheme = ThemeGeneratorService.mapPaletteToTheme(this._extractedPalette);
          // Set base color for manipulation to primary color
          if (this._generatedTheme.colors.light.primary) {
              this._hex1 = this._generatedTheme.colors.light.primary;
          }
      }
  }

  render() {
    const contrastTs = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

const hex1 = '#ffffff';
const hex2 = '#000000';

const ratio = ThemeGeneratorService.getContrastRatio(hex1, hex2); 
console.log(ratio); // 21`;

    const contrastReact = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

function ContrastChecker() {
  const [color1, setColor1] = useState('#ffffff');
  const [color2, setColor2] = useState('#000000');
  
  const ratio = ThemeGeneratorService.getContrastRatio(color1, color2);

  return (
    <div>
      <input type="color" value={color1} onChange={e => setColor1(e.target.value)} />
      <input type="color" value={color2} onChange={e => setColor2(e.target.value)} />
      <p>Ratio: {ratio.toFixed(2)}</p>
    </div>
  );
}`;

    const contrastAngular = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

@Component({
  template: \`
    <input type="color" [(ngModel)]="color1">
    <input type="color" [(ngModel)]="color2">
    <p>Ratio: {{ getRatio() }}</p>
  \`
})
class ContrastComp {
  color1 = '#ffffff';
  color2 = '#000000';

  getRatio() {
    return ThemeGeneratorService.getContrastRatio(this.color1, this.color2);
  }
}`;

    const contrastVue = `<script setup>
import { ref, computed } from 'vue';
import { ThemeGeneratorService } from '@deepverse/zero-ui';

const c1 = ref('#ffffff');
const c2 = ref('#000000');
const ratio = computed(() => ThemeGeneratorService.getContrastRatio(c1.value, c2.value));
</script>

<template>
  <input type="color" v-model="c1">
  <input type="color" v-model="c2">
  <p>Ratio: {{ ratio }}</p>
</template>`;

    const apiHtml = html`
        <div slot="api">
            <h3>Static Methods</h3>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Parameters</th>
                        <th>Returns</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>extractColorsFromImage</code></td>
                        <td><code>file: File</code></td>
                        <td><code>Promise&lt;string[]&gt;</code></td>
                        <td>Extracts distinct color palette from an image file.</td>
                    </tr>
                    <tr>
                        <td><code>mapPaletteToTheme</code></td>
                        <td><code>palette: string[]</code></td>
                        <td><code>ThemeConfig</code></td>
                        <td>Generates a full theme configuration from a color palette.</td>
                    </tr>
                    <tr>
                        <td><code>generateCssVariables</code></td>
                        <td><code>theme: ThemeConfig, mode: 'light' | 'dark'</code></td>
                        <td><code>string</code></td>
                        <td>Generates CSS variable definitions for the given theme mode.</td>
                    </tr>
                    <tr>
                        <td><code>getContrastRatio</code></td>
                        <td><code>hex1: string, hex2: string</code></td>
                        <td><code>number</code></td>
                        <td>Calculates wcag contrast ratio between two colors (1-21).</td>
                    </tr>
                    <tr>
                        <td><code>lighten</code></td>
                        <td><code>hex: string, percent: number</code></td>
                        <td><code>string</code></td>
                        <td>Lightens a color by the specified percentage (0-100).</td>
                    </tr>
                    <tr>
                        <td><code>darken</code></td>
                        <td><code>hex: string, percent: number</code></td>
                        <td><code>string</code></td>
                        <td>Darkens a color by the specified percentage (0-100).</td>
                    </tr>
                     <tr>
                        <td><code>rotateHue</code></td>
                        <td><code>hex: string, degrees: number</code></td>
                        <td><code>string</code></td>
                        <td>Rotates the hue of a color by the specified degrees.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    const basicReact = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

function App() {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Extract colors
    const palette = await ThemeGeneratorService.extractColorsFromImage(file);
    
    // Generate theme
    const theme = ThemeGeneratorService.mapPaletteToTheme(palette);
    console.log(theme);
  };

  return (
    <div>
      <h3>Theme Generator</h3>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';
import { ThemeGeneratorService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`
    <h3>Theme Generator</h3>
    <input type="file" (change)="onFileChange($event)" />
  \`
})
export class AppComponent {
  async onFileChange(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    
    if (file) {
      const palette = await ThemeGeneratorService.extractColorsFromImage(file);
      const theme = ThemeGeneratorService.mapPaletteToTheme(palette);
      console.log(theme);
    }
  }
}`;

    const basicVue = `<script setup>
import { ThemeGeneratorService } from '@deepverse/zero-ui';

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const palette = await ThemeGeneratorService.extractColorsFromImage(file);
  const theme = ThemeGeneratorService.mapPaletteToTheme(palette);
  console.log(theme);
};
</script>

<template>
  <div>
    <h3>Theme Generator</h3>
    <input type="file" @change="onFileChange" />
  </div>
</template>`;

    const contrastHtml = html`
         <div class="card">
            <div class="input-group">
                <label>Foreground Color</label>
                <div style="display: flex; gap: 8px;">
                    <input type="color" .value=${this._hex1} @input=${(e: any) => { this._hex1 = e.target.value; this._updateContrast(); }}>
                    <input type="text" .value=${this._hex1} @input=${(e: any) => { this._hex1 = e.target.value; this._updateContrast(); }}>
                </div>
            </div>
            <div class="input-group">
                <label>Background Color</label>
                <div style="display: flex; gap: 8px;">
                    <input type="color" .value=${this._hex2} @input=${(e: any) => { this._hex2 = e.target.value; this._updateContrast(); }}>
                    <input type="text" .value=${this._hex2} @input=${(e: any) => { this._hex2 = e.target.value; this._updateContrast(); }}>
                </div>
            </div>
            
            <div class="result-box" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Ratio: ${this._contrastRatio.toFixed(2)}</span>
                <span style="
                    padding: 2px 8px; 
                    border-radius: 4px; 
                    background: ${this._contrastRatio >= 4.5 ? 'var(--color-success, green)' : 'var(--color-danger, red)'}; 
                    color: white;"
                >
                    ${this._contrastRatio >= 4.5 ? 'PASS (AA)' : 'FAIL'}
                </span>
            </div>
        </div>
    `;

    const extractorHtml = html`
        <div class="card">
            <h3>Theme Extractor</h3>
            <div class="input-group">
                <label>Upload Image</label>
                <input type="file" accept="image/*" @change=${this._handleFileUpload}>
            </div>
            
            ${this._extractedPalette.length ? html`
                <div class="input-group">
                    <label>Extracted Palette</label>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${this._extractedPalette.map(color => html`
                            <div style="width: 24px; height: 24px; background: ${color}; border-radius: 4px; border: 1px solid var(--card-border);" title="${color}"></div>
                        `)}
                    </div>
                </div>
            ` : ''}

            ${this._generatedTheme ? html`
                <div class="input-group">
                    <label>Generated Theme (Preview)</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem;">
                        <div style="padding: 8px; background: ${this._generatedTheme.colors.light.background}; color: ${this._generatedTheme.colors.light.text}">
                            Light Mode
                            <div style="margin-top: 4px;">
                                <span style="display:inline-block; width:12px; height:12px; background:${this._generatedTheme.colors.light.primary}; border-radius:2px;"></span> Primary
                                <span style="display:inline-block; width:12px; height:12px; background:${this._generatedTheme.colors.light.secondary}; border-radius:2px;"></span> Secondary
                            </div>
                        </div>
                        <div style="padding: 8px; background: ${this._generatedTheme.colors.dark.background}; color: ${this._generatedTheme.colors.dark.text}">
                            Dark Mode
                            <div style="margin-top: 4px;">
                                <span style="display:inline-block; width:12px; height:12px; background:${this._generatedTheme.colors.dark.primary}; border-radius:2px;"></span> Primary
                                <span style="display:inline-block; width:12px; height:12px; background:${this._generatedTheme.colors.dark.secondary}; border-radius:2px;"></span> Secondary
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    const manipulationHtml = html`
        <div class="demo-grid">
            <div class="card">
                <h3>Color Manipulation</h3>
                <div class="input-group">
                    <label>Base Color</label>
                     <div style="display: flex; gap: 8px;">
                        <input type="color" .value=${this._hex1} @input=${(e: any) => { this._hex1 = e.target.value; this.requestUpdate(); }}>
                        <input type="text" .value=${this._hex1} @input=${(e: any) => { this._hex1 = e.target.value; this.requestUpdate(); }}>
                    </div>
                </div>
                
                <div class="result-box">
                    <div>Lighten (+20%): <span style="color: ${ThemeGeneratorService.lighten(this._hex1, 20)}">
                        ${ThemeGeneratorService.lighten(this._hex1, 20)}
                    </span></div>
                    <div>Darken (-20%): <span style="color: ${ThemeGeneratorService.darken(this._hex1, 20)}">
                        ${ThemeGeneratorService.darken(this._hex1, 20)}
                    </span></div>
                    <div>Complimentary (Hue +180): <span style="color: ${ThemeGeneratorService.rotateHue(this._hex1, 180)}">
                        ${ThemeGeneratorService.rotateHue(this._hex1, 180)}
                    </span></div>
                </div>
            </div>
        </div>
    `;

    const manipulationTs = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

// Lighten
const light = ThemeGeneratorService.lighten('#3b82f6', 20);

// Darken
const dark = ThemeGeneratorService.darken('#3b82f6', 20);

// Rotate Hue
const comp = ThemeGeneratorService.rotateHue('#3b82f6', 180);`;

    const extractorTs = `import { ThemeGeneratorService } from '@deepverse/zero-ui';

// 1. Extract colors from an image
const file = event.target.files[0];
const palette = await ThemeGeneratorService.extractColorsFromImage(file);

// 2. Generate a full theme config from palette
const themeConfig = ThemeGeneratorService.mapPaletteToTheme(palette);

// 3. Generate CSS variables string
const css = ThemeGeneratorService.generateCssVariables(themeConfig, 'light');`;

    return html`
      <demo-page
        name="Theme Generator Service"
        description="Headless utility service for color extraction, contrast calculations, and CSS variable generation."
      >
        <demo-example
          header="Theme Extractor"
          description="Upload an image to extract a color palette and generate a theme."
          .html=${extractorTs}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
            ${extractorHtml}
        </demo-example>

        <demo-example
          header="Color Manipulation"
          description="Static methods for modifying colors (lighten, darken, hue rotation)."
          .html=${manipulationTs}
        >
            ${manipulationHtml}
        </demo-example>

        <demo-example
            header="Contrast Ratio Calculator"
            description="Check accessibility compliance between two colors."
            .html=${contrastTs}
            .react=${contrastReact}
            .angular=${contrastAngular}
            .vue=${contrastVue}
        >
            ${contrastHtml}
        </demo-example>
        
        ${apiHtml}
      </demo-page>
    `;
  }
}
