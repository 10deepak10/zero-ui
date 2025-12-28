import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/camera-check';
import '../components/demo-page';
import '../components/demo-example';
import { CameraCheckService, type CameraDevice } from '@deepverse/zero-ui';

@customElement('camera-check-demo')
export class CameraCheckDemo extends LitElement {
  @state() private _permission: string = 'Unknown';
  @state() private _devices: CameraDevice[] = [];
  
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
    
    zui-camera-check {
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
    CameraCheckService.subscribe(this._handleUpdate);
    this._refreshInfo();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    CameraCheckService.unsubscribe(this._handleUpdate);
  }

  private _handleUpdate = () => {
    this._refreshInfo();
  };

  private async _refreshInfo() {
    this._permission = await CameraCheckService.checkPermission();
    this._devices = await CameraCheckService.getDevices();
  }

  render() {
    const properties = [
      { name: 'showPreview', type: 'boolean', default: 'false', description: 'Show video preview if permission granted.' }
    ];

    const basicHtml = `<zui-camera-check showPreview></zui-camera-check>`;

    const basicReact = `import { ZuiCameraCheck } from '@deepverse/zero-ui/camera-check';

function App() {
  return <ZuiCameraCheck showPreview />;
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-camera-check showPreview></zui-camera-check>\`
})
export class AppComponent {}`;

    const basicVue = `<template>
  <zui-camera-check showPreview />
</template>`;

    const serviceReact = `import { useState, useEffect } from 'react';
import { CameraCheckService } from '@deepverse/zero-ui';

function App() {
  const [permission, setPermission] = useState('Unknown');
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function load() {
      setPermission(await CameraCheckService.checkPermission());
      setDevices(await CameraCheckService.getDevices());
    }
    load();
  }, []);

  return <pre>{JSON.stringify({ permission, devices }, null, 2)}</pre>;
}`;

    const serviceAngular = `import { Component, OnInit } from '@angular/core';
import { CameraCheckService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`<pre>{{ info | json }}</pre>\`
})
export class AppComponent implements OnInit {
  info: any = {};
  async ngOnInit() {
    this.info = {
      permission: await CameraCheckService.checkPermission(),
      devices: await CameraCheckService.getDevices()
    };
  }
}`;

    const serviceVue = `<template>
  <pre>{{ info }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CameraCheckService } from '@deepverse/zero-ui';

const info = ref({});
onMounted(async () => {
  info.value = {
      permission: await CameraCheckService.checkPermission(),
      devices: await CameraCheckService.getDevices()
  };
});
</script>`;

    const apiHtml = html`
      <div slot="api">
        <h3>Properties</h3>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
             ${properties.map(p => html`
              <tr>
                <td><code>${p.name}</code></td>
                <td><code>${p.type}</code></td>
                <td><code>${p.default}</code></td>
                <td>${p.description}</td>
              </tr>
            `)}
          </tbody>
        </table>

        <h3>Static Methods (CameraCheckService)</h3>
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
              <td><code>checkPermission</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;PermissionStatus&gt;</code></td>
              <td>Check camera permission status.</td>
            </tr>
            <tr>
              <td><code>requestAccess</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;boolean&gt;</code></td>
              <td>Request camera access.</td>
            </tr>
            <tr>
              <td><code>getDevices</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;CameraDevice[]&gt;</code></td>
              <td>List available video input devices.</td>
            </tr>
            <tr>
              <td><code>getStream</code></td>
              <td><code>deviceId?: string</code></td>
              <td><code>Promise&lt;MediaStream&gt;</code></td>
              <td>Get video stream for a device.</td>
            </tr>
            <tr>
              <td><code>subscribe</code></td>
              <td><code>callback: (status) => void</code></td>
              <td><code>void</code></td>
              <td>Listen for permission changes.</td>
            </tr>
            <tr>
              <td><code>unsubscribe</code></td>
              <td><code>callback: (status) => void</code></td>
              <td><code>void</code></td>
              <td>Stop listening.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Camera Check"
        description="Manages camera permissions and lists available video input devices."
        .properties=${properties}
      >
        <demo-example
          header="Component Usage"
          description="Camera test with preview."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-camera-check ?showPreview=${true}></zui-camera-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing camera info."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
           <pre style="background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Permission Status:
${this._permission}

// Detected Devices:
${JSON.stringify(this._devices, null, 2)}
           </pre>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
