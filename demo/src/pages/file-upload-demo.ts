import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/file-upload';
import '../components/demo-page';
import '../components/demo-example';

@customElement('file-upload-demo')
export class FileUploadDemo extends LitElement {
  static styles = css`
    zui-file-upload {
      max-width: 500px;
      width: 100%;
    }
  `;

  render() {
    const properties = [
      { name: 'label', type: 'string', default: "'Upload File'", description: 'Label text shown on the upload area.' },
      { name: 'accept', type: 'string', default: "''", description: 'Comma-separated string of accepted file types (e.g. ".jpg,.png").' },
      { name: 'maxSize', type: 'number', default: 'Infinity', description: 'Maximum file size in MB.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the upload input.' },
    ];

    const basicHtml = `<zui-file-upload 
  label="Upload Document" 
  accept=".pdf,.doc,.docx"
  maxSize="5"
></zui-file-upload>`;

    const imageHtml = `<zui-file-upload 
  label="Upload Image" 
  accept="image/*"
  maxSize="2"
></zui-file-upload>`;

    const basicReact = `import { ZuiFileUpload } from '@deepverse/zero-ui/react';

function App() {
  const handleUpload = (e) => {
    // e.detail.files contains the FileList
    console.log(e.detail.files);
  };
  return (
    <ZuiFileUpload 
      label="Upload Document" 
      accept=".pdf,.doc,.docx"
      maxSize={5}
      onZuiUpload={handleUpload}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-file-upload 
      label="Upload Document" 
      accept=".pdf,.doc,.docx"
      maxSize="5"
      (zui-upload)="handleUpload($event)">
    </zui-file-upload>
  \`
})
export class AppComponent {
  handleUpload(e: any) {
    console.log(e.detail.files);
  }
}`;

    const basicVue = `<template>
  <zui-file-upload 
    label="Upload Document" 
    accept=".pdf,.doc,.docx"
    maxSize="5"
    @zui-upload="handleUpload"
  />
</template>

<script setup>
const handleUpload = (e) => console.log(e.detail.files);
</script>`;

    return html`
      <demo-page
        name="File Upload"
        description="A drag-and-drop file upload component with progress indication and validation."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Standard file upload with restrictions."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; justify-content: center;">
            <zui-file-upload 
              label="Upload Document" 
              accept=".pdf,.doc,.docx"
              maxSize="5"
            ></zui-file-upload>
          </div>
        </demo-example>

        <demo-example
          header="Image Upload"
          description="Specialized upload for images."
          .html=${imageHtml}
          .react=${basicReact.replace('Upload Document', 'Upload Image').replace('.pdf,.doc,.docx', 'image/*').replace('maxSize={5}', 'maxSize={2}')}
          .angular=${basicAngular.replace('Upload Document', 'Upload Image').replace('.pdf,.doc,.docx', 'image/*').replace('maxSize="5"', 'maxSize="2"')}
          .vue=${basicVue.replace('Upload Document', 'Upload Image').replace('.pdf,.doc,.docx', 'image/*').replace('maxSize="5"', 'maxSize="2"')}
        >
          <div style="display: flex; justify-content: center;">
            <zui-file-upload 
              label="Upload Image" 
              accept="image/*"
              maxSize="2"
            ></zui-file-upload>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
