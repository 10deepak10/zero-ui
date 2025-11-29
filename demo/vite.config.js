import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@deepverse/zero-ui/button': path.resolve(__dirname, '../packages/zero-ui/dist/button/dv-button.js'),
      '@deepverse/zero-ui/card': path.resolve(__dirname, '../packages/zero-ui/dist/card/dv-card.js'),
      '@deepverse/zero-ui/upload-box': path.resolve(__dirname, '../packages/zero-ui/dist/upload-box/dv-upload-box.js'),
      '@deepverse/zero-ui': path.resolve(__dirname, '../packages/zero-ui/dist/index.js'),
    }
  }
});
