'use client'

// 预编译 ESM 消费：组件依赖 useState/styled-components，须声明 client boundary。
// 'use client' 必须是文件的首个语句（前面不能有任何注释），否则下游打包器
//（Next.js App Router / Rollup preserveDirectives）会把指令降级、静默丢弃 client boundary。

export * from './base-table'
export * from './interfaces'
export * from './utils'
export * from './transforms'
export * from './pipeline'
export * from './common-views'

export * from './internals'

// 把 pipeline/features 的 *FeatureOptions 类型从主入口直接导出，方便消费者
// `import type { SortFeatureOptions } from '@yupanzi/fluxtable'`
// pipeline/index.ts 把 features 作为命名空间导出（用于 `features.sort()` 调用），
// 这里补上类型层面的顶级 re-export，二者不冲突。仅列类型避免 buildTree 等同名函数歧义。
export type {
  ColumnHoverFeatureOptions,
  ColumnRangeHoverFeatureOptions,
  ColumnResizeFeatureOptions,
  MultiSelectFeatureOptions,
  RowDetailFeatureOptions,
  RowGroupingFeatureOptions,
  SingleSelectFeatureOptions,
  SortFeatureOptions,
  TreeModeFeatureOptions,
  TreeSelectFeatureOptions,
} from './pipeline/features'

