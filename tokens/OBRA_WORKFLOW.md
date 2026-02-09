# Correct Workflow: Obra Figma → Storybook

**Key Principle: Obra Figma is the source of truth. Always sync FROM Obra TO Storybook, never the reverse.**

## Why This Matters

- Obra Figma already has all components properly mapped to variables
- Obra's variable structure is production-ready
- Exporting tokens back to Obra would **override** existing variables
- This would **break** all component mappings in Obra
- You'd have to manually remap everything (which you want to avoid!)

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

## Step-by-Step: Sync Obra → Storybook

### 1. Export from Obra Figma

1. Open **Obra shadcn/ui** file in Figma
2. Open **Variables** panel (right sidebar)
3. Right-click on collections (or select multiple)
4. Choose **"Export modes"**
5. Save JSON files to `tokens/obra-variables-figma-export/`

**What to export:**
- All collections (colors, spacing, typography, radii, shadows, etc.)
- Both modes if you have light/dark themes

### 2. Import to Your Project

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

### 3. Build Tokens

```bash
npm run tokens:build
```

This generates:
- `tokens/output/css/variables.css` (for Storybook)
- `tokens/output/tailwind/theme.cjs` (for Tailwind)
- `tokens/joe-tokens-legacy.json` (for Token Studio, if needed)

### 4. View in Storybook

```bash
npm run storybook
```

Open the **Design Tokens** tab to see all your tokens!

## Do You Need Token Studio?

**No.** For the Obra → Storybook workflow you **don't need Token Studio**.

| What you use | Purpose |
|--------------|--------|
| **Figma Variables panel** | Export tokens from Obra ("Export modes") |
| **Import script** | `npm run tokens:import-figma-folder` |
| **Build** | `npm run tokens:build` |
| **Storybook** | View tokens |

Token Studio is **optional** and only useful if you later:
- Create a **new** Figma file (not Obra) and want to push tokens from code into it
- Need Token Studio’s repo sync for a different workflow (e.g. code as source of truth)

For **Obra as source of truth → Storybook**, use only Figma’s built-in export and the project scripts. You can ignore Token Studio and `joe-tokens-legacy.json` (that file is only for Token Studio if you ever use it).

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
- Use Token Studio to sync back to Obra

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
npm run tokens:build
git push
# Then Token Studio → Export to Obra
# This would break Obra!
```
