import { FilterOutlined } from '@ant-design/icons';
import type { FluxColumn, TableTransform } from '@yupanzi/fluxtable';
import {
  BaseTable,
  applyTransforms,
  collectNodes,
  internals,
  proto,
  traverseColumn,
} from '@yupanzi/fluxtable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, InputNumber, Popover, Slider, Space } from 'antd';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { cols, useRegionTreeDataSource } from '../_fixtures/region-sales-mock';

type FilterState = Record<string, unknown>;

interface NormalFilterProps {
  code: string;
  valueList: (string | number)[];
  selectedValues: (string | number)[];
  filterState: FilterState;
  onChangeFilterState: (next: FilterState) => void;
  fitFilterValues: (string | number)[];
}

function NormalFilter({
  code,
  valueList,
  selectedValues,
  filterState,
  onChangeFilterState,
  fitFilterValues,
}: NormalFilterProps): ReactNode {
  return (
    <div style={{ minHeight: 150, minWidth: 150 }}>
      <div style={{ maxHeight: 300, overflow: 'auto', padding: 8 }}>
        {valueList.map((v) => {
          const checked = selectedValues.includes(v);
          return (
            <div key={String(v)} style={{ height: 24, display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={checked}
                onChange={() => {
                  onChangeFilterState({
                    ...filterState,
                    [code]: checked
                      ? selectedValues.filter((x) => x !== v)
                      : selectedValues.concat([v]),
                  });
                }}
              >
                {v}
              </Checkbox>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Space size="small">
          <Button
            onClick={() => onChangeFilterState({ ...filterState, [code]: null })}
            size="small"
            type="primary"
          >
            重置
          </Button>
          <Button
            onClick={() => onChangeFilterState({ ...filterState, [code]: fitFilterValues })}
            size="small"
          >
            自适应匹配
          </Button>
          <Button
            onClick={() => {
              const selectedSet = new Set(selectedValues);
              onChangeFilterState({
                ...filterState,
                [code]: valueList.filter((v) => !selectedSet.has(v)),
              });
            }}
            size="small"
          >
            反选
          </Button>
        </Space>
      </div>
    </div>
  );
}

interface RangeFilterProps {
  code: string;
  extent: [number, number];
  selectedRange: [number, number];
  filterState: FilterState;
  onChangeFilterState: (next: FilterState) => void;
}

function RangeFilter({
  code,
  extent,
  selectedRange,
  filterState,
  onChangeFilterState,
}: RangeFilterProps): ReactNode {
  return (
    <div style={{ minHeight: 100, minWidth: 260 }}>
      <div style={{ padding: '8px 16px' }}>
        <Slider
          max={extent[1]}
          min={extent[0]}
          onChange={(r) => {
            const [min, max] = r as [number, number];
            onChangeFilterState({ ...filterState, [code]: [min, max] });
          }}
          range
          value={selectedRange}
        />
      </div>
      <div style={{ padding: '4px 16px', display: 'flex', gap: 8 }}>
        <InputNumber
          onChange={(v) => {
            if (typeof v === 'number') {
              onChangeFilterState({ ...filterState, [code]: [v, selectedRange[1]] });
            }
          }}
          size="small"
          value={selectedRange[0]}
        />
        <InputNumber
          onChange={(v) => {
            if (typeof v === 'number') {
              onChangeFilterState({ ...filterState, [code]: [selectedRange[0], v] });
            }
          }}
          size="small"
          value={selectedRange[1]}
        />
      </div>
      <div style={{ padding: 4 }}>
        <Button onClick={() => onChangeFilterState({ ...filterState, [code]: null })} size="small">
          重置
        </Button>
      </div>
    </div>
  );
}

function extent(values: number[]): [number, number] {
  if (values.length === 0) return [0, 0];
  let min = values[0] as number;
  let max = values[0] as number;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

interface MakeFilterTransformInput {
  filterState: FilterState;
  onChangeFilterState: (next: FilterState) => void;
}

function makeFilterTransform({
  filterState,
  onChangeFilterState,
}: MakeFilterTransformInput): TableTransform {
  return (input) =>
    applyTransforms(
      input,
      ({ dataSource, columns }) => {
        const filterCols = collectNodes(columns, 'leaf-only').filter(
          (col: FluxColumn) => col.code != null && col.features?.filter,
        );
        const cache = new Map<string, Set<unknown>>();
        for (const col of filterCols) {
          if (!col.code) continue;
          if (col.features?.filter === 'range') continue;
          if (filterState[col.code] == null) continue;
          cache.set(col.code, new Set(filterState[col.code] as unknown[]));
        }
        return {
          dataSource: dataSource.filter((record: Record<string, unknown>, rowIndex: number) =>
            filterCols.every((col: FluxColumn) => {
              if (!col.code) return true;
              if (filterState[col.code] == null) return true;
              if (col.features?.filter === 'range') {
                const selected = filterState[col.code] as [number, number];
                const v = internals.safeGetValue(col, record, rowIndex) as number;
                return selected[0] <= v && v <= selected[1];
              }
              return cache.get(col.code)?.has(internals.safeGetValue(col, record, rowIndex));
            }),
          ),
          columns,
        };
      },
      traverseColumn((col, { dataSource }) => {
        if (col.code == null || !col.features?.filter) return col;
        const justifyContent =
          col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';
        const prevTitle = internals.safeRenderHeader(col);
        const valueList = uniq(
          input.dataSource.map((record: Record<string, unknown>, rowIndex: number) =>
            internals.safeGetValue(col, record, rowIndex),
          ),
        ) as (string | number)[];

        let isActiveFilter: boolean;
        let filterView: ReactNode;

        if (col.features.filter === 'range') {
          const ext = extent(valueList as number[]);
          const selectedRange = ((filterState[col.code] as [number, number] | undefined) ??
            ext) as [number, number];
          isActiveFilter = !(selectedRange[0] === ext[0] && selectedRange[1] === ext[1]);
          filterView = (
            <RangeFilter
              code={col.code}
              extent={ext}
              filterState={filterState}
              onChangeFilterState={onChangeFilterState}
              selectedRange={selectedRange}
            />
          );
        } else {
          const selectedValues =
            (filterState[col.code] as (string | number)[] | undefined) ?? valueList;
          isActiveFilter = selectedValues.length !== valueList.length;
          const fitFilterValues = uniq(
            dataSource.map((record: Record<string, unknown>, rowIndex: number) =>
              internals.safeGetValue(col, record, rowIndex),
            ),
          ) as (string | number)[];
          filterView = (
            <NormalFilter
              code={col.code}
              filterState={filterState}
              fitFilterValues={fitFilterValues}
              onChangeFilterState={onChangeFilterState}
              selectedValues={selectedValues}
              valueList={valueList}
            />
          );
        }

        return {
          ...col,
          title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent }}>
              <Popover content={filterView} trigger="click">
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: isActiveFilter ? '#1677ff' : undefined,
                    fontWeight: isActiveFilter ? 'bold' : 'normal',
                  }}
                >
                  {prevTitle}
                  <FilterOutlined style={{ marginLeft: 2 }} />
                </div>
              </Popover>
            </div>
          ),
        };
      }),
    );
}

const meta: Meta = {
  title: 'Tables/Others/Filter',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const 筛选: Story = {
  render: (): React.ReactElement => {
    const { dataSource, isLoading } = useRegionTreeDataSource();
    const [filterState, onChangeFilterState] = useState<FilterState>({});

    const colProto = proto.array<FluxColumn>({ features: proto.object({ filter: true }) });

    const columns = colProto([
      { lock: true, width: 80, name: '', code: 'order', features: { filter: false } },
      cols.regionName,
      cols.storeName,
      { ...cols.orderCount, features: { filter: 'range' } },
      { ...cols.salesAmount, features: { filter: 'range' } },
      { ...cols.newUserCount, features: { filter: 'range' } },
      cols.updateTime,
    ]);

    const renderData = applyTransforms(
      {
        dataSource: dataSource
          .slice(0, 15)
          .flatMap((prov) => prov.children ?? [])
          .map((row, i) => ({ ...row, order: i + 1 })),
        columns,
      },
      makeFilterTransform({ filterState, onChangeFilterState }),
    );

    return (
      <div>
        <p>tips: 自适应匹配 —— 根据其他列的筛选条件缩小当前列的筛选范围</p>
        <div>
          <Button onClick={() => onChangeFilterState({})}>重置筛选</Button>
        </div>
        <BaseTable
          columns={renderData.columns}
          dataSource={renderData.dataSource}
          isLoading={isLoading}
          style={{ marginTop: 8 }}
        />
      </div>
    );
  },
};
