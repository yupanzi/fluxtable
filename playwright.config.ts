import { defineConfig, devices } from '@playwright/test';

/**
 * 该配置只服务于 @storybook/test-runner 的执行环境。
 * test-runner 自身有 jest-playwright 桥接，会按 PLAYWRIGHT_BROWSERS 等环境变量取项目；
 * 此文件主要给本地 IDE 与 lint 提供类型与 baseURL 提示。
 */
export default defineConfig({
  testDir: './stories',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    baseURL: 'http://127.0.0.1:6006',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
