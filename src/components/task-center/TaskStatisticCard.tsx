'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { TaskStats } from '@/lib/types/task';

interface TaskStatisticCardProps {
  stats: TaskStats;
}

const TaskStatisticCard: React.FC<TaskStatisticCardProps> = ({ stats }) => {
  return (
    <div className="task-statistic-card">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="换片提醒"
              value={stats.lensReplacement}
              prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="复查提醒"
              value={stats.followUp}
              prefix={<ReloadOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="流失召回"
              value={stats.recall}
              prefix={<UserDeleteOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="超时任务"
              value={stats.overdue}
              prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskStatisticCard;
