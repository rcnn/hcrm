'use client';

import React from 'react';
import { Card, Row, Col, Progress, Statistic, Space, Alert } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import type { TaskStats } from '@/lib/types/task';

interface TaskChartsProps {
  stats: TaskStats;
}

const TaskCharts: React.FC<TaskChartsProps> = ({ stats }) => {
  // 计算完成率
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  // 任务类型分布数据
  const typeData = [
    { type: '换片提醒', value: stats.lensReplacement },
    { type: '复查提醒', value: stats.followUp },
    { type: '流失召回', value: stats.recall },
    { type: '转介绍', value: stats.referral },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: typeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div className="task-charts">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="本周完成率">
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={completionRate}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <div style={{ marginTop: 16 }}>
                <Statistic
                  title="平均处理时长"
                  value={2.5}
                  suffix="小时"
                  precision={1}
                />
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <span>较上周:</span>
                    <span style={{ color: '#52c41a' }}>
                      <ArrowDownOutlined /> 15%
                    </span>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="任务类型分布">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="超时任务预警">
            <Alert
              message={`当前有 ${stats.overdue} 个任务已超时`}
              description="请及时处理超时任务，避免影响客户体验和业务指标"
              type="error"
              showIcon
              action={
                <Space direction="vertical">
                  <div>超时任务数：{stats.overdue} 个</div>
                  <div>预警级别：需要处理</div>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskCharts;
