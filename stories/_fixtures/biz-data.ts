import type { FluxColumn } from '@yupanzi/fluxtable';
import { proto } from '@yupanzi/fluxtable';

export function repeat<T>(arr: T[], n: number): T[] {
  return Array.from({ length: n }, () => arr).flat();
}

export function randomPick<T>(arr: T[]): T {
  // biome-ignore lint/style/noNonNullAssertion: 随机索引保证 < arr.length
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const dataSource1 = [
  {
    id: '1',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '招商银行丨杭州分行',
    applier: 'James Collier',
  },
  {
    id: '2',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '建设银行丨未来科技城',
    applier: 'Philip Burke',
  },
  {
    id: '3',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '交通银行丨浙大路支行',
    applier: 'Wesley Cruz',
  },
  {
    id: '4',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '招商银行丨庆春路支行',
    applier: 'Billy Horton',
  },
  {
    id: '5',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '招商银行丨文一路分行',
    applier: 'Paul Tran',
  },
  {
    id: '6',
    name: '晨星网络技术有限公司',
    amount: '600,000.00(CNY)',
    dept: '农业银行丨杭州分行',
    applier: 'Anna Poole',
  },
];

export const columns1: FluxColumn[] = [
  { code: 'name', width: 220, name: '公司名称' },
  { code: 'amount', width: 160, align: 'right', name: '金额' },
  { code: 'dept', width: 160, name: '金融机构' },
  { code: 'applier', width: 120, name: '申请人' },
];

export const dataSource2 = [
  { name: '远岸数科', dept: '消费者业务部-用户体验', dest: 'South Maddison', guide: 'Don Moreno' },
  {
    name: '晨星(中国)有限公司',
    dept: '出行业务部-住宿业务',
    dest: 'Emilhaven',
    guide: 'Douglas Richards',
  },
  { name: '青柚物流', dept: '消费者业务部-用户体验', dest: '云南大理', guide: 'Douglas Lee' },
  {
    name: '远岸数科',
    dept: '数据平台部-用户体验',
    dest: '杭州千岛湖',
    guide: 'Eric Castillo',
  },
  {
    name: '晨星(中国)有限公司',
    dept: '消费者业务部-用户体验',
    dest: 'East Karl',
    guide: 'Herbert Patton',
  },
];

export const columns2: FluxColumn[] = [
  { code: 'name', name: '公司名称', width: 200 },
  { code: 'dept', name: '部门名称', width: 180 },
  { code: 'dest', name: '团建目的地', width: 160 },
  { code: 'guide', name: '当地导游', width: 160 },
];

export const dataSource3 = [
  {
    name: '晨星网络技术有限公司1',
    entity: '远岸数科（中国）',
    dept: '招商银行丨杭州分行',
    applier: 'Don Moreno',
  },
  {
    name: '晨星网络技术有限公司2',
    entity: '远岸数科（中国）',
    dept: '建设银行丨未来科技城',
    applier: 'Douglas Richards',
  },
  {
    name: '晨星网络技术有限公司3',
    entity: '远岸数科（中国）',
    dept: '交通银行丨浙大路支行',
    applier: 'Douglas Lee',
  },
  {
    name: '晨星网络技术有限公司4',
    entity: '远岸数科（中国）',
    dept: '招商银行丨庆春路支行',
    applier: 'Eric Castillo',
  },
  {
    name: '晨星网络技术有限公司5',
    entity: '远岸数科（中国）',
    dept: '招商银行丨文一路分行',
    applier: 'Herbert Patton',
  },
];

export const columns3: FluxColumn[] = [
  { code: 'name', name: '公司名称', width: 200, features: { sortable: true } },
  { code: 'entity', name: '支付实体', width: 160 },
  { code: 'dept', name: '金融机构', width: 160, features: { sortable: true } },
  { code: 'applier', name: '申请人', width: 160, features: { sortable: true } },
];

interface TreeRow {
  id: string;
  title: string;
  dept: string;
  dest: string;
  guide: string;
  children?: TreeRow[];
}

export function makeChildren(prefix: string): TreeRow[] {
  return [
    {
      id: `${prefix}-1`,
      title: '二级标题',
      dept: '消费者业务部-用户体验',
      dest: '云南大理',
      guide: 'Douglas Lee',
      children: [
        {
          id: `${prefix}-1-1`,
          title: '三级标题',
          dept: '零售产品技术部-用户体验',
          dest: '云南大理',
          guide: 'Douglas Lee',
        },
        {
          id: `${prefix}-1-2`,
          title: '三级标题',
          dept: '零售产品技术部-前端',
          dest: '云南大理',
          guide: 'Douglas Lee',
        },
      ],
    },
    {
      id: `${prefix}-2`,
      title: '二级标题',
      dept: '消费者业务部-用户体验',
      dest: '云南大理',
      guide: 'Douglas Lee',
      children: [
        {
          id: `${prefix}-2-1`,
          title: '三级标题',
          dept: '零售产品技术部-用户体验',
          dest: '云南大理',
          guide: 'Douglas Lee',
        },
        {
          id: `${prefix}-2-2`,
          title: '三级标题',
          dept: '零售产品技术部-前端',
          dest: '云南大理',
          guide: 'Douglas Lee',
        },
      ],
    },
    {
      id: `${prefix}-3`,
      title: '二级标题',
      dept: '消费者业务部-用户体验',
      dest: '云南大理',
      guide: 'Douglas Lee',
    },
  ];
}

export const dataSource4: TreeRow[] = [
  {
    id: '1',
    title: '一级标题',
    dept: '消费者业务部-用户体验',
    dest: 'South Maddison',
    guide: 'Don Moreno',
    children: makeChildren('1'),
  },
  {
    id: '2',
    title: '一级标题',
    dept: '出行业务部-住宿业务',
    dest: 'Emilhaven',
    guide: 'Douglas Richards',
    children: makeChildren('2'),
  },
  {
    id: '3',
    title: '一级标题',
    dept: '消费者业务部-用户体验',
    dest: '云南大理',
    guide: 'Douglas Lee',
    children: makeChildren('3'),
  },
  {
    id: '4',
    title: '一级标题',
    dept: '数据平台部-用户体验',
    dest: '杭州千岛湖',
    guide: 'Eric Castillo',
    children: makeChildren('4'),
  },
  {
    id: '5',
    title: '一级标题',
    dept: '消费者业务部-用户体验',
    dest: 'East Karl',
    guide: 'Herbert Patton',
  },
];

export const columns4: FluxColumn[] = [
  { code: 'title', name: '标题', width: 200 },
  { code: 'dept', name: '部门名称', width: 180 },
  { code: 'dest', name: '团建目的地', width: 160 },
  { code: 'guide', name: '当地导游', width: 160 },
];

export const dataSource5 = [
  { id: '1', title: '晨星网络技术有限公司', children: makeChildren('1').slice(0, 2) },
  { id: '2', title: '远岸数科有限公司', children: makeChildren('2').slice(0, 2) },
  { id: '3', title: '其他', children: makeChildren('3').slice(0, 2) },
];

export const columns5: FluxColumn[] = [
  { code: 'title', name: '标题', width: 200 },
  { code: 'dept', name: '部门名称', width: 180 },
  { code: 'dest', name: '团建目的地', width: 160 },
  { code: 'guide', name: '当地导游', width: 160 },
];

const occupations = ['UED', '客服', '产品', '运营', '前端', '数据'];
const col = proto.array<FluxColumn>({
  align: 'center',
  width: 80,
  headerCellProps: { style: { textAlign: 'center', padding: 0 } },
});

export const dataSource6 = occupations.map((occupation) => ({
  occupation,
  hc_2014: 104,
  hc_2015: 168,
  hc_lfl: 50,
  age_2014: 30,
  age_2015: 32,
  age_lfl: 15,
  rate_2014: 0.3,
  rate_2015: 0.45,
  rate2_2014: 0.33,
  rate2_2015: 0.48,
}));

export const columns6: FluxColumn[] = col([
  { lock: true, code: 'occupation', name: '职务', width: 120 },
  {
    name: '人数',
    children: col([
      { code: 'hc_2014', name: '2014年' },
      { code: 'hc_2015', name: '2015年' },
      { code: 'hc_lfl', name: '同比增长' },
    ]),
  },
  {
    name: '年龄',
    children: col([
      { code: 'age_2014', name: '2014年' },
      { code: 'age_2015', name: '2015年' },
      { code: 'age_lfl', name: '同比增长' },
    ]),
  },
  {
    name: '占比',
    children: col([
      { code: 'rate_2014', name: '2014年' },
      { code: 'rate_2015', name: '2015年' },
    ]),
  },
  {
    name: '占比2',
    children: col([
      { code: 'rate2_2014', name: '2014年' },
      { code: 'rate2_2015', name: '2015年' },
    ]),
  },
]);
