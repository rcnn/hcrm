'use client';

import React from 'react';
import { Area } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface AreaChartProps {
  data: DataItem[];
  xField: string;
  yField: string;
  seriesField?: string;
  height?: number;
  color?: string | string[];
  padding?: [number, number, number, number];
  tooltip?: boolean;
  legend?: boolean;
  smooth?: boolean;
  gradient?: boolean;
  loading?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xField,
  yField,
  seriesField,
  height = 300,
  color,
  padding = 'auto',
  tooltip = true,
  legend = true,
  smooth = true,
  gradient = true,
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
    areaStyle: gradient
      ? {
          fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        }
      : undefined,
    line: {
      lineWidth: 2,
    },
    point: {
      size: 3,
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

  return <Area {...config} />;
};

export default AreaChart;
