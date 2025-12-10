import React from 'react';

/**
 * 性能优化工具函数
 */

/**
 * 图表数据抽样算法
 * 当数据点过多时，通过抽样减少数据量以提高渲染性能
 * @param data 原始数据数组
 * @param maxPoints 最大数据点数量，默认为100
 * @param priority 抽样优先级：'start' | 'end' | 'both'，默认为'both'
 * @returns 抽样后的数据
 */
export const sampleChartData = <T>(
  data: T[],
  maxPoints: number = 100,
  priority: 'start' | 'end' | 'both' = 'both'
): T[] => {
  if (data.length <= maxPoints) {
    return data;
  }

  const step = Math.ceil(data.length / maxPoints);
  const sampled: T[] = [];

  if (priority === 'start') {
    // 保留开头的数据
    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }
  } else if (priority === 'end') {
    // 保留结尾的数据
    const startIndex = data.length - maxPoints * step;
    for (let i = startIndex; i < data.length; i += step) {
      if (i >= 0) {
        sampled.push(data[i]);
      }
    }
  } else {
    // 保留开头和结尾的数据
    const halfPoints = Math.floor(maxPoints / 2);
    const startStep = Math.ceil(data.length / halfPoints);

    // 保留前半部分
    for (let i = 0; i < data.length / 2; i += startStep) {
      sampled.push(data[i]);
    }

    // 保留后半部分
    for (let i = Math.ceil(data.length / 2); i < data.length; i += startStep) {
      sampled.push(data[i]);
    }
  }

  return sampled;
};

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 * @param func 要执行的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 创建虚拟滚动容器
 * @param itemHeight 单项高度
 * @param containerHeight 容器高度
 * @param overscan 预渲染数量，默认为5
 * @returns 虚拟滚动配置
 */
export const createVirtualScrollConfig = (
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  return {
    itemHeight,
    containerHeight,
    overscan,
    visibleCount,
    totalHeight: (data: any[]) => data.length * itemHeight,
    getVisibleRange: (scrollTop: number, dataLength: number) => {
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + visibleCount + overscan, dataLength);
      const startIndex = Math.max(0, start - overscan);

      return { startIndex, endIndex: end };
    },
  };
};

/**
 * 内存缓存工具
 */
export class MemoryCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.ttl = ttl; // 默认5分钟缓存
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

/**
 * 懒加载组件的高阶函数
 * @param importFunc 动态导入函数
 * @returns 懒加载组件
 */
export const lazy = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFunc);
};

/**
 * 计算列表渲染窗口
 * @param scrollTop 滚动位置
 * @param itemHeight 单项高度
 * @param containerHeight 容器高度
 * @param totalItems 总项目数
 * @param overscan 预渲染数量
 * @returns 渲染窗口配置
 */
export const calculateRenderWindow = (
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan: number = 5
) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    totalItems
  );

  return {
    startIndex: Math.max(0, startIndex - overscan),
    endIndex,
    offsetY: startIndex * itemHeight,
  };
};

/**
 * 批量更新状态
 * @param updater 状态更新函数
 * @param updates 要更新的数据
 */
export const batchUpdate = <T>(
  updater: (update: T | ((prev: T) => T)) => void,
  updates: T
): void => {
  // 在React 18中，状态更新自动批处理
  updater(updates);
};

export default {
  sampleChartData,
  debounce,
  throttle,
  createVirtualScrollConfig,
  MemoryCache,
  lazy,
  calculateRenderWindow,
  batchUpdate,
};
