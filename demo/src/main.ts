import './style.css'
import { setupCounter } from './counter.ts'
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/upload-box';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section>
    <h2>Direct source import (dev)</h2>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <dv-button>Source Button</dv-button>
      <dv-card>Some card content</dv-card>
      <dv-upload-box 
        label="Upload Document" 
        accept="image/*" 
        maxSize="1"
      ></dv-upload-box>
    </div>
  </section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
