import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/select';
import '../components/demo-page';
import '../components/demo-example';

@customElement('select-demo')
export class SelectDemo extends LitElement {
  static styles = css`
    .output {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    zui-select {
        width: 100%;
        max-width: 300px;
    }
  `;

  @state() private _value1 = '';
  @state() private _value2 = '';
  @state() private _values1: string[] = [];
  @state() private _values2: string[] = [];

  private _options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
  ];

  render() {
    const properties = [
      { name: 'value', type: 'string', default: "''", description: 'Selected value (single select).' },
      { name: 'values', type: 'string[]', default: '[]', description: 'Selected values (multi select).' },
      { name: 'options', type: 'Option[]', default: '[]', description: 'Array of {label, value} objects.' },
      { name: 'label', type: 'string', default: "''", description: 'Label text.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Enable multi-select.' },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Enable search/filter.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the select.' },
    ];

    const basicHtml = `<zui-select
  label="Choose a fruit"
  .options="\${options}"
  .value="\${value}"
  @zui-change="\${handleChange}"
></zui-select>`;

    const multiHtml = `<zui-select
  label="Search and select multiple"
  multiple
  searchable
  .options="\${options}"
  .values="\${values}"
  @zui-change="\${handleChange}"
></zui-select>`;

    const basicReact = `import { ZuiSelect } from '@deepverse/zero-ui/react';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

function App() {
  const [value, setValue] = useState('');
  return (
    <ZuiSelect
      label="Choose a fruit"
      options={options}
      value={value}
      onZuiChange={(e) => setValue(e.detail.value)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-select
      label="Choose a fruit"
      [options]="options"
      [value]="value"
      (zui-change)="handleChange($event)">
    </zui-select>
  \`
})
export class AppComponent {
  value = '';
  options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];
  handleChange(e: any) {
    this.value = e.detail.value;
  }
}`;

    const basicVue = `<template>
  <zui-select
    label="Choose a fruit"
    :options="options"
    v-model="value"
  />
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];
</script>`;

    return html`
      <demo-page
        name="Select"
        description="An advanced select component with search and multi-select capabilities."
        .properties=${properties}
      >
        <demo-example
          header="Single Select"
          description="Basic usage for selecting a single option."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <zui-select
              label="Choose a fruit"
              .options=${this._options}
              .value=${this._value1}
              @zui-change=${(e: CustomEvent) => this._value1 = e.detail.value}
            ></zui-select>
            <div class="output">Selected: ${this._value1 || 'None'}</div>
          </div>
        </demo-example>

        <demo-example
          header="Multi-Select with Search"
          description="Select multiple options with filtering."
          .html=${multiHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <zui-select
              label="Search and select multiple"
              multiple
              searchable
              .options=${this._options}
              .values=${this._values2}
              @zui-change=${(e: CustomEvent) => this._values2 = e.detail.values}
            ></zui-select>
            <div class="output">
              Selected: ${this._values2.length > 0 ? this._values2.join(', ') : 'None'}
            </div>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
