'use client';

import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface KPICardProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: string;
  precision?: number;
  valueStyle?: React.CSSProperties;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  loading?: boolean;
  onClick?: () => void;
}

/**
 * KPI卡片组件
 * 用于展示关键绩效指标
 */
const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  valueStyle,
  trend,
  loading = false,
  onClick,
}) => {
  const getTrendColor = () => {
    if (!trend) return undefined;
    return trend.direction === 'up' ? '#52c41a' : '#f5222d';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === 'up' ? (
      <CaretUpOutlined style={{ color: '#52c41a' }} />
    ) : (
      <CaretDownOutlined style={{ color: '#f5222d' }} />
    );
  };

  return (
    <Card
      size="small"
      loading={loading}
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        precision={precision}
        valueStyle={{ fontSize: 18, ...valueStyle }}
      />
      {trend && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          {getTrendIcon()}
          <Text style={{ color: getTrendColor(), fontSize: 12 }}>
            {Math.abs(trend.value)}%
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            较昨日
          </Text>
        </div>
      )}
    </Card>
  );
};

export default KPICard;
