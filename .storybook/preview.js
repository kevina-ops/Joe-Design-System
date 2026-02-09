import React from 'react';
import './globals.css';
import { designTokens } from './design-tokens';
import { ThemeProvider } from 'next-themes';

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story) =>
      React.createElement(
        ThemeProvider,
        { attribute: 'class', defaultTheme: 'light', enableSystem: false },
        React.createElement(Story)
      ),
  ],
  parameters: {
    designToken: designTokens,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'surface', value: '#FAFAFA' },
        { name: 'dark', value: '#171717' },
      ],
    },
  },
};

export default preview;
