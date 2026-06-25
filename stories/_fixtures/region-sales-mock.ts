import type { FluxColumn } from '@yupanzi/fluxtable';
import { amount, time } from './format';
import { type LoadingState, randomInt, useMockAsync } from './helpers';

export interface RegionItem {
  regionName: string;
  orderCount: number;
  refundCount: number;
  salesAmount: number;
  newUserCount: number;
  updateTime: string;
  children?: StoreItem[];
}

export type StoreItem = Omit<RegionItem, 'children'> & {
  storeName: string;
};

const REGIONS: readonly string[] = [
  '华东一区',
  '华东二区',
  '华南一区',
  '华南二区',
  '华北一区',
  '华北二区',
  '华中一区',
  '华中二区',
  '西南一区',
  '西南二区',
  '西北区',
  '东北区',
  '京津区',
  '川渝区',
  '闽粤区',
] as const;

function buildStoreItems(region: string): StoreItem[] {
  const storeCount = randomInt(3, 5);
  const updateTime = '2024-02-15 19:52:02.000';
  return Array.from({ length: storeCount }, (_, idx) => ({
    regionName: region,
    storeName: `${region}-门店${idx + 1}`,
    orderCount: randomInt(10, 500),
    refundCount: randomInt(0, 50),
    salesAmount: randomInt(1000, 90000),
    newUserCount: randomInt(0, 80),
    updateTime,
  }));
}

function buildMockData(): { regions: RegionItem[]; stores: StoreItem[] } {
  const regions: RegionItem[] = [];
  const stores: StoreItem[] = [];
  for (const name of REGIONS) {
    const regionStores = buildStoreItems(name);
    stores.push(...regionStores);
    const totalOrder = regionStores.reduce((sum, s) => sum + s.orderCount, 0);
    const totalRefund = regionStores.reduce((sum, s) => sum + s.refundCount, 0);
    const totalSales = regionStores.reduce((sum, s) => sum + s.salesAmount, 0);
    const totalNewUser = regionStores.reduce((sum, s) => sum + s.newUserCount, 0);
    regions.push({
      regionName: name,
      orderCount: totalOrder,
      refundCount: totalRefund,
      salesAmount: totalSales,
      newUserCount: totalNewUser,
      updateTime: '2024-02-15 19:52:02.000',
      children: regionStores,
    });
  }
  regions.sort((a, b) => b.orderCount - a.orderCount);
  return { regions, stores };
}

const MOCK_DATA = buildMockData();

const rawCols = {
  regionName: { code: 'regionName', name: '大区', width: 150 },
  storeName: { code: 'storeName', name: '门店', width: 150 },
  orderCount: {
    code: 'orderCount',
    name: '订单数',
    width: 100,
    render: amount,
    align: 'right' as const,
  },
  refundCount: {
    code: 'refundCount',
    name: '退款数',
    width: 100,
    render: amount,
    align: 'right' as const,
  },
  salesAmount: {
    code: 'salesAmount',
    name: '销售额',
    width: 100,
    render: amount,
    align: 'right' as const,
  },
  newUserCount: {
    code: 'newUserCount',
    name: '新增用户',
    width: 100,
    render: amount,
    align: 'right' as const,
  },
  updateTime: {
    code: 'updateTime',
    name: '最后更新时间',
    width: 180,
    render: time,
  },
};

const indCols: FluxColumn[] = [rawCols.orderCount, rawCols.salesAmount, rawCols.newUserCount];

export const cols = { ...rawCols, indCols };

export const testRegionColumns: FluxColumn[] = [cols.regionName, ...cols.indCols, cols.updateTime];

const REGIONS_NO_CHILDREN = MOCK_DATA.regions.map(({ children: _c, ...rest }) => rest);

export function useAllStoreDataSource(): LoadingState<StoreItem[]> {
  return useMockAsync(MOCK_DATA.stores);
}

export function useRegionDataSource(): LoadingState<Omit<RegionItem, 'children'>[]> {
  return useMockAsync(REGIONS_NO_CHILDREN);
}

export function useRegionTreeDataSource(): LoadingState<RegionItem[]> {
  return useMockAsync(MOCK_DATA.regions);
}
