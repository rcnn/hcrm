'use client';

import React from 'react';
import { Radar } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface RadarChartProps {
  data: DataItem[];
  xField: string;
  yField: string;
  seriesField?: string;
  height?: number;
  color?: string | string[];
  padding?: [number, number, number, number];
  tooltip?: boolean;
  legend?: boolean;
  loading?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  xField,
  yField,
  seriesField,
  height = 300,
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
    area: {
      fillOpacity: 0.3,
    },
    line: {
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

  return <Radar {...config} />;
};

export default RadarChart;
