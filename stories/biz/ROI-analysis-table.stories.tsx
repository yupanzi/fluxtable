import type { FluxColumn } from '@yupanzi/fluxtable';
import { BaseTable, applyTransforms, proto, traverseColumn } from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';
import { randomPick } from '../_fixtures/biz-data';
import { amount, lfl, ratio } from '../_fixtures/format';

const meta: Meta = {
  title: 'Tables/Biz/ROIAnalysisTable',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const HintDiv = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  color: #d32f2f;
`;

const PbpRatioCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding-right: 12px;
  user-select: none;

  &:hover {
    background: #f5f5f5;
  }
`;

interface RowData {
  stat_date: string;
  [key: string]: unknown;
}

function generateRandomData(): RowData[] {
  const mockData: RowData[] = [];
  const randomPbpRate = (): number => randomPick([0.3, 0.4, 0.5, 0.6]);
  const randomAppTrdAmt = (): number => randomPick([300, 400, 500, 600]);
  const randomPosTrdAmt = (): number => randomPick([400, 500, 600, 800]);
  const randomMarketCost = (): number => randomPick([100, 200, 300, 500]);
  const randomNetProfit = (): number => randomPick([100, 200, 300]);

  for (let i = 1; i <= 11; i++) {
    const item: RowData = {
      stat_date: `3月${i}号`,
      pbp_rate_stage1: 0.4,
      pbp_rate_stage2: 0.5,
      pbp_rate_stage3: 0.6,
    };
    for (let d = 1; d <= 10; d++) {
      if (d + i <= 11) {
        item[`pbp_rate_day${d}`] = randomPbpRate();
        item[`app_trd_amt_day${d}`] = randomAppTrdAmt();
        item[`pos_trd_amt_day${d}`] = randomPosTrdAmt();
        item[`market_cost_day${d}`] = randomMarketCost();
        item[`net_profit_day${d}`] = randomNetProfit();
      }
    }
    mockData.push(item);
  }
  return mockData;
}

const pbp = proto.array<FluxColumn>({
  align: 'right',
  render: ratio,
  width: 100,
  features: proto.object({
    pbp: true,
    dateOrder: proto.number,
  }),
});

function redIfSmallerThanZero(v: number): { style: { background: string } } | undefined {
  if (v < 0) return { style: { background: '#f9cace' } };
  return undefined;
}

function rowRender(value: unknown, row: Record<string, unknown>): React.ReactNode {
  const render = row.render as ((v: unknown, r: unknown) => React.ReactNode) | undefined;
  return render ? render(value, row) : String(value);
}

function pbpRatioRender(v: number, col: FluxColumn, row: RowData): React.ReactNode {
  if (Number.isNaN(v) || v == null) return null;

  const dateOrder = Number(col.features?.dateOrder ?? 0);

  const getRow = (
    codePrefix: string,
    name: string,
    render: (v: string | number | null | undefined) => React.ReactNode,
  ): Record<string, unknown> => {
    const current = row[`${codePrefix}day${dateOrder}`];
    const left1 = row[`${codePrefix}day${dateOrder - 1}`];
    const left2 = row[`${codePrefix}day${dateOrder - 2}`];
    const lflValue = (Number(current) - Number(left1)) / Number(left1);
    return { name, current, left1, left2, lfl: lflValue, render };
  };

  const dataSource = [
    getRow('pbp_rate_', '回本率', ratio),
    getRow('app_trd_amt_', '线上GMV', amount),
    getRow('pos_trd_amt_', '线下GMV', amount),
    getRow('market_cost_', '营销费用', amount),
    getRow('net_profit_', '净利额', amount),
  ];

  const currentCol: FluxColumn = {
    name: `第${dateOrder}天`,
    code: 'current',
    align: 'right',
    getCellProps: redIfSmallerThanZero as FluxColumn['getCellProps'],
    render: rowRender,
  };
  const left1Col: FluxColumn = {
    name: `第${dateOrder - 1}天`,
    code: 'left1',
    align: 'right',
    getCellProps: redIfSmallerThanZero as FluxColumn['getCellProps'],
    render: rowRender,
  };
  const left2Col: FluxColumn = {
    name: `第${dateOrder - 2}天`,
    code: 'left2',
    align: 'right',
    getCellProps: redIfSmallerThanZero as FluxColumn['getCellProps'],
    render: rowRender,
  };
  const lflCol: FluxColumn = {
    name: `对比第${dateOrder - 1}天`,
    code: 'lfl',
    align: 'right',
    render: lfl,
  };

  const columns: FluxColumn[] = [
    { name: '明细', code: 'name' },
    {
      name: `${row.stat_date} 第${dateOrder}天`,
      align: 'center',
      children: dateOrder >= 2 ? [currentCol, lflCol] : [currentCol],
    },
    ...(dateOrder >= 2 ? [left1Col] : []),
    ...(dateOrder >= 3 ? [left2Col] : []),
  ];

  return (
    <Popover
      content={<BaseTable columns={columns} dataSource={dataSource} style={{ width: 500 }} />}
      trigger="click"
    >
      <PbpRatioCell>{ratio(v)}</PbpRatioCell>
    </Popover>
  );
}

export const ROIAnalysisTable: Story = {
  render: (): React.ReactElement => {
    const dataSource = useMemo(() => generateRandomData(), []);
    const columnProto = proto.array<FluxColumn>({ width: 100, align: 'right' });

    const columns: FluxColumn[] = columnProto([
      { lock: true, code: 'stat_date', name: '日期' },
      {
        name: '阶段情况',
        align: 'left',
        children: columnProto([
          { code: 'pbp_rate_stage1', name: '阶段1回本率', render: ratio },
          { code: 'pbp_rate_stage2', name: '阶段2回本率', render: ratio },
          { code: 'pbp_rate_stage3', name: '阶段3回本率', render: ratio },
        ]),
      },
      {
        name: '分日情况',
        align: 'left',
        children: pbp([
          { code: 'pbp_rate_day1', name: '第1天回本率', features: { dateOrder: 1 } },
          { code: 'pbp_rate_day2', name: '第2天回本率', features: { dateOrder: 2 } },
          { code: 'pbp_rate_day3', name: '第3天回本率', features: { dateOrder: 3 } },
          { code: 'pbp_rate_day4', name: '第4天回本率', features: { dateOrder: 4 } },
          { code: 'pbp_rate_day5', name: '第5天回本率', features: { dateOrder: 5 } },
          { code: 'pbp_rate_day6', name: '第6天回本率', features: { dateOrder: 6 } },
          { code: 'pbp_rate_day7', name: '第7天回本率', features: { dateOrder: 7 } },
          { code: 'pbp_rate_day8', name: '第8天回本率', features: { dateOrder: 8 } },
          { code: 'pbp_rate_day9', name: '第9天回本率', features: { dateOrder: 9 } },
          { code: 'pbp_rate_day10', name: '第10天回本率', features: { dateOrder: 10 } },
        ]),
      },
    ]);

    const renderData = applyTransforms(
      { dataSource, columns },
      traverseColumn((col) => {
        if (!col.features?.pbp) return col;
        return {
          ...col,
          getCellProps: () => ({ style: { padding: 0 } }),
          render: (v: number, row: Record<string, unknown>) =>
            pbpRatioRender(v, col, row as RowData),
        };
      }),
    );

    return (
      <div>
        <HintDiv>交互提示：点击分日情况单元格 查看详细数据</HintDiv>
        <BaseTable columns={renderData.columns} dataSource={renderData.dataSource} />
      </div>
    );
  },
};
