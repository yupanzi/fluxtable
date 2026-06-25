import { Classes } from '../styles'

// querySelector 在 strictNullChecks 下返回 T | null。
// 表格 DOM 结构在运行时必然存在这些节点（见上方结构注释），
// 这里用断言收窄：若节点缺失说明结构被破坏，抛出明确错误而非静默传播 null。
function assertElement<T extends Element>(element: T | null, selector: string): T {
  if (element == null) {
    throw new Error(`fluxtable: 找不到匹配选择器 "${selector}" 的 DOM 节点`)
  }
  return element
}

// 表格 DOM 结构
// div.flux-table-wrapper
// └── div.flux-loading-wrapper
//     ├── div.flux-loading-indicator-wrapper
//     │   └── div.flux-loading-indicator
//     │
//     └── div.flux-loading-content-wrapper
//         ├── div.flux-table
//         │   │
//         │   ├── div.flux-table-header
//         │   │  └── table
//         │   │      ├── colgroup
//         │   │      └── thead  注意这里会出现自定义内容，可能存在嵌套表格
//         │   │
//         │   ├── div.flux-table-body
//         │   │   ├── div.flux-virtual-blank.top
//         │   │   ├── table
//         │   │   │   ├── colgroup
//         │   │   │   └── tbody 注意这里会出现自定义内容，可能存在嵌套表格
//         │   │   └── div.flux-virtual-blank.bottom
//         │   │
//         │   ├── div.flux-table-footer
//         │   │  └── table
//         │   │      ├── colgroup
//         │   │      └── tfoot  注意这里会出现自定义内容，可能存在嵌套表格
//         │   │
//         │   ├── div.flux-lock-shadow-mask
//         │   │   └── div.flux-left-lock-shadow
//         │   └── div.flux-lock-shadow-mask
//         │       └── div.flux-right-lock-shadow
//         │
//         └── div.flux-sticky-scroll
//             └── div.flux-sticky-scroll-item
//
// 在「可能存在嵌套表格」的情况下，我们可以采用以下的方式来避免「querySelector 不小心获取到了的嵌套表格上的元素」：
//  fluxTable.querySelector(':scope > .flux-lock-shadow-mask .flux-left-lock-shadow')

// 表格 DOM 结构辅助工具
export class TableDOMHelper {
  readonly fluxTableWrapper: HTMLDivElement
  readonly fluxTable: HTMLDivElement
  readonly tableHeader: HTMLDivElement
  readonly tableBody: HTMLDivElement
  readonly tableFooter: HTMLDivElement

  readonly stickyScroll: HTMLDivElement
  readonly stickyScrollItem: HTMLDivElement

  constructor(fluxTableWrapper: HTMLDivElement) {
    this.fluxTableWrapper = fluxTableWrapper
    const fluxTableSelector = `.${Classes.fluxTable}`
    this.fluxTable = assertElement(
      fluxTableWrapper.querySelector<HTMLDivElement>(fluxTableSelector),
      fluxTableSelector,
    )
    const tableHeaderSelector = `:scope > .${Classes.tableHeader}`
    this.tableHeader = assertElement(
      this.fluxTable.querySelector<HTMLDivElement>(tableHeaderSelector),
      tableHeaderSelector,
    )
    const tableBodySelector = `:scope > .${Classes.tableBody}`
    this.tableBody = assertElement(
      this.fluxTable.querySelector<HTMLDivElement>(tableBodySelector),
      tableBodySelector,
    )
    const tableFooterSelector = `:scope > .${Classes.tableFooter}`
    this.tableFooter = assertElement(
      this.fluxTable.querySelector<HTMLDivElement>(tableFooterSelector),
      tableFooterSelector,
    )

    const stickyScrollSelector = `.${Classes.fluxTable} + .${Classes.stickyScroll}`
    this.stickyScroll = assertElement(
      fluxTableWrapper.querySelector<HTMLDivElement>(stickyScrollSelector),
      stickyScrollSelector,
    )
    const stickyScrollItemSelector = `.${Classes.stickyScrollItem}`
    this.stickyScrollItem = assertElement(
      this.stickyScroll.querySelector<HTMLDivElement>(stickyScrollItemSelector),
      stickyScrollItemSelector,
    )
  }

  // 虚拟滚动占位块仅在开启虚拟滚动时存在，调用方已用 ?. 处理，故返回值可空
  getVirtualTop(): HTMLDivElement | null {
    return this.tableBody.querySelector<HTMLDivElement>(`.${Classes.virtualBlank}.top`)
  }

  getTableRows(): NodeListOf<HTMLTableRowElement> {
    const htmlTable = this.getTableBodyHtmlTable()
    return htmlTable.querySelectorAll<HTMLTableRowElement>(`:scope > tbody > .${Classes.tableRow}`)
  }

  getTableBodyHtmlTable(): HTMLTableElement {
    const selector = `.${Classes.tableBody} table`
    return assertElement(this.fluxTable.querySelector<HTMLTableElement>(selector), selector)
  }

  // 左侧锁列阴影仅在存在左锁列时渲染，调用方已做空值判断，故返回值可空
  getLeftLockShadow(): HTMLDivElement | null {
    const selector = `:scope > .${Classes.lockShadowMask} .${Classes.leftLockShadow}`
    return this.fluxTable.querySelector<HTMLDivElement>(selector)
  }

  // 右侧锁列阴影仅在存在右锁列时渲染，调用方已做空值判断，故返回值可空
  getRightLockShadow(): HTMLDivElement | null {
    const selector = `:scope > .${Classes.lockShadowMask} .${Classes.rightLockShadow}`
    return this.fluxTable.querySelector<HTMLDivElement>(selector)
  }

  // 加载指示器仅在 loading 时存在，调用方已做空值判断，故返回值可空
  getLoadingIndicator(): HTMLDivElement | null {
    return this.fluxTableWrapper.querySelector<HTMLDivElement>(`.${Classes.loadingIndicator}`)
  }
}
