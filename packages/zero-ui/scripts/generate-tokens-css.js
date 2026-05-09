import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = resolve(__dirname, '../src/tokens');
const OUTPUT_DIR = resolve(__dirname, '../dist');

function kebab(str) {
  return str.replace(/_/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
}

function loadJSON(file) {
  return JSON.parse(readFileSync(resolve(TOKENS_DIR, file), 'utf-8'));
}

function flatten(obj, prefix = '', out = []) {
  for (const [key, value] of Object.entries(obj)) {
    const k = kebab(key);
    const path = prefix ? `${prefix}.${k}` : k;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, path, out);
    } else {
      out.push({ path, value: String(value) });
    }
  }
  return out;
}

function generateTokensCSS() {
  const pathToVar = new Map();
  const allVarEntries = [];

  // ─── Primitives: colors ───
  {
    const data = loadJSON('primitives/colors.json');
    for (const [color, shades] of Object.entries(data)) {
      if (typeof shades === 'string') {
        const path = `primitives.colors.${kebab(color)}`;
        const v = `--zui-${kebab(color)}`;
        pathToVar.set(path, v);
        allVarEntries.push({ name: v, value: shades });
      } else {
        for (const [shade, value] of Object.entries(shades)) {
          const path = `primitives.colors.${kebab(color)}.${kebab(shade)}`;
          const v = `--zui-${kebab(color)}-${kebab(shade)}`;
          pathToVar.set(path, v);
          allVarEntries.push({ name: v, value: String(value) });
        }
      }
    }
  }

  // ─── Primitives: spacing ───
  {
    const data = loadJSON('primitives/spacing.json');
    for (const [key, value] of Object.entries(data)) {
      const path = `primitives.spacing.${kebab(key)}`;
      const v = `--zui-space-${kebab(key)}`;
      pathToVar.set(path, v);
      allVarEntries.push({ name: v, value: String(value) });
    }
  }

  // ─── Primitives: typography ───
  {
    const data = loadJSON('primitives/typography.json');
    const categories = {
      fontFamily: 'font',
      fontSize: 'text',
      fontWeight: 'font',
      lineHeight: 'leading',
      letterSpacing: 'tracking'
    };
    for (const [category, values] of Object.entries(data)) {
      const prefix = categories[category] || category;
      for (const [key, value] of Object.entries(values)) {
        const path = `primitives.typography.${kebab(category)}.${kebab(key)}`;
        const v = `--zui-${prefix}-${kebab(key)}`;
        pathToVar.set(path, v);
        allVarEntries.push({ name: v, value: String(value) });
      }
    }
  }

  // ─── Primitives: radius ───
  {
    const data = loadJSON('primitives/radius.json');
    for (const [key, value] of Object.entries(data)) {
      const path = `primitives.radius.${kebab(key)}`;
      const v = `--zui-radius-${kebab(key)}`;
      pathToVar.set(path, v);
      allVarEntries.push({ name: v, value: String(value) });
    }
  }

  // ─── Primitives: shadows ───
  {
    const data = loadJSON('primitives/shadows.json');
    for (const [key, value] of Object.entries(data)) {
      const path = `primitives.shadows.${kebab(key)}`;
      const v = `--zui-shadow-${kebab(key)}`;
      pathToVar.set(path, v);
      allVarEntries.push({ name: v, value: String(value) });
    }
  }

  // ─── Primitives: motion ───
  {
    const data = loadJSON('primitives/motion.json');
    for (const [category, values] of Object.entries(data)) {
      for (const [key, value] of Object.entries(values)) {
        const path = `primitives.motion.${kebab(category)}.${kebab(key)}`;
        const v = `--zui-${kebab(category)}-${kebab(key)}`;
        pathToVar.set(path, v);
        allVarEntries.push({ name: v, value: String(value) });
      }
    }
  }

  // ─── Brand ───
  {
    const data = loadJSON('brand/zeroui.json');
    for (const [key, value] of Object.entries(data.brand)) {
      const path = `brand.brand.${kebab(key)}`;
      const v = `--zui-brand-${kebab(key)}`;
      pathToVar.set(path, v);
      allVarEntries.push({ name: v, value: String(value) });
    }
  }

  function pathToCSSName(path) {
    return path.replace(/\./g, '-');
  }

  // ─── Semantic ───
  {
    const data = loadJSON('semantic/colors.json');
    for (const { path, value } of flatten(data)) {
      const p = `semantic.${path}`;
      const v = `--zui-${pathToCSSName(path)}`;
      pathToVar.set(p, v);
      allVarEntries.push({ name: v, value });
    }
  }
  {
    const data = loadJSON('semantic/typography.json');
    for (const { path, value } of flatten(data)) {
      const p = `semantic.${path}`;
      const v = `--zui-${pathToCSSName(path)}`;
      pathToVar.set(p, v);
      allVarEntries.push({ name: v, value });
    }
  }
  {
    const data = loadJSON('semantic/elevation.json');
    for (const { path, value } of flatten(data)) {
      const p = `semantic.elevation.${path}`;
      const v = `--zui-${pathToCSSName(path)}`;
      pathToVar.set(p, v);
      allVarEntries.push({ name: v, value });
    }
  }

  // Resolve references using the path map (normalize to kebab-case for lookup)
  function resolveValue(value, selfVarName) {
    return value.replace(/\{([^}]+)\}/g, (_, refPath) => {
      const normalized = refPath.split('.').map(kebab).join('.');
      const varName = pathToVar.get(normalized);
      if (varName) {
        if (selfVarName && varName === selfVarName) {
          const primitiveEntry = allVarEntries.find(e => e.name === varName);
          if (primitiveEntry) return primitiveEntry.value;
        }
        return `var(${varName})`;
      }
      const categoryPrefixes = ['primitives.', 'semantic.', 'brand.', 'component.'];
      let cssPath = normalized;
      for (const prefix of categoryPrefixes) {
        if (normalized.startsWith(prefix)) {
          cssPath = normalized.slice(prefix.length);
          break;
        }
      }
      console.warn(`Warning: Unresolved reference "${refPath}" (looked up as "${normalized}")`);
      return `var(--zui-${cssPath.replace(/\./g, '-')})`;
    });
  }

  const resolvedAll = allVarEntries.map(e => ({
    name: e.name,
    value: resolveValue(e.value, e.name)
  }));

  // ─── Theme overrides ───
  function getThemeOverrides(theme) {
    const data = loadJSON(`themes/${theme}.json`);
    const overrides = data.overrides || {};
    const entries = [];
    for (const { path, value } of flatten(overrides)) {
      const p = `semantic.${path}`;
      const v = `--zui-${pathToCSSName(path)}`;
      entries.push({ name: v, value: resolveValue(String(value)) });
    }
    return entries;
  }

  const lightOverrides = getThemeOverrides('light');
  const darkOverrides = getThemeOverrides('dark');

  // ─── Component tokens ───
  function getComponentTokens(file) {
    const data = loadJSON(`components/${file}.json`);
    const entries = [];
    for (const { path, value } of flatten(data)) {
      const suffix = path.replace(`${file}.`, '').replace(/\./g, '-');
      const v = `--zui-${file}-${suffix}`;
      entries.push({ name: v, value: resolveValue(String(value)) });
    }
    return entries;
  }

  const componentFiles = ['button', 'card', 'input', 'dropdown', 'checkbox', 'toggle', 'slider', 'select'];

  // ─── Build CSS ───
  const lines = ['/* ZeroUI Design Tokens — Auto-generated */', ''];

  lines.push(':root {');
  for (const e of resolvedAll) {
    lines.push(`  ${e.name}: ${e.value};`);
  }
  lines.push('}');
  lines.push('');

  if (lightOverrides.length > 0) {
    lines.push('[data-theme="light"],');
    lines.push('.light {');
    for (const e of lightOverrides) {
      lines.push(`  ${e.name}: ${e.value};`);
    }
    lines.push('}');
    lines.push('');
  }

  if (darkOverrides.length > 0) {
    lines.push('[data-theme="dark"],');
    lines.push('.dark {');
    for (const e of darkOverrides) {
      lines.push(`  ${e.name}: ${e.value};`);
    }
    lines.push('}');
    lines.push('');
  }

  lines.push('/* Component Tokens */');
  lines.push(':root {');
  for (const file of componentFiles) {
    for (const e of getComponentTokens(file)) {
      lines.push(`  ${e.name}: ${e.value};`);
    }
  }
  lines.push('}');

  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const css = generateTokensCSS();
  const outPath = resolve(OUTPUT_DIR, 'zui-tokens.css');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, css, 'utf-8');
  console.log(`Tokens CSS generated: ${outPath}`);
}
