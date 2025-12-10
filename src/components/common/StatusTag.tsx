'use client';

import React from 'react';
import { Tag } from 'antd';
import type { CustomerCategory } from '@/lib/types/customer';
import type { TaskStatus } from '@/lib/types/task';

interface StatusTagProps {
  status: CustomerCategory | TaskStatus | string;
  type?: 'category' | 'task' | 'custom';
  colorMap?: Record<string, string>;
}

/**
 * 状态标签组件
 * 支持客户分类、任务状态等不同类型的状态显示
 */
export default function StatusTag({
  status,
  type = 'custom',
  colorMap,
}: StatusTagProps) {
  // 默认颜色映射
  const defaultColorMap: Record<string, string> = {
    // 客户分类
    potential: '#fa8c16',     // 潜在客户
    converted: '#52c41a',     // 成交客户
    upgrade: '#1890ff',       // 升单潜力
    referral: '#722ed1',      // 转科潜力
    churn: '#f5222d',         // 流失预警

    // 任务状态
    pending: '#faad14',       // 未开始
    in_progress: '#1890ff',   // 进行中
    completed: '#52c41a',     // 已完成
    overdue: '#f5222d',       // 已超时
    delayed: '#faad14',       // 已延期

    // 通用
    active: '#52c41a',
    inactive: '#8c8c8c',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
  };

  const color = colorMap?.[status] || defaultColorMap[status] || '#8c8c8c';

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      // 客户分类
      potential: '潜在客户',
      converted: '成交客户',
      upgrade: '升单潜力',
      referral: '转科潜力',
      churn: '流失预警',

      // 任务状态
      pending: '未开始',
      in_progress: '进行中',
      completed: '已完成',
      overdue: '已超时',
      delayed: '已延期',
    };

    return textMap[status] || status;
  };

  return (
    <Tag
      color={color}
      style={{
        borderRadius: 0, // 方形标签
        padding: '0 4px',
        height: 20,
        lineHeight: '20px',
        fontSize: 12,
      }}
    >
      {getStatusText(status)}
    </Tag>
  );
}
