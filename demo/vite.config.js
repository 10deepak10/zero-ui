import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@deepverse/zero-ui/button",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/button/zui-button.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/card",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/card/zui-card.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/file-upload",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/file-upload/zui-file-upload.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/otp-input",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/otp-input/zui-otp-input.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/phone-input",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/phone-input/zui-phone-input.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/star-rating",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/star-rating/zui-star-rating.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/select",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/select/zui-select.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/dropdown",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/dropdown/zui-dropdown.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/checkbox",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/checkbox/zui-checkbox.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/radio-group",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/radio-group/index.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/toggle",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/toggle/zui-toggle.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/slider",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/slider/zui-slider.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/os-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/os-check/zui-os-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/browser-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/browser-check/zui-browser-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/screen-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/screen-check/zui-screen-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/storage-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/storage-check/zui-storage-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/gpu-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/gpu-check/zui-gpu-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/network-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/network-check/zui-network-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/battery-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/battery-check/zui-battery-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui/camera-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/camera-check/zui-camera-check.ts"
        ),
      },
      {
        find: "@deepverse/zero-ui",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/index.ts"
        ),
      },
    ],
  },
});
