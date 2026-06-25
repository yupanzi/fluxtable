import cx from 'classnames'
import React from 'react'
import { Colgroup } from './colgroup'
import type { VisibleColumnDescriptor } from './interfaces'
import { Classes } from './styles'

const DefaultEmptyContent = React.memo(() => (
  <>
    <svg
      className="empty-image"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      role="img"
      aria-label="empty"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V19" fill="#fafafa" />
        <path d="M6 19l7-9h24l7 9H33l-2 6H19l-2-6z" fill="#fafafa" />
      </g>
    </svg>
    <div className="empty-tips">
      没有符合查询条件的数据
      <br />
      请修改条件后重新查询
    </div>
  </>
))

export interface EmptyTableProps {
  descriptors: VisibleColumnDescriptor[]
  isLoading: boolean
  emptyCellHeight?: number
  EmptyContent?: React.ComponentType
}

export function EmptyHtmlTable({
  descriptors,
  isLoading,
  emptyCellHeight,
  EmptyContent = DefaultEmptyContent,
}: EmptyTableProps) {
  const show = !isLoading

  return (
    <table>
      <Colgroup descriptors={descriptors} />
      <tbody>
        <tr className={cx(Classes.tableRow, 'first', 'last', 'no-hover')} data-rowindex={0}>
          <td
            className={cx(Classes.tableCell, 'first', 'last')}
            colSpan={descriptors.length}
            style={{ height: emptyCellHeight ?? 200 }}
          >
            {show && (
              <div className={Classes.emptyWrapper}>
                <EmptyContent />
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
