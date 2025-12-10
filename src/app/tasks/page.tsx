'use client';

import React, { useState } from 'react';
import { Table, Tag, Space, Button, Card, Tabs, Badge } from 'antd';
import {
  CheckSquareOutlined,
  EyeOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import StatusTag from '@/components/common/StatusTag';
import TaskDashboard from '@/components/task-center/TaskDashboard';
import OverdueAlert from '@/components/task-center/OverdueAlert';
import { useTaskStore } from '@/stores/taskStore';
import { mockTasks } from '@/lib/mock/tasks';
import type { Task } from '@/lib/types/task';

const { TabPane } = Tabs;

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { taskStats } = useTaskStore();

  const columns = [
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { text: string; color: string }> = {
          lens_replacement: { text: '换片提醒', color: '#1890ff' },
          follow_up: { text: '复查提醒', color: '#52c41a' },
          recall: { text: '流失召回', color: '#faad14' },
          referral: { text: '转介绍', color: '#722ed1' },
        };
        const config = typeMap[type] || { text: type, color: '#8c8c8c' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <StatusTag status={status} type="task" />,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const colorMap: Record<string, string> = {
          high: '#f5222d',
          medium: '#faad14',
          low: '#1890ff',
        };
        return (
          <Tag color={colorMap[priority]} style={{ borderRadius: 0 }}>
            {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
          </Tag>
        );
      },
    },
    {
      title: '截止时间',
      dataIndex: 'dueAt',
      key: 'dueAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '责任人',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Task) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status !== 'completed' && (
            <Button type="primary" size="small">
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'pending':
        return mockTasks.filter((t) => t.status === 'pending');
      case 'in_progress':
        return mockTasks.filter((t) => t.status === 'in_progress');
      case 'completed':
        return mockTasks.filter((t) => t.status === 'completed');
      case 'overdue':
        return mockTasks.filter((t) => t.status === 'overdue');
      default:
        return mockTasks;
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <h2>任务中心</h2>

          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <DashboardOutlined />
                    Dashboard
                  </span>
                }
                key="dashboard"
              >
                <TaskDashboard />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    全部任务
                    <Badge count={taskStats.total} style={{ marginLeft: 8 }} />
                  </span>
                }
                key="all"
              >
                <Table
                  size="small"
                  dataSource={getFilteredTasks()}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                  rowClassName={(record, index) => {
                    if (record.status === 'completed') return 'table-row-success';
                    if (record.status === 'overdue') return 'table-row-overdue';
                    return index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
                  }}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    待处理
                    <Badge count={taskStats.pending} style={{ marginLeft: 8 }} />
                  </span>
                }
                key="pending"
              >
                <Table
                  size="small"
                  dataSource={getFilteredTasks()}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    已超时
                    <Badge
                      count={taskStats.overdue}
                      style={{ marginLeft: 8, backgroundColor: '#f5222d' }}
                    />
                  </span>
                }
                key="overdue"
              >
                <OverdueAlert
                  onTaskClick={(taskId) => console.log('Click task:', taskId)}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Space>
      </div>
    </MainLayout>
  );
}
