import type { FluxColumn } from '@yupanzi/fluxtable';
import {
  BaseTable,
  collectNodes,
  features,
  isLeafNode,
  useTablePipeline,
} from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Radio, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  columns1,
  columns3,
  columns4,
  columns5,
  columns6,
  dataSource1,
  dataSource3,
  dataSource4,
  dataSource5,
  dataSource6,
  randomPick,
} from '../_fixtures/biz-data';
import { getRegionSalesData } from '../_fixtures/report-data-mock';
import { ratio } from '../_fixtures/format';

// 简易 RadioButtonGroup：替代原仓 website/src/assets/RadioButtonGroup.tsx
interface RBGOption {
  value: string;
  label: string;
}
interface RBGProps {
  dataSource: RBGOption[];
  value: string;
  onChange: (v: string) => void;
}
function RadioButtonGroup({ dataSource, value, onChange }: RBGProps): React.ReactElement {
  return (
    <Radio.Group onChange={(e) => onChange(e.target.value)} optionType="button" value={value}>
      {dataSource.map((opt) => (
        <Radio.Button key={opt.value} value={opt.value}>
          {opt.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}

const components = { Checkbox, Radio, Tooltip };

function 树形表格(): React.ReactElement {
  const [openKeys, onChangeOpenKeys] = useState(['4', '4-2']);
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource4, columns: columns4 })
    .primaryKey('id')
    .use(features.treeMode({ openKeys, onChangeOpenKeys }));
  const allParentKeys = (collectNodes(dataSource4, 'pre') as unknown as Record<string, unknown>[])
    .filter((row) => !isLeafNode(row as never))
    .map((row) => row.id as string);
  return (
    <div>
      <Space>
        <Button onClick={() => onChangeOpenKeys(allParentKeys)}>展开全部</Button>
        <Button onClick={() => onChangeOpenKeys([])}>收拢全部</Button>
      </Space>
      <p>
        openKeys: {openKeys.join(', ')} {openKeys.length === 0 && '[空]'}
      </p>
      <BaseTable {...pipeline.getProps()} />
    </div>
  );
}

function 行多选(): React.ReactElement {
  const [value, onChange] = useState(['1', '3']);
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource4, columns: columns4 })
    .primaryKey('id')
    .mapDataSource((ds) => collectNodes(ds, 'pre'))
    .snapshot('flat')
    .use(
      features.multiSelect({
        value,
        onChange,
        highlightRowWhenSelected: true,
        isDisabled(row: Record<string, unknown>) {
          return (row.id as string).startsWith('4-');
        },
        checkboxPlacement: 'start',
        checkboxColumn: { lock: true },
        clickArea: 'row',
      }),
    )
    .mapColumns(([a, ...b]) => {
      if (!a) return b;
      return [a, { name: 'id', code: 'id', width: 80 }, ...b];
    });
  return (
    <div>
      <p>注意：行单选依赖于 pipeline.ctx.components.Checkbox 组件。</p>
      <Space>
        <Button onClick={() => onChange([])}>清空选中状态</Button>
        <Button
          onClick={() => {
            const flatData = pipeline.getDataSource('flat');
            const allKeys = flatData.map((row: Record<string, unknown>) => row.id as string);
            onChange(allKeys.filter((key) => !value.includes(key)));
          }}
        >
          反转选中状态
        </Button>
      </Space>
      <BaseTable style={{ marginTop: 16 }} {...pipeline.getProps()} />
    </div>
  );
}

function 行单选(): React.ReactElement {
  const [value, onChange] = useState('1');
  const [clickArea, setClickArea] = useState<'radio' | 'cell' | 'row'>('radio');
  const [radioPlacement, setRadioPlacement] = useState<'start' | 'end'>('start');
  const [highlightRowWhenSelected, setHighlightRowWhenSelected] = useState(true);
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource1, columns: columns1 })
    .primaryKey('id')
    .use(
      features.singleSelect({
        value,
        onChange,
        highlightRowWhenSelected,
        radioPlacement,
        clickArea,
      }),
    );
  return (
    <div>
      <p>注意：行单选依赖于 pipeline.ctx.components.Radio 组件。</p>
      <div>
        <span>单选框摆放位置: </span>
        <RadioButtonGroup
          dataSource={[
            { value: 'start', label: '左侧' },
            { value: 'end', label: '右侧' },
          ]}
          onChange={(v) => setRadioPlacement(v as 'start' | 'end')}
          value={radioPlacement}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>是否高亮选中行: </span>
        <RadioButtonGroup
          dataSource={[
            { value: 'true', label: '开启' },
            { value: 'false', label: '关闭' },
          ]}
          onChange={(v) => setHighlightRowWhenSelected(v === 'true')}
          value={String(highlightRowWhenSelected)}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <span>点击触发范围: </span>
        <RadioButtonGroup
          dataSource={[
            { value: 'radio', label: '控件' },
            { value: 'cell', label: '单元格' },
            { value: 'row', label: '整行' },
          ]}
          onChange={(v) => setClickArea(v as 'radio' | 'cell' | 'row')}
          value={clickArea}
        />
      </div>
      <div style={{ margin: '12px 0' }}>
        <Space>
          <Button onClick={() => onChange(randomPick(dataSource1.map((row) => row.id)))}>
            随机选择
          </Button>
          <Button onClick={() => onChange('')}>取消选中</Button>
        </Space>
        <p>当前选中的 key： {value || '[空]'}</p>
      </div>
      <BaseTable {...pipeline.getProps()} />
    </div>
  );
}

function 行展开(): React.ReactElement {
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource5, columns: columns5 })
    .primaryKey('id')
    .use(features.rowGrouping({ defaultOpenKeys: ['1', '2'] }));
  return <BaseTable {...pipeline.getProps()} />;
}

function 表格排序(): React.ReactElement {
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource3, columns: columns3 })
    .use(
      features.sort({
        mode: 'single',
        defaultSorts: [{ code: 'applier', order: 'asc' }],
        highlightColumnWhenActive: true,
      }),
    );
  return <BaseTable {...pipeline.getProps()} />;
}

function 多列排序(): React.ReactElement {
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource3, columns: columns3 })
    .use(
      features.sort({
        mode: 'multiple',
        defaultSorts: [{ code: 'applier', order: 'asc' }],
        highlightColumnWhenActive: true,
      }),
    );
  return <BaseTable {...pipeline.getProps()} />;
}

function 树状模式与层级排序(): React.ReactElement {
  const columns: FluxColumn[] = [
    { code: 'name', name: '数据维度', lock: true, width: 200 },
    { code: 'storeName', name: '门店', features: { sortable: true } },
    {
      code: 'exposureRate',
      name: '曝光占比',
      render: ratio,
      align: 'right',
      features: { sortable: true },
    },
    { code: 'avgPrice', name: '件单价', align: 'right', features: { sortable: true } },
    {
      code: 'salesAmount',
      name: '成交金额',
      align: 'right',
      features: { sortable: true },
    },
  ];
  const [state, setState] = useState<{ isLoading: boolean; data: Record<string, unknown>[] }>({
    isLoading: true,
    data: [],
  });
  useEffect(() => {
    getRegionSalesData().then((data) => {
      setState({ isLoading: false, data: data as unknown as Record<string, unknown>[] });
    });
  }, []);
  const pipeline = useTablePipeline({ components })
    .input({ columns, dataSource: state.data })
    .primaryKey('id')
    .use(features.buildTree('id', 'parentId'))
    .use(features.sort({ mode: 'single', highlightColumnWhenActive: true }))
    .use(features.treeMode({ defaultOpenKeys: ['ALL'] }));
  return <BaseTable isLoading={state.isLoading} {...pipeline.getProps()} />;
}

function 表头分组与列高亮(): React.ReactElement {
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource6, columns: columns6 })
    .use(features.columnRangeHover());
  return <BaseTable className="bordered" {...pipeline.getProps()} />;
}

function 多选与提示信息(): React.ReactElement {
  const columns: FluxColumn[] = [
    { code: 'title', name: '标题', width: 200, features: { tips: '我是指标的详细信息~~' } },
    { code: 'dept', name: '部门名称', width: 180 },
    { code: 'dest', name: '团建目的地', width: 160 },
    { code: 'guide', name: '当地导游', width: 160 },
  ];
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource4, columns })
    .primaryKey('id')
    .mapDataSource((ds) => collectNodes(ds, 'pre'))
    .use(
      features.multiSelect({
        defaultValue: ['1', '3'],
        highlightRowWhenSelected: true,
        clickArea: 'cell',
      }),
    )
    .use(features.tips());
  return <BaseTable {...pipeline.getProps()} />;
}

const DetailDiv = styled.div`
  margin: 16px;
  display: flex;
  min-width: 800px;

  p:first-child {
    margin-top: 0;
  }
  p {
    margin: 0;
    line-height: 20px;
  }

  .right {
    margin-left: 48px;
  }
`;

function 行详情(): React.ReactElement {
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource1, columns: columns1.slice(0, 4) })
    .primaryKey('id')
    .use(
      features.rowDetail({
        defaultOpenKeys: ['2'],
        renderDetail(row: Record<string, unknown>) {
          return (
            <DetailDiv>
              <div className="left">
                <p>最近工作：高级经理｜{String(row.dept)}｜2009-07-01 至今</p>
                <p>工作职责：巴拉巴拉小魔仙</p>
                <p>联系方式：67676767｜1212121@163.con</p>
              </div>
              <div className="right">
                <p>教育经理：北京大学｜工商管理｜2007-09-01 至 2010-06-01</p>
                <p>中央财经大学｜2004-09-01 至 2007-06-01</p>
              </div>
            </DetailDiv>
          );
        },
      }),
    );
  return <BaseTable {...pipeline.getProps()} />;
}

function 树形可选择表格(): React.ReactElement {
  const columns: FluxColumn[] = [
    { lock: true, code: 'id', name: 'id', width: 100 },
    { code: 'title', name: '标题', width: 200 },
    { code: 'dept', name: '部门名称', width: 180 },
    { code: 'dest', name: '团建目的地', width: 160 },
    { code: 'guide', name: '当地导游', width: 160 },
  ];
  const pipeline = useTablePipeline({ components })
    .input({ dataSource: dataSource4, columns })
    .primaryKey('id')
    .use(features.treeMode())
    .use(
      features.treeSelect({
        tree: dataSource4,
        rootKey: 'root',
        defaultValue: ['1', '2', '3'],
        checkboxColumn: { lock: true },
        highlightRowWhenSelected: true,
        clickArea: 'cell',
        checkedStrategy: 'parent',
        isDisabled(row: Record<string, unknown>): boolean {
          return row.id === '2';
        },
      }),
    );
  return (
    <div>
      <p>注意 id=2 的行 detached 属性为 true，选中状态不与其父节点关联</p>
      <BaseTable {...pipeline.getProps()} />
    </div>
  );
}

const meta: Meta = {
  title: 'Tables/Basic/Pipeline',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const TreeMode: Story = { name: '树形表格', render: 树形表格 };
export const MultiSelect: Story = { name: '行多选', render: 行多选 };
export const SingleSelect: Story = { name: '行单选', render: 行单选 };
export const RowGrouping: Story = { name: '行展开', render: 行展开 };
export const SingleSort: Story = { name: '表格排序', render: 表格排序 };
export const MultiSort: Story = { name: '多列排序', render: 多列排序 };
export const TreeSort: Story = { name: '树状模式与层级排序', render: 树状模式与层级排序 };
export const GroupHeaderHighlight: Story = {
  name: '表头分组与列高亮',
  render: 表头分组与列高亮,
};
export const MultiSelectWithTips: Story = { name: '多选与提示信息', render: 多选与提示信息 };
export const RowDetail: Story = { name: '行详情', render: 行详情 };
export const TreeSelect: Story = { name: '树形可选择表格', render: 树形可选择表格 };
