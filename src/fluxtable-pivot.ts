'use client'

// 预编译 ESM 消费：组件依赖 useState/styled-components，须声明 client boundary。
// 'use client' 必须是文件的首个语句（前面不能有任何注释），否则下游打包器
//（Next.js App Router / Rollup preserveDirectives）会把指令降级、静默丢弃 client boundary。

export * from './pivot/pivot-utils'
export * from './pivot/cross-table'
export * from './pivot/cross-tree-table'
