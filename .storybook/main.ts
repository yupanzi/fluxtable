import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * vite alias 把 stories 里写的 `@yupanzi/fluxtable` / `@yupanzi/fluxtable/pivot` 直接解析到本仓库的 src 入口，
 * 避免依赖已发布的 npm 包。注意：更具体的 `@yupanzi/fluxtable/pivot` 必须排在 `@yupanzi/fluxtable` 之前，
 * 否则 `@yupanzi/fluxtable/pivot` 会被前缀匹配到主入口。
 */
const aliasToSrc = {
  '@yupanzi/fluxtable/pivot': resolve(__dirname, '../src/fluxtable-pivot.ts'),
  '@yupanzi/fluxtable': resolve(__dirname, '../src/fluxtable.ts'),
};

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: { check: false, reactDocgen: 'react-docgen' },
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias || {}),
      ...aliasToSrc,
    };
    return viteConfig;
  },
};

export default config;
