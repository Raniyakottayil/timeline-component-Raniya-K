
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import '../src/styles/animations.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#fafafa',
        },
        {
          name: 'dark',
          value: '#18181b',
        },
      ],
    },
  },
};

export default preview;