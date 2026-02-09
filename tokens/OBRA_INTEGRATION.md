# Obra shadcn/ui Integration Guide

This guide explains how to integrate Obra shadcn/ui Figma kit tokens with the Joe Design System, keeping everything in sync between Figma (Token Studio) and Storybook.

## Overview

The integration allows you to:
1. **Import Obra tokens** from Token Studio export into your token system
2. **Keep Obra default values** (perfect for when rebranding isn't complete)
3. **Maintain sync** between Figma and Storybook
4. **Generate all shadcn/ui components** with Storybook stories

## Quick Start

### Step 1: Export Tokens from Token Studio

1. In Figma, open the Obra shadcn/ui kit
2. Install Token Studio plugin if not already installed
3. In Token Studio:
   - Connect to your repo (or use local sync)
   - Export tokens as JSON
   - Save the file (e.g., `obra-tokens-export.json`)

### Step 2: Import Obra Tokens

**Option A: Using Figma's "Export modes" (Recommended)**

This method captures ALL variable types (colors, spacing, typography, radii, shadows, etc.):

1. In Figma Variables panel, right-click on a collection (or select multiple)
2. Choose **"Export modes"**
3. Save the JSON file
4. Import:
```bash
npm run tokens:import-figma ./figma-variables-export.json
# Or specify a mode:
npm run tokens:import-figma ./figma-variables-export.json --mode shadcn
```

**Option B: Using Token Studio Export**

If you exported from Token Studio:
```bash
npm run tokens:import-obra ./obra-tokens-export.json
```

**Note:** Token Studio's "Import variables" only imports colors. Use Figma's "Export modes" for complete token import.

Both methods will:
- Backup your existing `joe-tokens.json`
- Map tokens to your `primitives` + `semantic` structure
- Merge values with existing tokens (imported values take precedence)
- Generate the legacy format for Token Studio sync

### Step 3: Build Tokens

```bash
npm run tokens:build
```

This generates:
- `tokens/output/css/variables.css` (for Storybook)
- `tokens/output/tailwind/theme.cjs` (for Tailwind)
- `tokens/joe-tokens-legacy.json` (for Token Studio sync)

### Step 4: Generate All Components

```bash
npm run components:generate
```

This generates all shadcn/ui components:
- `src/components/ui/*.tsx` (React components)
- `src/components/ui/*.stories.jsx` (Storybook stories)

### Step 5: Sync Back to Figma (Optional)

1. In Token Studio, point sync to `tokens/joe-tokens-legacy.json`
2. Set Token format to **Legacy**
3. Pull tokens to sync Figma variables

## Workflow: Design → Code → Design

### Designers Working in Figma

1. **Use Obra components** from the Figma library
2. **Modify tokens** in Token Studio (if needed)
3. **Export tokens** when ready to sync

### Developers Working in Code

1. **Import tokens** from Figma export:
   ```bash
   npm run tokens:import-obra ./figma-export.json
   npm run tokens:build
   ```

2. **Generate new components** (if Obra added new ones):
   ```bash
   npm run components:generate
   ```

3. **View in Storybook**:
   ```bash
   npm run storybook
   ```

4. **Commit changes**:
   ```bash
   git add tokens/joe-tokens.json tokens/output/
   git commit -m "Sync tokens from Figma"
   ```

### Two-Way Sync

The system supports two-way sync:

- **Figma → Code**: Import Obra tokens via `tokens:import-obra`
- **Code → Figma**: Token Studio syncs from `joe-tokens-legacy.json`

## Token Structure

The system maintains this structure:

```
joe-tokens.json (W3C format)
├── primitives/          # Base design tokens
│   ├── colors/
│   ├── space/
│   ├── radii/
│   ├── fonts/
│   └── ...
└── semantic/           # Semantic tokens (reference primitives)
    └── color/
        ├── background/
        ├── text/
        ├── action/
        └── ...
```

Obra tokens are automatically mapped to this structure during import.

## Component Generation

### Generate All Components

```bash
npm run components:generate
```

### Generate Single Component

```bash
npm run components:generate:single input
```

### Available Components

The generator supports these shadcn/ui components:

- `input`, `textarea`, `label`
- `card`, `badge`, `alert`
- `button` (already exists)
- `accordion`, `alert-dialog`, `dialog`
- `dropdown-menu`, `select`, `combobox`
- `tabs`, `table`, `skeleton`
- And 30+ more...

See `scripts/generate-components.mjs` for the full list.

## Dependencies

Some components require Radix UI primitives. Install as needed:

```bash
npm install @radix-ui/react-label
npm install @radix-ui/react-separator
npm install @radix-ui/react-dialog
# ... etc
```

The generator will warn you if a component needs additional dependencies.

## Troubleshooting

### Token Studio Only Imports Colors

**Problem:** Token Studio's "Import variables" only imports color variables, even when all types are selected.

**Solution:** Use Figma's native "Export modes" feature instead:

1. In Figma Variables panel, right-click on a collection
2. Select **"Export modes"**
3. This exports ALL variable types (colors, spacing, typography, radii, shadows, etc.)
4. Use `npm run tokens:import-figma` instead of `tokens:import-obra`

**Why:** Figma's "Export modes" provides a complete JSON export of all variables with their values for each mode, while Token Studio's import has limitations.

### Tokens Not Syncing Properly

1. **Check Token Studio format**: Must be set to **Legacy**
2. **Verify file path**: Token Studio should point to `tokens/joe-tokens-legacy.json`
3. **Check token sets**: Both `primitives` and `semantic` must be active in Token Studio

### Components Not Rendering

1. **Check dependencies**: Some components need `@radix-ui/*` packages
2. **Verify Tailwind config**: Ensure tokens are built (`npm run tokens:build`)
3. **Check Storybook**: Run `npm run storybook` to see component stories

### Import Mapping Issues

If Obra tokens aren't mapping correctly:

1. **Review the import script**: `scripts/import-obra-tokens.mjs`
2. **Check Obra token structure**: The script uses heuristics to map tokens
3. **Manual adjustment**: Edit `joe-tokens.json` directly if needed

## Best Practices

1. **Always backup**: The import script creates `joe-tokens.json.backup`
2. **Review before committing**: Check merged tokens before pushing
3. **Keep Figma and code in sync**: Regular token syncs prevent drift
4. **Use semantic tokens**: Prefer semantic tokens over primitives in components
5. **Document customizations**: Note any manual token adjustments

## Next Steps

- [ ] Import Obra tokens from your Figma export
- [ ] Generate all components
- [ ] Review components in Storybook
- [ ] Set up Token Studio sync in Figma
- [ ] Customize tokens for Joe brand (when ready)

## Resources

- [Obra shadcn/ui Kit](https://shadcn.obra.studio/)
- [Token Studio Docs](https://docs.tokens.studio/)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Joe Design System Tokens](./README.md)
