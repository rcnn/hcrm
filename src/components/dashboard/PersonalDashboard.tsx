'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Progress, Avatar, Space, Spin, Button, Dropdown } from 'antd';
import {
  UserOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import KPICard from './KPICard';
import { PersonalDashboardData } from '@/types/dashboard';
import { fetchPersonalDashboard, generatePersonalMockData } from '@/services/api/dashboard';
import { exportToExcel, exportToPDF, exportMultiSheetExcel, exportKPIToPDF } from '@/utils/export';

const { Title, Text } = Typography;

/**
 * 个人看板组件
 * 展示员工个人业绩、任务进度和客户分析
 */
const PersonalDashboard: React.FC = () => {
  const [data, setData] = useState<PersonalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 使用Mock数据
    const mockData = generatePersonalMockData();
    setData(mockData);
    setLoading(false);
  }, []);

  // 导出为Excel
  const handleExportExcel = () => {
    if (!data) return;

    // 准备Excel数据
    const excelData = {
      '员工信息': [
        { '姓名': data.employeeInfo.name, '部门': data.employeeInfo.department, '职位': data.employeeInfo.position },
      ],
      '个人业绩': [
        { '本月转角塑': data.performance.monthlyReferrals.orthoK, '本月转屈光': data.performance.monthlyReferrals.refractive, '预估激励金额': data.performance.estimatedBonus, '任务完成率': data.performance.taskCompletionRate },
      ],
      '任务数据': [
        { '今日待办': data.tasks.todayPending, '本周已完成': data.tasks.weekCompleted, '任务超时率': data.tasks.timeoutRate, '平均响应时长': data.tasks.avgResponseTime },
      ],
      '客户数据': [
        { '负责客户总数': data.customers.total, '本月新增客户': data.customers.newThisMonth, '客户活跃度': data.customers.activeRate, '升单成功率': data.customers.upsellSuccessRate },
      ],
      '业绩排名': [
        { '团队排名': `#${data.ranking.position}`, '团队人数': data.ranking.teamSize, '较上月': data.ranking.vsLastMonth, '目标完成度': `${data.ranking.targetCompletion}%` },
      ],
    };

    exportMultiSheetExcel(excelData, `${data.employeeInfo.name}-个人报表`);
  };

  // 导出为PDF
  const handleExportPDF = () => {
    if (!data) return;

    // KPI数据
    const kpiData = {
      '本月转角塑': `${data.performance.monthlyReferrals.orthoK}人`,
      '本月转屈光': `${data.performance.monthlyReferrals.refractive}人`,
      '预估激励金额': `${data.performance.estimatedBonus}元`,
      '任务完成率': `${data.performance.taskCompletionRate}%`,
      '负责客户总数': `${data.customers.total}人`,
      '本月新增客户': `${data.customers.newThisMonth}人`,
      '客户活跃度': `${data.customers.activeRate}%`,
      '升单成功率': `${data.customers.upsellSuccessRate}%`,
      '团队排名': `#${data.ranking.position}`,
      '目标完成度': `${data.ranking.targetCompletion}%`,
    };

    exportKPIToPDF(kpiData, `${data.employeeInfo.name}-个人报表`, `${data.employeeInfo.name} - 个人业绩报表`);
  };

  // 导出菜单配置
  const exportMenuItems = [
    {
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: '导出为Excel',
      onClick: handleExportExcel,
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: '导出为PDF',
      onClick: handleExportPDF,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>暂无数据</div>;
  }

  // 转介绍数据图表配置
  const referralChartConfig = {
    data: [
      { type: '角塑', value: data.performance.monthlyReferrals.orthoK },
      { type: '屈光', value: data.performance.monthlyReferrals.refractive },
    ],
    xField: 'type',
    yField: 'value',
    color: '#1890ff',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      value: {
        alias: '转介绍数量',
      },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            个人看板
          </Title>
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Dropdown>
        </div>

        {/* 员工信息头部 */}
        <Card size="small">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {data.employeeInfo.name}
              </Title>
              <Text type="secondary">
                {data.employeeInfo.department} | {data.employeeInfo.position}
              </Text>
            </div>
          </div>
        </Card>

        {/* 个人业绩展示 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="本月转角塑"
              value={data.performance.monthlyReferrals.orthoK}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              trend={{ value: 15, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="本月转屈光"
              value={data.performance.monthlyReferrals.refractive}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              suffix="人"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              trend={{ value: 8, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="预估激励金额"
              value={data.performance.estimatedBonus}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              suffix="元"
              precision={0}
              valueStyle={{ color: '#faad14' }}
              trend={{ value: 12, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="任务完成率"
              value={data.performance.taskCompletionRate}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
              suffix="%"
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              trend={{ value: 5, direction: 'up' }}
              loading={loading}
            />
          </Col>
        </Row>

        {/* 任务进度和客户分析 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="任务概览" size="small" loading={loading}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">今日待办任务</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {data.tasks.todayPending}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">本周已完成任务</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {data.tasks.weekCompleted}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">任务超时率</Text>
                  <Progress
                    percent={data.tasks.timeoutRate}
                    size="small"
                    strokeColor={data.tasks.timeoutRate > 5 ? '#f5222d' : '#52c41a'}
                  />
                </div>
                <div>
                  <Text type="secondary">平均响应时长</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {data.tasks.avgResponseTime}
                  </Title>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="客户分析" size="small" loading={loading}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">负责客户总数</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {data.customers.total}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">本月新增客户</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {data.customers.newThisMonth}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">客户活跃度</Text>
                  <Progress
                    percent={data.customers.activeRate}
                    size="small"
                    strokeColor="#1890ff"
                  />
                </div>
                <div>
                  <Text type="secondary">升单成功率</Text>
                  <Progress
                    percent={data.customers.upsellSuccessRate}
                    size="small"
                    strokeColor="#52c41a"
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 转介绍图表和业绩排名 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="本月转介绍" size="small" loading={loading}>
              <Bar {...referralChartConfig} />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="业绩排名" size="small" loading={loading}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                    #{data.ranking.position}
                  </Title>
                  <Text type="secondary">团队排名</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {data.ranking.teamSize}
                    </Title>
                    <Text type="secondary">团队人数</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title
                      level={4}
                      style={{
                        margin: 0,
                        color: data.ranking.vsLastMonth.startsWith('+') ? '#52c41a' : '#f5222d',
                      }}
                    >
                      {data.ranking.vsLastMonth}
                    </Title>
                    <Text type="secondary">较上月</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {data.ranking.targetCompletion}%
                    </Title>
                    <Text type="secondary">目标完成度</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default PersonalDashboard;
