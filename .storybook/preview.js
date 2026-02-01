import '../app/globals.css';
import { designTokens } from './design-tokens';

/** @type { import('@storybook/react').Preview } */
const preview = {
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
