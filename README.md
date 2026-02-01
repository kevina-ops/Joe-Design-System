# Joe Design System

Token-driven React component library for Joe Coffee. Built with Tailwind CSS, shadcn-style components (CVA), Storybook 10, and design tokens from a single source of truth.

## Requirements

- **Node.js 20.19+** (or 22.12+). Required for Storybook 10 and `storybook-design-token` v5. To upgrade: `nvm install 20` then `nvm use 20`, or download from [nodejs.org](https://nodejs.org/).

## Tech stack

- **Tokens**: `tokens/joe-tokens.json` → CSS variables + Tailwind theme via `scripts/build-tokens.mjs`
- **Styling**: Tailwind CSS, semantic variables in `app/globals.css` (ShadCN-style for Button etc.)
- **Components**: React, CVA, `tailwind-merge` + `cn()`; Phosphor Icons
- **Docs**: Storybook 10 (Webpack), addon-a11y, storybook-design-token

## Scripts

| Script | Description |
|--------|-------------|
| `npm run tokens:build` | Build CSS variables and Tailwind theme from `tokens/joe-tokens.json` |
| `npm run tokens:watch` | Watch tokens and rebuild on change |
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
