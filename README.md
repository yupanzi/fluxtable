# fluxtable

[![npm version](https://img.shields.io/npm/v/@yupanzi/fluxtable.svg)](https://www.npmjs.com/package/@yupanzi/fluxtable)
[![CI](https://github.com/yupanzi/fluxtable/actions/workflows/ci.yml/badge.svg)](https://github.com/yupanzi/fluxtable/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

高性能 React 表格 / 数据网格组件。底层用 RxJS 流 + pipeline 驱动可见区计算，支持三向虚拟化、透视表（cross-table / cross-tree-table），以及排序 / 树模式 / 列宽拖拽 / 列高亮等数据变换。

## 安装

```bash
pnpm add @yupanzi/fluxtable
```

> peerDependencies：`react` / `react-dom`（^16.8 及以上）。导出 Excel 为可选能力，按需安装 `xlsx`。

## 用法

```ts
import { BaseTable } from '@yupanzi/fluxtable'
import { CrossTable } from '@yupanzi/fluxtable/pivot'
```

- 主入口 `@yupanzi/fluxtable`：`BaseTable`、pipeline、transforms、公共视图等。
- 子路径 `@yupanzi/fluxtable/pivot`：透视 / 交叉表（`CrossTable`、`CrossTreeTable` 等）。

CSS class 前缀为 `flux-`（如 `.flux-table-cell`、`.flux-lock-shadow`），覆盖样式时以此为准。

## 源流与许可

承袭 [alibaba/ali-react-table](https://github.com/alibaba/ali-react-table) v2.6.2 改造而来，遵循其 MIT 许可（见 [LICENSE](./LICENSE)；原始版权归 Alibaba，依 MIT 条款保留）。

## Changelog

提交遵循 [Conventional Commits](https://www.conventionalcommits.org/)，版本与发布由 [semantic-release](https://semantic-release.gitbook.io/) 在 GitHub Actions 中自动完成，版本记录见 [`CHANGELOG.md`](./CHANGELOG.md)。
