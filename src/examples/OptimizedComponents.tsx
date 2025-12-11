'use client';

import React from 'react';
import { Card, Statistic, Flex, Tag, Alert, Button, Progress, Table } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

// ===== 优化后的StatisticCard =====
interface OptimizedStatisticCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  status?: 'success' | 'warning' | 'error' | 'normal';
  trend?: number;
  description?: string;
  extra?: React.ReactNode;
}

export const OptimizedStatisticCard: React.FC<OptimizedStatisticCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  status = 'normal',
  trend,
  description,
  extra,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#52c41a';
      case 'warning': return '#fa8c16';
      case 'error': return '#f5222d';
      default: return '#1677ff';
    }
  };

  const getStatusTagColor = () => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card
      size="small"
      style={{
        borderLeft: `4px solid ${getStatusColor()}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Flex vertical gap={6}>
        <Flex justify="space-between" align="center">
          <span style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
            {title}
          </span>
          {status !== 'normal' && (
            <Tag color={getStatusTagColor()} style={{ margin: 0, fontSize: 11 }}>
              {status === 'success' && '正常'}
              {status === 'warning' && '警告'}
              {status === 'error' && '异常'}
            </Tag>
          )}
        </Flex>

        <Statistic
          value={value}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{
            fontSize: 24,
            fontWeight: 600,
            color: '#262626',
          }}
        />

        {description && (
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{description}</div>
        )}

        {trend !== undefined && (
          <Flex align="center" gap={4}>
            <span
              style={{
                fontSize: 12,
                color: trend > 0 ? '#52c41a' : trend < 0 ? '#f5222d' : '#8c8c8c',
                fontWeight: 500,
              }}
            >
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '-'} {Math.abs(trend)}%
            </span>
            <span style={{ fontSize: 11, color: '#bfbfbf' }}>较昨日</span>
          </Flex>
        )}

        {extra && <div style={{ marginTop: 4 }}>{extra}</div>}
      </Flex>
    </Card>
  );
};

// ===== 危急值提醒组件 =====
interface CriticalAlertProps {
  title: string;
  message: string;
  patientName?: string;
  onHandle?: () => void;
  onIgnore?: () => void;
}

export const CriticalAlert: React.FC<CriticalAlertProps> = ({
  title,
  message,
  patientName,
  onHandle,
  onIgnore,
}) => {
  return (
    <Alert
      message={
        <Flex justify="space-between" align="center">
          <span>
            <ExclamationCircleOutlined style={{ color: '#f5222d', marginRight: 8 }} />
            {title}
            {patientName && <strong style={{ marginLeft: 8 }}>患者：{patientName}</strong>}
          </span>
          <Tag color="error" style={{ margin: 0 }}>危急值</Tag>
        </Flex>
      }
      description={message}
      type="error"
      showIcon={false}
      style={{
        borderLeft: '4px solid #f5222d',
        background: '#fff1f0',
        marginBottom: 8,
      }}
      action={
        <Flex gap={8}>
          <Button size="small" type="primary" danger onClick={onHandle}>
            立即处理
          </Button>
          <Button size="small" onClick={onIgnore}>
            忽略
          </Button>
        </Flex>
      }
    />
  );
};

// ===== 患者状态标签 =====
interface PatientStatusTagProps {
  status: 'waiting' | 'in_progress' | 'completed' | 'critical' | 'pending';
}

export const PatientStatusTag: React.FC<PatientStatusTagProps> = ({ status }) => {
  const statusConfig = {
    waiting: { color: 'orange', text: '待接诊', icon: <ExclamationCircleOutlined /> },
    in_progress: { color: 'blue', text: '诊疗中', icon: <ExclamationCircleOutlined /> },
    completed: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
    critical: { color: 'red', text: '危急值', icon: <CloseCircleOutlined /> },
    pending: { color: 'default', text: '待处理', icon: <ExclamationCircleOutlined /> },
  };

  const config = statusConfig[status];

  return (
    <Tag color={config.color} icon={config.icon} style={{ fontWeight: 500 }}>
      {config.text}
    </Tag>
  );
};

// ===== 医疗进度条 =====
interface MedicalProgressProps {
  percent: number;
  status?: 'success' | 'normal' | 'exception';
  showInfo?: boolean;
  target?: number;
}

export const MedicalProgressBar: React.FC<MedicalProgressProps> = ({
  percent,
  status = 'normal',
  showInfo = true,
  target,
}) => {
  return (
    <div>
      <Progress
        percent={percent}
        status={status}
        strokeColor={{
          '0%': '#1677ff',
          '100%': '#52c41a',
        }}
        trailColor="#f0f0f0"
        showInfo={showInfo}
      />
      {target && (
        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
          目标：{target}%
        </div>
      )}
    </div>
  );
};

// ===== 高密度数据表格 =====
interface OptimizedTableProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  onRowClick?: (record: any) => void;
}

export const OptimizedTable: React.FC<OptimizedTableProps> = ({
  columns,
  data,
  loading,
  onRowClick,
}) => {
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={data}
      loading={loading}
      rowHeight={32}
      pagination={{
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        style: { cursor: onRowClick ? 'pointer' : 'default' },
      })}
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 2,
      }}
    />
  );
};

// ===== 使用示例 =====
export const ComponentExamples: React.FC = () => {
  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <h2>优化后组件示例</h2>

      <div>
        <h3>1. 统计卡片</h3>
        <Flex gap={16} wrap="wrap">
          <OptimizedStatisticCard
            title="今日接诊量"
            value={156}
            prefix={<CheckCircleOutlined />}
            status="success"
            trend={12.5}
          />
          <OptimizedStatisticCard
            title="7日内复查率"
            value="88.5"
            suffix="%"
            status="warning"
            trend={-2.3}
            description="目标: 90%"
          />
          <OptimizedStatisticCard
            title="危急值提醒"
            value={3}
            status="error"
            extra={<span style={{ fontSize: 12, color: '#f5222d' }}>需要立即处理</span>}
          />
        </Flex>
      </div>

      <div>
        <h3>2. 危急值提醒</h3>
        <CriticalAlert
          title="血糖危急值"
          message="患者张三血糖检测值为 2.8 mmol/L，低于危急值下限"
          patientName="张三"
          onHandle={() => console.log('处理')}
          onIgnore={() => console.log('忽略')}
        />
      </div>

      <div>
        <h3>3. 患者状态标签</h3>
        <Flex gap={8} wrap="wrap">
          <PatientStatusTag status="waiting" />
          <PatientStatusTag status="in_progress" />
          <PatientStatusTag status="completed" />
          <PatientStatusTag status="critical" />
          <PatientStatusTag status="pending" />
        </Flex>
      </div>

      <div>
        <h3>4. 医疗进度条</h3>
        <MedicalProgressBar percent={88.5} target={90} />
      </div>
    </Flex>
  );
};

export default ComponentExamples;
