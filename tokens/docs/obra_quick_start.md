# Quick Start: Obra Integration

This is a fast-track guide to get Obra shadcn/ui tokens and components synced with your Storybook.

## 🚀 Fast Track Setup

### Step 1: Export Tokens from Figma

**Recommended: Use Figma's "Export modes" (captures ALL variable types)**

1. Open Obra shadcn/ui kit in Figma
2. Open **Variables** panel (right sidebar)
3. Right-click on a collection (or select multiple collections)
4. Choose **"Export modes"**
5. Save the JSON file (e.g., `figma-variables-export.json`)


### Step 2: Import Tokens

**If you used Figma's "Export modes" (recommended):**
```bash
npm run tokens:import-figma ./figma-variables-export.json
# Or specify a mode (e.g., 'shadcn' or 'shadcn-dark'):
npm run tokens:import-figma ./figma-variables-export.json --mode shadcn
npm run tokens:build
```


This will:
- ✅ Backup your existing tokens
- ✅ Map Obra tokens to your structure
- ✅ Generate CSS variables and Tailwind theme

### Step 3: Generate Components

Generate all components at once:

```bash
npm run components:generate
```

Or generate specific components:

```bash
npm run components:generate:single input
npm run components:generate:single card
npm run components:generate:single badge
# ... etc
```

### Step 4: Install Dependencies (if needed)

Some components require Radix UI primitives:

```bash
npm install @radix-ui/react-label @radix-ui/react-separator
```

The generator will warn you if a component needs additional dependencies.

### Step 5: View in Storybook

```bash
npm run storybook
```

Open http://localhost:6006 to see all components!

## 📋 What Gets Generated

### Components Generated
- ✅ `src/components/ui/*.tsx` - React components
- ✅ `src/components/ui/*.stories.jsx` - Storybook stories

### Tokens Generated
- ✅ `tokens/output/css/variables.css` - CSS custom properties
- ✅ `tokens/output/tailwind/theme.cjs` - Tailwind theme

## 🔄 One-Way Sync Workflow: Figma → Code

### Figma → Code
1. Export tokens from Figma Variables panel ("Export modes")
2. Run `npm run tokens:import-figma <file>` or `npm run tokens:import-figma-folder`
3. Run `npm run tokens:build`
4. Commit changes

## 📝 Available Components

The generator supports 40+ shadcn/ui components:

**Form Components:**
- input, textarea, label, select, checkbox, radio-group, switch

**Layout Components:**
- card, separator, skeleton, aspect-ratio, resizable

**Feedback Components:**
- alert, badge, toast, sonner, progress

**Navigation Components:**
- button (already exists), dropdown-menu, navigation-menu, breadcrumb, tabs

**Overlay Components:**
- dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip

**Data Display:**
- table, calendar, carousel, accordion, collapsible

**And more...**

See `scripts/generate-components.mjs` for the complete list.

## 🎯 Current Status

✅ Token import script created
✅ Component generator created  
✅ Core components generated (Input, Card, Badge, Alert, Label, Textarea, Separator, Skeleton)
✅ Storybook stories generated
✅ Documentation created

## 📚 Documentation

- [Full Obra Guide](./obra_guide.md) - Comprehensive integration and workflow guide
- [Token Documentation](../README.md)
- [Figma Export Guide](./figma_export_guide.md)

## ⚠️ Notes

1. **Token Mapping**: The import script uses heuristics to map Obra tokens. Review `joe-tokens.json` after import and adjust if needed.

2. **Radix UI**: Some components need `@radix-ui/*` packages. Install as needed when you use those components.

3. **Customization**: When Joe rebranding is complete, update tokens in `joe-tokens.json` and rebuild.

4. **Backup**: The import script creates `joe-tokens.json.backup` - use it to restore if needed.

## 🎉 You're Ready!

Your design system now has:
- ✅ Obra tokens integrated
- ✅ All shadcn/ui components available
- ✅ Storybook documentation
- ✅ One-way sync from Figma to code

Start designing in Figma and sync to code, or generate components and view them in Storybook!
