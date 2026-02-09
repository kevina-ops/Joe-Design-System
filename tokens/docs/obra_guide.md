# Obra shadcn/ui Integration Guide

Complete guide for integrating Obra shadcn/ui Figma kit tokens with the Joe Design System, keeping everything in sync between Figma and Storybook.

## Key Principle

**Obra Figma is the source of truth. Always sync FROM Obra TO Storybook, never the reverse.**

### Why This Matters

- Obra Figma already has all components properly mapped to variables
- Obra's variable structure is production-ready
- Exporting tokens back to Obra would **override** existing variables
- This would **break** all component mappings in Obra
- You'd have to manually remap everything (which you want to avoid!)

## Overview

The integration allows you to:
1. **Import Obra tokens** from Figma export into your token system
2. **Keep Obra default values** (perfect for when rebranding isn't complete)
3. **Maintain sync** between Figma and Storybook
4. **Generate all shadcn/ui components** with Storybook stories

## The Correct Workflow

### One-Way Sync: Obra → Storybook

```
┌─────────────────┐
│  Obra Figma     │  ← Source of Truth
│  (Components + │
│   Variables)    │
└────────┬────────┘
         │
         │ Export tokens
         │ (Export modes)
         ▼
┌─────────────────┐
│  Import Script  │  ← npm run tokens:import-figma-folder
│  (import-figma) │
└────────┬────────┘
         │
         │ Generate
         ▼
┌─────────────────┐
│ joe-tokens.json │  ← W3C format
└────────┬────────┘
         │
         │ Build
         ▼
┌─────────────────┐
│  Storybook      │  ← Display tokens
│  (Design Tokens)│
└─────────────────┘
```

## Step-by-Step Setup

### Step 1: Export Tokens from Obra Figma

1. Open **Obra shadcn/ui** file in Figma
2. Open **Variables** panel (right sidebar)
3. Right-click on collections (or select multiple)
4. Choose **"Export modes"**
5. Save JSON files to `tokens/obra-variables-figma-export/`

**What to export:**
- All collections (colors, spacing, typography, radii, shadows, etc.)
- Both modes if you have light/dark themes

### Step 2: Import to Your Project

```bash
# Import all tokens from the folder
npm run tokens:import-figma-folder

# Or specify a mode
npm run tokens:import-figma-folder --mode shadcn
```

This will:
- Read all JSON files from `tokens/obra-variables-figma-export/`
- Map Obra tokens to your `primitives` + `semantic` structure
- Merge with existing tokens (Obra values take precedence)
- Generate `joe-tokens.json`

### Step 3: Build Tokens

```bash
npm run tokens:build
```

This generates:
- `tokens/output/css/variables.css` (for Storybook)
- `tokens/output/tailwind/theme.cjs` (for Tailwind)

### Step 4: Generate Components

```bash
npm run components:generate
```

This generates all shadcn/ui components:
- `src/components/ui/*.tsx` (React components)
- `src/components/ui/*.stories.jsx` (Storybook stories)

### Step 5: View in Storybook

```bash
npm run storybook
```

Open the **Design Tokens** tab to see all your tokens!

## Workflow: Design → Code

### Designers Working in Figma

1. **Use Obra components** from the Figma library
2. **Modify tokens** in Figma Variables panel (if needed)
3. **Export tokens** when ready to sync using "Export modes"

### Developers Working in Code

1. **Import tokens** from Figma export:
   ```bash
   npm run tokens:import-figma-folder
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

## When You Make Changes

### Scenario 1: Changes in Obra Figma

1. Designer updates tokens in Obra Figma
2. Export tokens from Obra (Export modes)
3. Import to your project: `npm run tokens:import-figma-folder`
4. Build: `npm run tokens:build`
5. View in Storybook: `npm run storybook`

### Scenario 2: Changes in Code (Rare)

If you need to make changes in code (not recommended if Obra is source of truth):

1. Edit `tokens/joe-tokens.json`
2. Build: `npm run tokens:build`
3. View in Storybook
4. **Do NOT sync back to Obra** - keep changes local or discuss with designer

### Scenario 3: Creating Custom Tokens

If you need custom tokens that don't exist in Obra:

1. Add to `tokens/joe-tokens.json`
2. Build: `npm run tokens:build`
3. Use in Storybook/components
4. **Optionally:** Create a separate Figma file for your custom tokens (not Obra)

## Dependencies

Some components require Radix UI primitives. Install as needed:

```bash
npm install @radix-ui/react-label
npm install @radix-ui/react-separator
npm install @radix-ui/react-dialog
# ... etc
```

The generator will warn you if a component needs additional dependencies.

## Best Practices

1. **Always export from Obra first**
   - Before making changes, export current Obra tokens
   - This ensures you're working with the latest

2. **Keep Obra structure intact**
   - Don't modify Obra's variable structure
   - Import and adapt, don't override

3. **Document customizations**
   - If you add custom tokens, document them
   - Consider if they should be added to Obra instead

4. **Regular syncs**
   - Sync from Obra regularly (weekly/monthly)
   - Keeps Storybook in sync with design

5. **Test after import**
   - Always run `npm run storybook` after importing
   - Verify tokens appear correctly in Design Tokens tab

6. **Always backup**: The import script creates `joe-tokens.json.backup`
7. **Review before committing**: Check merged tokens before pushing
8. **Use semantic tokens**: Prefer semantic tokens over primitives in components

## Troubleshooting

### "Tokens don't match Obra"

**Solution:**
- Re-export from Obra (make sure you export all collections)
- Delete `tokens/joe-tokens.json.backup` if you want a clean start
- Re-import: `npm run tokens:import-figma-folder`
- Re-build: `npm run tokens:build`

### "Some tokens are missing"

**Solution:**
- Check that you exported all collections from Obra
- Verify the import script processed all files
- Check `tokens/joe-tokens.json` to see what was imported

### Import Issues

If tokens aren't importing correctly:

1. **Verify export format**: Make sure you used Figma's "Export modes" feature
2. **Check file structure**: The import script expects Figma's export format with `collections` array
3. **Review mappings**: Check `joe-tokens.json` after import to verify token mappings

### Components Not Rendering

1. **Check dependencies**: Some components need `@radix-ui/*` packages
2. **Verify Tailwind config**: Ensure tokens are built (`npm run tokens:build`)
3. **Check Storybook**: Run `npm run storybook` to see component stories

### Import Mapping Issues

If Obra tokens aren't mapping correctly:

1. **Review the import script**: `scripts/import-obra-tokens.mjs`
2. **Check Obra token structure**: The script uses heuristics to map tokens
3. **Manual adjustment**: Edit `joe-tokens.json` directly if needed

### "I accidentally synced back to Obra"

**Solution:**
- Don't panic! Obra file might have version history
- Check Figma's version history (File → Version History)
- Restore to a previous version
- Going forward: Only sync FROM Obra, never TO Obra

## Summary

✅ **DO:**
- Export tokens FROM Obra Figma
- Import to Storybook using `tokens:import-figma-folder`
- Keep Obra as the source of truth
- Use Obra's existing component mappings

❌ **DON'T:**
- Export tokens TO Obra Figma
- Override Obra's variables
- Break Obra's component mappings

## Quick Reference

**Sync Obra → Storybook:**
```bash
# 1. Export from Obra Figma (Export modes)
# 2. Save to tokens/obra-variables-figma-export/
# 3. Import
npm run tokens:import-figma-folder
# 4. Build
npm run tokens:build
# 5. View
npm run storybook
```

**Never do this:**
```bash
# ❌ DON'T sync Storybook → Obra
# Don't export tokens back to Obra - it would break existing component mappings!
```

## Resources

- [Quick Start Guide](./obra_quick_start.md) - Fast-track setup
- [Figma Export Guide](./figma_export_guide.md) - Detailed export instructions
- [Obra shadcn/ui Kit](https://shadcn.obra.studio/)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Token Documentation](../README.md)
