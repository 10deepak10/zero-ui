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

## 📦 Installation for Consumers

To use **Zero UI** in your own project:

```bash
npm install @deepverse/zero-ui
```

Then import the components you need:

```typescript
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
```

For detailed usage instructions and framework integration guides (React, Angular, etc.), please refer to the [Library Documentation](packages/zero-ui/README.md).

---

## � Development & Contribution

### Project Structure

This monorepo is organized into the following workspaces:

- **`packages/zero-ui`**: The core library containing all Web Components (`dv-button`, `dv-card`, `dv-upload-box`, etc.).
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
