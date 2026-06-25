import type { FluxColumn } from '../../interfaces'

export interface CrossTableLeftColumn extends FluxColumn {
  columnType: 'left'
  children?: never
}

export interface CrossTableDataColumn extends FluxColumn {
  columnType: 'data'
}

export interface CrossTableDataParentColumn extends FluxColumn {
  columnType: 'data-parent'
  children: (CrossTableDataParentColumn | CrossTableDataColumn)[]
}

export type CrossTableRenderColumn = CrossTableLeftColumn | CrossTableDataColumn | CrossTableDataParentColumn
