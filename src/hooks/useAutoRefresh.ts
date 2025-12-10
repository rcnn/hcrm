'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // 刷新间隔（毫秒），默认 5 分钟
  enabled?: boolean; // 是否启用自动刷新
  onRefresh?: () => void; // 刷新回调函数
}

export const useAutoRefresh = (options: UseAutoRefreshOptions = {}) => {
  const { interval = 5 * 60 * 1000, enabled = true, onRefresh } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setLastRefreshTime(new Date());
    } catch (error) {
      console.error('自动刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const start = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (enabled) {
        refresh();
      }
    }, interval);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    start();
  };

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, interval]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isRefreshing,
    lastRefreshTime,
    refresh,
    start,
    stop,
    reset,
  };
};

export default useAutoRefresh;
