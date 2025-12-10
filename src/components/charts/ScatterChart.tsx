'use client';

import React from 'react';
import { Scatter } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface ScatterChartProps {
  data: DataItem[];
  xField: string;
  yField: string;
  sizeField?: string;
  colorField?: string;
  shapeField?: string;
  height?: number;
  color?: string | string[];
  padding?: [number, number, number, number];
  tooltip?: boolean;
  legend?: boolean;
  loading?: boolean;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xField,
  yField,
  sizeField,
  colorField,
  shapeField,
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
              name: '数据点',
              value: {
                [xField]: datum[xField],
                [yField]: datum[yField],
                ...(sizeField && { [sizeField]: datum[sizeField] }),
                ...(colorField && { [colorField]: datum[colorField] }),
              },
            };
          },
        }
      : false,
    legend: legend ? { position: 'top' } : false,
    color: color,
    shape: shapeField ? 'circle' : undefined,
    size: sizeField
      ? {
          field: sizeField,
          scale: {
            type: 'sqrt',
          },
        }
      : 6,
    regressionLine: {
      method: 'linear',
      style: {
        stroke: '#fa8c16',
        lineWidth: 2,
        shadowColor: '#fa8c16',
        shadowBlur: 10,
      },
    },
    animation: {
      appear: {
        animation: 'zoom-in',
        duration: 2000,
      },
    },
  };

  if (colorField) {
    (config as any).colorField = colorField;
  }

  if (shapeField) {
    (config as any).shapeField = shapeField;
  }

  return <Scatter {...config} />;
};

export default ScatterChart;
