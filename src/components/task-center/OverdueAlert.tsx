'use client';

import React, { useEffect, useState } from 'react';
import { Alert, List, Avatar, Space, Badge, Card, Typography, Button } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTaskStore } from '@/stores/taskStore';
import type { Task } from '@/lib/types/task';

const { Title, Text } = Typography;

interface OverdueAlertProps {
  onTaskClick?: (taskId: string) => void;
}

const OverdueAlert: React.FC<OverdueAlertProps> = ({ onTaskClick }) => {
  const { tasks, taskStats } = useTaskStore();
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  useEffect(() => {
    const now = new Date();
    const overdue = tasks.filter((task) => {
      if (task.status === 'completed') return false;
      const dueTime = new Date(task.dueAt);
      const hoursDiff = (now.getTime() - dueTime.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24;
    });

    setOverdueTasks(overdue);
  }, [tasks]);

  if (overdueTasks.length === 0) {
    return null;
  }

  const getTaskTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      lens_replacement: '换片提醒',
      follow_up: '复查提醒',
      recall: '流失召回',
      referral: '转介绍跟进',
    };
    return typeMap[type] || type;
  };

  const getOverdueLevel = (hours: number) => {
    if (hours >= 72) return { level: 'error' as const, text: '紧急' };
    if (hours >= 48) return { level: 'warning' as const, text: '重要' };
    return { level: 'warning' as const, text: '一般' };
  };

  return (
    <div className="overdue-alert">
      <Alert
        message={`当前有 ${overdueTasks.length} 个任务已超时`}
        description="请及时处理超时任务，避免影响客户体验和业务指标"
        type="error"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      <Card
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
            <span>超时任务列表</span>
          </Space>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={overdueTasks}
          renderItem={(task) => {
            const now = new Date();
            const dueTime = new Date(task.dueAt);
            const hoursDiff = Math.floor(
              (now.getTime() - dueTime.getTime()) / (1000 * 60 * 60)
            );
            const levelInfo = getOverdueLevel(hoursDiff);

            return (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => onTaskClick?.(task.id)}
                  >
                    处理
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      count={levelInfo.text}
                      style={{ backgroundColor: levelInfo.level === 'error' ? '#f5222d' : '#faad14' }}
                    >
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong>{getTaskTypeName(task.type)}</Text>
                      <Text type="secondary">- {task.customerName}</Text>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">责任人: {task.assignedToName}</Text>
                      <Text type="secondary">
                        超时时间: {hoursDiff}小时
                      </Text>
                      <Text type="secondary">
                        截止时间: {new Date(task.dueAt).toLocaleString('zh-CN')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default OverdueAlert;
