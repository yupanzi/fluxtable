import dayjs from 'dayjs';
import type { CSSProperties, ReactNode } from 'react';

export type NumberFormatter = (value: string | number | null | undefined) => string;
export type RichNumberFormatter = (value: string | number | null | undefined) => ReactNode;

const intl0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const intl1 = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const intl2 = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const intlPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function isDash(v: string | number | null | undefined): boolean {
  return v === '-' || v == null || (typeof v === 'number' && Number.isNaN(v));
}

export const plain: NumberFormatter = (v) => (isDash(v) ? '-' : String(v));

export const amount0: NumberFormatter = (v) => (isDash(v) ? '-' : intl0.format(Number(v)));
export const amount = amount0;
export const amount1: NumberFormatter = (v) => (isDash(v) ? '-' : intl1.format(Number(v)));
export const amount2: NumberFormatter = (v) => (isDash(v) ? '-' : intl2.format(Number(v)));
export const ratio: NumberFormatter = (v) => (isDash(v) ? '-' : intlPercent.format(Number(v)));

export function time(d: string): string {
  return dayjs(d).format('YYYY年MM月DD日 HH:mm:ss');
}

interface IconProps {
  size?: number;
  style?: CSSProperties;
}

function BeautifulUpIcon({ size = 12, style }: IconProps): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      style={style}
      viewBox="0 0 1024 1024"
      width={size}
    >
      <title>上升</title>
      <path d="M682.667 512v426.667H341.333V512h-256L512 0l426.667 512h-256z" />
    </svg>
  );
}

function BeautifulDownIcon({ size = 12, style }: IconProps): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      style={style}
      viewBox="0 0 1024 1024"
      width={size}
    >
      <title>下降</title>
      <path d="M682.667 426.667V0H341.333v426.667h-256l426.667 512 426.667-512h-256z" />
    </svg>
  );
}

function renderLflCell(children: ReactNode): ReactNode {
  return (
    <div
      className="lfl-cell"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  );
}

/** 环比/同比格式化：返回带箭头的富元素 */
export const lfl: RichNumberFormatter = (value) => {
  if (isDash(value) || value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
    return renderLflCell('-');
  }
  const n = Number(value);
  if (n > 0) {
    return renderLflCell(
      <>
        <span style={{ color: '#f4485c' }}>{intlPercent.format(n)}</span>
        <BeautifulUpIcon style={{ marginLeft: 4, color: '#f4485c' }} />
      </>,
    );
  }
  if (n < 0) {
    return renderLflCell(
      <>
        <span style={{ color: '#00a854' }}>{intlPercent.format(n)}</span>
        <BeautifulDownIcon style={{ marginLeft: 4, color: '#00a854' }} />
      </>,
    );
  }
  return renderLflCell(<span style={{ color: '#838383' }}>0</span>);
};

/** 金额格式化：自动选择万/亿单位 */
export const money: NumberFormatter = (v) => {
  if (isDash(v)) return '-';
  const n = Number(v);
  if (n < 0) return `-${money(-n)}`;
  if (n === 0) return '0';
  if (n < 1e4) return intl0.format(n);
  if (n < 10e4) return `${intl1.format(n / 1e4)}万`;
  if (n < 1e8) return `${intl0.format(n / 1e4)}万`;
  if (n < 10e8) return `${intl1.format(n / 1e8)}亿`;
  return `${intl0.format(n / 1e8)}亿`;
};
