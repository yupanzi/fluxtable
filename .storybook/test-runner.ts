import type { TestRunnerConfig } from '@storybook/test-runner';

/**
 * 默认行为：对每一个 story 做 smoke 渲染（无报错即视为通过）。
 * 后续若要加 a11y / 视觉快照，可在 postVisit 钩子里拓展。
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    // 等待 styled-components / antd 注入 CSS，避免 antd Wave/Compact 在首次渲染抛错
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; }' });
  },
  tags: {
    skip: ['skip-test'],
  },
};

export default config;
