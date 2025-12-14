import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/gpu-check';
import '../components/demo-page';
import '../components/demo-example';
import { GpuCheckService, type GpuInfo } from '@deepverse/zero-ui';

@customElement('gpu-check-demo')
export class GpuCheckDemo extends LitElement {
  @state() private _serviceInfo: GpuInfo | null = null;

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

    @media (max-width: 768px) {
      .preview {
        padding: 16px;
      }
    }

    zui-gpu-check {
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._serviceInfo = GpuCheckService.getGpuInfo();
  }

  render() {
    const basicHtml = `<zui-gpu-check></zui-gpu-check>`;

    const basicReact = `import { ZuiGpuCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiGpuCheck />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-gpu-check></zui-gpu-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-gpu-check />
</template>`;

    const serviceReact = `import { useState, useEffect } from 'react';
import { GpuCheckService } from '@deepverse/zero-ui';

function App() {
  const [info, setInfo] = useState(null as any);

  useEffect(() => {
    setInfo(GpuCheckService.getGpuInfo());
  }, []);

  return <pre>{JSON.stringify(info, null, 2)}</pre>;
}`;

    const serviceAngular = `import { Component, OnInit } from '@angular/core';
import { GpuCheckService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`<pre>{{ info | json }}</pre>\`
})
export class AppComponent implements OnInit {
  info: any;
  ngOnInit() {
    this.info = GpuCheckService.getGpuInfo();
  }
}`;

    const serviceVue = `<template>
  <pre>{{ info }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GpuCheckService } from '@deepverse/zero-ui';

const info = ref(null);
onMounted(() => {
  info.value = GpuCheckService.getGpuInfo();
});
</script>`;


    return html`
      <demo-page
        name="GPU Check"
        description="Detects GPU information (vendor, renderer) using WebGL."
      >
        <demo-example
          header="Component Usage"
          description="Visual display of GPU details."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-gpu-check></zui-gpu-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing GPU info."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
           <pre style="background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Result:
${JSON.stringify(this._serviceInfo, null, 2)}
           </pre>
        </demo-example>
      </demo-page>
    `;
  }
}
