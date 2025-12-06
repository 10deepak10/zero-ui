import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/storage-check';
import { StorageCheckService, type StorageQuota } from '@deepverse/zero-ui';

@customElement('storage-check-demo')
export class StorageCheckDemo extends LitElement {
  @state() private _serviceQuota: StorageQuota | null = null;
  @state() private _serviceAvailable: any = null;

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

  static styles = css`
    :host {
      display: block;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section {
      margin-bottom: 50px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 30px;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: var(--text-main);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
    }

    .demo-item {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .code-block {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.9rem;
      color: #a5b4fc;
      margin-top: 10px;
      white-space: pre-wrap;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
    }
  `;

  render() {
    return html`
      <h1>Storage Check</h1>

      <div class="section">
        <h2>Component Usage</h2>
        <div class="demo-item">
          <zui-storage-check></zui-storage-check>
          
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button 
              id="fill-btn"
              @click=${this._fillStorage}
              style="padding: 8px 16px; background: #3b82f6; border: none; border-radius: 6px; color: white; cursor: pointer; transition: opacity 0.2s;"
            >
              Add +5MB (IndexedDB)
            </button>
            <button 
              id="clear-btn"
              @click=${this._clearStorage}
              style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer; transition: opacity 0.2s;"
            >
              Clear Storage
            </button>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button 
              id="fill-ls-btn"
              @click=${this._fillLocalStorage}
              style="padding: 8px 16px; background: #8b5cf6; border: none; border-radius: 6px; color: white; cursor: pointer; transition: opacity 0.2s;"
            >
              Add +500KB (LocalStorage)
            </button>
            <button 
              @click=${this._clearLocalStorage}
              style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer; transition: opacity 0.2s;"
            >
              Clear LocalStorage
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Service Usage (Headless)</h2>
        <div class="code-block">
import { StorageCheckService } from '@deepverse/zero-ui';

// Check availability (Sync)
const available = StorageCheckService.checkAvailability();

// Get Quota (Async)
const quota = await StorageCheckService.getQuota();
        </div>
        
        <div class="code-block" style="margin-top: 10px; border-left: 4px solid #3b82f6;">
// Result (Availability):
${JSON.stringify(this._serviceAvailable, null, 2)}

// Result (Quota):
${JSON.stringify(this._serviceQuota, null, 2)}
        </div>
      </div>
    `;
  }
}
