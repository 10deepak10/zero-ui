import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/storage-check/zui-storage-check.js';
import '../components/demo-page';
import '../components/demo-example';
import { StorageCheckService, type StorageQuota } from '@deepverse/zero-ui';

@customElement('storage-check-demo')
export class StorageCheckDemo extends LitElement {
  @state() private _serviceQuota: StorageQuota | null = null;
  @state() private _serviceAvailable: any = null;

  static styles = css`
    .preview {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    button {
      padding: 8px 16px; 
      border-radius: 6px; 
      color: white; 
      cursor: pointer; 
      transition: opacity 0.2s;
      font-family: inherit;
      font-size: 0.875rem;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
    }
    .btn-primary { background: #3b82f6; border: none; }
    .btn-secondary { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
    .btn-accent { background: #8b5cf6; border: none; }

    zui-storage-check {
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

  async connectedCallback() {
    super.connectedCallback();
    this._refreshData();
  }

  private async _refreshData() {
    this._serviceAvailable = StorageCheckService.checkAvailability();
    this._serviceQuota = await StorageCheckService.getQuota();
  }

  private async _fillIndexedDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('DemoDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction('store', 'readwrite');
        const store = transaction.objectStore('store');
        
        // Add a new 5MB chunk each time with a unique key
        const chunkId = Date.now().toString();
        const data = new Blob([new Array(5 * 1024 * 1024).join('x')], { type: 'text/plain' });
        store.put(data, `chunk_${chunkId}`);

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async _clearIndexedDB() {
    // Close any potential open connections first (though we close them after write)
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('DemoDB');
      
      request.onblocked = () => {
        console.warn('Delete database blocked - checking for open tabs/connections');
      };

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async _fillStorage() {
    const btn = this.shadowRoot?.getElementById('fill-btn') as HTMLButtonElement;
    if (btn) {
      const originalText = btn.innerText;
      btn.disabled = true;
      btn.innerText = 'Adding 5MB...';
      
      try {
        await this._fillIndexedDB();
        // Give browser a moment to update quota stats
        await new Promise(r => setTimeout(r, 1000));
        await this._refreshData();
        
        const component = this.shadowRoot?.querySelector('zui-storage-check') as any;
        if (component) component._checkStorage();
      } catch (e) {
        console.error('Storage full or error', e);
        alert('Could not fill storage (potentially full)');
      } finally {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  }

  private async _clearStorage() {
    const btn = this.shadowRoot?.getElementById('clear-btn') as HTMLButtonElement;
    if (btn) {
      const originalText = btn.innerText;
      btn.disabled = true;
      btn.innerText = 'Clearing...';

      try {
        await this._clearIndexedDB();
        await new Promise(r => setTimeout(r, 1000));
        await this._refreshData();
        
        const component = this.shadowRoot?.querySelector('zui-storage-check') as any;
        if (component) component._checkStorage();
      } catch (e) {
        console.error('Error clearing storage', e);
      } finally {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  }

  private async _fillLocalStorage() {
    const btn = this.shadowRoot?.getElementById('fill-ls-btn') as HTMLButtonElement;
    if (btn) {
      const originalText = btn.innerText;
      btn.disabled = true;
      btn.innerText = 'Adding...';
      
      try {
        const chunkId = Date.now().toString();
        // Add ~500KB to LS
        const data = new Array(500 * 1024).join('x');
        localStorage.setItem(`demo_ls_${chunkId}`, data);
        
        await new Promise(r => setTimeout(r, 500));
        await this._refreshData();
        
        const component = this.shadowRoot?.querySelector('zui-storage-check') as any;
        if (component) component._checkStorage();
      } catch (e) {
        console.error('LS full', e);
        alert('LocalStorage full');
      } finally {
        btn.disabled = false;
        btn.innerText = originalText;
      }
    }
  }

  private async _clearLocalStorage() {
    localStorage.clear();
    await this._refreshData();
    const component = this.shadowRoot?.querySelector('zui-storage-check') as any;
    if (component) component._checkStorage();
  }

  render() {
    const basicHtml = `<zui-storage-check></zui-storage-check>`;
    const basicReact = `import { ZuiStorageCheck } from '../components/storage-check/zui-storage-check.js';

function App() {
  return <ZuiStorageCheck />;
}`;
    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-storage-check></zui-storage-check>\`
})
export class AppComponent {}`;
    const basicVue = `<template>
  <zui-storage-check />
</template>`;

    const serviceReact = `import { useState, useEffect } from 'react';
import { StorageCheckService } from '@deepverse/zero-ui';

function App() {
  const [quota, setQuota] = useState(null);
  
  useEffect(() => {
    StorageCheckService.getQuota().then(setQuota);
  }, []);

  return <pre>{JSON.stringify(quota, null, 2)}</pre>;
}`;

    const serviceAngular = `import { Component, OnInit } from '@angular/core';
import { StorageCheckService } from '@deepverse/zero-ui';

@Component({
  selector: 'app-root',
  template: \`<pre>{{ quota | json }}</pre>\`
})
export class AppComponent implements OnInit {
  quota: any;
  async ngOnInit() {
    this.quota = await StorageCheckService.getQuota();
  }
}`;

    const serviceVue = `<template>
  <pre>{{ quota }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { StorageCheckService } from '@deepverse/zero-ui';

const quota = ref(null);
onMounted(async () => {
    quota.value = await StorageCheckService.getQuota();
});
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
              <td><code>checkAvailability</code></td>
              <td><code>-</code></td>
              <td><code>StorageAvailability</code></td>
              <td>Check support for LocalStorage, SessionStorage, IDB.</td>
            </tr>
            <tr>
              <td><code>getQuota</code></td>
              <td><code>-</code></td>
              <td><code>Promise&lt;StorageQuota&gt;</code></td>
              <td>Get storage quota and usage estimates.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    return html`
      <demo-page
        name="Storage Check"
        description="Visualizes storage usage availability and quota (IndexedDB, LocalStorage, etc)."
      >
        <demo-example
          header="Component Usage"
          description="Visual storage quota indicator."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div class="preview">
            <zui-storage-check></zui-storage-check>
            
            <div class="controls">
              <button 
                id="fill-btn"
                class="btn-primary"
                @click=${this._fillStorage}
              >
                Add +5MB (IndexedDB)
              </button>
              <button 
                id="clear-btn"
                class="btn-secondary"
                @click=${this._clearStorage}
              >
                Clear Storage
              </button>
            </div>

            <div class="controls">
              <button 
                id="fill-ls-btn"
                class="btn-accent"
                @click=${this._fillLocalStorage}
              >
                Add +500KB (LocalStorage)
              </button>
              <button 
                class="btn-secondary"
                @click=${this._clearLocalStorage}
              >
                Clear LocalStorage
              </button>
            </div>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing storage quota."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
           <pre style="background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Result (Availability):
${JSON.stringify(this._serviceAvailable, null, 2)}

// Result (Quota):
${JSON.stringify(this._serviceQuota, null, 2)}
           </pre>
        </demo-example>

        ${apiHtml}
      </demo-page>
    `;
  }
}
