import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/file-upload';

@customElement('file-upload-demo')
export class FileUploadDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }
    .demo-section {
      margin-bottom: 40px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }
    h2 {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .preview {
      padding: 24px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    zui-file-upload {
      max-width: 500px;
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
