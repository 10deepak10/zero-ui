import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/checkbox';
import '../components/demo-page';
import '../components/demo-example';

@customElement('checkbox-demo')
export class CheckboxDemo extends LitElement {
  @state() private _checked1 = false;
  @state() private _indeterminate = true;

  static styles = css`
    .custom-theme {
      --zui-checkbox-color: #10b981;
      --zui-checkbox-border-radius: 50%;
    }
  `;

  render() {
    const properties = [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Visual indeterminate state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
      { name: 'label', type: 'string', default: "''", description: 'Label text to display.' },
    ];

    const basicHtml = `<zui-checkbox 
  label="Accept Terms" 
  .checked="\${checked}"
  @change="\${handleChange}"
></zui-checkbox>`;

    const basicReact = `import { ZuiCheckbox } from '@deepverse/zero-ui/react';

function App() {
  const [checked, setChecked] = useState(false);
  return (
    <ZuiCheckbox
      label="Accept Terms"
      checked={checked}
      onZuiChange={(e) => setChecked(e.detail.checked)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-checkbox 
      label="Accept Terms" 
      [checked]="checked" 
      (change)="handleChange($event)">
    </zui-checkbox>
  \`
})
export class AppComponent {
  checked = false;
  handleChange(e: any) {
    this.checked = e.detail.checked;
  }
}`;

    const basicVue = `<template>
  <zui-checkbox 
    label="Accept Terms" 
    :checked="checked" 
    @change="checked = $event.detail.checked" 
  />
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(false);
</script>`;

    const statesHtml = `<zui-checkbox label="Disabled Unchecked" disabled></zui-checkbox>
<zui-checkbox label="Disabled Checked" disabled checked></zui-checkbox>
<zui-checkbox label="Indeterminate" indeterminate></zui-checkbox>`;

    const customThemeHtml = `<style>
  .custom-theme {
    --zui-checkbox-color: #10b981;
    --zui-checkbox-border-radius: 50%;
  }
</style>

<zui-checkbox class="custom-theme" label="Custom" checked></zui-checkbox>`;

    return html`
      <demo-page
        name="Checkbox"
        description="Checkboxes allow the user to select one or more items from a set."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard checkbox with label and state management."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 16px; align-items: center; justify-content: center; flex-wrap: wrap;">
            <zui-checkbox 
              label="Accept Terms" 
              .checked=${this._checked1}
              @change=${(e: any) => this._checked1 = e.detail.checked}
            ></zui-checkbox>
            <zui-checkbox 
              label="Subscribe to newsletter" 
              checked
            ></zui-checkbox>
          </div>
        </demo-example>

        <demo-example
          header="States"
          description="Different interaction states including disabled and indeterminate."
          .html=${statesHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 16px; align-items: center; justify-content: center; flex-wrap: wrap;">
            <zui-checkbox label="Disabled Unchecked" disabled></zui-checkbox>
            <zui-checkbox label="Disabled Checked" disabled checked></zui-checkbox>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <zui-checkbox
                label="Indeterminate"
                .indeterminate=${this._indeterminate}
                @change=${() => this._indeterminate = false}
                ></zui-checkbox>
                <button 
                @click=${() => this._indeterminate = true}
                style="padding: 4px 8px; font-size: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: var(--text-main); border-radius: 4px; cursor: pointer;"
                >
                Reset
                </button>
            </div>
          </div>
        </demo-example>

        <demo-example
          header="Custom Styling"
          description="Customize colors and radius using CSS variables."
          .html=${customThemeHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <zui-checkbox 
            class="custom-theme" 
            label="Custom Colors & Shape" 
            checked
          ></zui-checkbox>
        </demo-example>
      </demo-page>
    `;
  }
}
