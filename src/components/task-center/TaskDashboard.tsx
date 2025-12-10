'use client';

import React, { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { useTaskStore } from '@/stores/taskStore';
import TaskStatisticCard from './TaskStatisticCard';
import TaskCharts from './TaskCharts';
import QuickActions from './QuickActions';

const { Title } = Typography;

const TaskDashboard: React.FC = () => {
  const { taskStats, loading, refreshStats } = useTaskStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      refreshStats();
      setInitialized(true);
    }
  }, [initialized, refreshStats]);

  return (
    <div className="task-dashboard">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>任务中心</Title>

        <TaskStatisticCard stats={taskStats} />

        <TaskCharts stats={taskStats} />

        <QuickActions />
      </Space>
    </div>
  );
};

export default TaskDashboard;
