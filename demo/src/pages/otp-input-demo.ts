import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/otp-input';
import '../components/demo-page';
import '../components/demo-example';

@customElement('otp-input-demo')
export class OtpInputDemo extends LitElement {
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

  @state() private _otpValue = '';
  @state() private _otpComplete = '';

  render() {
    const properties = [
      { name: 'length', type: 'number', default: '6', description: 'Number of OTP digits.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input.' },
      { name: 'value', type: 'string', default: "''", description: 'Current OTP value.' },
    ];

    const basicHtml = `<zui-otp-input
  length="6"
  @zui-otp-change="\${handleChange}"
  @zui-otp-complete="\${handleComplete}"
></zui-otp-input>`;

    const basicReact = `import { ZuiOtpInput } from '@deepverse/zero-ui/react';

function App() {
  return (
    <ZuiOtpInput
      length={6}
      onZuiOtpChange={(e) => console.log('Change:', e.detail.value)}
      onZuiOtpComplete={(e) => console.log('Complete:', e.detail.value)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-otp-input
      [length]="6"
      (zui-otp-change)="handleChange($event)"
      (zui-otp-complete)="handleComplete($event)">
    </zui-otp-input>
  \`
})
export class AppComponent {
  handleChange(e: any) {
    console.log('Change:', e.detail.value);
  }
  handleComplete(e: any) {
    console.log('Complete:', e.detail.value);
  }
}`;

    const basicVue = `<template>
  <zui-otp-input
    :length="6"
    @zui-otp-change="logChange"
    @zui-otp-complete="logComplete"
  />
</template>

<script setup>
const logChange = (e) => console.log('Change:', e.detail.value);
const logComplete = (e) => console.log('Complete:', e.detail.value);
</script>`;

    const shortHtml = `<zui-otp-input length="4"></zui-otp-input>`;


    return html`
      <demo-page
        name="OTP Input"
        description="A secure and user-friendly one-time password input field with auto-focus and navigation."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard 6-digit OTP input."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <zui-otp-input
              @zui-otp-change=${(e: CustomEvent) => this._otpValue = e.detail.value}
              @zui-otp-complete=${(e: CustomEvent) => this._otpComplete = e.detail.value}
            ></zui-otp-input>
            
            <div class="output">
              Current Value: ${this._otpValue}<br>
              Completed: ${this._otpComplete || '...'}
            </div>
          </div>
        </demo-example>

        <demo-example
          header="4-Digit OTP"
          description="Configurable length (e.g. 4 digits)."
          .html=${shortHtml}
          .react=${basicReact.replace('length={6}', 'length={4}')}
          .angular=${basicAngular.replace('[length]="6"', '[length]="4"')}
          .vue=${basicVue.replace(':length="6"', ':length="4"')}
        >
           <div style="display: flex; justify-content: center;">
            <zui-otp-input length="4"></zui-otp-input>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
