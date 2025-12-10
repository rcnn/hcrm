'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Space, Button, Timeline, Typography, Divider } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/stores/taskStore';
import type { Task } from '@/lib/types/task';

const { Title, Paragraph } = Typography;

interface TaskDetailProps {
  taskId: string;
  onComplete?: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onComplete }) => {
  const { currentTask, fetchTaskById, updateTaskStatus } = useTaskStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTaskById(taskId);
    }
  }, [taskId, fetchTaskById]);

  const handleCompleteTask = async () => {
    setLoading(true);
    try {
      await updateTaskStatus(taskId, 'completed', '任务已完成');
      onComplete?.(taskId);
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      lens_replacement: '换片提醒',
      follow_up: '复查提醒',
      recall: '流失召回',
      referral: '转介绍跟进',
    };
    return typeMap[type] || type;
  };

  const getPriorityName = (priority: string) => {
    const priorityMap: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      high: '#f5222d',
      medium: '#faad14',
      low: '#1890ff',
    };
    return colorMap[priority] || '#8c8c8c';
  };

  if (!currentTask) {
    return <div>加载中...</div>;
  }

  return (
    <div className="task-detail">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              {getTaskTypeName(currentTask.type)}
            </Title>
            <Space>
              <Tag color={getPriorityColor(currentTask.priority)}>
                优先级: {getPriorityName(currentTask.priority)}
              </Tag>
              {currentTask.status === 'completed' && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  已完成
                </Tag>
              )}
            </Space>
          </div>
          <Divider />
          <Descriptions bordered column={2}>
            <Descriptions.Item label="任务ID" span={1}>
              {currentTask.id}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={1}>
              {new Date(currentTask.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="截止时间" span={1}>
              {new Date(currentTask.dueAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="责任人" span={1}>
              {currentTask.assignedToName}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="客户信息">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="客户姓名" span={1}>
              <Space>
                <UserOutlined />
                {currentTask.customerName}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="联系电话" span={1}>
              <Space>
                <PhoneOutlined />
                138****8888
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="当前产品类型" span={1}>
              角膜塑形镜
            </Descriptions.Item>
            <Descriptions.Item label="上次检查时间" span={1}>
              2024-09-15
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="任务描述">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>任务类型和原因：</strong>
              <Paragraph>
                根据客户上次检查结果，建议在合适时机提醒客户进行复查。
              </Paragraph>
            </div>
            <div>
              <strong>建议话术：</strong>
              <Paragraph>
                {currentTask.script || '点击"生成话术"按钮获取AI生成的个性化话术'}
              </Paragraph>
            </div>
            <div>
              <strong>参考标准（SOP）：</strong>
              <Paragraph>
                1. 提前1-2天联系客户<br />
                2. 确认客户时间安排<br />
                3. 提供预约建议<br />
                4. 记录客户反馈
              </Paragraph>
            </div>
          </Space>
        </Card>

        {currentTask.notes && (
          <Card title="备注信息">
            <Paragraph>{currentTask.notes}</Paragraph>
          </Card>
        )}

        <Card title="操作记录">
          <Timeline
            items={[
              {
                color: 'blue',
                children: (
                  <div>
                    <div>任务创建</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {new Date(currentTask.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ),
              },
              ...(currentTask.completedAt
                ? [
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div>任务完成</div>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {new Date(currentTask.completedAt).toLocaleString('zh-CN')}
                          </div>
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </Card>

        {currentTask.status !== 'completed' && (
          <Card>
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleCompleteTask}
                loading={loading}
              >
                完成任务
              </Button>
              <Button icon={<EyeOutlined />}>生成话术</Button>
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default TaskDetail;
