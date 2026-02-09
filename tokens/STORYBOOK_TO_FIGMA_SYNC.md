# Syncing Tokens Between Storybook and Figma (Obra)

**⚠️ IMPORTANT: Obra Figma is the source of truth. Do NOT export tokens back to Obra - it will break existing components!**

This guide explains the correct workflow for keeping Storybook and Obra Figma in sync.

## Overview: One-Way Sync (Obra → Storybook)

**Correct workflow:**
```
Obra Figma (Source of Truth)
    ↓ Export tokens
    ↓
Import scripts (import-figma-folder.mjs)
    ↓
joe-tokens.json (W3C format)
    ↓
npm run tokens:build
    ↓
Storybook (Design Tokens tab)
```

**❌ DO NOT DO THIS:**
```
Storybook → Token Studio → Obra Figma
```
This would override Obra's carefully crafted variables and break all component mappings!

## The Right Approach: Obra → Storybook Only

### Why Obra is the Source of Truth

- ✅ Obra already has all components mapped to variables
- ✅ Obra has the correct variable structure and references
- ✅ Obra components are production-ready
- ✅ Overriding would break existing component mappings

### Your Workflow Should Be:

1. **Make changes in Obra Figma** (if needed)
2. **Export from Obra** → Use "Export modes" from Variables panel
3. **Import to Storybook** → `npm run tokens:import-figma-folder`
4. **Build tokens** → `npm run tokens:build`
5. **View in Storybook** → `npm run storybook`

## When You Might Sync Back (Advanced - Not Recommended)

**Only sync Storybook → Figma if:**
- You're creating a NEW Figma file (not Obra)
- You want to create a custom version separate from Obra
- You understand it will override existing variables

**For Obra specifically:** Don't sync back. Keep Obra as-is and import from it.

## ⚠️ IMPORTANT: Don't Sync Back to Obra!

**If you're working with the Obra Figma file:**
- ❌ **DO NOT** export tokens back to Obra
- ❌ **DO NOT** use Token Studio to sync to Obra
- ✅ **DO** keep Obra as-is and import FROM it
- ✅ **DO** see [OBRA_WORKFLOW.md](./OBRA_WORKFLOW.md) for the correct workflow

**Token Studio sync is only for:**
- Creating a NEW Figma file (not Obra)
- Custom design system files
- When you want to override existing variables

## Method 1: Token Studio (For Custom Files Only)

**Why Token Studio?**
- ✅ Works well for **code → Figma** sync (better than import)
- ✅ Supports all token types (colors, spacing, typography, radii, etc.)
- ✅ Maintains references between primitives and semantic tokens
- ✅ Already set up in your project (`joe-tokens-legacy.json`)

**⚠️ Use only for NEW files, NOT for Obra!**

### Step-by-Step: Sync Code to Figma

#### 1. Ensure Tokens Are Built

Make sure your tokens are up to date:

```bash
npm run tokens:build
```

This generates `tokens/joe-tokens-legacy.json` which Token Studio will read.

#### 2. Commit Tokens to Git

Token Studio needs to access the file from your repository:

```bash
git add tokens/joe-tokens-legacy.json
git commit -m "Update tokens for Figma sync"
git push
```

#### 3. Open Token Studio in Figma

1. Open your **Obra shadcn/ui** file in Figma
2. Go to **Plugins** → **Token Studio** (or install it if needed)
3. Click **"Sync"** or **"Connect to repository"**

#### 4. Configure Token Studio

1. **Connect to your repo:**
   - Select your repository (GitHub/GitLab/etc.)
   - Path: `tokens/joe-tokens-legacy.json`
   - Token format: **Legacy**

2. **Pull tokens:**
   - Click **"Pull"** to fetch tokens from your repo
   - You should see two token sets: `primitives` and `semantic`

3. **Activate both sets:**
   - In the **Sets** panel, check both:
     - ✅ `primitives`
     - ✅ `semantic`
   - Both must be active for proper export

#### 5. Export to Figma Variables

1. Click **"Export to Figma"**
2. **Export Options:**
   - ✅ **Variables** → Check: Color, String, Number, Boolean
   - ❌ **Styles** → Leave unchecked (unless you want styles too)
3. **Token Sets:**
   - Select **both** `primitives` and `semantic`
4. Click **"Export"**

#### 6. Verify in Figma

1. Open **Variables** panel in Figma (right sidebar)
2. You should see two collections:
   - `primitives` - Base design tokens
   - `semantic` - Semantic tokens (should reference primitives)
3. Check that semantic variables show references (not hex values)

### Troubleshooting Token Studio Sync

**Problem: Semantic variables show hex instead of references**

**Solution:**
1. Ensure both `primitives` and `semantic` sets are checked in Token Studio
2. Delete existing variable collections in Figma
3. Re-export with both sets selected
4. If still failing, try exporting primitives first, then semantic

**Problem: Only colors are syncing**

**Solution:**
- Make sure you checked **all** variable types in Export Options:
  - ✅ Color
  - ✅ String (for typography)
  - ✅ Number (for spacing, radii)
  - ✅ Boolean

**Problem: Token Studio can't find the file**

**Solution:**
- Verify the path: `tokens/joe-tokens-legacy.json`
- Ensure the file is committed and pushed to your repo
- Check that Token Studio has access to your repository

## Method 2: Direct Figma Variables API (Advanced)

If you want more control or automation, you can create a custom script that uses Figma's Variables API directly. This requires:

1. Figma Plugin API access
2. Custom plugin development
3. More setup but more flexibility

**When to use:** If you need automated sync, custom mappings, or Token Studio doesn't meet your needs.

## Method 3: Manual Export/Import (One-time)

For one-time syncs or when you don't want to set up Token Studio:

1. **Export from Storybook:**
   - Your tokens are already in `tokens/joe-tokens.json`
   - Use this as reference

2. **Manually create variables in Figma:**
   - Open Variables panel
   - Create collections matching your token structure
   - Add variables manually

**When to use:** One-time setup, or if you prefer manual control.

## Recommended Workflow

### For Regular Sync (Code → Figma)

1. **Make changes in code:**
   ```bash
   # Edit tokens/joe-tokens.json
   # Or import from Figma: npm run tokens:import-figma-folder
   ```

2. **Build tokens:**
   ```bash
   npm run tokens:build
   ```

3. **Commit and push:**
   ```bash
   git add tokens/joe-tokens.json tokens/joe-tokens-legacy.json
   git commit -m "Update design tokens"
   git push
   ```

4. **Sync in Figma:**
   - Open Token Studio
   - Click **"Pull"** to get latest tokens
   - Click **"Export to Figma"** with both sets selected

### For Regular Sync (Figma → Code)

1. **Export from Figma:**
   - Use **"Export modes"** from Variables panel
   - Save JSON files

2. **Import to code:**
   ```bash
   npm run tokens:import-figma-folder
   npm run tokens:build
   ```

3. **Verify in Storybook:**
   ```bash
   npm run storybook
   # Check Design Tokens tab
   ```

## Best Practices

1. **Always build tokens before syncing:**
   ```bash
   npm run tokens:build
   ```

2. **Commit legacy file:**
   - Always commit `joe-tokens-legacy.json` so Token Studio can access it

3. **Test sync regularly:**
   - Make a small change in code
   - Sync to Figma
   - Verify it appears correctly

4. **Keep both directions in sync:**
   - If you change tokens in Figma, import them
   - If you change tokens in code, export them

5. **Use semantic tokens:**
   - Prefer semantic tokens over primitives in components
   - This makes rebranding easier later

## Token Structure in Figma

After syncing, your Figma Variables should have:

```
primitives (collection)
├── colors/
│   ├── neutral/50, 100, 200... 950
│   ├── blue/50, 100, 200... 950
│   └── ...
├── space/
│   ├── xs, sm, md, lg, xl...
│   └── ...
├── radii/
│   ├── xs, sm, md, lg, full
│   └── ...
└── fonts/
    ├── sansSerif
    └── system

semantic (collection)
├── color/
│   ├── background/
│   │   ├── default → references primitives.colors.white
│   │   └── muted → references primitives.colors.grey.50
│   ├── text/
│   │   ├── primary → references primitives.colors.black
│   │   └── ...
│   └── action/
│       ├── primary → references primitives.colors.blue.500
│       └── ...
```

## Quick Reference

**Sync Code → Figma:**
```bash
npm run tokens:build  # Generate legacy format
git add tokens/joe-tokens-legacy.json && git commit -m "Update tokens" && git push
# Then in Figma: Token Studio → Pull → Export to Figma
```

**Sync Figma → Code:**
```bash
# Export from Figma Variables panel → "Export modes"
npm run tokens:import-figma-folder
npm run tokens:build
npm run storybook  # Verify in Storybook
```

## Next Steps

1. ✅ Set up Token Studio sync (Method 1)
2. ✅ Test sync in both directions
3. ✅ Document your team's workflow
4. ✅ Set up automated sync (optional, via CI/CD)

## Resources

- [Token Studio Documentation](https://docs.tokens.studio/)
- [Figma Variables API](https://www.figma.com/plugin-docs/api/variables/)
- [Your Token Documentation](./README.md)
- [Obra Integration Guide](./OBRA_INTEGRATION.md)
