/**
 * Tailwind CSS Configuration — Merchant Manager
 * 
 * Imports the generated theme from the shared token pipeline.
 * For merchant-specific overrides, run: pnpm tokens:build:merchant
 */
const joeTheme = require('../../tokens/output/tailwind/theme.cjs');

module.exports = {
    darkMode: ['class'],
    content: [
        './src/**/*.{ts,tsx,js,jsx}',
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
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
