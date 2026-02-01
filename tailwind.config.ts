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
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      ...joeTheme,
    },
  },
  plugins: [],
};

export default config;
