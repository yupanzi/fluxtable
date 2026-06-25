import type { DrillNode } from '@yupanzi/fluxtable/pivot';
import {
  CrossTable,
  buildDrillTree,
  buildRecordMatrix,
  convertDrillTreeToCrossTree,
} from '@yupanzi/fluxtable/pivot';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Radio, Select, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { getIncomeData } from '../_fixtures/report-data-mock';
import { amount, lfl, ratio } from '../_fixtures/format';

const dimensions = [
  { code: 'planet', name: '子公司', width: 150 },
  { code: 'area', name: '门店', width: 150 },
  { code: 'season', name: '季度' },
  { code: 'month', name: '月份' },
  { code: 'one', name: '一级类目' },
  { code: 'two', name: '二级类目' },
  { code: 'three', name: '三级类目' },
];

const dimMap = new Map(dimensions.map((dim) => [dim.code, dim]));

interface Indicator {
  code: string;
  name: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  render?: (v: unknown) => React.ReactNode;
  expression?: string;
  hidden?: boolean;
}

const indicators: Indicator[] = [
  {
    code: 'a',
    name: '指标A',
    width: 100,
    align: 'right',
    expression: 'SUM(a)',
    render: amount as (v: unknown) => React.ReactNode,
  },
  {
    code: 'b',
    name: '指标B',
    width: 100,
    align: 'right',
    expression: 'SUM(b)',
    render: amount as (v: unknown) => React.ReactNode,
  },
  {
    code: 'c',
    name: '指标C',
    hidden: true,
    render: amount as (v: unknown) => React.ReactNode,
    expression: 'SUM(c)',
  },
  {
    code: 'lfl',
    name: '环比指标',
    expression: '(b - c) / c',
    width: 100,
    align: 'right',
    render: lfl as (v: unknown) => React.ReactNode,
  },
  {
    code: 'd',
    name: '指标D',
    expression: 'SUM(d)',
    render: amount as (v: unknown) => React.ReactNode,
    width: 120,
    align: 'right',
  },
  {
    code: 'rate',
    name: '占比指标',
    expression: 'd / b',
    render: ratio as (v: unknown) => React.ReactNode,
    width: 120,
    align: 'right',
  },
];

const visibleIndicators = indicators.filter((ind) => !ind.hidden);

/** 极简 aggregate：执行 SUM 聚合 + 基础表达式求值（仅针对本 example 的 expressions）。 */
function makeAggregate(): (slice: Record<string, unknown>[]) => Record<string, unknown> {
  return (slice) => {
    const result: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    for (const row of slice) {
      for (const k of ['a', 'b', 'c', 'd']) {
        result[k] = (result[k] ?? 0) + (Number(row[k]) || 0);
      }
    }
    const out: Record<string, unknown> = { ...result };
    // lfl = (b - c) / c
    out.lfl = result.c !== 0 ? (Number(result.b) - Number(result.c)) / Number(result.c) : 0;
    // rate = d / b
    out.rate = result.b !== 0 ? Number(result.d) / Number(result.b) : 0;
    return out;
  };
}

function generateSubtotalNode(drillNode: DrillNode): { position: 'start'; value: string } {
  return {
    position: 'start',
    value: drillNode.path.length === 0 ? '总计' : '小计',
  };
}

interface DesignerProps {
  leftCodes: string[];
  onChangeLeftCodes: (v: string[]) => void;
  topCodes: string[];
  onChangeTopCodes: (v: string[]) => void;
  indicatorSide: string;
  onChangeIndicatorSide: (v: string) => void;
  showSubtotal: boolean;
  onChangeShowSubtotal: (v: boolean) => void;
  supportsExpand: boolean;
  onChangeSupportsExpand: (v: boolean) => void;
}

function SimplePivotDesigner(props: DesignerProps): React.ReactElement {
  const options = dimensions.map((d) => ({ value: d.code, label: d.name }));
  return (
    <Card size="small" style={{ marginBottom: 16 }} title="透视表维度配置">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <span style={{ marginRight: 8 }}>左侧维度：</span>
          <Select
            mode="multiple"
            onChange={props.onChangeLeftCodes}
            options={options}
            style={{ minWidth: 300 }}
            value={props.leftCodes}
          />
        </div>
        <div>
          <span style={{ marginRight: 8 }}>顶部维度：</span>
          <Select
            mode="multiple"
            onChange={props.onChangeTopCodes}
            options={options}
            style={{ minWidth: 300 }}
            value={props.topCodes}
          />
        </div>
        <div>
          <span style={{ marginRight: 8 }}>指标位置：</span>
          <Radio.Group
            onChange={(e) => props.onChangeIndicatorSide(e.target.value as string)}
            options={[
              { value: 'top', label: '顶部' },
              { value: 'left', label: '左侧' },
            ]}
            optionType="button"
            value={props.indicatorSide}
          />
        </div>
        <div>
          <span style={{ marginRight: 8 }}>小计：</span>
          <Switch checked={props.showSubtotal} onChange={props.onChangeShowSubtotal} />
          <span style={{ marginLeft: 16, marginRight: 8 }}>支持展开：</span>
          <Switch checked={props.supportsExpand} onChange={props.onChangeSupportsExpand} />
        </div>
      </Space>
    </Card>
  );
}

const meta: Meta = {
  title: 'Tables/Others/SimplePivotTable',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const 简易透视表: Story = {
  render: (): React.ReactElement => {
    const [{ data, isLoading }, setState] = useState<{
      isLoading: boolean;
      data: Record<string, unknown>[];
    }>({
      isLoading: true,
      data: [],
    });

    useEffect(() => {
      getIncomeData().then((d) =>
        setState({ data: d as unknown as Record<string, unknown>[], isLoading: false }),
      );
    }, []);

    const [indicatorSide, onChangeIndicatorSide] = useState('top');
    const [leftCodes, onChangeLeftCodes] = useState(['planet', 'area', 'one']);
    const [topCodes, onChangeTopCodes] = useState(['season', 'month']);
    const [showSubtotal, onChangeShowSubtotal] = useState(true);
    const [supportsExpand, onChangeSupportsExpand] = useState(false);

    const [leftExpandKeys, onChangeLeftExpandKeys] = useState<string[]>([]);
    const leftExpandKeySet = new Set(leftExpandKeys);
    const leftDrillTree = buildDrillTree(data, leftCodes, {
      includeTopWrapper: true,
      isExpand: !supportsExpand ? undefined : (key: string) => leftExpandKeySet.has(key),
    });
    const [leftTreeRoot] = convertDrillTreeToCrossTree(leftDrillTree, {
      indicators: indicatorSide === 'left' ? (visibleIndicators as any) : undefined,
      generateSubtotalNode: showSubtotal ? generateSubtotalNode : undefined,
      supportsExpand,
      expandKeys: leftExpandKeys,
      onChangeExpandKeys: onChangeLeftExpandKeys,
    });

    const [topExpandKeys, onChangeTopExpandKeys] = useState<string[]>([]);
    const topExpandKeySet = new Set(topExpandKeys);
    const topDrillTree = buildDrillTree(data, topCodes, {
      includeTopWrapper: true,
      isExpand: !supportsExpand ? undefined : (key: string) => topExpandKeySet.has(key),
    });
    const [topTreeRoot] = convertDrillTreeToCrossTree(topDrillTree, {
      indicators: indicatorSide === 'top' ? (visibleIndicators as any) : undefined,
      generateSubtotalNode: showSubtotal ? generateSubtotalNode : undefined,
      supportsExpand,
      expandKeys: topExpandKeys,
      onChangeExpandKeys: onChangeTopExpandKeys,
    });

    const aggregate = makeAggregate();
    const matrix = buildRecordMatrix({
      data,
      leftCodes,
      topCodes,
      aggregate,
      prebuiltLeftTree: leftDrillTree,
      prebuiltTopTree: topDrillTree,
    });

    return (
      <div>
        <SimplePivotDesigner
          indicatorSide={indicatorSide}
          leftCodes={leftCodes}
          onChangeIndicatorSide={onChangeIndicatorSide}
          onChangeLeftCodes={onChangeLeftCodes}
          onChangeShowSubtotal={onChangeShowSubtotal}
          onChangeSupportsExpand={onChangeSupportsExpand}
          onChangeTopCodes={onChangeTopCodes}
          showSubtotal={showSubtotal}
          supportsExpand={supportsExpand}
          topCodes={topCodes}
        />
        {leftTreeRoot && topTreeRoot ? (
          <CrossTable
            className="bordered"
            defaultColumnWidth={100}
            getValue={(leftNode, topNode) => {
              const leftKey = leftNode.data?.dataKey as string | undefined;
              const topKey = topNode.data?.dataKey as string | undefined;
              if (!leftKey || !topKey) return '-';
              const record = matrix.get(leftKey)?.get(topKey);
              if (record == null) return '-';
              const indicator = (leftNode.data?.indicator ?? topNode.data?.indicator) as
                | Indicator
                | undefined;
              return indicator ? (record as Record<string, unknown>)[indicator.code] : '-';
            }}
            isLoading={isLoading}
            leftMetaColumns={leftCodes.map((code) => dimMap.get(code)).filter(Boolean) as any}
            leftTotalNode={leftTreeRoot}
            leftTree={leftTreeRoot.children ?? []}
            render={(value, leftNode, topNode) => {
              const indicator = (leftNode.data?.indicator ?? topNode.data?.indicator) as
                | Indicator
                | undefined;
              const renderFn = indicator?.render;
              if (typeof renderFn === 'function') return renderFn(value);
              return value as React.ReactNode;
            }}
            topTotalNode={topTreeRoot}
            topTree={topTreeRoot.children ?? []}
            useVirtual={true}
          />
        ) : null}
      </div>
    );
  },
};
