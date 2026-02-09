# Figma Variables Export Guide

## Why Use Figma's "Export modes" Instead of Token Studio Import?

Token Studio's "Import variables" feature has a limitation: **it only imports color variables**, even when you select all variable types (spacing, typography, radii, shadows, etc.).

Figma's native **"Export modes"** feature provides a complete export of ALL variable types, making it the recommended approach for importing tokens.

## How to Export from Figma

### Step 1: Open Variables Panel

1. In Figma, open the Obra shadcn/ui kit (or your design file)
2. Open the **Variables** panel (right sidebar, or `Shift + Cmd/Ctrl + K`)

### Step 2: Export Modes

**Option A: Export Single Collection**

1. Right-click on a collection (e.g., "semantic colors", "spacing", "typography")
2. Select **"Export modes"** from the context menu
3. Save the JSON file (e.g., `figma-variables-export.json`)

**Option B: Export Multiple Collections**

1. Select multiple collections in the Variables panel
2. Right-click and choose **"Export modes"**
3. This exports all selected collections in one JSON file

**Option C: Export All Collections**

1. Export each collection individually, or
2. Select all collections and export together

### Step 3: Import to Your Project

```bash
npm run tokens:import-figma ./figma-variables-export.json
```

Or specify a specific mode:

```bash
npm run tokens:import-figma ./figma-variables-export.json --mode shadcn
npm run tokens:import-figma ./figma-variables-export.json --mode shadcn-dark
```

## What Gets Exported

Figma's "Export modes" includes:

- ✅ **Colors** (raw colors, semantic colors)
- ✅ **Spacing** (all spacing tokens)
- ✅ **Typography** (font families, sizes, weights, line heights)
- ✅ **Border Radii** (all radius values)
- ✅ **Shadows** (box shadows, drop shadows)
- ✅ **Modes** (light/dark theme values)

## Export Format

The exported JSON has this structure:

```json
{
  "collections": [
    {
      "name": "semantic colors",
      "modes": ["shadcn", "shadcn-dark"],
      "variables": [
        {
          "name": "background",
          "type": "COLOR",
          "valuesByMode": {
            "shadcn": "white",
            "shadcn-dark": "black"
          }
        }
      ]
    },
    {
      "name": "spacing",
      "variables": [
        {
          "name": "sm",
          "type": "FLOAT",
          "valuesByMode": {
            "shadcn": 8
          }
        }
      ]
    }
  ]
}
```

## Mode Selection

When importing, you can specify which mode to use:

- `--mode shadcn` - Use light theme values
- `--mode shadcn-dark` - Use dark theme values
- No mode specified - Uses first available mode

## Comparison: Token Studio vs Figma Export

| Feature | Token Studio Import | Figma Export Modes |
|---------|-------------------|-------------------|
| Colors | ✅ | ✅ |
| Spacing | ❌ | ✅ |
| Typography | ❌ | ✅ |
| Border Radii | ❌ | ✅ |
| Shadows | ❌ | ✅ |
| Modes | ❌ | ✅ |
| Complete Export | ❌ | ✅ |

## Troubleshooting

### "Invalid Figma export format"

Make sure you used **"Export modes"** from the Variables panel, not a different export method. The file should have a `collections` array.

### "No value found for variable"

Some variables might not have values for the selected mode. Try a different mode or check the variable in Figma.

### Variables Not Mapping Correctly

The import script uses heuristics to map Figma variables to your token structure. Review `joe-tokens.json` after import and adjust if needed.

## Best Practices

1. **Export all collections** you need in one go
2. **Use consistent naming** in Figma (helps with mapping)
3. **Review after import** - check `joe-tokens.json` for accuracy
4. **Keep backups** - the script creates `joe-tokens.json.backup`
5. **Test with one collection first** before importing everything

## Next Steps

After importing:

1. Review `tokens/joe-tokens.json`
2. Run `npm run tokens:build`
3. Check Storybook to see tokens in action
4. Adjust mappings if needed
