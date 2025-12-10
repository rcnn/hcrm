'use client';

import React from 'react';
import { Column } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface BarChartProps {
  data: DataItem[];
  xField: string;
  yField: string;
  seriesField?: string;
  height?: number;
  color?: string | string[];
  padding?: [number, number, number, number];
  tooltip?: boolean;
  legend?: boolean;
  horizontal?: boolean;
  stacked?: boolean;
  loading?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  yField,
  seriesField,
  height = 300,
  color,
  padding = 'auto',
  tooltip = true,
  legend = true,
  horizontal = false,
  stacked = false,
  loading = false,
}) => {
  const config = {
    data,
    xField: horizontal ? yField : xField,
    yField: horizontal ? xField : yField,
    height,
    padding,
    tooltip: tooltip
      ? {
          formatter: (datum: any) => {
            return {
              name: seriesField ? datum[seriesField] : yField,
              value: datum[horizontal ? xField : yField],
            };
          },
        }
      : false,
    legend: legend && seriesField ? { position: 'top' } : false,
    color: color,
    columnStyle: {
      radius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
    },
    animation: {
      appear: {
        animation: 'grow-in-x',
        duration: 2000,
      },
    },
  };

  if (seriesField) {
    (config as any).seriesField = seriesField;
    (config as any).isStack = stacked;
  }

  if (horizontal) {
    (config as any).meta = {
      [xField]: {
        type: 'linear',
      },
    };
  }

  return <Column {...config} />;
};

export default BarChart;
