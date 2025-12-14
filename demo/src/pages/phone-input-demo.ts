import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/phone-input';
import '../components/demo-page';
import '../components/demo-example';

@customElement('phone-input-demo')
export class PhoneInputDemo extends LitElement {
  static styles = css`
    .output {
      margin-top: 16px;
      padding: 12px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 6px;
      font-family: monospace;
      color: var(--text-main);
      width: 100%;
      max-width: 400px;
    }
  `;

  @state() private _phoneValue = '';
  @state() private _isValid = false;

  render() {
    const properties = [
      { name: 'allowedCountries', type: 'string[]', default: '[] (All)', description: 'Array of country codes to allow.' },
      { name: 'validationPatterns', type: 'Record<string, string | RegExp>', default: '{}', description: 'Custom regex patterns keyed by ISO country code.' },
      { name: 'value', type: 'string', default: "''", description: 'Current phone number.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input.' },
    ];

    const basicHtml = `<zui-phone-input
  @zui-phone-change="\${handleChange}"
></zui-phone-input>`;

    const filteredHtml = `<zui-phone-input
  .allowedCountries="\${['US', 'CA', 'GB']}"
></zui-phone-input>`;

    const basicReact = `import { ZuiPhoneInput } from '@deepverse/zero-ui/react';

function App() {
  return (
    <ZuiPhoneInput
      onZuiPhoneChange={(e) => console.log(e.detail)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-phone-input
      (zui-phone-change)="handleChange($event)">
    </zui-phone-input>
  \`
})
export class AppComponent {
  handleChange(e: any) {
    console.log(e.detail);
  }
}`;

    const basicVue = `<template>
  <zui-phone-input
    @zui-phone-change="logChange"
  />
</template>

<script setup>
const logChange = (e) => console.log(e.detail);
</script>`;

    const filteredReact = `import { ZuiPhoneInput } from '@deepverse/zero-ui/react';

function App() {
  return (
    <ZuiPhoneInput
      allowedCountries={['US', 'CA', 'GB']}
    />
  );
}`;

    const filteredAngular = `<zui-phone-input
  [allowedCountries]="['US', 'CA', 'GB']">
</zui-phone-input>`;

    const filteredVue = `<zui-phone-input
  :allowedCountries="['US', 'CA', 'GB']"
/>`;


    return html`
      <demo-page
        name="Phone Input"
        description="A phone number input with country code selector and validation."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage (All Countries)"
          description="Default phone input supporting all countries."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <zui-phone-input
              @zui-phone-change=${(e: CustomEvent) => {
        this._phoneValue = e.detail.value;
        this._isValid = e.detail.isValid;
      }}
            ></zui-phone-input>
            
            <div class="output">
              Current Value: ${this._phoneValue || '...'}<br>
              Status: <span style="color: ${this._isValid ? '#16a34a' : '#dc2626'}">
                ${this._isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </div>
        </demo-example>

        <demo-example
          header="Filtered Countries (US, CA, GB)"
          description="Limit the available countries."
          .html=${filteredHtml}
          .react=${filteredReact}
          .angular=${filteredAngular}
          .vue=${filteredVue}
        >
          <div style="display: flex; justify-content: center;">
            <zui-phone-input
              .allowedCountries=${['US', 'CA', 'GB']}
            ></zui-phone-input>
          </div>
        </demo-example>
        <demo-example
          header="Custom Regex Validation"
          description="Apply custom validation rules per country (e.g., US: exact 10 digits, IN: starts with 6-9)."
          .html=${`<zui-phone-input></zui-phone-input>
<script>
  const input = document.querySelector('zui-phone-input');
  input.validationPatterns = {
    'US': /^\\d{10}$/,
    'IN': /^[6-9]\\d{9}$/
  };
</script>`}
          .react=${`import { ZuiPhoneInput } from '@deepverse/zero-ui/react';

function App() {
  const patterns = {
    'US': /^\\d{10}$/,
    'IN': /^[6-9]\\d{9}$/
  };

  return (
    <ZuiPhoneInput
      validationPatterns={patterns}
    />
  );
}`}
          .angular=${`<zui-phone-input
  [validationPatterns]="patterns">
</zui-phone-input>

class AppComponent {
  patterns = {
    'US': /^\\d{10}$/,
    'IN': /^[6-9]\\d{9}$/
  };
}`}
          .vue=${`<script setup>
const patterns = {
  'US': /^\\d{10}$/,
  'IN': /^[6-9]\\d{9}$/
};
</script>

<template>
  <zui-phone-input
    :validationPatterns="patterns"
  />
</template>`}
        >
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <zui-phone-input
              .validationPatterns=${{
        'US': /^\d{10}$/,
        'IN': /^[6-9]\d{9}$/
      }}
              @zui-phone-change=${(e: CustomEvent) => {
        // specific logic for this demo if needed, otherwise uses internal valid state
        const el = e.target as HTMLElement;
        const isValid = e.detail.isValid;
        el.style.setProperty('--zui-primary', isValid ? '#16a34a' : '#ef4444');
      }}
            ></zui-phone-input>
            <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-muted);">
              Try US (10 digits) or India (10 digits starting with 6-9)
            </div>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
