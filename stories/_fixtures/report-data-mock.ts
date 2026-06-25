import { delay, randomFloat, randomRate } from './helpers';

export interface RegionSalesRow {
  id: string;
  parentId?: string;
  /** 树形首列展示用：门店名（叶子）或大区名（中间层） */
  name?: string;
  regionName?: string;
  storeName?: string;
  exposureRate?: number;
  avgPrice?: number;
  salesAmount?: number;
  buyerCount?: number;
  overallConvRate?: number;
  searchConvRate?: number;
  categoryConvRate?: number;
  cartConvRate?: number;
}

const REGIONS = ['华东', '华南', '华北', '华中', '西南'] as const;
const STORE_TYPES = ['自营店', '加盟店', '旗舰店'] as const;

function buildMetrics(scale: 'region' | 'store'): Omit<RegionSalesRow, 'id' | 'parentId' | 'name'> {
  const big = scale === 'region';
  return {
    exposureRate: randomRate(),
    avgPrice: big ? randomFloat(10, 100) : randomFloat(5, 50),
    salesAmount: big ? randomFloat(10000, 80000) : randomFloat(1000, 30000),
    buyerCount: big ? randomFloat(100, 500) : randomFloat(50, 200),
    overallConvRate: randomRate(),
    searchConvRate: randomRate(),
    categoryConvRate: randomRate(),
    cartConvRate: randomRate(),
  };
}

let salesCache: RegionSalesRow[] | null = null;

function buildSalesData(): RegionSalesRow[] {
  const rows: RegionSalesRow[] = [];
  // 顶级汇总节点
  rows.push({ id: 'ALL', regionName: '合计', name: '合计' });
  for (const region of REGIONS) {
    const regionId = `ALL/${region}`;
    rows.push({
      id: regionId,
      parentId: 'ALL',
      regionName: region,
      name: region,
      ...buildMetrics('region'),
    });
    for (const store of STORE_TYPES) {
      rows.push({
        id: `${regionId}/${store}`,
        parentId: regionId,
        regionName: region,
        storeName: store,
        name: store,
        ...buildMetrics('store'),
      });
    }
  }
  return rows;
}

export interface IncomeRow {
  planet: string;
  area: string;
  season: string;
  month: string;
  one: string;
  two: string;
  three: string;
  a: number;
  b: number;
  c: number;
  d: number;
}

const PLANETS = ['晨星科技', '远岸数科', '青柚物流'] as const;
const AREAS = ['旗舰店', '社区店'] as const;
const SEASON_MONTHS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['Q1', ['1月', '2月', '3月']],
  ['Q2', ['4月', '5月', '6月']],
  ['Q3', ['7月', '8月', '9月']],
  ['Q4', ['10月', '11月', '12月']],
];
const CATEGORY_TREE: ReadonlyArray<{
  one: string;
  twos: ReadonlyArray<{ two: string; threes: readonly string[] }>;
}> = [
  { one: '服饰', twos: [{ two: '男装', threes: ['衬衫'] }, { two: '女装', threes: ['连衣裙'] }] },
  { one: '食品', twos: [{ two: '生鲜', threes: ['果蔬'] }, { two: '零食', threes: ['坚果'] }] },
];

let incomeCache: IncomeRow[] | null = null;

function buildIncomeData(): IncomeRow[] {
  const rows: IncomeRow[] = [];
  for (const planet of PLANETS) {
    for (const area of AREAS) {
      for (const [season, months] of SEASON_MONTHS) {
        for (const month of months) {
          for (const cat of CATEGORY_TREE) {
            for (const sub of cat.twos) {
              for (const three of sub.threes) {
                const b = randomFloat(700, 1300);
                rows.push({
                  planet,
                  area,
                  season,
                  month,
                  one: cat.one,
                  two: sub.two,
                  three,
                  a: randomFloat(800, 1200),
                  b,
                  c: randomFloat(700, 1300),
                  d: randomFloat(100, Math.max(120, b)),
                });
              }
            }
          }
        }
      }
    }
  }
  return rows;
}

/** 区域 / 门店销售树形数据（id + parentId），用于树形表格与数据报表示例。 */
export function getRegionSalesData(): Promise<RegionSalesRow[]> {
  if (!salesCache) salesCache = buildSalesData();
  return delay(200, salesCache);
}

/** 多维收入明细数据，用于钻取树表格与透视表示例。 */
export function getIncomeData(): Promise<IncomeRow[]> {
  if (!incomeCache) incomeCache = buildIncomeData();
  return delay(200, incomeCache);
}
