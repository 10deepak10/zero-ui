import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/file-upload';

@customElement('file-upload-demo')
export class FileUploadDemo extends LitElement {
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
    pre {
      background: rgba(0,0,0,0.3);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    zui-file-upload {
      max-width: 500px;
      width: 100%;
    }
  `;

  render() {
    return html`
      <h1>File Upload</h1>
      <p>A drag-and-drop file upload component with progress and validation.</p>

      <div class="demo-section">
        <h2>Basic Usage</h2>
        <div class="preview">
          <zui-file-upload 
            label="Upload Document" 
            accept=".pdf,.doc,.docx"
            maxSize="5"
          ></zui-file-upload>
        </div>
        <pre><code>&lt;zui-file-upload 
  label="Upload Document" 
  accept=".pdf,.doc,.docx"
&gt;&lt;/zui-file-upload&gt;</code></pre>
      </div>

      <div class="demo-section">
        <h2>Image Upload</h2>
        <div class="preview">
          <zui-file-upload 
            label="Upload Image" 
            accept="image/*"
            maxSize="2"
          ></zui-file-upload>
        </div>
      </div>
    `;
  }
}
