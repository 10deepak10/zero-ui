import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/slider';
import '../components/demo-page';
import '../components/demo-example';

@customElement('slider-demo')
export class SliderDemo extends LitElement {
  @state() private _value1 = 50;
  @state() private _value2 = 20;
  @state() private _rangeValue: [number, number] = [25, 75];

  static styles = css`
    .custom-theme {
      --zui-slider-fill-color: #10b981;
      --zui-slider-thumb-border: 2px solid #10b981;
    }
    
    zui-slider {
      width: 100%;
    }
    
    .wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    const properties = [
      { name: 'value', type: 'number | [number, number]', default: '0', description: 'Current value or range.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
      { name: 'step', type: 'number', default: '1', description: 'Step increment.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the slider.' },
    ];

    const basicHtml = `<zui-slider 
  label="Volume" 
  .value="\${value}"
  @input="\${handleInput}"
></zui-slider>`;

    const basicReact = `import { ZuiSlider } from '@deepverse/zero-ui/slider';

function App() {
  const [value, setValue] = useState(50);
  return (
    <ZuiSlider
      label="Volume"
      value={value}
      onZuiInput={(e) => setValue(e.detail.value)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-slider 
      label="Volume" 
      [value]="value" 
      (input)="handleInput($event)">
    </zui-slider>
  \`
})
export class AppComponent {
  value = 50;
  handleInput(e: any) {
    this.value = e.detail.value;
  }
}`;

    const basicVue = `<template>
  <zui-slider 
    label="Volume" 
    v-model="value"
  />
</template>

<script setup>
import { ref } from 'vue';
const value = ref(50);
</script>`;

    const customRangeHtml = `<zui-slider 
  label="Price" 
  min="0"
  max="1000"
  step="10"
  .value="\${value}"
></zui-slider>`;

    const doubleSliderHtml = `<zui-slider 
  label="Price Range" 
  .value="\${[25, 75]}"
></zui-slider>`;

    const customThemeHtml = `<style>
  .custom-theme {
    --zui-slider-fill-color: #10b981;
    --zui-slider-thumb-border: 2px solid #10b981;
  }
</style>

<zui-slider class="custom-theme" label="Custom" value="75"></zui-slider>`;

    return html`
      <demo-page
        name="Slider"
        description="A slider input for selecting a value or range from a set."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard slider for selection."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="wrapper">
            <zui-slider 
              label="Volume" 
              .value=${this._value1}
              @input=${(e: any) => this._value1 = e.detail.value}
            ></zui-slider>
            <div>Value: ${this._value1}</div>
          </div>
        </demo-example>

        <demo-example
          header="Custom Range & Step"
          description="Slider with configured min, max, and step."
          .html=${customRangeHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="wrapper">
            <zui-slider 
              label="Price Range ($0 - $1000)" 
              min="0"
              max="1000"
              step="10"
              .value=${this._value2}
              @input=${(e: any) => this._value2 = e.detail.value}
            ></zui-slider>
            <div>Value: ${this._value2}</div>
          </div>
        </demo-example>

        <demo-example
          header="Double Slider (Range)"
          description="A slider with two handles for selecting a range."
          .html=${doubleSliderHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="wrapper">
            <zui-slider 
              label="Price Range" 
              .value=${this._rangeValue}
              @input=${(e: any) => this._rangeValue = e.detail.value}
            ></zui-slider>
            <div>Range: [${this._rangeValue[0]}, ${this._rangeValue[1]}]</div>
          </div>
        </demo-example>

        <demo-example
          header="States"
          description="Disabled state."
          .html=${`<zui-slider label="Disabled" value="30" disabled></zui-slider>`}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <zui-slider label="Disabled" value="30" disabled></zui-slider>
        </demo-example>

        <demo-example
          header="Custom Styling"
          description="Customize colors."
          .html=${customThemeHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <zui-slider 
            class="custom-theme" 
            label="Custom Colors" 
            value="75"
          ></zui-slider>
        </demo-example>
      </demo-page>
    `;
  }
}
