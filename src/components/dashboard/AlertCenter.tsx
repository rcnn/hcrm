'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Select, Row, Col, Spin, Empty } from 'antd';
import AlertItem from './AlertItem';
import { Alert } from '@/types/dashboard';
import { fetchAlerts, generateOverviewMockData } from '@/services/api/dashboard';

const { Title } = Typography;
const { Option } = Select;

/**
 * 预警中心组件
 * 集中展示和管理所有预警信息
 */
const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  useEffect(() => {
    loadAlerts();
  }, [filterStatus, filterSeverity, filterDepartment]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      // 使用Mock数据
      const mockData = generateOverviewMockData();
      setAlerts(mockData.alerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertAction = (alertId: string, action: 'handle' | 'ignore') => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: action === 'handle' ? 'resolved' : alert.status } : alert
      )
    );
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterDepartment !== 'all' && alert.department !== filterDepartment) return false;
    return true;
  });

  // 统计数据
  const stats = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === 'active').length,
    high: alerts.filter((a) => a.severity === 'high' && a.status === 'active').length,
    medium: alerts.filter((a) => a.severity === 'medium' && a.status === 'active').length,
    low: alerts.filter((a) => a.severity === 'low' && a.status === 'active').length,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>
          预警中心
        </Title>

        {/* 统计概览 */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {stats.total}
              </Title>
              <Typography.Text type="secondary">总预警</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#f5222d' }}>
                {stats.active}
              </Title>
              <Typography.Text type="secondary">待处理</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#f5222d' }}>
                {stats.high}
              </Title>
              <Typography.Text type="secondary">高优先级</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                {stats.medium}
              </Title>
              <Typography.Text type="secondary">中优先级</Typography.Text>
            </Card>
          </Col>
        </Row>

        {/* 筛选器 */}
        <Card size="small">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={8}>
              <Select
                style={{ width: '100%' }}
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Option value="all">全部状态</Option>
                <Option value="active">待处理</Option>
                <Option value="resolved">已处理</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                style={{ width: '100%' }}
                value={filterSeverity}
                onChange={setFilterSeverity}
              >
                <Option value="all">全部级别</Option>
                <Option value="high">高优先级</Option>
                <Option value="medium">中优先级</Option>
                <Option value="low">低优先级</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                style={{ width: '100%' }}
                value={filterDepartment}
                onChange={setFilterDepartment}
              >
                <Option value="all">全部院区</Option>
                <Option value="总院区">总院区</Option>
                <Option value="东院区">东院区</Option>
                <Option value="西院区">西院区</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* 预警列表 */}
        <Card title={`预警列表 (${filteredAlerts.length})`} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onHandle={(id) => handleAlertAction(id, 'handle')}
                  onIgnore={(id) => handleAlertAction(id, 'ignore')}
                  onView={(alert) => console.log('View alert:', alert)}
                />
              ))
            ) : (
              <Empty description="暂无预警信息" />
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default AlertCenter;
