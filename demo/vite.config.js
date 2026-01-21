import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@deepverse/zero-ui/button",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/button/zui-button.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/card",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/card/zui-card.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/file-upload",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/file-upload/zui-file-upload.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/otp-input",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/otp-input/zui-otp-input.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/phone-input",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/phone-input/zui-phone-input.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/star-rating",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/star-rating/zui-star-rating.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/select",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/select/zui-select.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/dropdown",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/dropdown/zui-dropdown.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/checkbox",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/checkbox/zui-checkbox.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/radio-group",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/radio-group/index.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/toggle",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/toggle/zui-toggle.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/slider",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/slider/zui-slider.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/os-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/os.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/browser-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/browser.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/screen-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/screen.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/storage-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/storage.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/gpu-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/gpu.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/network-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/network.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/battery-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/battery.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/camera-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/camera.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/theme-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/theme.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/mic-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/mic.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/geolocation-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/geolocation.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/clipboard-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/clipboard.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/notification-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/notification.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/extension-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/extension.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/proctoring",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/proctoring.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/logger",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/logger.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/event-bus",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/event-bus.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/socket-check",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/socket.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/theme-generator",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/theme-generator.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/split",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/split/index.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/tabs",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/tabs/index.ts",
        ),
      },

      {
        find: "@deepverse/zero-ui/text-editor",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/text-editor/index.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui/code-editor",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/services/syntax-highlighter.service.ts",
        ),
      },
      {
        find: "@deepverse/zero-ui",
        replacement: path.resolve(
          __dirname,
          "../packages/zero-ui/src/index.ts",
        ),
      },
    ],
  },
  optimizeDeps: {
    exclude: [
      "@deepverse/zero-ui/button",
      "@deepverse/zero-ui/card",
      "@deepverse/zero-ui/file-upload",
      "@deepverse/zero-ui/otp-input",
      "@deepverse/zero-ui/phone-input",
      "@deepverse/zero-ui/star-rating",
      "@deepverse/zero-ui/select",
      "@deepverse/zero-ui/dropdown",
      "@deepverse/zero-ui/checkbox",
      "@deepverse/zero-ui/radio-group",
      "@deepverse/zero-ui/toggle",
      "@deepverse/zero-ui/slider",
      "@deepverse/zero-ui/os-check",
      "@deepverse/zero-ui/browser-check",
      "@deepverse/zero-ui/screen-check",
      "@deepverse/zero-ui/storage-check",
      "@deepverse/zero-ui/gpu-check",
      "@deepverse/zero-ui/network-check",
      "@deepverse/zero-ui/battery-check",
      "@deepverse/zero-ui/camera-check",
      "@deepverse/zero-ui/theme-check",
      "@deepverse/zero-ui/mic-check",
      "@deepverse/zero-ui/geolocation-check",
      "@deepverse/zero-ui/clipboard-check",
      "@deepverse/zero-ui/notification-check",
      "@deepverse/zero-ui/extension-check",
      "@deepverse/zero-ui/proctoring",
      "@deepverse/zero-ui/logger",
      "@deepverse/zero-ui/event-bus",
      "@deepverse/zero-ui/split",
      "@deepverse/zero-ui/tabs",

      "@deepverse/zero-ui/text-editor",
      "@deepverse/zero-ui/code-editor",
    ],
  },
});
