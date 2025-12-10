import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';

/**
 * 懒加载图表组件
 * 使用React.lazy和Suspense实现图表的懒加载
 */

// 懒加载各种图表组件
const LazyLineChart = lazy(() => import('./LineChart'));
const LazyColumnChart = lazy(() => import('./BarChart'));
const LazyPieChart = lazy(() => import('./PieChart'));
const LazyAreaChart = lazy(() => import('./AreaChart'));
const LazyScatterChart = lazy(() => import('./ScatterChart'));
const LazyRadarChart = lazy(() => import('./RadarChart'));
const LazyDrillDownChart = lazy(() => import('./DrillDownChart'));
const LazyMultiDimensionFilter = lazy(() => import('./MultiDimensionFilter'));

/**
 * 懒加载图表包装器组件
 */
interface LazyChartWrapperProps {
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'drilldown' | 'filter';
  props?: any;
  fallback?: React.ReactNode;
}

/**
 * 懒加载图表组件
 */
const LazyChart: React.FC<LazyChartWrapperProps> = ({ chartType, props = {}, fallback }) => {
  const defaultFallback = (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
    </div>
  );

  const chartComponents = {
    line: LazyLineChart,
    bar: LazyColumnChart,
    pie: LazyPieChart,
    area: LazyAreaChart,
    scatter: LazyScatterChart,
    radar: LazyRadarChart,
    drilldown: LazyDrillDownChart,
    filter: LazyMultiDimensionFilter,
  };

  const ChartComponent = chartComponents[chartType];

  if (!ChartComponent) {
    return <div>未知的图表类型: {chartType}</div>;
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <ChartComponent {...props} />
    </Suspense>
  );
};

export default LazyChart;
