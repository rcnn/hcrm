import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateRenderWindow } from '@/utils/performance';

interface VirtualScrollProps<T> {
  data: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * 虚拟滚动组件
 * 用于渲染大量数据时提高性能，只渲染可见区域和预渲染区域的数据
 */
function VirtualScroll<T>({
  data,
  itemHeight,
  height,
  renderItem,
  overscan = 5,
  className,
}: VirtualScrollProps<T>) {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * itemHeight;

  // 计算当前可见区域
  const visibleRange = useMemo(
    () => calculateRenderWindow(scrollTop, itemHeight, height, data.length, overscan),
    [scrollTop, itemHeight, height, data.length, overscan]
  );

  // 可见数据
  const visibleData = useMemo(() => {
    return data.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [data, visibleRange.startIndex, visibleRange.endIndex]);

  // 滚动事件处理
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={className}
      style={{ height, overflow: 'auto', position: 'relative' }}
      onScroll={handleScroll}
    >
      {/* 占位元素，用于撑起滚动容器高度 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 可见区域 */}
        <div
          style={{
            position: 'absolute',
            top: visibleRange.offsetY,
            left: 0,
            right: 0,
            willChange: 'transform',
          }}
        >
          {visibleData.map((item, index) => (
            <div
              key={visibleRange.startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualScroll;
