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
      </demo-page>
    `;
  }
}
