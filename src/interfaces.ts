import React, { type ReactNode } from 'react'

export type FluxColumnAlign = 'left' | 'center' | 'right'

export type CellProps = React.TdHTMLAttributes<HTMLTableCellElement>

export interface FluxColumnStaticPart {
  /** 列的名称 */
  name: string

  /** 在数据中的字段 code */
  code?: string

  /** 列标题的展示名称；在页面中进行展示时，该字段将覆盖 name 字段 */
  title?: ReactNode

  /** 列的宽度，如果该列是锁定的，则宽度为必传项 */
  width?: number

  /** 单元格中的文本或内容的 对其方向 */
  align?: FluxColumnAlign

  /** @deprecated 是否隐藏 */
  hidden?: boolean

  /** 是否锁列 */
  lock?: boolean

  /** 表头单元格的 props */
  headerCellProps?: CellProps

  /** 功能开关 */
  features?: { [key: string]: any }
}

export interface FluxColumnDynamicPart {
  /** 自定义取数方法 */
  getValue?(row: any, rowIndex: number): any

  /** 自定义渲染方法 */
  render?(value: any, row: any, rowIndex: number): ReactNode

  /** 自定义的获取单元格 props 的方法 */
  getCellProps?(value: any, row: any, rowIndex: number): CellProps

  /** 自定义的获取单元格 SpanRect 方法 */
  getSpanRect?(value: any, row: any, rowIndex: number): SpanRect | undefined
}

export interface FluxColumn extends FluxColumnStaticPart, FluxColumnDynamicPart {
  /** 该列的子节点 */
  children?: FluxColumn[]
}

/** SpanRect 用于描述合并单元格的边界
 * 注意 top/left 为 inclusive，而 bottom/right 为 exclusive */
export interface SpanRect {
  top: number
  bottom: number
  left: number
  right: number
}

export interface AbstractTreeNode {
  children?: AbstractTreeNode[]
}

export type SortOrder = 'desc' | 'asc' | 'none'

export type SortItem = { code: string; order: SortOrder }

export type Transform<T> = (input: T) => T

/** @deprecated transform */
export type TableTransform = Transform<{
  columns: FluxColumn[]
  dataSource: any[]
}>

export interface HoverRange {
  start: number
  end: number
}
