# Joe Design System – Tokens

This folder is the **single source of truth** for design token.

Generated output is used by: **Storybook** and components via **`.storybook/globals.css`**.

## Files

| File | Role |
|------|------|
| `joe-tokens.json` | Source tokens (W3C format). Edited by designers/devs or synced from Figma. |
| `output/css/variables.css` | Generated CSS custom properties (DO NOT EDIT THIS!!). |
| `output/tailwind/theme.cjs` | Generated Tailwind theme (DO NOT EDIT THIS!!!). |

Generated files are produced by `npm run tokens:build` (see `scripts/build-tokens.mjs`).

## Recommended approach: Figma + Storybook in sync

**Goals:** Storybook keeps working, tokens stay in sync with Figma.

### Workflow: Figma → Storybook

- **Single source of truth:** `joe-tokens.json` (W3C format). Build produces CSS variables and Tailwind theme.
- **Storybook:** Uses `tokens/output/` from `tokens:build`.
- **Figma → Code:** Export tokens from Figma using "Export modes" (see [Figma Export Guide](docs/figma_export_guide.md)), then import using `npm run tokens:import-figma`.
- **After changes:** Run **`npm run tokens:build`** and commit the generated files.

## Token structure (required for the pipeline)

The build script expects this shape so it can resolve references and generate CSS + Tailwind:

1. **Top-level groups**: `primitives` and `semantic`.
2. **Token format**: Each token is an object with a value and type. **W3C DTCG format is preferred:**
   - **W3C DTCG:** `$value` and `$type` (e.g. `"$value": "#FFFFFF"`, `"$type": "color"`).
   - **Legacy format** (`value` and `type`) is also supported for compatibility.
3. **References**: Use `{primitives.colors.white}` or `{primitives.space.m}` so semantic tokens point at primitives. References are resolved at build time.

Example:

```json
{
  "primitives": {
    "colors": {
      "white": { "$value": "#FFFFFF", "$type": "color" }
    },
    "space": {
      "m": { "$value": "1rem", "$type": "spacing" }
    }
  },
  "semantic": {
    "color": {
      "background": {
        "default": { "$value": "{primitives.colors.white}", "$type": "color" }
      }
    }
  }
}
```

## Importing from Figma

To import tokens from Figma, use Figma's native "Export modes" feature (see [Figma Export Guide](docs/figma_export_guide.md)):

1. Export tokens from Figma Variables panel using "Export modes"
2. Import using: `npm run tokens:import-figma <path-to-export.json>`
3. Build tokens: `npm run tokens:build`
4. View in Storybook: `npm run storybook`

### Light / dark mode (when you extend tokens)

When you add themes, export each mode separately from Figma and import them. The import script supports mode selection via the `--mode` flag.

## Extending the token set

- **Primitives**: Add under `primitives` (e.g. `primitives.colors`, `primitives.space`, `primitives.radii`, `primitives.fontSizes`). The build script already maps these to CSS variables and Tailwind theme.
- **Semantic**: Add under `semantic.color` (or other semantic groups the script supports). Prefer referencing primitives, e.g. `"$value": "{primitives.colors.blue.500}"`.
- **New categories**: If you add new top-level sections (e.g. `semantic.shadow`), you may need to extend `scripts/build-tokens.mjs` to emit CSS and/or Tailwind for them.

The current set covers: **Button** (primary, secondary, outline, ghost, destructive, icon), and the semantic color/space/typography/radius tokens used by the UI components and `app/globals.css`. It can be extended for Input, Card, Badge, Alert, etc. as needed.
