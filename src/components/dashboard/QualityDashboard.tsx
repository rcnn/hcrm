'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Space, Progress, Spin, Tabs, Button, Dropdown } from 'antd';
import {
  CheckCircleOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import KPICard from './KPICard';
import RankingTable from './RankingTable';
import { QualityDashboardData } from '@/types/dashboard';
import { fetchQualityDashboard, generateQualityMockData } from '@/services/api/dashboard';
import { exportToExcel, exportToPDF, exportMultiSheetExcel, exportKPIToPDF, exportChartToExcel } from '@/utils/export';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 质控红黑榜组件
 * 展示执行质控和经营质控数据
 */
const QualityDashboard: React.FC = () => {
  const [data, setData] = useState<QualityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('execution');

  useEffect(() => {
    // 使用Mock数据
    const mockData = generateQualityMockData();
    setData(mockData);
    setLoading(false);
  }, []);

  // 导出为Excel
  const handleExportExcel = () => {
    if (!data) return;

    // 准备Excel数据
    const excelData = {
      '质控概览': [
        { '任务完成率排名': 1, '企微回复率排名': 3, 'SOP执行率': data.executionControl.sopCompliance, '超时任务数': data.executionControl.timeoutTasks },
      ],
      '任务完成率排名': data.executionControl.taskCompletionRanking,
      '企微回复率排名': data.executionControl.wechatReplyRate,
      '客单价异常': data.operationControl.priceAnomalies,
      '转化率异常': data.operationControl.conversionAnomalies,
      '整改单': data.rectification.list || [],
    };

    exportMultiSheetExcel(excelData, '质控红黑榜报表');
  };

  // 导出为PDF
  const handleExportPDF = () => {
    if (!data) return;

    // KPI数据
    const kpiData = {
      '任务完成率排名': '1名',
      '企微回复率排名': '3名',
      'SOP执行率': `${data.executionControl.sopCompliance}%`,
      '超时任务数': `${data.executionControl.timeoutTasks}个`,
      '待处理整改单': `${data.rectification.pendingOrders}个`,
      '处理中整改单': `${data.rectification.inProgress}个`,
      '已完成整改单': `${data.rectification.completed}个`,
    };

    exportKPIToPDF(kpiData, '质控红黑榜报表', '质控红黑榜 - 关键指标报表');
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

  // SOP执行率图表配置
  const sopChartConfig = {
    data: [
      { name: 'SOP执行率', value: data.executionControl.sopCompliance },
      { name: '目标', value: 95 },
    ],
    xField: 'name',
    yField: 'value',
    color: ['#52c41a', '#d9d9d9'],
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const priceAnomalyColumns = [
    {
      title: '院区',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '平均客单价',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '偏差',
      dataIndex: 'deviation',
      key: 'deviation',
      render: (deviation: number) => (
        <Text type={deviation < 0 ? 'danger' : 'success'}>
          {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '预警' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const conversionAnomalyColumns = [
    {
      title: '院区',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate: number) => `${rate.toFixed(1)}%`,
    },
    {
      title: '偏差',
      dataIndex: 'deviation',
      key: 'deviation',
      render: (deviation: number) => (
        <Text type={deviation < 0 ? 'danger' : 'success'}>
          {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="red">{status}</Tag>
      ),
    },
  ];

  const rectificationColumns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '院区',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '问题描述',
      dataIndex: 'issue',
      key: 'issue',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { text: '待处理', color: 'orange' },
          in_progress: { text: '处理中', color: 'blue' },
          completed: { text: '已完成', color: 'green' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '责任人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            质控红黑榜
          </Title>
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Dropdown>
        </div>

        {/* 质控概览KPI */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="任务完成率排名"
              value={1}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              suffix="名"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              trend={{ value: 2, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="企微回复率排名"
              value={3}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
              suffix="名"
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              trend={{ value: 1, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="SOP执行率"
              value={data.executionControl.sopCompliance}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              trend={{ value: 3, direction: 'up' }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="超时任务数"
              value={data.executionControl.timeoutTasks}
              prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
              suffix="个"
              precision={0}
              valueStyle={{ color: '#f5222d' }}
              trend={{ value: 5, direction: 'down' }}
              loading={loading}
            />
          </Col>
        </Row>

        {/* 质控详细数据 */}
        <Card size="small" loading={loading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="执行质控" key="execution">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="任务完成率排名" size="small">
                    <RankingTable
                      data={data.executionControl.taskCompletionRanking.map((item) => ({
                        rank: item.rank,
                        name: item.department,
                        completionRate: item.completionRate,
                        status: item.status,
                      }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="企微回复率排名" size="small">
                    <RankingTable
                      data={data.executionControl.wechatReplyRate.map((item, index) => ({
                        rank: item.rank,
                        name: item.employee,
                        completionRate: item.replyRate,
                        status: index < 5 ? '优秀' : '良好',
                      }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="经营质控" key="operation">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="客单价异常名单" size="small">
                    <Table
                      size="small"
                      dataSource={data.operationControl.priceAnomalies}
                      columns={priceAnomalyColumns}
                      pagination={false}
                      rowKey="department"
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="转化率异常名单" size="small">
                    <Table
                      size="small"
                      dataSource={data.operationControl.conversionAnomalies}
                      columns={conversionAnomalyColumns}
                      pagination={false}
                      rowKey="department"
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="整改单管理" key="rectification">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="整改单列表" size="small">
                    <Table
                      size="small"
                      dataSource={data.rectification.list}
                      columns={rectificationColumns}
                      pagination={false}
                      rowKey="id"
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="质控报表" key="reports">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="SOP执行率" size="small">
                    <Column {...sopChartConfig} />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Card size="small">
                      <Title level={4}>整改单统计</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text type="secondary">待处理</Text>
                          <Title level={4} style={{ margin: '8px 0', color: '#faad14' }}>
                            {data.rectification.pendingOrders}
                          </Title>
                        </div>
                        <div>
                          <Text type="secondary">处理中</Text>
                          <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                            {data.rectification.inProgress}
                          </Title>
                        </div>
                        <div>
                          <Text type="secondary">已完成</Text>
                          <Title level={4} style={{ margin: '8px 0', color: '#52c41a' }}>
                            {data.rectification.completed}
                          </Title>
                        </div>
                      </Space>
                    </Card>
                  </Space>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Space>
    </div>
  );
};

export default QualityDashboard;
