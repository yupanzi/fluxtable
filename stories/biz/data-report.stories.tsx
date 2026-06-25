/**
 * 数据报表示例：演示「指标树（左侧行）+ 钻取维度（顶部列）」的交叉报表渲染。
 * identity 为本地实现，避免对 rxjs 的额外依赖。
 */

import type { FluxColumn } from '@yupanzi/fluxtable';
import { BaseTable, features, isLeafNode, useTablePipeline } from '@yupanzi/fluxtable';
import type { DrillNode } from '@yupanzi/fluxtable/pivot';
import { buildDrillTree, buildRecordMap } from '@yupanzi/fluxtable/pivot';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tables/Biz/DataReport',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

import { useEffect, useState } from 'react';
import { getRegionSalesData } from '../_fixtures/report-data-mock';

const identity = <T,>(v: T): T => v;
const amount = (v: unknown): string => Number(v).toFixed(2);
const ratio = (v: unknown): string => `${(Number(v) * 100).toFixed(2)}%`;

const indicatorTree: FluxColumn[] = [
  {
    name: '核心指标',
    code: 'avgPrice',
    render: String,
    children: [
      { code: 'exposureRate', name: '曝光占比', render: ratio },
      {
        code: 'salesAmount',
        name: '成交金额',
        render: (value: unknown) => amount(value),
        getCellProps: ((value: unknown) => {
          if ((value as number) > 30) return { style: { color: 'red' } };
          return {};
        }) as FluxColumn['getCellProps'],
      },
      { code: 'buyerCount', name: '成交用户数', render: amount },
    ],
  },
  {
    name: '转化率',
    code: 'overallConvRate',
    render: ratio,
    children: [
      { code: 'overallConvRate', name: '整体转化率', render: ratio },
      { code: 'searchConvRate', name: '搜索转化率', render: ratio },
      { code: 'categoryConvRate', name: '分类转化率', render: ratio },
      { code: 'cartConvRate', name: '购物车转化率', render: ratio },
    ],
  },
];

const mainCol: FluxColumn = {
  name: '指标',
  width: 200,
  lock: true,
  render: (_value, record) => (record as { name: string }).name,
};

function convertDrillTreeToColumns(
  recordMap: Map<string, Record<string, unknown>>,
  nodes: DrillNode[],
): FluxColumn[] {
  return nodes.map((node) => {
    const col: FluxColumn = {
      name: node.value,
      code: node.key,
      render: (_v: unknown, innerCol: FluxColumn) => {
        const record = recordMap.get(node.key);
        const cellRender = innerCol.render ?? identity;
        const code = innerCol.code ?? '';
        return cellRender(record?.[code], record, -1) as React.ReactNode;
      },
      getCellProps: ((_v: unknown, innerCol: FluxColumn) => {
        const record = recordMap.get(node.key);
        const code = innerCol.code ?? '';
        if (innerCol.getCellProps != null) {
          return innerCol.getCellProps(record?.[code], record, -1) ?? {};
        }
        return {};
      }) as FluxColumn['getCellProps'],
      width: 150,
    };
    if (!isLeafNode(node)) {
      col.children = convertDrillTreeToColumns(recordMap, node.children ?? []);
    }
    return col;
  });
}

export const DataReport: Story = {
  render: (): React.ReactElement => {
    const [state, setState] = useState<{ isLoading: boolean; columns: FluxColumn[] }>({
      isLoading: true,
      columns: [],
    });

    useEffect(() => {
      getRegionSalesData().then((data) => {
        const codes = ['regionName', 'storeName'];
        const topTree = buildDrillTree(data, codes);
        const recordMap = buildRecordMap({ data, codes });
        const columns = convertDrillTreeToColumns(recordMap, topTree);
        setState({ isLoading: false, columns });
      });
    }, []);

    const [openKeys, onChangeOpenKeys] = useState(['核心指标', '转化率']);

    const pipeline = useTablePipeline()
      .input({ columns: [mainCol, ...state.columns], dataSource: indicatorTree })
      .primaryKey('name')
      .use(features.treeMode({ openKeys, onChangeOpenKeys, indentSize: 20 }));

    return <BaseTable {...pipeline.getProps()} isLoading={state.isLoading} />;
  },
};
