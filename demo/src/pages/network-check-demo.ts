import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/network-check';
import '../components/demo-page';
import '../components/demo-example';
import { NetworkCheckService, type NetworkInfo } from '@deepverse/zero-ui';

@customElement('network-check-demo')
export class NetworkCheckDemo extends LitElement {
  @state() private _serviceInfo: NetworkInfo | null = null;
  
  private _updateHandler = (info: NetworkInfo) => {
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

    @media (max-width: 768px) {
      .preview {
        padding: 16px;
      }
    }
    .tip {
      background: rgba(59, 130, 246, 0.1);
      border-left: 4px solid #3b82f6;
      padding: 12px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #bfdbfe;
      border-radius: 4px;
    }
    
    zui-network-check {
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    NetworkCheckService.subscribe(this._updateHandler);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    NetworkCheckService.unsubscribe(this._updateHandler);
  }

  render() {
    const basicHtml = `<zui-network-check></zui-network-check>`;

    const basicReact = `import { ZuiNetworkCheck } from '@deepverse/zero-ui/react';

function App() {
  return <ZuiNetworkCheck />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-network-check></zui-network-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-network-check />
</template>`;

    const serviceReact = `import { useEffect, useState } from 'react';
import { NetworkCheckService } from '@deepverse/zero-ui';

function App() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    NetworkCheckService.subscribe(setInfo);
    return () => NetworkCheckService.unsubscribe(setInfo);
  }, []);

  return <pre>{JSON.stringify(info, null, 2)}</pre>;
}`;

    const serviceAngular = `import { Component, OnInit, OnDestroy } from '@angular/core';
import { NetworkCheckService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`<pre>{{ info | json }}</pre>\`
})
export class AppComponent implements OnInit, OnDestroy {
  info: any;
  private handler = (i: any) => this.info = i;

  ngOnInit() {
    NetworkCheckService.subscribe(this.handler);
  }

  ngOnDestroy() {
    NetworkCheckService.unsubscribe(this.handler);
  }
}`;

    const serviceVue = `<template>
  <pre>{{ info }}</pre>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { NetworkCheckService } from '@deepverse/zero-ui';

const info = ref(null);
const update = (i) => info.value = i;

onMounted(() => NetworkCheckService.subscribe(update));
onUnmounted(() => NetworkCheckService.unsubscribe(update));
</script>`;

    return html`
      <demo-page
        name="Network Check"
        description="Monitors network connection status (online/offline) and type."
      >
        <div class="tip">
          <strong>Tip:</strong> Open Chrome DevTools > Network tab > Throttling dropdown to simulate "Offline" or "Slow 3G" and see the component update in real-time.
        </div>

        <demo-example
          header="Component Usage"
          description="Visual connection indicator."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-network-check></zui-network-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing network info."
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
