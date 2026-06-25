import { CrossTreeTable } from '@yupanzi/fluxtable/pivot';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Space, Transfer } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getIncomeData } from '../_fixtures/report-data-mock';
import { amount, lfl, ratio } from '../_fixtures/format';

const ALL_DIMS = [
  { code: 'planet', name: '子公司' },
  { code: 'season', name: '季度' },
  { code: 'month', name: '月份' },
  { code: 'area', name: '门店' },
  { code: 'one', name: '一级类目' },
  { code: 'two', name: '二级类目' },
  { code: 'three', name: '三级类目' },
];

type RenderFn = (v: unknown) => React.ReactNode;
const INDICATORS: Array<{ code: string; name: string; render: RenderFn }> = [
  { code: 'a', name: '目标收入', render: amount as RenderFn },
  { code: 'b', name: '实际收入', render: amount as RenderFn },
  { code: 'lfl', name: '收入月环比', render: lfl as RenderFn },
  { code: 'd', name: '重点商品收入', render: amount as RenderFn },
  { code: 'rate', name: '重点商品收入占比', render: ratio as RenderFn },
];

/** 根据 dimCodes 构建钻取树（左侧树） */
interface TreeNode {
  key: string;
  value: string;
  children?: TreeNode[];
}

function buildLeftTree(
  data: Record<string, unknown>[],
  dimCodes: string[],
  recordMap: Map<string, Record<string, number>>,
): TreeNode[] {
  if (dimCodes.length === 0 || data.length === 0) return [];
  const [head, ...rest] = dimCodes;
  if (!head) return [];
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const row of data) {
    const v = String(row[head] ?? '');
    const list = groups.get(v) ?? [];
    list.push(row);
    groups.set(v, list);
  }
  const nodes: TreeNode[] = [];
  for (const [value, rows] of groups.entries()) {
    const key = `${head}=${value}`;
    recordMap.set(key, aggregate(rows));
    const children = rest.length > 0 ? buildLeftTree(rows, rest, recordMap) : undefined;
    nodes.push({ key, value, children });
  }
  return nodes;
}

function aggregate(rows: Record<string, unknown>[]): Record<string, number> {
  const acc = { a: 0, b: 0, c: 0, d: 0 };
  for (const row of rows) {
    for (const k of ['a', 'b', 'c', 'd'] as const) {
      acc[k] += Number(row[k]) || 0;
    }
  }
  const lflValue = acc.c !== 0 ? (acc.b - acc.c) / acc.c : 0;
  const rateValue = acc.b !== 0 ? acc.d / acc.b : 0;
  return { ...acc, lfl: lflValue, rate: rateValue };
}

interface TopNode {
  key: string;
  value: string;
  align?: 'left' | 'right' | 'center';
  data: { indicator: (typeof INDICATORS)[number] };
}

const meta: Meta = {
  title: 'Tables/Others/DrillTreeTable',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const DrillableTreeTableExample: Story = {
  render: (): React.ReactElement => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dimCodes, setDimCodes] = useState(['planet', 'area', 'season']);

    useEffect(() => {
      getIncomeData().then((d) => {
        setData(d as unknown as Record<string, unknown>[]);
        setIsLoading(false);
      });
    }, []);

    const { leftTree, recordMap } = useMemo(() => {
      const map = new Map<string, Record<string, number>>();
      const tree = buildLeftTree(data, dimCodes, map);
      return { leftTree: tree, recordMap: map };
    }, [data, dimCodes]);

    const topTree: TopNode[] = INDICATORS.map((indicator) => ({
      key: indicator.code,
      value: indicator.name,
      align: 'right' as const,
      data: { indicator },
    }));

    const transferDataSource = ALL_DIMS.map((d) => ({ key: d.code, title: d.name }));

    return (
      <div>
        <Card size="small" style={{ marginBottom: 16 }} title="左侧维度配置">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Transfer
              dataSource={transferDataSource}
              onChange={(nextTargetKeys) => setDimCodes(nextTargetKeys.map(String))}
              render={(item) => item.title}
              targetKeys={dimCodes}
              titles={['可选', '已选']}
            />
          </Space>
        </Card>

        <CrossTreeTable
          defaultColumnWidth={120}
          getValue={(leftNode, topNode) => {
            const record = recordMap.get(leftNode.key);
            const ind = topNode.data.indicator as (typeof INDICATORS)[number];
            return record?.[ind.code];
          }}
          isLoading={isLoading}
          leftTree={leftTree}
          primaryColumn={{ lock: true, name: '数据维度', width: 180 } as any}
          render={(value, _leftNode, topNode) => {
            const ind = topNode.data.indicator as (typeof INDICATORS)[number];
            return ind.render(value);
          }}
          style={{ marginTop: 8 }}
          topTree={topTree}
        />
      </div>
    );
  },
};
