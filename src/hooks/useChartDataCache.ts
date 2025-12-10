import { useState, useCallback, useEffect, useRef } from 'react';
import { Customer, ExaminationRecord } from '@/lib/types/customer';

// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// 图表数据类型
export type ChartDataType = 'refraction' | 'axial' | 'visual' | 'comprehensive';

// 缓存配置
interface CacheConfig {
  ttl: number; // 缓存生存时间（毫秒）
  maxSize: number; // 最大缓存项数量
}

// 缓存键生成器
const generateCacheKey = (
  type: ChartDataType,
  customerId: string,
  params?: Record<string, any>
): string => {
  const paramStr = params ? JSON.stringify(params) : '';
  return `chart_${type}_${customerId}_${paramStr}`;
};

// 默认缓存配置
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5分钟
  maxSize: 100, // 最大缓存100个图表
};

/**
 * 图表数据缓存 Hook
 * 用于缓存客户图表数据，提高性能
 */
export function useChartDataCache(config: Partial<CacheConfig> = {}) {
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config };
  const [cache, setCache] = useState<Map<string, CacheItem<any>>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const cacheRef = useRef<Map<string, CacheItem<any>>>(new Map());

  // 更新缓存引用
  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  // 清理过期缓存
  const cleanupExpiredCache = useCallback(() => {
    const now = Date.now();
    const newCache = new Map<string, CacheItem<any>>();

    for (const [key, item] of cacheRef.current.entries()) {
      if (item.expiresAt > now) {
        newCache.set(key, item);
      }
    }

    // 如果缓存超过最大大小，删除最旧的项
    if (newCache.size > cacheConfig.maxSize) {
      const sortedEntries = Array.from(newCache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );
      const entriesToDelete = sortedEntries.slice(
        0,
        newCache.size - cacheConfig.maxSize
      );
      entriesToDelete.forEach(([key]) => newCache.delete(key));
    }

    setCache(newCache);
  }, [cacheConfig.maxSize]);

  // 定期清理过期缓存
  useEffect(() => {
    const interval = setInterval(cleanupExpiredCache, 60000); // 每分钟清理一次
    return () => clearInterval(interval);
  }, [cleanupExpiredCache]);

  // 获取缓存的数据
  const getCachedData = useCallback(
    <T>(key: string): T | null => {
      const item = cacheRef.current.get(key);
      if (!item) return null;

      if (Date.now() > item.expiresAt) {
        // 缓存已过期，删除它
        const newCache = new Map(cacheRef.current);
        newCache.delete(key);
        setCache(newCache);
        return null;
      }

      return item.data as T;
    },
    []
  );

  // 设置缓存数据
  const setCachedData = useCallback(
    <T>(key: string, data: T): void => {
      const now = Date.now();
      const item: CacheItem<T> = {
        data,
        timestamp: now,
        expiresAt: now + cacheConfig.ttl,
      };

      const newCache = new Map(cacheRef.current);
      newCache.set(key, item);
      setCache(newCache);
    },
    [cacheConfig.ttl]
  );

  // 清除特定缓存
  const invalidateCache = useCallback((key?: string): void => {
    if (key) {
      const newCache = new Map(cacheRef.current);
      newCache.delete(key);
      setCache(newCache);
    } else {
      setCache(new Map());
    }
  }, []);

  // 预加载数据
  const preloadData = useCallback(
    async <T>(
      type: ChartDataType,
      customerId: string,
      params: Record<string, any>,
      dataLoader: () => Promise<T>
    ): Promise<T> => {
      const key = generateCacheKey(type, customerId, params);

      // 检查缓存
      const cachedData = getCachedData<T>(key);
      if (cachedData !== null) {
        return cachedData;
      }

      // 检查是否正在加载
      if (loading.has(key)) {
        // 等待加载完成
        return new Promise((resolve, reject) => {
          const checkLoading = setInterval(() => {
            if (!loading.has(key)) {
              clearInterval(checkLoading);
              const data = getCachedData<T>(key);
              if (data) {
                resolve(data);
              } else {
                reject(new Error('加载失败'));
              }
            }
          }, 100);

          // 10秒超时
          setTimeout(() => {
            clearInterval(checkLoading);
            reject(new Error('加载超时'));
          }, 10000);
        });
      }

      // 开始加载
      setLoading((prev) => new Set(prev).add(key));

      try {
        const data = await dataLoader();
        setCachedData(key, data);
        return data;
      } finally {
        setLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    },
    [getCachedData, setCachedData, loading]
  );

  // 生成图表数据
  const generateChartData = useCallback(
    (
      type: ChartDataType,
      customer: Customer,
      startDate?: string,
      endDate?: string
    ) => {
      const params = { startDate, endDate };
      const key = generateCacheKey(type, customer.id, params);

      return preloadData(type, customer.id, params, async () => {
        // 模拟API延迟
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 根据类型生成不同的图表数据
        switch (type) {
          case 'refraction':
            return generateRefractionData(customer.examinations, startDate, endDate);
          case 'axial':
            return generateAxialData(customer.examinations, startDate, endDate);
          case 'visual':
            return generateVisualData(customer.examinations, startDate, endDate);
          case 'comprehensive':
            return generateComprehensiveData(customer.examinations, startDate, endDate);
          default:
            return [];
        }
      });
    },
    [preloadData]
  );

  return {
    cache,
    loading: Array.from(loading),
    getCachedData,
    setCachedData,
    invalidateCache,
    generateChartData,
    preloadData,
    cleanupExpiredCache,
  };
}

// 生成度数增长曲线数据
function generateRefractionData(
  examinations: ExaminationRecord[],
  startDate?: string,
  endDate?: string
) {
  return examinations
    .filter((exam) => {
      const examDate = new Date(exam.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return examDate >= start && examDate <= end;
    })
    .map((exam) => ({
      date: exam.date,
      右眼度数: exam.odRefraction,
      左眼度数: exam.osRefraction,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 生成眼轴增长曲线数据
function generateAxialData(
  examinations: ExaminationRecord[],
  startDate?: string,
  endDate?: string
) {
  return examinations
    .filter((exam) => {
      const examDate = new Date(exam.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return examDate >= start && examDate <= end && exam.odAxialLength && exam.osAxialLength;
    })
    .map((exam) => ({
      date: exam.date,
      右眼轴长: exam.odAxialLength,
      左眼轴长: exam.osAxialLength,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 生成视力数据
function generateVisualData(
  examinations: ExaminationRecord[],
  startDate?: string,
  endDate?: string
) {
  return examinations
    .filter((exam) => {
      const examDate = new Date(exam.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return examDate >= start && examDate <= end && exam.odVisualAcuity && exam.osVisualAcuity;
    })
    .map((exam) => ({
      date: exam.date,
      右眼视力: exam.odVisualAcuity,
      左眼视力: exam.osVisualAcuity,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 生成综合数据
function generateComprehensiveData(
  examinations: ExaminationRecord[],
  startDate?: string,
  endDate?: string
) {
  return examinations
    .filter((exam) => {
      const examDate = new Date(exam.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return examDate >= start && examDate <= end;
    })
    .map((exam) => ({
      date: exam.date,
      右眼度数: exam.odRefraction,
      左眼度数: exam.osRefraction,
      右眼轴长: exam.odAxialLength || 0,
      左眼轴长: exam.osAxialLength || 0,
      眼压: exam.intraocularPressure || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
