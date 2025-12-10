'use client';

import React from 'react';
import { Row, Col, Card, Table, Progress } from 'antd';
import { CheckSquareOutlined, ReloadOutlined, UserDeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import StatisticCard from '@/components/common/StatisticCard';
import { Line, Column } from '@ant-design/charts';

export default function AnalyticsPage() {
  // 模拟趋势数据
  const trendData = [
    { month: '1月', churnRate: 5.2, revisitRate: 82.5 },
    { month: '2月', churnRate: 4.8, revisitRate: 85.2 },
    { month: '3月', churnRate: 5.5, revisitRate: 83.8 },
    { month: '4月', churnRate: 4.2, revisitRate: 87.3 },
    { month: '5月', churnRate: 3.8, revisitRate: 88.9 },
    { month: '6月', churnRate: 4.5, revisitRate: 86.5 },
  ];

  // 模拟院区排名数据
  const rankingData = [
    {
      key: '1',
      rank: 1,
      name: '总部医院',
      hospital: '总部',
      completionRate: 95,
      score: 95,
    },
    {
      key: '2',
      rank: 2,
      name: '东区医院',
      hospital: '东区',
      completionRate: 88,
      score: 88,
    },
    {
      key: '3',
      rank: 3,
      name: '西区医院',
      hospital: '西区',
      completionRate: 82,
      score: 82,
    },
  ];

  const rankingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <span
          style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            lineHeight: '24px',
            textAlign: 'center',
            backgroundColor: rank <= 3 ? '#52c41a' : '#d9d9d9',
            color: '#ffffff',
            borderRadius: 0,
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {rank}
        </span>
      ),
    },
    {
      title: '院区',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '任务完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" status={rate >= 90 ? 'success' : 'active'} />
      ),
    },
    {
      title: '综合评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <span style={{ fontWeight: 'bold' }}>{score}分</span>,
    },
  ];

  const lineConfig = {
    data: trendData,
    xField: 'month',
    yField: 'rate',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 2000,
      },
    },
  };

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <h2>数据分析</h2>

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="角塑换片率"
              value={85}
              suffix="%"
              prefix={<CheckSquareOutlined style={{ color: '#1890ff' }} />}
              trend={5}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="复查到院率"
              value={88}
              suffix="%"
              prefix={<ReloadOutlined style={{ color: '#52c41a' }} />}
              trend={3}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="流失率"
              value={4.5}
              suffix="%"
              prefix={<UserDeleteOutlined style={{ color: '#faad14' }} />}
              trend={-2}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="客单价"
              value={3500}
              prefix={<UserAddOutlined style={{ color: '#722ed1' }} />}
              trend={8}
            />
          </Col>
        </Row>

        <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="流失率/复购率趋势" size="small">
              <Line {...lineConfig} />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="各院区排名" size="small">
              <Table
                size="small"
                dataSource={rankingData}
                columns={rankingColumns}
                pagination={false}
                rowKey="key"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
