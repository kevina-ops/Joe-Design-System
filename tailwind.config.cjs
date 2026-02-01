/**
 * Tailwind config in CJS for environments that don't load .ts (e.g. Storybook PostCSS).
 * Kept in sync with tailwind.config.ts.
 */
const joeTheme = require('./tokens/output/tailwind/theme.cjs');

module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './.storybook/**/*.{js,jsx,mjs,ts,tsx}',
  ],
  theme: {
    extend: {
      ...joeTheme,
      colors: {
        ...(joeTheme.colors || {}),
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'ring-offset-background': 'var(--background)',
      },
    },
  },
  plugins: [],
};
