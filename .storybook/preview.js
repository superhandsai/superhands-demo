import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import '../src/style.css'
import '../src/pages.css'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story) => React.createElement(MemoryRouter, null, React.createElement(Story)),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
};

export default preview;
