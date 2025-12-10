'use client';

import React from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert as AlertType } from '@/types/dashboard';
import dayjs from 'dayjs';

const { Text } = Typography;

interface AlertItemProps {
  alert: AlertType;
  onHandle?: (alertId: string) => void;
  onIgnore?: (alertId: string) => void;
  onView?: (alert: AlertType) => void;
}

/**
 * 预警条目组件
 * 用于展示预警信息，支持处理和忽略操作
 */
const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onHandle,
  onIgnore,
  onView,
}) => {
  const getAlertType = () => {
    if (alert.severity === 'high') return 'error';
    if (alert.severity === 'medium') return 'warning';
    return 'warning';
  };

  const getIcon = () => {
    if (alert.severity === 'high') return <ExclamationCircleOutlined />;
    return <WarningOutlined />;
  };

  const getSeverityColor = () => {
    if (alert.severity === 'high') return '#f5222d';
    if (alert.severity === 'medium') return '#faad14';
    return '#1890ff';
  };

  const formatTimestamp = (timestamp: Date) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
  };

  return (
    <Alert
      message={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{alert.message}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatTimestamp(alert.timestamp)}
          </Text>
        </div>
      }
      description={
        <div>
          <Text type="secondary">{alert.department}</Text>
          {alert.currentValue !== undefined && alert.threshold !== undefined && (
            <Text
              type="secondary"
              style={{
                marginLeft: 16,
                color: getSeverityColor(),
                fontWeight: 500,
              }}
            >
              当前值: {alert.currentValue}%
              {alert.threshold < 0 ? ' (下降)' : ' (上升)'}
              {Math.abs(alert.currentValue)}% | 阈值: {alert.threshold}%
            </Text>
          )}
        </div>
      }
      type={getAlertType()}
      showIcon
      icon={getIcon()}
      action={
        <Space>
          {onView && (
            <Button size="small" onClick={() => onView(alert)}>
              查看
            </Button>
          )}
          <Button size="small" type="primary" onClick={() => onHandle?.(alert.id)}>
            处理
          </Button>
          <Button size="small" onClick={() => onIgnore?.(alert.id)}>
            忽略
          </Button>
        </Space>
      }
      closable
      style={{ marginBottom: 8 }}
    />
  );
};

export default AlertItem;
