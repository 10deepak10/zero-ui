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
import '@deepverse/zero-ui/upload-box';

// OR Import everything
import '@deepverse/zero-ui';
```

## Components

### Button (`<dv-button>`)

A simple button component.

```html
<dv-button>Click Me</dv-button>
```

### Card (`<dv-card>`)

A container component with shadow and rounded corners.

```html
<dv-card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</dv-card>
```

### Upload Box (`<dv-upload-box>`)

A drag-and-drop file upload component.

```html
<dv-upload-box 
  label="Upload Document" 
  accept=".pdf,.doc,.docx" 
  maxSize="5"
></dv-upload-box>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `''` | Label text shown when idle. |
| `accept` | `string` | `'*/*'` | File types to accept (e.g., `image/*`, `.pdf`). |
| `maxSize` | `number` | `10` | Maximum file size in MB. |
| `disabled` | `boolean` | `false` | Whether the input is disabled. |
| `required` | `boolean` | `false` | Whether the input is required in a form. |
| `progress` | `number` | `0` | Upload progress percentage (0-100). |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ file: File }` | Fired when a file is selected or dropped. |
| `error` | `{ message: string }` | Fired when validation fails (e.g., wrong type or size). |
| `clear` | `undefined` | Fired when the file is cleared. |

## Framework Integration

### React

The library includes global type declarations, so it works seamlessly with React and TypeScript.

```tsx
import '@deepverse/zero-ui/upload-box';

function App() {
  return (
    <dv-upload-box 
      label="Upload Image" 
      accept="image/*"
      maxSize="2"
    ></dv-upload-box>
  );
}
```

### Angular

To use Web Components in Angular, you must add `CUSTOM_ELEMENTS_SCHEMA`.

1. **Update Module/Component**:
```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@deepverse/zero-ui/upload-box';

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
<dv-upload-box label="Upload"></dv-upload-box>
```
