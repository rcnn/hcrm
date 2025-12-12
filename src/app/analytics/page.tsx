'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Progress } from 'antd';
import { CheckSquareOutlined, ReloadOutlined, UserDeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import StatisticCard from '@/components/common/StatisticCard';
import { Line, Column } from '@ant-design/charts';
import { generateOverviewMockData } from '@/services/api/dashboard';

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  // 加载数据
  useEffect(() => {
    const mockData = generateOverviewMockData();
    setDashboardData(mockData);
  }, []);

  // 院区排名数据
  const rankingData = (dashboardData?.hospitalRankings || []).map((item: any, index: number) => ({
    key: String(index + 1),
    rank: item.rank,
    name: item.name,
    hospital: item.name,
    completionRate: item.completionRate,
    score: item.completionRate,
  }));

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
    data: dashboardData?.trends || [],
    xField: 'month',
    yField: 'rate',
    seriesField: 'type',
    color: ['#1890ff', '#52c41a'],
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 2000,
      },
    },
    legend: {
      position: 'top' as const,
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
              value={Math.round((dashboardData?.progressIndicators?.replacementRate || 0))}
              suffix="%"
              prefix={<CheckSquareOutlined style={{ color: '#1890ff' }} />}
              trend={5}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="复查到院率"
              value={Math.round((dashboardData?.progressIndicators?.revisitRate || 0))}
              suffix="%"
              prefix={<ReloadOutlined style={{ color: '#52c41a' }} />}
              trend={3}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="流失率"
              value={Number(((dashboardData?.progressIndicators?.churnRate || 0)).toFixed(1))}
              suffix="%"
              prefix={<UserDeleteOutlined style={{ color: '#faad14' }} />}
              trend={-2}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="客单价"
              value={dashboardData?.kpis?.avgOrderValue || 0}
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
