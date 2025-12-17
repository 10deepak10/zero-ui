import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/screen-check';
import '../components/demo-page';
import '../components/demo-example';
import { ScreenCheckService } from '@deepverse/zero-ui';

@customElement('screen-check-demo')
export class ScreenCheckDemo extends LitElement {
  @state() private _screenInfo: any = null;
  @state() private _serviceInfo: any = null;

  private _cleanupSubscription: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._cleanupSubscription = ScreenCheckService.subscribe((info) => {
      this._serviceInfo = info;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._cleanupSubscription) {
      this._cleanupSubscription();
      this._cleanupSubscription = null;
    }
  }

  private _handleScreenChange(e: CustomEvent) {
    this._screenInfo = e.detail;
  }

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

    zui-screen-check {
      width: 100%;
    }

    .badge {
      font-size: 0.75rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
       /* Prevent full width in flex container */
       width: fit-content;
    }
  `;

  render() {
    const liveHtml = `<zui-screen-check 
  live 
  @screen-change="\${handleChange}"
></zui-screen-check>`;
    const liveReact = `import { ZuiScreenCheck } from '@deepverse/zero-ui/screen-check';

function App() {
  const handleScreenChange = (e) => {
    console.log('Screen info:', e.detail);
  };

  return <ZuiScreenCheck live onScreenChange={handleScreenChange} />;
}`;
    const liveAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-screen-check live (screen-change)="onScreenChange($event)"></zui-screen-check>\`
})
export class AppComponent {
  onScreenChange(event: any) {
    console.log('Screen info:', event.detail);
  }
}`;
    const liveVue = `<template>
  <zui-screen-check live @screen-change="onScreenChange" />
</template>

<script setup>
const onScreenChange = (event) => {
  console.log('Screen info:', event.detail);
};
</script>`;

    const staticHtml = `<zui-screen-check></zui-screen-check>`;
    const staticReact = `import { ZuiScreenCheck } from '@deepverse/zero-ui/screen-check';

function App() {
  return <ZuiScreenCheck />;
}`;
    const staticAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<zui-screen-check></zui-screen-check>\`
})
export class AppComponent {}`;
    const staticVue = `<template>
  <zui-screen-check />
</template>`;

    const serviceReact = `import { useEffect } from 'react';
import { ScreenCheckService } from '@deepverse/zero-ui';

function App() {
  useEffect(() => {
    const cleanup = ScreenCheckService.subscribe((info) => {
      console.log('Screen updated:', info);
    });
    return cleanup;
  }, []);

  return <div>Headless Service Active</div>;
}`;

    const serviceAngular = `import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScreenCheckService } from '@deepverse/zero-ui';

@Component({ ... })
export class AppComponent implements OnInit, OnDestroy {
  cleanup: any;

  ngOnInit() {
    this.cleanup = ScreenCheckService.subscribe((info) => {
      console.log('Screen updated:', info);
    });
  }

  ngOnDestroy() {
    if (this.cleanup) this.cleanup();
  }
}`;

    const serviceVue = `<script setup>
import { onMounted, onUnmounted } from 'vue';
import { ScreenCheckService } from '@deepverse/zero-ui';

let cleanup;
onMounted(() => {
  cleanup = ScreenCheckService.subscribe((info) => {
    console.log('Screen updated:', info);
  });
});
onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>`;

    return html`
      <demo-page
        name="Screen Check"
        description="Detects screen properties like resolution, orientation, and color depth."
      >
        <demo-example
          header="Live Monitor"
          description="Real-time screen dimension monitoring. Try resizing your window!"
          .html=${liveHtml}
          .react=${liveReact}
          .angular=${liveAngular}
          .vue=${liveVue}
        >
          <div class="preview">
            <span class="badge">Resize Window to Test</span>
            <zui-screen-check
              live
              @screen-change=${this._handleScreenChange}
            ></zui-screen-check>
            
            ${this._screenInfo ? html`
               <div style="width: 100%; margin-top: 16px;">
                  <zui-code-editor .value=${"// Event Data:\n" + JSON.stringify(this._screenInfo, null, 2)} readonly language="json"></zui-code-editor>
               </div>
            ` : ''}
          </div>
        </demo-example>

        <demo-example
          header="Static Snapshot"
          description="One-time check of screen properties."
          .html=${staticHtml}
          .react=${staticReact}
          .angular=${staticAngular}
          .vue=${staticVue}
        >
          <div class="preview">
            <zui-screen-check></zui-screen-check>
          </div>
        </demo-example>

        <demo-example
          header="Service Usage"
          description="Headless API for accessing screen information."
          .html=${`<!-- No HTML equivalent, JS-only -->`}
          .react=${serviceReact}
          .angular=${serviceAngular}
          .vue=${serviceVue}
        >
          <div class="preview">
             <pre style="width: 100%; background: #1e1e1e; padding: 16px; border-radius: 8px; overflow: auto; color: #fff;">
// Result:
${JSON.stringify(this._serviceInfo, null, 2)}
             </pre>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
