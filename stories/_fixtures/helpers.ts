import { useEffect, useState } from 'react';

/** [min, max] 闭区间随机整数 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** [min, max) 随机浮点，保留两位小数 */
export function randomFloat(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

/** [0, 1) 随机比率，保留四位小数 */
export function randomRate(): number {
  return Number(Math.random().toFixed(4));
}

/** 延迟 ms 后 resolve 给定值，用于模拟异步请求 */
export function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface LoadingState<T> {
  dataSource: T;
  isLoading: boolean;
}

/** 模拟「请求中 → 完成」的加载态：挂载后延迟 delayMs 置为完成 */
export function useMockAsync<T>(data: T, delayMs = 300): LoadingState<T> {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);
  return { dataSource: data, isLoading };
}
