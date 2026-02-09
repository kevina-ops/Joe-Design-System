import type { Config } from 'tailwindcss';
import joeTheme from './tokens/output/tailwind/theme.cjs';

/**
 * Tailwind CSS Configuration
 * 
 * Part of PRD Section 5: Tailwind Integration
 * 
 * Imports the generated theme from joe-tokens.json and extends Tailwind's default theme.
 */

const config: Config = {
    darkMode: ['class'],
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
  			'ring-offset-background': 'var(--background)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
