```instructions
## Joe Coffee Design System — Multi-Platform Architecture Rules

### MCP Usage

When answering questions or editing code in this workspace, automatically use the
following tools when they are helpful:

- **Context7** for framework/library documentation (Tailwind, React, Radix UI,
  Storybook, Turborepo, etc.) instead of guessing.
- **Chrome DevTools MCP** for tasks that require running or inspecting the site in
  the browser (navigation, screenshots, checking layouts).

Prefer MCP tools over unsupported web browsing.

---

## 1. Goal & Tooling

### 1.1 Mission

Evolve the Joe Design System from a single consumer-app library into a
multi-platform design system that serves:

1. **Consumer App** — React Native (separate repo; touch-first, brand-forward).
   Consumes published npm packages from this design system.
2. **Merchant Manager** — React web, desktop-only (**current priority**;
   data-dense, utilitarian).
3. **POS** — Web/Electron (future; speed-first, high-contrast, large tap targets).

All platforms share the same design token foundation (`tokens/joe-tokens.json`) but
have **separate component packages** under `packages/`.

The Figma design library is the **Obra shadcn/ui kit** (customized for Joe).
Components in code are built on **shadcn/ui + CVA** to stay 1:1 with the Obra
Figma components.

### 1.2 Monorepo Tooling

| Tool                  | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| **pnpm**              | Package manager & workspace linking            |
| **Turborepo**         | Task orchestration, caching, dependency graph   |
| **@changesets/cli**   | Versioning & changelog generation              |
| **Chromatic**         | Visual regression testing (per-package)         |

Root config files:

- `pnpm-workspace.yaml` — declares `packages/*` and `tokens/` as workspaces
- `turbo.json` — defines the task pipeline (see §5.4)
- `.npmrc` — `shamefully-hoist=true` (required for some Radix UI / Storybook deps)
- `.changeset/config.json` — changeset configuration

All commands use `pnpm` (not `npm`). Example: `pnpm run tokens:build`,
`pnpm turbo build`, `pnpm --filter merchant-ui storybook`.

---

## 2. Token Pipeline — Workflow

1. **Designer** updates Figma Variables inside the Obra-customized Figma file.
2. **Designer** exports variables from Figma using Figma's built-in export (JSON).
3. **Designer** feeds the exported JSON into the repo / provides it to Copilot.
4. **Copilot** translates the Figma Variables JSON into the project's token format
   and writes/updates `tokens/joe-tokens.json`.
5. `pnpm run tokens:build` (or `tokens:build:<platform>`) generates:
   - `tokens/output/css/variables.css` — CSS custom properties
   - `tokens/output/tailwind/theme.cjs` — Tailwind theme extension object
   - (Future) `tokens/output/rn/tokens.js` — React Native theme object

**`tokens/joe-tokens.json` is the single source of truth for primitives.**
**`tokens/semantic/shared.json` is the single source of truth for base semantics.**

Never hard-code color hex values, spacing pixel values, or typography values
anywhere in component code. Always reference tokens through CSS variables or
Tailwind theme keys.

---

## 3. Architecture — Monorepo Structure

Organize or migrate the project toward this structure. Respect anything that
already exists; adapt paths only when necessary and document deviations.

```
joe-design-system/
├── pnpm-workspace.yaml              # Declares workspace packages
├── turbo.json                        # Turborepo task pipeline
├── .npmrc                            # pnpm configuration
├── package.json                      # Root workspace config (no components here)
├── .changeset/
│   └── config.json                   # Changesets versioning config
├── tokens/
│   ├── joe-tokens.json               # Primitives only — from Figma export
│   ├── semantic/
│   │   ├── shared.json               # Base semantic tokens (all platforms)
│   │   ├── consumer.json             # Consumer app semantic overrides
│   │   ├── merchant.json             # Merchant Manager semantic overrides
│   │   └── pos.json                  # POS semantic overrides (placeholder)
│   ├── output/                       # GENERATED — do not hand-edit
│   │   ├── css/variables.css
│   │   ├── tailwind/theme.cjs
│   │   └── rn/tokens.js              # Future
│   └── README.md
├── packages/
│   ├── merchant-ui/                  # Merchant Manager component library
│   │   ├── src/
│   │   │   ├── components/ui/        # React (web) shadcn/Obra components
│   │   │   └── lib/utils.ts          # cn() helper (imports from shared-utils)
│   │   ├── .storybook/
│   │   ├── tailwind.config.cjs       # Extends generated theme
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── consumer-ui/                  # Consumer app component library
│   │   ├── src/
│   │   │   ├── components/ui/        # React Native shadcn-style components
│   │   │   └── lib/utils.ts
│   │   ├── .storybook/
│   │   ├── tailwind.config.cjs
│   │   └── package.json
│   ├── pos-ui/                       # POS component library (scaffold only)
│   │   ├── src/components/ui/        # Empty — placeholder
│   │   └── package.json
│   └── shared-utils/                 # Cross-package utilities (no UI)
│       ├── src/
│       │   ├── cn.ts                 # clsx + tailwind-merge
│       │   ├── formatters.ts         # Price, date, currency formatting
│       │   └── validators.ts         # Shared validation logic
│       ├── tsconfig.json
│       └── package.json
├── scripts/
│   ├── build-tokens.mjs              # Custom token builder
│   ├── generate-components.mjs
│   ├── import-figma-folder.mjs
│   ├── import-figma-variables.mjs
│   └── import-obra-tokens.mjs
├── .github/
│   ├── instructions/
│   │   └── vscode-rules.instructions.md
│   └── workflows/
│       ├── tokens-sync.yml           # Rebuild tokens on token file changes
│       └── chromatic.yml             # Visual regression per package
└── docs/
    └── MIGRATION.md                  # Flat → monorepo migration guide
```

### 3.1 What Lives Where

| Concern               | Location                                 |
| ---------------------- | ---------------------------------------- |
| Primitive tokens       | `tokens/joe-tokens.json`                 |
| Semantic tokens        | `tokens/semantic/*.json`                 |
| Generated outputs      | `tokens/output/` (never hand-edit)       |
| Merchant components    | `packages/merchant-ui/src/components/ui/`|
| Consumer components    | `packages/consumer-ui/src/components/ui/`|
| Shared logic (no UI)   | `packages/shared-utils/src/`             |
| Build/import scripts   | `scripts/`                               |

---

## 4. Token Architecture — Three Layers

### 4.1 Primitives (`tokens/joe-tokens.json`)

Raw, brand-level values: color scales, spacing scale, font families, font sizes,
font weights, line heights, radii, shadows. These are building blocks and must
**NEVER** be referenced directly in component code.

All tokens use W3C DTCG format (`$type`, `$value`).

> **Migration note:** The current `joe-tokens.json` contains both `primitives` and
> `semantic` sections. During migration, extract the `semantic` section into
> `tokens/semantic/shared.json` so that `joe-tokens.json` contains **only** the
> `primitives` group. Preserve the existing naming conventions (`colors.blue.500`,
> `space.m`, `fontSizes.heading1`, etc.).

### 4.2 Semantic Tokens (`tokens/semantic/`)

Meaningful names that alias primitives. Components consume **only** semantic tokens.

#### `shared.json` — Base semantics for all platforms

```
color.background.default     → {primitives.colors.white}
color.background.surface     → {primitives.colors.grey.50}
color.background.muted       → {primitives.colors.grey.100}
color.text.primary           → {primitives.colors.black}
color.text.secondary         → {primitives.colors.grey.600}
color.text.disabled          → {primitives.colors.grey.400}
color.action.primary         → {primitives.colors.blue.500}
color.action.primaryHover    → {primitives.colors.blue.600}
color.status.success         → {primitives.colors.green.500}
color.status.warning         → {primitives.colors.yellow.500}
color.status.error           → {primitives.colors.red.500}
color.status.info            → {primitives.colors.blue.400}
color.border.default         → {primitives.colors.grey.200}
color.border.subtle          → {primitives.colors.grey.100}
```

#### `merchant.json` — Overrides for Merchant Manager

Only tokens that **differ** from `shared.json`. Missing keys fall back to shared.

- Tighter spacing defaults (desktop-optimized)
- Smaller border radii (8px cards instead of 16px)
- Denser typography (body2 at 0.875rem default instead of body1)
- Muted background surfaces (`colors.grey.50` default)

#### `consumer.json` — Overrides for Consumer App

- Larger touch targets (44px+ tap areas per Apple HIG)
- More generous spacing
- Larger border radii (brand-forward, rounded aesthetic)

#### `pos.json` — Overrides for POS (scaffold only, populate later)

- Largest touch targets (52px+ buttons)
- High-contrast status indicators
- Bolder text weights

### 4.3 Token Merge Order

The build script merges tokens in this order (later wins):

```
1. joe-tokens.json      (primitives — base palette)
2. semantic/shared.json  (base semantic layer)
3. semantic/<platform>.json  (platform overrides — deep-merged over shared)
```

This means `merchant.json` only needs to declare the tokens it overrides.
Everything else inherits from `shared.json`.

### 4.4 Component Tokens (inside each package)

Per-component tokens like `button.primary.background` live within each package's
Tailwind config or CSS module, referencing semantic tokens. These are NOT shared
across packages.

### 4.5 Dark Mode (Deferred)

Dark mode is not a current priority. However, the semantic token architecture
supports it: each semantic token can carry `light` and `dark` values when needed.
When dark mode work begins, add a `dark` key to semantic tokens and update the
build script to generate `:root` and `.dark` / `[data-theme="dark"]` CSS blocks.

Do NOT implement dark mode token variants until explicitly requested.

---

## 5. Token Pipeline — Build Script

### 5.1 Dependencies (Root)

These must be present in the root `package.json` devDependencies:

| Package                      | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `turbo`                      | Monorepo task runner                   |
| `@changesets/cli`            | Package versioning                     |
| `class-variance-authority`   | Component variant management           |
| `clsx`                       | Conditional class joining              |
| `tailwind-merge`             | Tailwind class deduplication           |
| `@phosphor-icons/react`      | Icon library (matches Obra Figma kit)  |
| `chromatic`                  | Visual regression testing              |

Per-package Storybook dependencies:

| Package                                | Purpose                   |
| -------------------------------------- | ------------------------- |
| `storybook`                            | Storybook core            |
| `@storybook/react-webpack5`            | React framework adapter   |
| `@storybook/addon-a11y`                | Accessibility checks      |
| `storybook-design-token`               | Token documentation addon |

> **Cleanup:** Remove `style-dictionary` and `token-transformer` from
> devDependencies — they are installed but unused. The project uses a custom
> build script.

### 5.2 Build Script (`scripts/build-tokens.mjs`)

The build script must:

1. Read `tokens/joe-tokens.json` (primitives).
2. Read `tokens/semantic/shared.json` (base semantic layer).
3. If `--platform <name>` is passed, read `tokens/semantic/<name>.json` and
   deep-merge it over `shared.json`.
4. Resolve all `{reference}` strings (semantic → primitive) in up to 10 passes.
5. **Throw an error** if any `{reference}` remains unresolved after all passes.
   Do not silently pass through unresolved references.
6. Output:
   - `tokens/output/css/variables.css` — `:root { --joe-<token-path>: <value>; }`
     with `@tokens` / `@tokens-end` comments for the Storybook design token addon.
   - `tokens/output/tailwind/theme.cjs` — CommonJS JS object for `theme.extend`.
7. Log a summary: total tokens processed, resolved, and output file paths.
8. Support `--watch` flag for development.

### 5.3 Scripts (Root `package.json`)

```jsonc
{
  "scripts": {
    "tokens:build": "node scripts/build-tokens.mjs",
    "tokens:build:consumer": "node scripts/build-tokens.mjs --platform consumer",
    "tokens:build:merchant": "node scripts/build-tokens.mjs --platform merchant",
    "tokens:build:pos": "node scripts/build-tokens.mjs --platform pos",
    "tokens:watch": "node scripts/build-tokens.mjs --watch",
    "tokens:import-obra": "node scripts/import-obra-tokens.mjs",
    "tokens:import-figma": "node scripts/import-figma-variables.mjs",
    "tokens:import-figma-folder": "node scripts/import-figma-folder.mjs",
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "storybook": "turbo run storybook",
    "chromatic": "turbo run chromatic",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  }
}
```

### 5.4 Turborepo Pipeline (`turbo.json`)

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "tokens:build": {
      "inputs": ["tokens/joe-tokens.json", "tokens/semantic/**"],
      "outputs": ["tokens/output/**"]
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    },
    "lint": {},
    "chromatic": {
      "dependsOn": ["build-storybook"]
    }
  }
}
```

---

## 6. Merchant Manager UI Package — Current Priority

### 6.1 Setup

Create `packages/merchant-ui/` as a **React component library** (not a Next.js app):

- React + Tailwind CSS + shadcn/ui + CVA.
- The **consuming application** may use Next.js, but `merchant-ui` itself is a
  framework-agnostic component library.
- Import the generated Tailwind theme from `../../tokens/output/tailwind/theme.cjs`.
- Import CSS variables from `../../tokens/output/css/variables.css`.
- Each component is individually importable (no barrel `index.ts` that re-exports
  everything — see §15).

### 6.2 Components to Build

Build these in `packages/merchant-ui/src/components/ui/`:

**Core (common patterns, but independent web implementations):**

- `button.tsx` — primary, secondary, outline, ghost, destructive; sizes sm/md/lg/icon
- `input.tsx` — text, password, email, search; with label, error, helper text
- `card.tsx` — content container with header, body, footer
- `badge.tsx` — status indicators
- `alert.tsx` — info, success, warning, error
- `dialog.tsx` — modal dialogs
- `toast.tsx` — notifications (using Sonner)

**Merchant-specific (do NOT exist in consumer-ui):**

- `data-table.tsx` — sortable, filterable, paginated tables
- `sidebar.tsx` — persistent navigation for desktop layout
- `command.tsx` — command palette / search
- `tabs.tsx` — section switching
- `dropdown-menu.tsx` — context menus, action menus
- `select.tsx` — single and multi-select for filters and forms
- `form.tsx` — form wrapper with React Hook Form compatibility
- `date-picker.tsx` — for report date ranges
- `stats-card.tsx` — metric card (revenue, orders, tips)
- `file-upload.tsx` — for store logos, banners, product images

### 6.3 Merchant Semantic Token Overrides

In `tokens/semantic/merchant.json`, define overrides that make the Merchant Manager
feel denser and more utilitarian than the consumer app:

```jsonc
{
  "spacing": {
    "page-padding": {
      "$value": "{primitives.space.s}",
      "$type": "dimension",
      "$description": "12px — tighter than consumer's 16px"
    },
    "card-padding": {
      "$value": "{primitives.space.m}",
      "$type": "dimension",
      "$description": "16px"
    }
  },
  "borderRadius": {
    "card": {
      "$value": "{primitives.radii.xs}",
      "$type": "dimension",
      "$description": "8px — sharper than consumer's 16px"
    },
    "button": {
      "$value": "{primitives.radii.xxs}",
      "$type": "dimension",
      "$description": "6px"
    },
    "input": {
      "$value": "{primitives.radii.xxs}",
      "$type": "dimension",
      "$description": "6px"
    }
  },
  "fontSize": {
    "body-default": {
      "$value": "{primitives.fontSizes.body2}",
      "$type": "dimension",
      "$description": "0.875rem — denser than consumer's body1"
    }
  },
  "color": {
    "background": {
      "default": {
        "$value": "{primitives.colors.grey.50}",
        "$type": "color",
        "$description": "Light grey surface for desktop"
      },
      "surface": {
        "$value": "{primitives.colors.white}",
        "$type": "color",
        "$description": "Card/panel background"
      }
    }
  }
}
```

> Note: Use W3C DTCG format (`$value`, `$type`) consistently — matching the
> project's actual token format in `joe-tokens.json`.

### 6.4 CVA Pattern for Merchant Components

Every component with visual variants follows the CVA pattern. Template:

```tsx
// packages/merchant-ui/src/components/ui/button.tsx
'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@joe-coffee/shared-utils";

const buttonVariants = cva(
  // Base: shared across all variants
  "inline-flex items-center justify-center font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Semantic token Tailwind classes — NEVER raw hex values
        primary: "bg-action-primary text-white hover:bg-action-primaryHover",
        secondary:
          "bg-background-surface text-text-primary border border-border-default " +
          "hover:bg-background-muted",
        outline:
          "border border-action-primary text-action-primary " +
          "hover:bg-action-primary hover:text-white",
        ghost: "hover:bg-background-muted hover:text-text-primary",
        destructive: "bg-status-error text-white hover:bg-status-error/90",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-10 rounded-md px-4 text-sm",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {leftIcon && <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>}
    </button>
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Rules for all components:**

- Class names must reference Tailwind keys generated from tokens. NEVER use
  hard-coded colors like `bg-[#3DA1F8]`.
- Always use `React.forwardRef` and set `displayName`.
- Always add the `'use client'` directive at the top for React Server Component
  compatibility.
- Import `cn` from `@joe-coffee/shared-utils` (not a local copy).
- Export both the component and its variants config (e.g., `Button` + `buttonVariants`).

---

## 7. Storybook — Per Package

### 7.1 Each Package Gets Its Own Storybook

- `packages/merchant-ui/.storybook/` — desktop component docs
- `packages/consumer-ui/.storybook/` — mobile component docs
- (Future) `packages/pos-ui/.storybook/`

Each Storybook is independently buildable and deployable. Run a specific one with:
`pnpm --filter merchant-ui storybook`

### 7.2 Shared Storybook Configuration Pattern

Each Storybook must:

1. Import the platform's generated CSS variables
   (`../../tokens/output/css/variables.css`).
2. Use `storybook-design-token` addon to expose tokens in the Design Token tab.
3. Use `@storybook/addon-a11y` for accessibility checks.
4. Set light/surface/dark background options matching the design system.
5. Map shadcn/ui CSS variables to Joe token CSS variables in a `globals.css`.

### 7.3 Stories Requirements

For each component, create a `.stories.tsx` file:

- Default story with controls for `variant` and `size`.
- All variant combinations (use a Variants story that renders all options).
- Disabled / loading / error states where applicable.
- At least one story demonstrating Phosphor icon usage.
- Typed with `Meta` and `StoryObj` from `@storybook/react`.

> **Convention note:** Existing stories in the flat `src/` use `.stories.jsx`.
> New stories in `packages/` must use `.stories.tsx`. Existing `.jsx` stories are
> acceptable until migrated.

---

## 8. POS Package — Scaffold Only (Future)

Create `packages/pos-ui/` with:

- A `package.json` with basic dependencies and the package name
  `@joe-coffee/pos-ui`.
- An empty `src/components/ui/` directory.
- A placeholder `tokens/semantic/pos.json` with `$description` fields documenting
  intended overrides (larger targets, high contrast, bolder weights).

Do NOT build POS components. The scaffold ensures the monorepo structure is ready
when POS work begins.

---

## 9. CI/CD

### 9.1 Token Sync Workflow (`.github/workflows/tokens-sync.yml`)

- Triggers on pushes that modify `tokens/joe-tokens.json` or `tokens/semantic/*.json`.
- Runs `pnpm run tokens:build` for each platform.
- Commits regenerated files in `tokens/output/` back to the branch.
- Uses `pnpm` (not `npm`) for installation and commands.

### 9.2 Chromatic (`.github/workflows/chromatic.yml`)

- Triggers on push / PR to `main`.
- Builds Storybook for `merchant-ui` (and `consumer-ui` when it has stories).
- Uses Turborepo filtering: `pnpm turbo run build-storybook --filter=merchant-ui`.
- Publishes to Chromatic for independent visual regression testing.
- Store `CHROMATIC_PROJECT_TOKEN` as a GitHub Actions secret.

### 9.3 Vercel Deployment

The Storybook deployment to Vercel must be updated for the monorepo:

- Update `vercel.json` to use `pnpm` commands.
- Build command: `pnpm run tokens:build:merchant && pnpm --filter merchant-ui build-storybook`.
- Output directory: `packages/merchant-ui/storybook-static`.
- When multiple Storybooks need hosting, consider separate Vercel projects per
  package or a unified documentation site.

---

## 10. Obra Alignment Rules

Since the Figma library is the **Obra shadcn/ui kit** (customized for Joe):

1. **Component names** in code must match Obra/shadcn naming conventions
   (e.g., `Button`, `Card`, `Input`, `Dialog`, `DataTable`).
2. **Component variants** in code (CVA) must match the variants available in the
   Obra Figma components (e.g., primary/secondary/outline/ghost/destructive).
3. When a designer exports a new variable from Figma, **Copilot** should map it to
   the existing token structure in `joe-tokens.json`, not create a parallel naming
   scheme.
4. The Obra kit uses Tailwind v4 colors as its base palette — when customizing for
   Joe, those are replaced with Joe's primitives. Code must mirror this: use Joe
   token classes, not default Tailwind color classes (e.g., `bg-action-primary`
   not `bg-blue-500`).

---

## 11. Constraints & Non-Goals

- Do NOT rename or move `tokens/joe-tokens.json` without explicit instruction.
- Do NOT introduce another component/styling framework beyond
  React + Tailwind + shadcn/ui + CVA.
- Do NOT build React Native or Swift/Kotlin components yet — keep the token
  pipeline modular so `--platform rn` or `--platform ios` can be added later.
- **Each platform has its own independent component implementations.** Do NOT
  copy-paste component code between packages. If `consumer-ui` and `merchant-ui`
  both need a `Button`, each gets its own implementation wired to its own semantic
  tokens and optimized for its platform's UX needs. Shared **behavioral logic**
  (formatters, validators, `cn()`) lives in `shared-utils`.
- Do NOT add platform conditionals inside components
  (e.g., `if (platform === 'merchant')`). Each package is self-contained.
- Do NOT put UI components in `shared-utils`. It contains only non-visual
  utilities.
- Do NOT hand-edit files in `tokens/output/`. They are generated and will be
  overwritten by the build script.

---

## 12. How Copilot Should Work

1. **Read these rules and the existing repo** before making changes.
2. **Implement in small, reviewable steps**, referencing the section number
   (e.g., "Implementing §6.2 — merchant data-table component").
3. **Prefer TypeScript**; keep types accurate. Use `interface` for component props.
4. **Explain token mappings** in code comments when the relationship between a
   token name and its visual purpose is not obvious.
5. **When the user pastes Figma Variables JSON**, translate it into the
   `joe-tokens.json` format, preserving existing naming conventions
   (`colors.blue.500`, `space.m`, `fontSizes.heading1`, etc.). Flag any new
   tokens that don't fit the existing structure.
6. **When building merchant-ui components**, check if a similar component exists
   elsewhere. Reuse the same CVA variant names where applicable for cross-platform
   consistency, but implement independently.
7. **Run `pnpm run tokens:build:merchant`** after any token change to verify the
   pipeline works before proceeding to component work.
8. **After editing the build script**, verify it throws on unresolved references
   and produces valid output. Run it and check the generated files.

---

## 13. Package Publishing & Versioning

### 13.1 Package Names

| Package        | npm name                    |
| -------------- | --------------------------- |
| merchant-ui    | `@joe-coffee/merchant-ui`   |
| consumer-ui    | `@joe-coffee/consumer-ui`   |
| pos-ui         | `@joe-coffee/pos-ui`        |
| shared-utils   | `@joe-coffee/shared-utils`  |

### 13.2 Versioning with Changesets

Use `@changesets/cli` to manage versions across the monorepo:

1. When making a change, run `pnpm changeset` and describe the change.
2. Changesets automatically determine which packages are affected.
3. `pnpm run version-packages` bumps versions and updates changelogs.
4. `pnpm run release` publishes to the registry.

### 13.3 Semantic Versioning Rules

| Change type                         | Version bump |
| ----------------------------------- | ------------ |
| Breaking token rename/removal       | **Major**    |
| Breaking component API change       | **Major**    |
| New component or token              | **Minor**    |
| New component variant               | **Minor**    |
| Bug fix / visual fix                | **Patch**    |
| Documentation update                | **Patch**    |

### 13.4 Publishing

Packages are published to a private npm registry (GitHub Packages or npm org).
The consumer app installs packages like any npm dependency:

```bash
pnpm add @joe-coffee/shared-utils
```

Each package has independent versions — they are NOT forced to stay in lockstep.

---

## 14. Accessibility Requirements

### 14.1 Standards

All components must meet **WCAG 2.1 Level AA**:

- **Color contrast:** 4.5:1 for normal text, 3:1 for large text and UI elements.
- **Keyboard navigation:** All interactive components must be fully operable via
  keyboard (Tab, Enter, Space, Escape, Arrow keys as appropriate).
- **Focus indicators:** Visible focus rings on all interactive elements. Use the
  `focus-visible:ring-2 focus-visible:ring-ring` pattern.
- **ARIA attributes:** All form inputs must have associated labels. Use proper
  `role`, `aria-label`, `aria-describedby`, `aria-expanded`, `aria-selected`
  attributes on interactive widgets.
- **Screen reader support:** Semantic HTML elements (`<button>`, `<nav>`,
  `<dialog>`, `<table>`) over generic `<div>` with ARIA roles.

### 14.2 Enforcement

- The `@storybook/addon-a11y` addon runs automated checks on every story.
- Stories that fail a11y checks should be treated as bugs and fixed before merge.
- Manual keyboard testing is required for complex interactive components
  (DataTable, Command, DatePicker).

### 14.3 POS-Specific (Future)

POS will have stricter requirements: minimum 48px touch targets,
high-contrast mode support, and large text options for readability at arm's length.

---

## 15. Bundle & Export Guidelines

### 15.1 Package Format

- Each package uses `"type": "module"` in its `package.json`.
- Build output targets ESM (`dist/esm/`) and optionally CJS (`dist/cjs/`).
- Set `"sideEffects": false` for tree-shaking.
- CSS is delivered as a separate importable file, not bundled into JS.

### 15.2 Import Patterns

Each component must be individually importable:

```tsx
// Good — tree-shakeable
import { Button } from "@joe-coffee/merchant-ui/button";
import { cn } from "@joe-coffee/shared-utils";

// Bad — imports entire package
import { Button, Card, Input } from "@joe-coffee/merchant-ui";
```

Use `package.json` `"exports"` field to define granular entry points:

```jsonc
{
  "exports": {
    "./button": "./dist/esm/components/ui/button.js",
    "./card": "./dist/esm/components/ui/card.js",
    "./styles.css": "./dist/styles.css"
  }
}
```

### 15.3 Dependency Rules

- `shared-utils` is the **only** cross-package dependency allowed.
- No circular dependencies between packages.
- Peer dependencies: `react`, `react-dom`, `tailwindcss` are peer deps (not
  bundled).

---

## 16. Deprecation Policy

When a token, component, or variant needs to be removed:

1. **Deprecation release (minor):** Add `@deprecated` JSDoc comment and a
   `console.warn` in development mode. Document the replacement in the
   component's Storybook docs.
2. **Migration guide:** Add an entry to `docs/MIGRATION.md` explaining what
   changed and how to update.
3. **Removal release (next major):** Remove the deprecated code. Reference the
   migration guide in the changelog.

Example:

```tsx
/**
 * @deprecated Use `variant="secondary"` instead. Will be removed in v2.0.
 */
```

Token deprecation follows the same pattern: mark deprecated in the JSON with a
`$description` field, keep for one minor release, remove in next major.

---

## 17. Migration — Flat Structure to Monorepo

The current repo is a flat single-package structure with components in
`src/components/ui/`. This section describes how to migrate to the monorepo.

### 17.1 Migration Order

1. **Set up monorepo tooling** — Add `pnpm-workspace.yaml`, `turbo.json`,
   `.npmrc`, `.changeset/config.json`. Convert from npm to pnpm.
2. **Create `packages/shared-utils/`** — Move `src/lib/utils.ts` to shared
   package. Publish as `@joe-coffee/shared-utils`.
3. **Extract semantic tokens** — Move the `semantic` section from
   `joe-tokens.json` into `tokens/semantic/shared.json`. Update
   `joe-tokens.json` to contain only primitives.
4. **Update build script** — Add `--platform` flag support, semantic file
   loading, and merge logic to `scripts/build-tokens.mjs`.
5. **Create `packages/merchant-ui/`** — Set up package structure, Tailwind
   config, Storybook config. Begin building merchant-specific components.
6. **Move existing components** — Migrate current `src/components/ui/` into
   `packages/consumer-ui/` (or `packages/merchant-ui/` depending on which
   platform they serve). Update import paths.
7. **Create `packages/pos-ui/`** — Scaffold only.
8. **Update CI/CD** — Update GitHub Actions, Vercel config, Chromatic.
9. **Update root `package.json`** — Remove component-level deps from root,
   keep only workspace-level tooling.
10. **Clean up** — Remove `src/` directory from root once all components are
    moved. Archive `storybook-static/` output (it will be per-package now).

### 17.2 Existing Component Disposition

The 31 components currently in `src/components/ui/` were built as web React
components with shadcn/ui patterns. During migration:

- Components that are common patterns (Button, Card, Input, Alert, Badge, Dialog,
  etc.) should be evaluated: if they match merchant needs, move to `merchant-ui`.
  If they were built for the consumer app, move to `consumer-ui`.
- Merchant-specific components (DataTable, Sidebar, Command, etc.) are built
  fresh in `merchant-ui`.
- Do NOT delete existing components until they have been verified in their new
  package location.

### 17.3 Import Path Updates

After migration, update all import paths:

```tsx
// Before (flat structure)
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

// After (monorepo)
import { cn } from "@joe-coffee/shared-utils";
import { Button } from "./components/ui/button"; // within same package
```
```
