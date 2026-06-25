import { BaseTable, features, useTablePipeline } from '@yupanzi/fluxtable';
import type { LeftCrossTreeNode, TopCrossTreeNode } from '@yupanzi/fluxtable/pivot';
import { ROW_KEY, buildCrossTable } from '@yupanzi/fluxtable/pivot';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Radio } from 'antd';

const components = { Checkbox, Radio };

const meta: Meta = {
  title: 'Tables/Others/CrossTableCustomization',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const CrossTableCustomization: Story = {
  render: (): React.ReactElement => {
    const leftTree = [
      { key: 'forenoon-9', value: '上午', children: [{ key: '9', value: '9:00-10:00' }] },
      { key: 'forenoon-10', value: '上午', children: [{ key: '10', value: '10:00-11:00' }] },
      { key: 'forenoon-11', value: '上午', children: [{ key: '11', value: '11:00-12:00' }] },
      { key: 'lunch', value: '午餐' },
      {
        key: 'afternoon',
        value: '下午',
        children: [
          { key: '14', value: '14:00-15:00' },
          { key: '15', value: '15:00-16:00' },
          { key: '16', value: '16:00-17:00' },
        ],
      },
      { key: 'dinner', value: '晚餐' },
      { key: 'evening-20', value: '晚上', children: [{ key: '20', value: '20:00-21:00' }] },
      { key: 'evening-21', value: '晚上', children: [{ key: '21', value: '21:00-22:00' }] },
    ];

    const makeTopChildren = (keyPrefix: string) => [
      { key: `${keyPrefix}-week-0`, value: '第一周', width: 80 },
      { key: `${keyPrefix}-week-1`, value: '第二周', width: 80 },
      { key: `${keyPrefix}-week-2`, value: '第三周', width: 80 },
      { key: `${keyPrefix}-week-3`, value: '第四周', width: 80 },
    ];

    const topTree = [
      { key: '2021-01', value: '2021-01', children: makeTopChildren('2021-01') },
      { key: '2021-02', value: '2021-02', children: makeTopChildren('2021-02') },
      { key: '2021-03', value: '2021-03', children: makeTopChildren('2021-03') },
      { key: '2021-04', value: '2021-04', children: makeTopChildren('2021-04') },
      { key: '2021-05', value: '2021-05', children: makeTopChildren('2021-05') },
      { key: '2021-06', value: '2021-06', children: makeTopChildren('2021-06') },
    ];

    const getValue = (
      leftNode: LeftCrossTreeNode,
      topNode: TopCrossTreeNode,
    ): string | undefined => {
      if (leftNode.key === 'lunch') {
        if (topNode.key.endsWith('week-0')) return '肯德基';
        if (topNode.key.endsWith('week-1')) return '麦当劳';
        if (topNode.key.endsWith('week-2')) return '汉堡王';
        return '烧烤';
      }
      if (leftNode.key === 'dinner') {
        if (topNode.key.endsWith('week-0')) return '家常菜';
        if (topNode.key.endsWith('week-1')) return '海底捞';
        if (topNode.key.endsWith('week-2')) return '麦当劳';
        return '体重+1';
      }
      return undefined;
    };

    const data = buildCrossTable({
      leftTree,
      topTree,
      getValue,
      columnOffset: 2,
    });

    const pipeline = useTablePipeline({ components })
      .primaryKey(ROW_KEY)
      .input(data)
      .mapColumns((cols) => [
        {
          name: '序号',
          lock: true,
          width: 80,
          align: 'right',
          getValue: (_row: unknown, rowIndex: number) => rowIndex + 1,
        },
        ...cols.map((col) => ({ ...col, lock: false })),
      ]);

    pipeline.use(features.columnRangeHover());
    pipeline.use(
      features.multiSelect({
        checkboxColumn: { lock: true },
        clickArea: 'cell',
        highlightRowWhenSelected: true,
      }),
    );

    return <BaseTable defaultColumnWidth={100} {...pipeline.getProps()} />;
  },
};
