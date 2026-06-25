import type { Preview } from '@storybook/react-vite';
import { App, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: { storySort: { order: ['Tables', ['Basic', 'Biz', 'Others']] } },
  },
  decorators: [
    (Story): ReactNode => (
      <ConfigProvider>
        <App>
          <Story />
        </App>
      </ConfigProvider>
    ),
  ],
};

export default preview;
