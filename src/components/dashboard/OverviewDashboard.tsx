'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Space, Typography, Spin, Dropdown } from 'antd';
import {
  UserAddOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
  AccountBookOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import KPICard from './KPICard';
import GaugeCard from './GaugeCard';
import RankingTable from './RankingTable';
import AlertItem from './AlertItem';
import { OverviewDashboardData } from '@/types/dashboard';
import {
  fetchOverviewDashboard,
  generateOverviewMockData,
  subscribeToRealtimeData,
} from '@/services/api/dashboard';
import { exportToExcel, exportToPDF, exportMultiSheetExcel, exportKPIToPDF, filterDataByDateRange, filterDataByDimension } from '@/utils/export';

const { Title } = Typography;

/**
 * 管理驾驶舱组件
 * 展示集团/院级的关键指标和趋势分析
 */
const OverviewDashboard: React.FC = () => {
  const [data, setData] = useState<OverviewDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 加载数据
  const loadData = async () => {
    try {
      // 使用Mock数据
      const mockData = generateOverviewMockData();
      setData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  // 导出为Excel
  const handleExportExcel = () => {
    if (!data) return;

    // 准备Excel数据
    const excelData = {
      'KPI指标': [
        { '指标名称': '今日新增客户', '数值': data?.kpis?.newCustomersToday || 0, '单位': '人' },
        { '指标名称': '本月成交金额', '数值': data?.kpis?.monthlyRevenue || 0, '单位': '万元' },
        { '指标名称': '在院客户数', '数值': data?.kpis?.activeCustomers || 0, '单位': '人' },
        { '指标名称': '实时客单价', '数值': data?.kpis?.avgOrderValue || 0, '单位': '元' },
        { '指标名称': '角塑换片率', '数值': (data?.progressIndicators?.replacementRate || 0) * 100, '单位': '%' },
        { '指标名称': '复查到院率', '数值': (data?.progressIndicators?.revisitRate || 0) * 100, '单位': '%' },
        { '指标名称': '流失率', '数值': (data?.progressIndicators?.churnRate || 0) * 100, '单位': '%' },
      ],
      '院区排名': data?.hospitalRankings || [],
      '趋势数据': data?.trends || [],
      '预警信息': data?.alerts || [],
    };

    exportMultiSheetExcel(excelData, '管理驾驶舱报表');
  };

  // 导出为PDF
  const handleExportPDF = () => {
    if (!data) return;

    // KPI数据
    const kpiData = {
      '今日新增客户': `${data?.kpis?.newCustomersToday || 0}人`,
      '本月成交金额': `${data?.kpis?.monthlyRevenue || 0}万元`,
      '在院客户数': `${data?.kpis?.activeCustomers || 0}人`,
      '实时客单价': `${data?.kpis?.avgOrderValue || 0}元`,
      '角塑换片率': `${((data?.progressIndicators?.replacementRate || 0) * 100).toFixed(2)}%`,
      '复查到院率': `${((data?.progressIndicators?.revisitRate || 0) * 100).toFixed(2)}%`,
      '流失率': `${((data?.progressIndicators?.churnRate || 0) * 100).toFixed(2)}%`,
    };

    exportKPIToPDF(kpiData, '管理驾驶舱KPI报表', '管理驾驶舱 - 关键指标报表');
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

  // 实时数据订阅
  useEffect(() => {
    loadData();

    // 订阅实时数据更新
    const unsubscribe = subscribeToRealtimeData((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 趋势图配置
  const trendChartConfig = {
    data: data?.trends || [],
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
    tooltip: {
      showMarkers: true,
    },
  };

  // 饼图配置
  const pieChartConfig = {
    data: data?.referralData || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

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

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            管理驾驶舱
          </Title>
          <Space>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Dropdown>
            <Button
              icon={<ReloadOutlined />}
              loading={refreshing}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          </Space>
        </div>

        {/* KPI指标概览 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="今日新增客户"
              value={data?.kpis?.newCustomersToday || 0}
              prefix={<UserAddOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              trend={{ value: 8, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="本月成交金额"
              value={data?.kpis?.monthlyRevenue || 0}
              prefix={<MoneyCollectOutlined style={{ color: '#52c41a' }} />}
              suffix="万元"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              trend={{ value: 12, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="在院客户数"
              value={data?.kpis?.activeCustomers || 0}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              suffix="人"
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              trend={{ value: 5, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="实时客单价"
              value={data?.kpis?.avgOrderValue || 0}
              prefix={<AccountBookOutlined style={{ color: '#fa8c16' }} />}
              suffix="元"
              precision={0}
              valueStyle={{ color: '#fa8c16' }}
              trend={{ value: 3, direction: 'down' }}
              loading={loading}
            />
          </Col>
        </Row>

        {/* 核心KPI指标 */}
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <GaugeCard
              title="角塑换片率"
              percent={data?.progressIndicators?.replacementRate || 0}
              target={90}
              loading={loading}
            />
          </Col>
          <Col span={6}>
            <GaugeCard
              title="复查到院率"
              percent={data?.progressIndicators?.revisitRate || 0}
              target={85}
              loading={loading}
            />
          </Col>
          <Col span={6}>
            <GaugeCard
              title="流失率"
              percent={data?.progressIndicators?.churnRate || 0}
              target={10}
              status={(data?.progressIndicators?.churnRate || 0) > 10 ? 'exception' : 'active'}
              loading={loading}
            />
          </Col>
          <Col span={6}>
            <GaugeCard
              title="病种客单价"
              percent={(data?.progressIndicators?.diseaseAvgPrice || 0) / 100}
              target={45}
              format={(val) => `¥${Math.round(val || 0)}`}
              loading={loading}
            />
          </Col>
        </Row>

        {/* 趋势分析图表 */}
        <Card title="流失率/复购率趋势" size="small" loading={loading}>
          <Line {...trendChartConfig} />
        </Card>

        {/* 排名和流量流转 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="各院区排名" size="small" loading={loading}>
              <RankingTable
                data={data?.hospitalRankings || []}
                size="small"
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="全院流量流转" size="small" loading={loading}>
              <Pie {...pieChartConfig} />
            </Card>
          </Col>
        </Row>

        {/* 异常预警 */}
        <Card title="异常预警" size="small" loading={loading}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {(data?.alerts || []).map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onHandle={(id) => console.log('Handle alert:', id)}
                onIgnore={(id) => console.log('Ignore alert:', id)}
                onView={(alert) => console.log('View alert:', alert)}
              />
            ))}
            {(data?.alerts || []).length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                暂无预警信息
              </div>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default OverviewDashboard;
