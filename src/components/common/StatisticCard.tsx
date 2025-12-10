'use client';

import React from 'react';
import { Card, Statistic, Flex } from 'antd';
import type { CardProps } from 'antd';

interface StatisticCardProps extends Omit<CardProps, 'prefix' | 'suffix'> {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  precision?: number;
  trend?: number;
  valueStyle?: React.CSSProperties;
}

export default function StatisticCard({
  title,
  value,
  prefix,
  suffix,
  precision,
  trend,
  valueStyle,
  ...props
}: StatisticCardProps) {
  return (
    <Card size="small" {...props}>
      <Flex vertical gap={8}>
        <Statistic
          title={title}
          value={value}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
          valueStyle={{
            fontSize: 18,
            fontWeight: 500,
            ...valueStyle,
          }}
        />
        {trend !== undefined && (
          <div
            style={{
              fontSize: 12,
              color: trend > 0 ? '#52c41a' : trend < 0 ? '#f5222d' : '#8c8c8c',
            }}
          >
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '-'} {Math.abs(trend)}%
          </div>
        )}
      </Flex>
    </Card>
  );
}
