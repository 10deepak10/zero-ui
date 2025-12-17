# @deepverse/zero-ui

A lightweight, tree-shakeable Web Component library built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @deepverse/zero-ui
```

## Usage

You can import the entire library or individual components. The library is configured for tree-shaking, so unused components will be removed from your bundle.

```typescript
// Import specific components (Recommended)
import '@deepverse/zero-ui/button';
import '@deepverse/zero-ui/card';
import '@deepverse/zero-ui/code-editor';

// Import services (Granular & Tree-shakeable)
import { LoggerService } from '@deepverse/zero-ui/services/logger';
import { BatteryCheckService } from '@deepverse/zero-ui/services/battery';

// OR Import everything (Not recommended for production)
import '@deepverse/zero-ui';

```

## Components

### Button (`<zui-button>`)

A simple button component.

```html
<zui-button>Click Me</zui-button>
```

### Card (`<zui-card>`)

A container component with shadow and rounded corners.

```html
<zui-card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</zui-card>
```

### File Upload (`<zui-file-upload>`)

A drag-and-drop file upload component.

```html
<zui-file-upload 
  label="Upload Document" 
  accept=".pdf,.doc,.docx" 
  max-size="5"
></zui-file-upload>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `''` | Label text shown when idle. |
| `accept` | `string` | `'*/*'` | File types to accept (e.g., `image/*`, `.pdf`). |
| `max-size` | `number` | `10` | Maximum file size in MB. |
| `disabled` | `boolean` | `false` | Whether the input is disabled. |
| `required` | `boolean` | `false` | Whether the input is required in a form. |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ file: File }` | Fired when a file is selected or dropped. |
| `error` | `{ message: string }` | Fired when validation fails (e.g., wrong type or size). |

## Framework Integration

### React

The library includes global type declarations, so it works seamlessly with React and TypeScript.

```tsx
import '@deepverse/zero-ui/file-upload';

function App() {
  return (
    <zui-file-upload 
      label="Upload Image" 
      accept="image/*"
      max-size="2"
    ></zui-file-upload>
  );
}
```

### Angular

To use Web Components in Angular, you must add `CUSTOM_ELEMENTS_SCHEMA`.

1. **Update Module/Component**:
```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@deepverse/zero-ui/file-upload';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Required for custom tags
})
export class AppComponent {}
```

2. **Use in Template**:
```html
<zui-file-upload label="Upload"></zui-file-upload>
```
