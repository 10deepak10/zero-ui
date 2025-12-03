import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      "@deepverse/zero-ui/button": path.resolve(
        __dirname,
        "../packages/zero-ui/src/button/zui-button.ts"
      ),
      "@deepverse/zero-ui/card": path.resolve(
        __dirname,
        "../packages/zero-ui/src/card/zui-card.ts"
      ),
      "@deepverse/zero-ui/file-upload": path.resolve(
        __dirname,
        "../packages/zero-ui/src/file-upload/zui-file-upload.ts"
      ),
      "@deepverse/zero-ui/otp-input": path.resolve(
        __dirname,
        "../packages/zero-ui/src/otp-input/zui-otp-input.ts"
      ),
      "@deepverse/zero-ui/phone-input": path.resolve(
        __dirname,
        "../packages/zero-ui/src/phone-input/zui-phone-input.ts"
      ),
      "@deepverse/zero-ui/star-rating": path.resolve(
        __dirname,
        "../packages/zero-ui/src/star-rating/zui-star-rating.ts"
      ),
      "@deepverse/zero-ui/select": path.resolve(
        __dirname,
        "../packages/zero-ui/src/select/zui-select.ts"
      ),
      "@deepverse/zero-ui/dropdown": path.resolve(
        __dirname,
        "../packages/zero-ui/src/dropdown/zui-dropdown.ts"
      ),
      "@deepverse/zero-ui/checkbox": path.resolve(
        __dirname,
        "../packages/zero-ui/src/checkbox/zui-checkbox.ts"
      ),
      "@deepverse/zero-ui/radio-group": path.resolve(
        __dirname,
        "../packages/zero-ui/src/radio-group/index.ts"
      ),
      "@deepverse/zero-ui/toggle": path.resolve(
        __dirname,
        "../packages/zero-ui/src/toggle/zui-toggle.ts"
      ),
      "@deepverse/zero-ui/slider": path.resolve(
        __dirname,
        "../packages/zero-ui/src/slider/zui-slider.ts"
      ),
      "@deepverse/zero-ui": path.resolve(
        __dirname,
        "../packages/zero-ui/dist/index.js"
      ),
    },
  },
});
