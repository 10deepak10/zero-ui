import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/network-check/zui-network-check.js';
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
    NetworkCheckService.subscribe(this._updateHandler);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    NetworkCheckService.unsubscribe(this._updateHandler);
  }

  render() {
    const basicHtml = `<zui-network-check></zui-network-check>`;

    const basicReact = `import { ZuiNetworkCheck } from '../components/network-check/zui-network-check.js';

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
              <td><code>getNetworkInfo</code></td>
              <td><code>-</code></td>
              <td><code>NetworkInfo</code></td>
              <td>Get current connection properties (type, rtt, etc).</td>
            </tr>
            <tr>
              <td><code>measureConnectionSpeed</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;number&gt;</code></td>
              <td>Run active speed test (downloads file). Returns Mbps.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (info: NetworkInfo) => void</code></td>
              <td><code>void</code></td>
              <td>Listen for network status changes.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (info: NetworkInfo) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

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

        ${apiHtml}
      </demo-page>
    `;
  }
}
