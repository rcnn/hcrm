'use client';

import React from 'react';
import { Pie } from '@ant-design/charts';

interface DataItem {
  [key: string]: any;
}

interface PieChartProps {
  data: DataItem[];
  angleField: string;
  colorField: string;
  height?: number;
  radius?: number;
  innerRadius?: number;
  tooltip?: boolean;
  legend?: boolean;
  label?: boolean;
  loading?: boolean;
  color?: string[];
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  angleField,
  colorField,
  height = 300,
  radius = 0.8,
  innerRadius = 0,
  tooltip = true,
  legend = true,
  label = false,
  color,
}) => {
  const config = {
    data,
    angleField,
    colorField,
    height,
    radius,
    innerRadius,
    tooltip: tooltip
      ? {
          formatter: (datum: any) => {
            return {
              name: datum[colorField],
              value: `${datum[angleField]} (${((datum[angleField] / data.reduce((sum, item) => sum + item[angleField], 0)) * 100).toFixed(2)}%)`,
            };
          },
        }
      : false,
    legend: legend ? { position: 'right' } : false,
    color: color,
    label: label
      ? {
          type: 'outer',
          content: '{name} {percentage}',
          style: {
            fontSize: 12,
            textAlign: 'center',
          },
        }
      : false,
    animation: {
      appear: {
        animation: 'grow-in-xy',
        duration: 2000,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...config} />;
};

export default PieChart;
