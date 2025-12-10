import React, { memo } from 'react';
import { Line, Column, Pie, Area, Scatter, Radar } from '@ant-design/charts';

/**
 * 图表组件属性
 */
interface ChartProps {
  data?: any;
  xField?: string;
  yField?: string;
  seriesField?: string;
  height?: number;
  [key: string]: any;
}

/**
 * 折线图（优化版）
 */
export const MemoizedLineChart = memo<ChartProps>(({ data, xField, yField, height = 300, ...rest }) => {
  if (!data || !xField || !yField) {
    return null;
  }

  const config = {
    data,
    xField,
    yField,
    height,
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    ...rest,
  };

  return <Line {...config} />;
});

MemoizedLineChart.displayName = 'MemoizedLineChart';

/**
 * 柱状图（优化版）
 */
export const MemoizedColumnChart = memo<ChartProps>(({ data, xField, yField, height = 300, ...rest }) => {
  if (!data || !xField || !yField) {
    return null;
  }

  const config = {
    data,
    xField,
    yField,
    height,
    animation: {
      appear: {
        animation: 'scale-in-x',
        duration: 1000,
      },
    },
    ...rest,
  };

  return <Column {...config} />;
});

MemoizedColumnChart.displayName = 'MemoizedColumnChart';

/**
 * 饼图（优化版）
 */
export const MemoizedPieChart = memo<ChartProps>(({ data, angleField, colorField, height = 300, ...rest }) => {
  if (!data || !angleField || !colorField) {
    return null;
  }

  const config = {
    data,
    angleField,
    colorField,
    height,
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    ...rest,
  };

  return <Pie {...config} />;
});

MemoizedPieChart.displayName = 'MemoizedPieChart';

/**
 * 面积图（优化版）
 */
export const MemoizedAreaChart = memo<ChartProps>(({ data, xField, yField, height = 300, ...rest }) => {
  if (!data || !xField || !yField) {
    return null;
  }

  const config = {
    data,
    xField,
    yField,
    height,
    smooth: true,
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    ...rest,
  };

  return <Area {...config} />;
});

MemoizedAreaChart.displayName = 'MemoizedAreaChart';

/**
 * 散点图（优化版）
 */
export const MemoizedScatterChart = memo<ChartProps>(({ data, xField, yField, height = 300, ...rest }) => {
  if (!data || !xField || !yField) {
    return null;
  }

  const config = {
    data,
    xField,
    yField,
    height,
    animation: {
      appear: {
        animation: 'zoom-in',
        duration: 1000,
      },
    },
    ...rest,
  };

  return <Scatter {...config} />;
});

MemoizedScatterChart.displayName = 'MemoizedScatterChart';

/**
 * 雷达图（优化版）
 */
export const MemoizedRadarChart = memo<ChartProps>(({ data, xField, yField, height = 300, ...rest }) => {
  if (!data || !xField || !yField) {
    return null;
  }

  const config = {
    data,
    xField,
    yField,
    height,
    animation: {
      appear: {
        animation: 'grow-in-xy',
        duration: 1000,
      },
    },
    ...rest,
  };

  return <Radar {...config} />;
});

MemoizedRadarChart.displayName = 'MemoizedRadarChart';

export default {
  LineChart: MemoizedLineChart,
  ColumnChart: MemoizedColumnChart,
  PieChart: MemoizedPieChart,
  AreaChart: MemoizedAreaChart,
  ScatterChart: MemoizedScatterChart,
  RadarChart: MemoizedRadarChart,
};
