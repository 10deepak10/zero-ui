import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/battery-check';
import '../components/demo-page';
import '../components/demo-example';
import { BatteryCheckService, type BatteryInfo } from '@deepverse/zero-ui';

@customElement('battery-check-demo')
export class BatteryCheckDemo extends LitElement {
  @state() private _serviceInfo: BatteryInfo | null = null;
  
  private _handleUpdate = (info: BatteryInfo) => {
    this._serviceInfo = info;
  };

  static styles = css`
    .preview {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      flex-wrap: wrap;
    }

    zui-battery-check {
      width: 100%;
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
  `;

  connectedCallback() {
    super.connectedCallback();
    BatteryCheckService.subscribe(this._handleUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    BatteryCheckService.unsubscribe(this._handleUpdate);
  }

  render() {
    const basicHtml = `<zui-battery-check></zui-battery-check>`;

    const basicReact = `import { ZuiBatteryCheck } from '@deepverse/zero-ui/battery-check';

function App() {
  return <ZuiBatteryCheck />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-battery-check></zui-battery-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-battery-check />
</template>`;

    const serviceReact = `import { useEffect, useState } from 'react';
import { BatteryCheckService } from '@deepverse/zero-ui';

function App() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    BatteryCheckService.subscribe(setInfo);
    return () => BatteryCheckService.unsubscribe(setInfo);
  }, []);

  return <pre>{JSON.stringify(info, null, 2)}</pre>;
}`;

    const serviceAngular = `import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatteryCheckService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`<pre>{{ info | json }}</pre>\`
})
export class AppComponent implements OnInit, OnDestroy {
  info: any;
  private handler = (i: any) => this.info = i;

  ngOnInit() {
    BatteryCheckService.subscribe(this.handler);
  }

  ngOnDestroy() {
    BatteryCheckService.unsubscribe(this.handler);
  }
}`;

    const serviceVue = `<template>
  <pre>{{ info }}</pre>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BatteryCheckService } from '@deepverse/zero-ui';

const info = ref(null);
const update = (i) => info.value = i;

onMounted(() => BatteryCheckService.subscribe(update));
onUnmounted(() => BatteryCheckService.unsubscribe(update));
</script>`;

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
              <td><code>getBatteryInfo</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;BatteryInfo&gt;</code></td>
              <td>Get current battery status (level, charging, etc).</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (info: BatteryInfo) => void</code></td>
              <td><code>Promise&lt;void&gt;</code></td>
              <td>Listen for battery status changes.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (info: BatteryInfo) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening for updates.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Battery Check"
        description="Monitors and displays battery status, level, and charging state."
      >
        <demo-example
          header="Component Usage"
          description="Visual indicator of battery health."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-battery-check></zui-battery-check>
          </div>
        </demo-example>

         <demo-example
          header="Service Usage"
          description="Headless API for accessing battery info."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
           <pre style="background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Live Result:
${JSON.stringify(this._serviceInfo, null, 2)}
           </pre>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
