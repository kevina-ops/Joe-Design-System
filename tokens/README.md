# Joe Design System – Tokens

This folder is the **single source of truth** for design token.

Generated output is used by: **Next.js** and **Storybook**, and by **`app/globals.css`**.

## Files

| File | Role |
|------|------|
| `joe-tokens.json` | Source tokens. Edited by designers/devs or synced from Figma (e.g. Token Studio). |
| `output/css/variables.css` | Generated CSS custom properties (do not edit). |
| `output/tailwind/theme.cjs` | Generated Tailwind theme (do not edit). |

Generated files are produced by `npm run tokens:build` (see `scripts/build-tokens.mjs`).

## Token structure (required for the pipeline)

The build script expects this shape so it can resolve references and generate CSS + Tailwind:

1. **Top-level groups**: `primitives` and `semantic`.
2. **Token format**: Each token is an object with a value and type. **Both formats are supported:**
   - **Legacy (Token Studio default):** `value` and `type` (e.g. `"value": "#FFFFFF"`, `"type": "color"`).
   - **W3C DTCG:** `$value` and `$type` (e.g. `"$value": "#FFFFFF"`, `"$type": "color"`).
   You can convert to W3C in Token Studio (“Convert to W3C DTCG format”); the pipeline accepts both.
3. **References**: Use `{primitives.colors.white}` or `{primitives.space.m}` so semantic tokens point at primitives. References are resolved at build time.

Example:

```json
{
  "primitives": {
    "colors": {
      "white": { "value": "#FFFFFF", "type": "color" }
    },
    "space": {
      "m": { "value": "1rem", "type": "spacing" }
    }
  },
  "semantic": {
    "color": {
      "background": {
        "default": { "value": "{primitives.colors.white}", "type": "color" }
      }
    }
  }
}
```

## Token Studio (Figma) alignment

If you use the **Token Studio** plugin in Figma:

1. **Export target**: Point the plugin’s export path to `tokens/joe-tokens.json` (or a file you then copy here).
2. **Structure**: Configure the plugin so the exported JSON has:
   - Root keys: `primitives` and `semantic` (or map your groups to these names in a post-step).
   - Each token as `{ "value": "...", "type": "..." }`.
   - References in the form `{primitives.xxx.yyy}`.
3. **If the plugin uses another format** (e.g. W3C design tokens): keep `joe-tokens.json` as the source of truth in the repo and either:
   - Change the plugin’s output format to match the structure above, or
   - Add a small conversion script that transforms the plugin’s export into `joe-tokens.json` before running `tokens:build`.

After any change to `joe-tokens.json`, run `npm run tokens:build` (or rely on CI if you have `tokens-sync.yml`).

## Extending the token set

- **Primitives**: Add under `primitives` (e.g. `primitives.colors`, `primitives.space`, `primitives.radii`, `primitives.fontSizes`). The build script already maps these to CSS variables and Tailwind theme.
- **Semantic**: Add under `semantic.color` (or other semantic groups the script supports). Prefer referencing primitives, e.g. `"value": "{primitives.colors.blue.500}"`.
- **New categories**: If you add new top-level sections (e.g. `semantic.shadow`), you may need to extend `scripts/build-tokens.mjs` to emit CSS and/or Tailwind for them.

The current set covers: **Button** (primary, secondary, outline, ghost, destructive, icon), and the semantic color/space/typography/radius tokens used by the UI components and `app/globals.css`. It can be extended for Input, Card, Badge, Alert, etc. as needed.
