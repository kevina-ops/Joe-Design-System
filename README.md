# Joe Design System

Token-driven multi-platform design system for Joe Coffee.

This repository is now a pnpm + Turborepo monorepo with platform-specific packages for Consumer, Merchant Manager, and POS.

## Current Architecture

- **Monorepo packages**
  - `@joe-coffee/consumer-ui` → `packages/consumer-ui`
  - `@joe-coffee/merchant-ui` → `packages/merchant-ui`
  - `@joe-coffee/pos-ui` → `packages/pos-ui`
  - `@joe-coffee/shared-utils` → `packages/shared-utils`
- **Token pipeline**
  - source: `tokens/joe-tokens.json` + `tokens/semantic/*.json`
  - build script: `scripts/build-tokens.mjs`
  - outputs: `tokens/output/css/variables.css`, `tokens/output/tailwind/theme.cjs`
- **Storybook ownership**
  - root `.storybook` has been removed
  - each package owns its own `.storybook`
- **CI visual testing**
  - Chromatic runs as a matrix job in `.github/workflows/chromatic.yml`
  - one Chromatic token per package/platform

## Requirements

- Node.js `>=20`
- pnpm `9.x` (defined via `packageManager`)
- nvm recommended (`.nvmrc` included)

## Install & Setup

```bash
nvm use
pnpm install
pnpm run tokens:build
```

## Key Scripts (root)

| Script                           | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| `pnpm run tokens:build`          | Build shared token outputs                      |
| `pnpm run tokens:build:consumer` | Build consumer tokens                           |
| `pnpm run tokens:build:merchant` | Build merchant tokens                           |
| `pnpm run tokens:build:pos`      | Build pos tokens                                |
| `pnpm run storybook`             | Run all package Storybooks via Turbo            |
| `pnpm run build-storybook`       | Build all package Storybooks via Turbo          |
| `pnpm run chromatic:consumer`    | Build + publish consumer Storybook to Chromatic |
| `pnpm run chromatic:merchant`    | Build + publish merchant Storybook to Chromatic |
| `pnpm run chromatic:pos`         | Build + publish pos Storybook to Chromatic      |

## Run Storybooks Separately

```bash
pnpm --filter @joe-coffee/consumer-ui run storybook   # http://localhost:6006
pnpm --filter @joe-coffee/merchant-ui run storybook   # http://localhost:6007
pnpm --filter @joe-coffee/pos-ui run storybook        # http://localhost:6008
```

## Project Structure

```text
packages/
  consumer-ui/
  merchant-ui/
  pos-ui/
  shared-utils/
tokens/
  joe-tokens.json
  semantic/
  output/
scripts/
  build-tokens.mjs
.github/workflows/
  chromatic.yml
  tokens-sync.yml
```

## Chromatic Setup

Configure these GitHub Actions secrets:

- `CHROMATIC_PROJECT_TOKEN_CONSUMER`
- `CHROMATIC_PROJECT_TOKEN_MERCHANT`
- `CHROMATIC_PROJECT_TOKEN_POS`

For local convenience, see `.env.example`.

## Tokens & Figma Sync

- Docs: `tokens/README.md`
- Figma import: `pnpm run tokens:import-figma-folder`
- Then rebuild tokens: `pnpm run tokens:build`

Obra/Figma is the source of truth; sync design → code.
