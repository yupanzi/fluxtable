import type { FluxColumn } from '@yupanzi/fluxtable';
import { BaseTable, Classes, proto } from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { amount, ratio } from '../_fixtures/format';

const meta: Meta = {
  title: 'Tables/Biz/RemainMatrix',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const COLORS = [
  '#E8F3FF',
  '#D6E9FF',
  '#ADD1FF',
  '#85B6FF',
  '#5790F2',
  // 从这里开始字体颜色要变为白色
  '#2E6BE6',
  '#1D4DBF',
  '#0F3499',
  '#061F73',
  '#03124D',
];

const DATA = [
  {
    date: '1月04号',
    user_cnt: 300,
    day1: 0.4,
    day2: 0.4,
    day3: 0.35,
    day4: 0.4,
    day5: 0.35,
    day6: 0.3,
    day7: 0.25,
  },
  {
    date: '1月05号',
    user_cnt: 350,
    day1: 0.4,
    day2: 0.36,
    day3: 0.45,
    day4: 0.3,
    day5: 0.3,
    day6: 0.2,
    day7: -1,
  },
  {
    date: '1月06号',
    user_cnt: 400,
    day1: 0.4,
    day2: 0.4,
    day3: 0.5,
    day4: 0.4,
    day5: 0.3,
    day6: -1,
    day7: -1,
  },
  {
    date: '1月07号',
    user_cnt: 350,
    day1: 0.45,
    day2: 0.4,
    day3: 0.3,
    day4: 0.2,
    day5: -1,
    day6: -1,
    day7: -1,
  },
  {
    date: '1月08号',
    user_cnt: 400,
    day1: 0.5,
    day2: 0.5,
    day3: 0.4,
    day4: -1,
    day5: -1,
    day6: -1,
    day7: -1,
  },
  {
    date: '1月09号',
    user_cnt: 500,
    day1: 0.6,
    day2: 0.48,
    day3: -1,
    day4: -1,
    day5: -1,
    day6: -1,
    day7: -1,
  },
  {
    date: '1月10号',
    user_cnt: 400,
    day1: 0.52,
    day2: -1,
    day3: -1,
    day4: -1,
    day5: -1,
    day6: -1,
    day7: -1,
  },
];

/** 纯 JS 版 d3.scaleQuantize：把值映射到 range 索引 */
function quantize(
  value: number,
  domainMin: number,
  domainMax: number,
  rangeLength: number,
): number {
  const r = (value - domainMin) / (domainMax - domainMin);
  return Math.min(Math.max(Math.floor(r * rangeLength), 0), rangeLength - 1);
}

const StyledBaseTable = styled(BaseTable)`
  --border-color: none;

  .${Classes.tableHeader} {
    border-top: 1px solid #dfe3e8;
    border-bottom: 1px solid #dfe3e8;
  }

  .${Classes.tableHeaderCell} {
    height: 48px;
  }
`;

function getRemainCellProps(
  rate: number,
): { style: { backgroundColor: string; color: string } } | undefined {
  if (rate === -1) return undefined;
  const i = quantize(rate, 0.2, 0.6, COLORS.length);
  return {
    style: {
      // biome-ignore lint/style/noNonNullAssertion: quantize 保证索引合法
      backgroundColor: COLORS[i]!,
      color: i <= 4 ? '#03124D' : 'white',
    },
  };
}

interface RemainRow {
  user_cnt: number;
  [key: string]: unknown;
}

function remainRateWithCount(rate: number, record: RemainRow): React.ReactNode {
  if (rate === -1) return null;
  return (
    <div style={{ lineHeight: '20px' }}>
      <div>{ratio(rate)}</div>
      <div>{amount(rate * record.user_cnt)}</div>
    </div>
  );
}

export const RemainMatrix: Story = {
  render: (): React.ReactElement => {
    const remainCol = proto.array<FluxColumn>({
      align: 'right',
      render: remainRateWithCount as FluxColumn['render'],
      getCellProps: getRemainCellProps as FluxColumn['getCellProps'],
    });
    return (
      <StyledBaseTable
        columns={[
          { code: 'date', name: '日期' },
          { code: 'user_cnt', name: '用户数' },
          ...remainCol([
            { code: 'day1', name: '第一日' },
            { code: 'day2', name: '第二日' },
            { code: 'day3', name: '第三日' },
            { code: 'day4', name: '第四日' },
            { code: 'day5', name: '第五日' },
            { code: 'day6', name: '第六日' },
            { code: 'day7', name: '第七日' },
          ]),
        ]}
        dataSource={DATA}
        defaultColumnWidth={100}
      />
    );
  },
};
