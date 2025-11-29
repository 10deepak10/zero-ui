<div align="center">
  <br />
  <h1>⚡️ Zero UI</h1>
  <h3>The next-generation, framework-agnostic UI library.</h3>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/@deepverse/zero-ui"><img src="https://img.shields.io/npm/v/@deepverse/zero-ui?style=flat-square" alt="npm version" /></a>
    <a href="https://github.com/deepverse/zero-ui"><img src="https://img.shields.io/npm/l/@deepverse/zero-ui?style=flat-square" alt="License" /></a>
    <a href="https://www.npmjs.com/package/@deepverse/zero-ui"><img src="https://img.shields.io/npm/dm/@deepverse/zero-ui?style=flat-square" alt="Downloads" /></a>
  </p>
  <br />
</div>

**Zero UI** is a collection of high-performance Web Components built with [Lit](https://lit.dev/). Designed to be lightweight, tree-shakeable, and universally compatible, it brings a premium look and feel to any application—whether you're using React, Angular, Vue, or just vanilla HTML.

---

## 🌟 Why Zero UI?

- 🚀 **Blazing Fast**: Built on native web standards for zero overhead.
- 🌲 **Tree-Shakeable**: Modular architecture means you only bundle what you use.
- 🔌 **Universal Compatibility**: Works seamlessly with React, Angular, Vue, and more.
- 🎨 **Fully Customizable**: Themed easily with CSS variables.
- 🔒 **Type Safe**: Written in TypeScript with full type definitions.

---

## 🏗 Component Categories

Zero UI is built around 6 core categories to cover every aspect of modern web development:

### 1️⃣ Form Elements
Foundational UI controls for data entry.
- `zui-file-upload` (Available)
- `zui-button` (Available)
- `zui-card` (Available)
- `zui-otp-input` (Planned)
- `zui-phone-input` (Planned)
- `zui-star-rating` (Planned)
- `zui-select` (Planned)
- `zui-checkbox` (Planned)
- `zui-radio-group` (Planned)
- `zui-toggle` (Planned)
- `zui-slider` (Planned)
- `zui-pin-input` (Planned)

### 2️⃣ Browser & Device Capability Checkers
Detect hardware and browser features instantly.
- `zui-os-check` (Planned)
- `zui-browser-check` (Planned)
- `zui-screen-check` (Planned)
- `zui-storage-check` (Planned)
- `zui-gpu-check` (Planned)
- `zui-network-check` (Planned)
- `zui-battery-check` (Planned)
- `zui-online-status` (Planned)

### 3️⃣ Permissions & Media Components
Handle device permissions and media access.
- `zui-camera-check` (Planned)
- `zui-mic-check` (Planned)
- `zui-geolocation-check` (Planned)
- `zui-notification-check` (Planned)
- `zui-clipboard-check` (Planned)

### 4️⃣ Extensions & Integrations
Check for external tools and wallets.
- `zui-extension-check` (Planned)
- `zui-wallet-check` (Planned)

### 5️⃣ Proctoring Tools
Essential for ed-tech and monitoring systems.
- `zui-tab-switch-check` (Planned)
- `zui-devtools-check` (Planned)
- `zui-incognito-check` (Planned)
- `zui-fullscreen-check` (Planned)
- `zui-copy-paste-test` (Planned)
- `zui-face-detection-check` (Planned)
- `zui-multi-monitor-check` (Planned)

### 6️⃣ Utility Components
Helpers to simplify app logic.
- `zui-logger` (Planned)
- `zui-event-bus` (Planned)
- `zui-theme-provider` (Planned)

---

## 📦 Installation for Consumers

To use **Zero UI** in your own project:

```bash
npm install @deepverse/zero-ui
```

Then import the components you need:

```typescript
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/file-upload';
```

For detailed usage instructions and framework integration guides (React, Angular, etc.), please refer to the [Library Documentation](packages/zero-ui/README.md).

---

## 🚀 Development & Contribution

### Project Structure

This monorepo is organized into the following workspaces:

- **`packages/zero-ui`**: The core library containing all Web Components (`zui-button`, `zui-card`, `zui-file-upload`, etc.).
- **`demo`**: A Vite-based playground for developing, testing, and showcasing the components.

### Getting Started

#### Prerequisites

- Node.js (v18 or higher recommended)
- npm

#### Installation

To get started with development, install the dependencies for the entire workspace:

```bash
npm install
```

#### Running the Demo

Want to see the components in action? Start the local demo server:

```bash
cd demo
npm run dev
```

This will launch the playground at `http://localhost:5173`.

#### Building the Library

To build the `@deepverse/zero-ui` package for production:

```bash
cd packages/zero-ui
npm run build
```

The optimized build artifacts will be output to `packages/zero-ui/dist`.

---

<div align="center">
  Made with ❤️ by Deepak (aka Deepverse).
</div>
