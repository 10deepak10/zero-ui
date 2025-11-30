import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@deepverse/zero-ui/button': path.resolve(__dirname, '../packages/zero-ui/src/button/zui-button.ts'),
      '@deepverse/zero-ui/card': path.resolve(__dirname, '../packages/zero-ui/src/card/zui-card.ts'),
      '@deepverse/zero-ui/file-upload': path.resolve(__dirname, '../packages/zero-ui/src/file-upload/zui-file-upload.ts'),
      '@deepverse/zero-ui/otp-input': path.resolve(__dirname, '../packages/zero-ui/src/otp-input/zui-otp-input.ts'),
      '@deepverse/zero-ui/phone-input': path.resolve(__dirname, '../packages/zero-ui/src/phone-input/zui-phone-input.ts'),
      '@deepverse/zero-ui': path.resolve(__dirname, '../packages/zero-ui/dist/index.js'),
    }
  }
});
