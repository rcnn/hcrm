'use client';

import React from 'react';
import { Line } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface LineChartProps {
  data: DataItem[];
  xField: string;
  yField: string;
  seriesField?: string;
  height?: number;
  smooth?: boolean;
  color?: string | string[];
  padding?: [number, number, number, number];
  tooltip?: boolean;
  legend?: boolean;
  loading?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  seriesField,
  height = 300,
  smooth = true,
  color,
  padding = 'auto',
  tooltip = true,
  legend = true,
  loading = false,
}) => {
  const config = {
    data,
    xField,
    yField,
    height,
    smooth,
    padding,
    tooltip: tooltip
      ? {
          formatter: (datum: any) => {
            return {
              name: seriesField ? datum[seriesField] : yField,
              value: datum[yField],
            };
          },
        }
      : false,
    legend: legend && seriesField ? { position: 'top' } : false,
    color: color,
    lineStyle: {
      lineWidth: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 2000,
      },
    },
  };

  if (seriesField) {
    (config as any).seriesField = seriesField;
  }

  return <Line {...config} />;
};

export default LineChart;
