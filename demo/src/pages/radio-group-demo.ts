import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/radio-group';
import '../components/demo-page';
import '../components/demo-example';

@customElement('radio-group-demo')
export class RadioGroupDemo extends LitElement {
  @state() private _value1 = 'option1';
  @state() private _value2 = 'vertical1';

  /* No custom styles needed */

  render() {
    const properties = [
      { name: 'value', type: 'string', default: "''", description: 'Currently selected value.' },
      { name: 'label', type: 'string', default: "''", description: 'Label for the radio group.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout orientation.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the group.' },
    ];

    const basicHtml = `<zui-radio-group 
  label="Select Plan" 
  orientation="horizontal"
  .value="\${value}"
  @change="\${handleChange}"
>
  <zui-radio value="option1">Basic</zui-radio>
  <zui-radio value="option2">Pro</zui-radio>
  <zui-radio value="option3">Enterprise</zui-radio>
</zui-radio-group>`;

    const verticalHtml = `<zui-radio-group 
  label="Choose Preference" 
  orientation="vertical"
  .value="\${value}"
>
  <zui-radio value="a">Option A</zui-radio>
  <zui-radio value="b">Option B</zui-radio>
  <zui-radio value="c" disabled>Option C (Disabled)</zui-radio>
</zui-radio-group>`;

    const basicReact = `import { ZuiRadioGroup, ZuiRadio } from '@deepverse/zero-ui/react';

function App() {
  const [value, setValue] = useState('option1');
  return (
    <ZuiRadioGroup 
      label="Select Plan" 
      orientation="horizontal"
      value={value}
      onZuiChange={(e) => setValue(e.detail.value)}
    >
      <ZuiRadio value="option1">Basic</ZuiRadio>
      <ZuiRadio value="option2">Pro</ZuiRadio>
      <ZuiRadio value="option3">Enterprise</ZuiRadio>
    </ZuiRadioGroup>
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-radio-group 
      label="Select Plan"
      orientation="horizontal" 
      [value]="value" 
      (change)="handleChange($event)">
      <zui-radio value="option1">Basic</zui-radio>
      <zui-radio value="option2">Pro</zui-radio>
      <zui-radio value="option3">Enterprise</zui-radio>
    </zui-radio-group>
  \`
})
export class AppComponent {
  value = 'option1';
  handleChange(e: any) {
    this.value = e.detail.value;
  }
}`;

    const basicVue = `<template>
  <zui-radio-group 
    label="Select Plan" 
    orientation="horizontal"
    v-model="value"
  >
    <zui-radio value="option1">Basic</zui-radio>
    <zui-radio value="option2">Pro</zui-radio>
    <zui-radio value="option3">Enterprise</zui-radio>
  </zui-radio-group>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('option1');
</script>`;

    return html`
      <demo-page
        name="Radio Group"
        description="Radio buttons allow the user to select one option from a set."
        .properties=${properties}
      >
        <demo-example
          header="Horizontal Layout"
          description="Radio items arranged horizontally."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <zui-radio-group 
              label="Select Plan" 
              orientation="horizontal"
              .value=${this._value1}
              @change=${(e: any) => this._value1 = e.detail.value}
            >
              <zui-radio value="option1">Basic</zui-radio>
              <zui-radio value="option2">Pro</zui-radio>
              <zui-radio value="option3">Enterprise</zui-radio>
            </zui-radio-group>
            <div>Selected: ${this._value1}</div>
          </div>
        </demo-example>

        <demo-example
          header="Vertical Layout"
          description="Radio items arranged vertically, with disabled options."
          .html=${verticalHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <zui-radio-group 
              label="Choose Preference" 
              orientation="vertical"
              .value=${this._value2}
              @change=${(e: any) => this._value2 = e.detail.value}
            >
              <zui-radio value="vertical1">Option A</zui-radio>
              <zui-radio value="vertical2">Option B</zui-radio>
              <zui-radio value="vertical3" disabled>Option C (Disabled)</zui-radio>
            </zui-radio-group>
            <div>Selected: ${this._value2}</div>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
