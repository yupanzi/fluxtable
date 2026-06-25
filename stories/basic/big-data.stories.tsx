import type { FluxColumn } from '@yupanzi/fluxtable';
import { BaseTable, features, useTablePipeline } from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { repeat } from '../_fixtures/biz-data';
import { cols, useAllStoreDataSource } from '../_fixtures/region-sales-mock';

const indexCol: FluxColumn = {
  lock: true,
  width: 80,
  name: 'index',
  getValue: (_record, rowIndex) => rowIndex,
};

function 滚动容器为window(): React.ReactElement {
  const { dataSource, isLoading } = useAllStoreDataSource();
  return (
    <BaseTable
      columns={[indexCol, cols.updateTime, cols.regionName, cols.storeName, ...cols.indCols]}
      dataSource={dataSource}
      isLoading={isLoading}
    />
  );
}

function 滚动容器为指定高度的div(): React.ReactElement {
  const { dataSource, isLoading } = useAllStoreDataSource();
  return (
    <BaseTable
      columns={[indexCol, cols.updateTime, cols.regionName, cols.storeName, ...cols.indCols]}
      dataSource={dataSource}
      isLoading={isLoading}
      style={{ height: 400, overflow: 'auto' }}
      useOuterBorder
    />
  );
}

const BIDIRECTIONAL_COLUMNS: FluxColumn[] = Array.from({ length: 200 }, (_, i) =>
  cols.indCols.map((col) => ({ ...col, name: `copy-${i} ${col.name}` })),
).flat();

function 双向虚拟滚动(): React.ReactElement {
  const { dataSource, isLoading } = useAllStoreDataSource();
  return (
    <BaseTable
      columns={[
        indexCol,
        cols.updateTime,
        cols.regionName,
        cols.storeName,
        ...BIDIRECTIONAL_COLUMNS,
      ]}
      dataSource={[dataSource, dataSource, dataSource, dataSource, dataSource].flat()}
      isLoading={isLoading}
      useVirtual={true}
    />
  );
}

const DetailDiv = styled.div`
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

const DYNAMIC_ROWS_DATASOURCE = repeat(
  [
    {
      name: '晨星科技',
      amount: '600,000.00(CNY)',
      dept: '招商银行丨杭州分行',
      applier: 'James Collier',
    },
    {
      name: '远岸数科',
      amount: '600,000.00(CNY)',
      dept: '建设银行丨未来科技城',
      applier: 'Philip Burke',
    },
    {
      name: '青柚物流',
      amount: '600,000.00(CNY)',
      dept: '交通银行丨浙大路支行',
      applier: 'Wesley Cruz',
    },
  ],
  500,
).map((row, i) => ({ ...row, id: String(i + 1) }));

const DYNAMIC_ROWS_COLUMNS: FluxColumn[] = [
  { code: 'name', width: 180, name: '公司名称' },
  { code: 'amount', width: 160, align: 'right', name: '金额' },
  { code: 'dept', width: 160, name: '金融机构' },
  { code: 'id', width: 80, name: '#', render: (v) => `#${v}` },
  { code: 'applier', width: 200, name: '申请人' },
];

function renderDynamicRowDetail(row: Record<string, unknown>): React.ReactElement {
  return (
    <DetailDiv style={{ margin: 8 }}>
      <div className="left">
        <p>最近工作：高级经理｜{String(row.dept)}｜2009-07-01 至今</p>
        <p>工作职责：巴拉巴拉小魔仙</p>
      </div>
      <div className="right">
        <p>教育经理：北京大学｜工商管理｜2007-09-01 至 2010-06-01</p>
        <p>中央财经大学｜2004-09-01 至 2007-06-01</p>
      </div>
    </DetailDiv>
  );
}

function 动态行数量(): React.ReactElement {
  const [openKeys, onChangeOpenKeys] = useState<string[]>([]);

  const pipeline = useTablePipeline({ components: { Checkbox, Radio } })
    .input({ dataSource: DYNAMIC_ROWS_DATASOURCE, columns: DYNAMIC_ROWS_COLUMNS })
    .primaryKey('id')
    .use(features.rowDetail({ openKeys, onChangeOpenKeys, renderDetail: renderDynamicRowDetail }));

  return (
    <div>
      <p>展开/收拢详情单元格时，行的数量会发生变化，组件会动态调整内部的缓存以适应此类情况。</p>
      <p>
        表格行的数量：{pipeline.getDataSource().length}
        <Button
          onClick={() => {
            const allKeys = DYNAMIC_ROWS_DATASOURCE.map((row) => row.id);
            onChangeOpenKeys(openKeys.length === allKeys.length ? [] : allKeys);
          }}
          size="small"
          style={{ marginLeft: 24 }}
        >
          展开/收拢全部
        </Button>
      </p>
      <BaseTable
        style={{ maxHeight: 450, overflow: 'auto' }}
        useOuterBorder
        {...pipeline.getProps()}
      />
    </div>
  );
}

const meta: Meta = {
  title: 'Tables/Basic/BigData',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const WindowScroll: Story = {
  name: '滚动容器为 window',
  render: 滚动容器为window,
};
export const FixedDivScroll: Story = {
  name: '滚动容器为指定高度的 div',
  render: 滚动容器为指定高度的div,
};
export const BiDirectionalVirtual: Story = {
  name: '双向虚拟滚动',
  render: 双向虚拟滚动,
};
export const DynamicRowCount: Story = {
  name: '动态行数量',
  render: 动态行数量,
};
