import './style.css'
import { setupCounter } from './counter.ts'
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/file-upload';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Zero UI Demo</h1>
    <zui-card>
      <h2>Card Component</h2>
      <p>This is a card component from Zero UI.</p>
      <zui-button>Click Me</zui-button>
    </zui-card>
    <br />
      <zui-file-upload label="Upload Document" accept=".pdf,.doc,.docx"></zui-file-upload>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
