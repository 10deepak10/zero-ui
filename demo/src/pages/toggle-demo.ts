import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/toggle';
import '../components/demo-page';
import '../components/demo-example';

@customElement('toggle-demo')
export class ToggleDemo extends LitElement {
  @state() private _checked1 = false;

  static styles = css`
    .custom-theme {
      --zui-toggle-bg-on: #10b981;
      --zui-toggle-width: 60px;
      --zui-toggle-height: 30px;
      --zui-toggle-thumb-size: 26px;
    }
  `;

  render() {
    const properties = [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the toggle is on.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
      { name: 'label', type: 'string', default: "''", description: 'Label text to display.' },
    ];

    const basicHtml = `<zui-toggle 
  label="Notifications" 
  .checked="\${checked}"
  @change="\${handleChange}"
></zui-toggle>`;

    const basicReact = `import { ZuiToggle } from '@deepverse/zero-ui/react';

function App() {
  const [checked, setChecked] = useState(false);
  return (
    <ZuiToggle
      label="Notifications"
      checked={checked}
      onZuiChange={(e) => setChecked(e.detail.checked)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-toggle 
      label="Notifications" 
      [checked]="checked" 
      (change)="handleChange($event)">
    </zui-toggle>
  \`
})
export class AppComponent {
  checked = false;
  handleChange(e: any) {
    this.checked = e.detail.checked;
  }
}`;

    const basicVue = `<template>
  <zui-toggle 
    label="Notifications" 
    :checked="checked" 
    @change="checked = $event.detail.checked" 
  />
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(false);
</script>`;

    const statesHtml = `<zui-toggle label="Disabled Off" disabled></zui-toggle>
<zui-toggle label="Disabled On" disabled checked></zui-toggle>`;

    const customThemeHtml = `<style>
  .custom-theme {
    --zui-toggle-bg-on: #10b981;
    --zui-toggle-width: 60px;
    --zui-toggle-height: 30px;
    --zui-toggle-thumb-size: 26px;
  }
</style>

<zui-toggle class="custom-theme" label="Custom" checked></zui-toggle>`;

    return html`
      <demo-page
        name="Toggle Switch"
        description="A toggle switch for switching between two states, usually on and off."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard toggle usage."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <zui-toggle
              label="Notifications"
              .checked=${this._checked1}
              @change=${(e: any) => this._checked1 = e.detail.checked}
            ></zui-toggle>
            <div style="font-family: monospace; font-size: 0.9em; color: var(--text-muted)">Checked: ${this._checked1}</div>
            <zui-toggle 
              label="Auto-save" 
              checked
            ></zui-toggle>
          </div>
        </demo-example>

        <demo-example
          header="States"
          description="Disabled toggle states."
          .html=${statesHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 16px; justify-content: center; align-items: center; flex-wrap: wrap;">
            <zui-toggle label="Disabled Off" disabled></zui-toggle>
            <zui-toggle label="Disabled On" disabled checked></zui-toggle>
          </div>
        </demo-example>

        <demo-example
          header="Custom Styling"
          description="Customize size and colors of the toggle."
          .html=${customThemeHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <zui-toggle 
            class="custom-theme" 
            label="Custom Size & Color" 
            checked
          ></zui-toggle>
        </demo-example>
      </demo-page>
    `;
  }
}
