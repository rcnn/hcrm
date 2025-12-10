'use client';

import React, { useState } from 'react';
import { List, Badge, Button, Space, Empty, message } from 'antd';
import { UserOutlined, CheckOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons';
import { useTaskStore } from '@/stores/taskStore';
import type { Task } from '@/lib/types/task';

interface WeComSidebarProps {
  customerId: string;
}

const WeComSidebar: React.FC<WeComSidebarProps> = ({ customerId }) => {
  const { tasks, updateTaskStatus } = useTaskStore();
  const [loading, setLoading] = useState<string | null>(null);

  // 获取当前客户的任务
  const customerTasks = tasks.filter((task) => task.customerId === customerId);

  const handleCompleteTask = async (taskId: string) => {
    setLoading(taskId);
    try {
      await updateTaskStatus(taskId, 'completed', '侧边栏完成任务');
      message.success('任务已完成');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(null);
    }
  };

  const handleViewProfile = () => {
    message.info('查看完整档案功能开发中...');
  };

  const handleGenerateScript = () => {
    message.info('生成话术功能开发中...');
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

  if (customerTasks.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无任务"
        />
      </div>
    );
  }

  return (
    <div className="wecom-sidebar">
      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ margin: 0 }}>客户任务</h3>
      </div>

      <List
        dataSource={customerTasks}
        renderItem={(task) => (
          <List.Item
            style={{
              padding: 12,
              backgroundColor: task.status === 'completed' ? '#f6ffed' : 'transparent',
              borderLeft: task.status === 'overdue' ? '3px solid #f5222d' : 'none',
            }}
          >
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Badge
                    dot={task.status === 'overdue'}
                    color={task.status === 'overdue' ? 'red' : 'blue'}
                  >
                    <UserOutlined />
                  </Badge>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {getTaskTypeName(task.type)}
                  </span>
                </Space>
              </div>

              <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                <div>截止: {new Date(task.dueAt).toLocaleDateString('zh-CN')}</div>
                {task.status === 'overdue' && (
                  <div style={{ color: '#f5222d', fontWeight: 500 }}>
                    已超时
                  </div>
                )}
              </div>

              <div style={{ marginTop: 8 }}>
                <Space>
                  <Button
                    size="small"
                    icon={<CheckOutlined />}
                    type="primary"
                    onClick={() => handleCompleteTask(task.id)}
                    loading={loading === task.id}
                    disabled={task.status === 'completed'}
                  >
                    完成
                  </Button>
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => message.info('查看详情功能开发中...')}
                  >
                    查看
                  </Button>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block icon={<UserOutlined />} onClick={handleViewProfile}>
            查看完整档案
          </Button>
          <Button
            block
            icon={<ToolOutlined />}
            onClick={handleGenerateScript}
          >
            生成话术
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default WeComSidebar;
