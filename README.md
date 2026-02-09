# Joe Design System

Token-driven React component library for Joe Coffee. Built with Tailwind CSS, shadcn-style components (CVA), Storybook 10, and design tokens from a single source of truth.

## Requirements

- **Node.js 20.19+** (or 22.12+). Required for Storybook 10 and `storybook-design-token` v5. To upgrade: `nvm install 20` then `nvm use 20`, or download from [nodejs.org](https://nodejs.org/).

## Tech stack

- **Tokens**: `tokens/joe-tokens.json` → CSS variables + Tailwind theme via `scripts/build-tokens.mjs`
- **Styling**: Tailwind CSS, semantic variables in `app/globals.css`
- **Components**: React, CVA, `tailwind-merge` + `cn()`; Phosphor Icons
- **Docs**: Storybook 10 (Webpack), addon-a11y, storybook-design-token

## Scripts

| Script | Description |
|--------|-------------|
| `npm run tokens:build` | Build CSS variables and Tailwind theme from `tokens/joe-tokens.json` |
| `npm run tokens:watch` | Watch tokens and rebuild on change |
| `npm run tokens:import-obra` | Import Obra tokens from Token Studio export (colors only) |
| `npm run tokens:import-figma` | Import Figma variables from "Export modes" (all types - recommended) |
| `npm run components:generate` | Generate all shadcn/ui components with Storybook stories |
| `npm run components:generate:single` | Generate a single component (e.g., `npm run components:generate:single input`) |
| `npm run dev` | Next.js dev server |
| `npm run build` | Build tokens, then Next.js |
| `npm run storybook` | Storybook dev server (port 6006) |
| `npm run build-storybook` | Build static Storybook |

## Project structure

```
├── app/                    # Next.js app (globals.css, layout, page)
├── src/
│   ├── components/ui/      # UI components (Button, etc.) + stories
│   └── lib/utils.ts        # cn() helper
├── tokens/
│   ├── joe-tokens.json     # Source of truth (edit here)
│   └── output/             # Generated CSS + Tailwind theme (do not edit)
├── .storybook/             # Storybook 10 config (main.ts ESM, preview.js, design-tokens.ts)
├── scripts/build-tokens.mjs
├── tailwind.config.ts      # Next.js / default build
└── tailwind.config.cjs    # Storybook PostCSS (same theme, CJS for Node)
```

- **Tailwind**: `tailwind.config.ts` is used by Next.js; `tailwind.config.cjs` is used by Storybook’s PostCSS so the same theme applies in both. Keep them in sync when extending the theme.

## Development

1. Install: `npm install`
2. Build tokens: `npm run tokens:build` (or use `tokens:watch` while editing tokens)
3. Run Storybook: `npm run storybook` → http://localhost:6006
4. Run Next.js: `npm run dev` → http://localhost:3000

## Tokens

Design tokens are documented in [tokens/README.md](tokens/README.md). Edit `tokens/joe-tokens.json`, then run `npm run tokens:build`. Generated files go to `tokens/output/` (CSS variables and Tailwind theme).

### Obra shadcn/ui Integration

This project integrates with the [Obra shadcn/ui Figma kit](https://shadcn.obra.studio/) for design-to-code synchronization.

**Documentation:**
- [Obra Integration Guide](tokens/OBRA_INTEGRATION.md) - Complete setup and workflow
- [Storybook to Figma Sync](tokens/STORYBOOK_TO_FIGMA_SYNC.md) - Sync tokens from Storybook back to Figma
- [Figma Export Guide](tokens/FIGMA_EXPORT_GUIDE.md) - Export tokens from Figma

**Quick start (Figma → Code):**
1. Export tokens from Figma Variables panel ("Export modes")
2. Import: `npm run tokens:import-figma-folder`
3. Build: `npm run tokens:build`
4. Generate components: `npm run components:generate`
5. View in Storybook: `npm run storybook`

**⚠️ Important:** Obra Figma is the source of truth. Always sync FROM Obra TO Storybook, never the reverse. See [Obra Workflow](tokens/OBRA_WORKFLOW.md) for details.

**Quick start (Obra → Storybook):**
1. Export from Obra: Variables panel → "Export modes" → Save to `tokens/obra-variables-figma-export/`
2. Import: `npm run tokens:import-figma-folder`
3. Build: `npm run tokens:build`
4. View: `npm run storybook`
