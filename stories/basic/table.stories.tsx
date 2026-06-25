import type { FluxColumn, CellProps } from '@yupanzi/fluxtable';
import { BaseTable } from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Space } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { dataSource1, repeat } from '../_fixtures/biz-data';
import { amount, time } from '../_fixtures/format';
import { cols, testRegionColumns, useRegionDataSource } from '../_fixtures/region-sales-mock';

function 基本用法(): React.ReactElement {
  const dataSource = [
    { region: '华东一区', orders: 54406, sales: 4793, newUsers: 1457, t: '2024-02-15 19:52:02' },
    { region: '华南一区', orders: 1294, sales: 409, newUsers: 2, t: '2024-02-15 19:52:02' },
    { region: '华北一区', orders: 1212, sales: 390, newUsers: 13, t: '2024-02-15 19:52:02' },
    { region: '华中一区', orders: 1162, sales: 428, newUsers: 0, t: '2024-02-15 19:52:02' },
    { region: '西南一区', orders: 1001, sales: 417, newUsers: 2, t: '2024-02-15 19:52:02' },
  ];
  const columns: FluxColumn[] = [
    { code: 'region', name: '大区', width: 150 },
    { code: 'orders', name: '订单数', width: 100, align: 'right' },
    { code: 'sales', name: '销售额', width: 100, align: 'right' },
    { code: 'newUsers', name: '新增用户', width: 100, align: 'right' },
    { code: 't', name: '最后更新时间', width: 180 },
  ];
  return <BaseTable columns={columns} dataSource={dataSource} />;
}

function 左侧锁列(): React.ReactElement {
  const { dataSource, isLoading } = useRegionDataSource();
  return (
    <BaseTable
      columns={[
        { lock: true, code: 'regionName', name: '大区', width: 150 },
        { code: 'orderCount', name: '订单数', width: 100, render: amount, align: 'right' },
        { code: 'refundCount', name: '退款数', width: 100, render: amount, align: 'right' },
        { code: 'salesAmount', name: '销售额', width: 100, render: amount, align: 'right' },
        { code: 'newUserCount', name: '新增用户', width: 100, render: amount, align: 'right' },
        { code: 'updateTime', name: '最后更新时间', width: 180, render: time },
      ]}
      dataSource={dataSource}
      isLoading={isLoading}
      style={{ width: 500, height: 300, overflow: 'auto' }}
      useOuterBorder
    />
  );
}

function 表头吸顶(): React.ReactElement {
  const { dataSource, isLoading } = useRegionDataSource();
  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: 48,
          border: '1px solid #ccc',
          zIndex: 30,
          background: 'white',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>表格操作栏，这里适合放置一些功能按钮</div>
      </div>
      <BaseTable
        columns={testRegionColumns}
        dataSource={dataSource}
        isLoading={isLoading}
        isStickyHead
        stickyTop={48}
      />
    </div>
  );
}

function 自定义表头单元格样式(): React.ReactElement {
  const { dataSource, isLoading } = useRegionDataSource();
  return (
    <BaseTable
      columns={[
        {
          code: 'regionName',
          name: '大区',
          width: 150,
          headerCellProps: { style: { color: 'white', fontSize: 20, background: '#1ea7fd' } },
        },
        ...cols.indCols,
        {
          code: 'updateTime',
          name: '最后更新时间',
          width: 180,
          render: time,
          headerCellProps: {
            style: { letterSpacing: 10, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
          },
        },
      ]}
      dataSource={dataSource.slice(0, 5)}
      isLoading={isLoading}
    />
  );
}

function 列分组(): React.ReactElement {
  const { dataSource, isLoading } = useRegionDataSource();
  return (
    <BaseTable
      columns={[
        { name: '基本信息', lock: true, children: [cols.regionName, cols.updateTime] },
        {
          name: '指标分组',
          children: [
            { name: '指标分组1', children: [cols.orderCount, cols.refundCount] },
            { name: '指标分组2', children: [cols.salesAmount, cols.newUserCount] },
          ],
        },
      ]}
      dataSource={dataSource}
      isLoading={isLoading}
    />
  );
}

function 单元格合并(): React.ReactElement {
  const dataSource = [
    { region: '华东一区', orders: 54406, sales: 4793, t: '2024-02-15 19:52:02' },
    { region: '华南一区', orders: 1294, sales: 409, t: '2024-02-15 19:52:02' },
    { region: '华北一区', orders: 1212, sales: 390, t: '2024-02-15 19:52:02' },
    { region: '华中一区', orders: 1162, sales: 428, t: '2024-02-15 19:52:02' },
    { region: '西南一区', orders: 1001, sales: 417, t: '2024-02-15 19:52:02' },
  ];
  const columns: FluxColumn[] = [
    {
      code: 'region',
      name: '大区',
      getCellProps: ((_v: unknown, _r: unknown, rowIndex: number) => {
        if (rowIndex === 3) return { colSpan: 2, rowSpan: 2 } as CellProps;
        return {};
      }) as FluxColumn['getCellProps'],
    },
    { code: 'orders', name: '订单数', align: 'right' },
    { code: 'sales', name: '销售额', align: 'right' },
    {
      code: 't',
      name: '最后更新时间',
      getCellProps: ((_v: unknown, _r: unknown, rowIndex: number) => {
        if (rowIndex === 1) return { rowSpan: 3 } as CellProps;
        return {};
      }) as FluxColumn['getCellProps'],
    },
  ];
  return <BaseTable columns={columns} dataSource={dataSource} defaultColumnWidth={100} />;
}

function 自定义单元格样式(): React.ReactElement {
  const { isLoading, dataSource } = useRegionDataSource();
  const columns: FluxColumn[] = [
    { code: 'regionName', name: '大区', width: 150 },
    {
      code: 'orderCount',
      name: '订单数',
      width: 100,
      align: 'right',
      render: (v: unknown) => {
        const num = v as number;
        const danger = num > 1000;
        const safe = num < 100;
        return (
          <div
            style={{
              color: danger ? 'red' : safe ? 'green' : 'unset',
              fontWeight: danger || safe ? 'bold' : 'normal',
            }}
          >
            {amount(num)}
          </div>
        );
      },
    },
    { code: 'refundCount', name: '退款数', width: 100, render: amount, align: 'right' },
    {
      code: 'salesAmount',
      name: '销售额',
      width: 100,
      render: amount,
      align: 'right',
      getCellProps: ((value: unknown) => {
        if ((value as number) > 50000) {
          return { style: { background: '#129835', color: 'white', fontWeight: 'bold' } };
        }
        return {};
      }) as FluxColumn['getCellProps'],
    },
    {
      code: 'newUserCount',
      name: '新增用户',
      width: 100,
      render: amount,
      align: 'right',
      getCellProps: ((value: unknown) => {
        if ((value as number) === 0) {
          return { style: { background: '#981c12', color: 'white', fontWeight: 'bold' } };
        }
        return {};
      }) as FluxColumn['getCellProps'],
    },
    { code: 'updateTime', name: '最后更新时间', width: 180, render: time },
  ];
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>样式说明</h1>
          <p style={{ margin: '6px 0' }}>红色字体：订单数 &gt; 1000</p>
          <p style={{ margin: '6px 0' }}>绿色背景：销售额 &gt; 50000</p>
          <p style={{ margin: '6px 0' }}>红色背景：新增用户 = 0</p>
        </div>
      </div>
      <BaseTable columns={columns} dataSource={dataSource} isLoading={isLoading} />
    </div>
  );
}

const Row = styled.div`
  height: 36px;
  display: flex;
  align-items: center;

  > span {
    width: 100px;
  }
`;

function Props组合(): React.ReactElement {
  const [config, setConfig] = useState({
    hasHeader: true,
    isLoading: false,
    useOuterBorder: false,
    dataSize: 10 as number,
    height: 'auto' as 'auto' | number,
  });
  const { isLoading, dataSource } = useRegionDataSource();
  return (
    <div>
      <div style={{ lineHeight: 1.5 }}>
        hasHeader 表示表头是否展示；
        <br />
        isLoading 表示表格数据是否在加载中；
        <br />
        useOuterBorder 表示是否使用表格最外层的 div 的边框来代替单元格的外边框
      </div>
      <Row>
        <Checkbox
          checked={config.hasHeader}
          onChange={(e) => setConfig({ ...config, hasHeader: e.target.checked })}
        >
          hasHeader
        </Checkbox>
        <Checkbox
          checked={config.isLoading}
          onChange={(e) => setConfig({ ...config, isLoading: e.target.checked })}
          style={{ marginLeft: 32 }}
        >
          isLoading
        </Checkbox>
        <Checkbox
          checked={config.useOuterBorder}
          onChange={(e) => setConfig({ ...config, useOuterBorder: e.target.checked })}
          style={{ marginLeft: 32 }}
        >
          useOuterBorder
        </Checkbox>
      </Row>
      <Row>
        <span>data size:</span>
        <Space>
          {[0, 3, 10].map((size) => (
            <Button
              key={size}
              onClick={() => setConfig({ ...config, dataSize: size })}
              size="small"
              type={config.dataSize === size ? 'primary' : 'default'}
            >
              {size}
            </Button>
          ))}
          <Button
            onClick={() => setConfig({ ...config, dataSize: Number.POSITIVE_INFINITY })}
            size="small"
            type={Number.isFinite(config.dataSize) ? 'default' : 'primary'}
          >
            不限
          </Button>
        </Space>
      </Row>
      <Row>
        <span>table height:</span>
        <Space>
          {(['auto', 200, 400, 600] as const).map((h) => (
            <Button
              key={String(h)}
              onClick={() => setConfig({ ...config, height: h })}
              size="small"
              type={config.height === h ? 'primary' : 'default'}
            >
              {h}
            </Button>
          ))}
        </Space>
      </Row>
      <p style={{ color: '#1677ff' }}>
        tips: 为表格设置具体的高度之后记得添加 style.overflow=auto，不然高度仍然会被内容撑开.
      </p>
      <BaseTable
        columns={testRegionColumns}
        dataSource={dataSource.slice(0, config.dataSize)}
        hasHeader={config.hasHeader}
        isLoading={isLoading || config.isLoading}
        style={{
          height: config.height,
          overflow: config.height === 'auto' ? 'visible' : 'auto',
          marginTop: 16,
        }}
        useOuterBorder={config.useOuterBorder}
      />
    </div>
  );
}

function 限定表格容器大小(): React.ReactElement {
  return (
    <BaseTable
      columns={[
        {
          name: '序号',
          width: 70,
          align: 'right',
          lock: true,
          getValue: (_row: unknown, rowIndex: number) => String(rowIndex + 1),
        },
        { lock: true, code: 'name', width: 200, name: '公司名称' },
        ...repeat<FluxColumn>(
          [
            { code: 'amount', width: 160, align: 'right', name: '金额' },
            { code: 'dept', width: 160, name: '金融机构' },
            { code: 'applier', width: 120, name: '申请人' },
          ],
          5,
        ),
      ]}
      dataSource={repeat(dataSource1, 10)}
      style={{ width: 800, height: 385, overflow: 'auto' }}
    />
  );
}

const meta: Meta = {
  title: 'Tables/Basic/BaseTable',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = { name: '基本用法', render: 基本用法 };
export const LeftLock: Story = { name: '左侧锁列', render: 左侧锁列 };
export const StickyHeader: Story = { name: '表头吸顶', render: 表头吸顶 };
export const CustomHeaderCell: Story = {
  name: '自定义表头单元格样式',
  render: 自定义表头单元格样式,
};
export const ColumnGroup: Story = { name: '列分组', render: 列分组 };
export const CellSpan: Story = { name: '单元格合并', render: 单元格合并 };
export const CustomCell: Story = { name: '自定义单元格样式', render: 自定义单元格样式 };
export const PropsCombination: Story = { name: 'Props 组合', render: Props组合 };
export const FixedSize: Story = { name: '限定表格容器大小', render: 限定表格容器大小 };
