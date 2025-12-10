'use client';

import React from 'react';
import { Card, Progress, Typography } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface GaugeCardProps {
  title: string;
  percent: number;
  target?: number;
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
  status?: 'normal' | 'exception' | 'active' | 'success';
  strokeColor?: string | string[] | object;
  loading?: boolean;
  onClick?: () => void;
  extra?: React.ReactNode;
}

/**
 * 进度仪表盘组件
 * 用于展示环形进度指标
 */
const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  percent,
  target,
  format = (val) => `${val || 0}%`,
  status = 'normal',
  strokeColor,
  loading = false,
  onClick,
  extra,
}) => {
  // 根据百分比自动确定状态
  const getStatus = () => {
    if (status !== 'normal') return status;
    if (percent >= 90) return 'success';
    if (percent < 60) return 'exception';
    return 'active';
  };

  // 根据百分比设置颜色
  const getStrokeColor = () => {
    if (strokeColor) return strokeColor;
    if (percent >= 90) return { '0%': '#1890ff', '100%': '#52c41a' } as any;
    if (percent < 60) return '#f5222d';
    return '#1890ff';
  };

  return (
    <Card
      title={title}
      size="small"
      extra={extra || (onClick && <a onClick={onClick}>详情</a>)}
      loading={loading}
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{ textAlign: 'center' }}>
        <Progress
          type="dashboard"
          percent={percent}
          success={target ? { percent: target } : undefined}
          format={format}
          status={getStatus()}
          strokeColor={getStrokeColor()}
        />
        {target && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              目标：{target}%
            </Text>
            <CaretUpOutlined style={{ color: '#52c41a', marginLeft: 4 }} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default GaugeCard;
