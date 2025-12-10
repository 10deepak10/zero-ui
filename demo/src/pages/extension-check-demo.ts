import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js'; // Added state
import '@deepverse/zero-ui/extension-check';
import { type ExtensionDefinition } from '@deepverse/zero-ui';

@customElement('extension-check-demo')
export class ExtensionCheckDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      color: var(--text-main);
    }

    .demo-section {
      margin-bottom: 40px;
      padding: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-weight: 600;
      color: var(--text-main);
    }

    .preview {
      padding: 40px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
    }

    zui-extension-check {
      width: 100%;
      max-width: 600px;
    }
  `;

  @state()
  private extensions: ExtensionDefinition[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      type: 'wallet',
      checkMethod: 'window',
      windowProperty: 'ethereum.isMetaMask'
    },
    {
      id: 'react-devtools',
      name: 'React DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__REACT_DEVTOOLS_GLOBAL_HOOK__'
    },
    {
      id: 'redux-devtools',
      name: 'Redux DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__REDUX_DEVTOOLS_EXTENSION__'
    },
    {
      id: 'vue-devtools',
      name: 'Vue.js DevTools',
      type: 'devtool',
      checkMethod: 'window',
      windowProperty: '__VUE_DEVTOOLS_GLOBAL_HOOK__'
    },
    {
      id: 'phantom',
      name: 'Phantom Wallet',
      type: 'wallet',
      checkMethod: 'window',
      windowProperty: 'solana.isPhantom'
    },
    {
      id: 'grammarly',
      name: 'Grammarly',
      type: 'other',
      checkMethod: 'dom',
      domSelector: 'grammarly-extension'
    }
  ];

  render() {
    return html`
      <h1>Extension Check</h1>
      <p>Detects common browser extensions and tools.</p>

      <div class="demo-section">
        <h2>Extension Detection</h2>
        <div class="preview">
          <zui-extension-check .extensions=${this.extensions}></zui-extension-check>
        </div>
      </div>
    `;
  }
}
