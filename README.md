# Joe Design System

Token-driven React component library for Joe Coffee. Built with Tailwind CSS, shadcn-style components (CVA), Storybook 10, and design tokens from a single source of truth.

## Requirements

- **Node.js 20.19+** (or 22.12+). Required for Storybook 10 and `storybook-design-token` v5.
- **nvm** (Node Version Manager) recommended for automatic Node version switching

### Setting up Node.js

This project includes an `.nvmrc` file that automatically tells nvm to use Node.js 20.

**First time setup:**
```bash
# Install Node.js 20 if you don't have it
nvm install 20

# Use Node.js 20 (this will happen automatically when you cd into the project)
nvm use
```

**Automatic switching:** If you have nvm's auto-switch enabled (add to your `~/.zshrc` or `~/.bashrc`):
```bash
# Add this to your shell config for automatic switching
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

Or simply run `nvm use` manually when you enter the project directory.

## Tech stack

- **Tokens**: `tokens/joe-tokens.json` → CSS variables + Tailwind theme via `scripts/build-tokens.mjs`
- **Styling**: Tailwind CSS, semantic variables in `.storybook/globals.css`
- **Components**: React, CVA, `tailwind-merge` + `cn()`; Phosphor Icons
- **Docs**: Storybook 10 (Webpack), addon-a11y, storybook-design-token

## Scripts

| Script | Description |
|--------|-------------|
| `npm run tokens:build` | Build CSS variables and Tailwind theme from `tokens/joe-tokens.json` |
| `npm run tokens:watch` | Watch tokens and rebuild on change |
| `npm run tokens:import-obra` | Import Obra tokens from Figma export |
| `npm run tokens:import-figma` | Import Figma variables from "Export modes" (all types - recommended) |
| `npm run components:generate` | Generate all shadcn/ui components with Storybook stories |
| `npm run components:generate:single` | Generate a single component (e.g., `npm run components:generate:single input`) |
| `npm run storybook` | Storybook dev server (port 6006) |
| `npm run build-storybook` | Build static Storybook |

## Project structure

```
├── src/
│   ├── components/ui/      # UI components (Button, etc.) + stories
│   └── lib/utils.ts        # cn() helper
├── tokens/
│   ├── joe-tokens.json     # Source of truth (edit here)
│   └── output/             # Generated CSS + Tailwind theme (do not edit)
├── .storybook/             # Storybook 10 config (main.ts ESM, preview.js, design-tokens.ts, globals.css)
├── scripts/build-tokens.mjs
├── tailwind.config.cjs     # Tailwind config (used by Storybook PostCSS)
├── postcss.config.mjs      # PostCSS config (for Tailwind processing)
└── tsconfig.json           # TypeScript configuration
```

- **Tailwind**: `tailwind.config.cjs` is used by Storybook's PostCSS for processing CSS with Tailwind.

## Development

**First time setup:**
```bash
# Make sure you're using Node.js 20
nvm use  # This will automatically use Node.js 20 from .nvmrc

# Install dependencies
npm install

# Build tokens
npm run tokens:build
```

**Daily workflow:**
1. `nvm use` - Switch to Node.js 20 (or configure auto-switching - see Requirements above)
2. `npm run storybook` - Start Storybook → http://localhost:6006
3. `npm run tokens:watch` - Watch tokens and rebuild on change (optional)

## Tokens

Design tokens are documented in [tokens/README.md](tokens/README.md). Edit `tokens/joe-tokens.json`, then run `npm run tokens:build`. Generated files go to `tokens/output/` (CSS variables and Tailwind theme).

### Obra shadcn/ui Integration

This project integrates with the [Obra shadcn/ui Figma kit](https://shadcn.obra.studio/) for design-to-code synchronization.

**Documentation:**
- [Obra Quick Start](tokens/docs/obra_quick_start.md) - Fast-track setup guide
- [Obra Guide](tokens/docs/obra_guide.md) - Complete integration and workflow guide
- [Figma Export Guide](tokens/docs/figma_export_guide.md) - Export tokens from Figma

**Quick start (Figma → Code):**
1. Export tokens from Figma Variables panel ("Export modes")
2. Import: `npm run tokens:import-figma-folder`
3. Build: `npm run tokens:build`
4. Generate components: `npm run components:generate`
5. View in Storybook: `npm run storybook`

**⚠️ Important:** Obra Figma is the source of truth. Always sync FROM Obra TO Storybook, never the reverse. See [Obra Guide](tokens/docs/obra_guide.md) for details.

**Quick start (Obra → Storybook):**
1. Export from Obra: Variables panel → "Export modes" → Save to `tokens/obra-variables-figma-export/`
2. Import: `npm run tokens:import-figma-folder`
3. Build: `npm run tokens:build`
4. View: `npm run storybook`
