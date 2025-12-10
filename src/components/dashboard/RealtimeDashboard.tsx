'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, Button, Space, Badge, Alert } from 'antd';
import { ReloadOutlined, WifiOutlined } from '@ant-design/icons';
import { LineChart } from '@/components/charts';
import useWebSocket from '@/hooks/useWebSocket';
import useAutoRefresh from '@/hooks/useAutoRefresh';

interface RealtimeDashboardProps {
  initialData?: any;
}

const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({ initialData }) => {
  const [data, setData] = useState(initialData || []);
  const [kpiData, setKpiData] = useState({
    newCustomers: 0,
    revenue: 0,
    conversionRate: 0,
    alerts: 0,
  });

  // WebSocket 连接
  const { isConnected, lastMessage, connect, disconnect } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'dashboard_update') {
        // 更新 KPI 数据
        setKpiData(prev => ({
          newCustomers: prev.newCustomers + Math.floor(Math.random() * 5),
          revenue: prev.revenue + Math.floor(Math.random() * 1000),
          conversionRate: 60 + Math.random() * 20,
          alerts: Math.floor(Math.random() * 10),
        }));

        // 更新图表数据
        setData((prev: any[]) => {
          const newData = [...prev];
          if (newData.length > 20) {
            newData.shift();
          }
          newData.push({
            time: new Date().toLocaleTimeString(),
            value: message.data.randomValue,
          });
          return newData;
        });
      }
    },
  });

  // 自动刷新
  const { isRefreshing, lastRefreshTime, refresh } = useAutoRefresh({
    interval: 5 * 60 * 1000, // 5 分钟
    enabled: true,
    onRefresh: async () => {
      console.log('执行定时刷新...');
      // 在这里可以重新获取数据
    },
  });

  // 初始化数据
  useEffect(() => {
    if (!initialData) {
      const initialChartData = Array.from({ length: 10 }, (_, i) => ({
        time: new Date(Date.now() - (10 - i) * 5000).toLocaleTimeString(),
        value: Math.random() * 100,
      }));
      setData(initialChartData);

      setKpiData({
        newCustomers: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 10000) + 50000,
        conversionRate: 60 + Math.random() * 20,
        alerts: Math.floor(Math.random() * 10),
      });
    }
  }, [initialData]);

  return (
    <div>
      <Card
        title="实时数据看板"
        extra={
          <Space>
            <Badge status={isConnected ? 'success' : 'error'} />
            <Tag color={isConnected ? 'green' : 'red'}>
              <WifiOutlined style={{ color: isConnected ? 'inherit' : '#999' }} />
              {isConnected ? '已连接' : '未连接'}
            </Tag>
            <Button
              icon={<ReloadOutlined />}
              loading={isRefreshing}
              onClick={refresh}
            >
              刷新
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="新增客户"
              value={kpiData.newCustomers}
              suffix="人"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="营收金额"
              value={kpiData.revenue}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="转化率"
              value={kpiData.conversionRate.toFixed(2)}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="活跃预警"
              value={kpiData.alerts}
              suffix="条"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="实时趋势图" style={{ marginBottom: 16 }}>
        <LineChart
          data={data}
          xField="time"
          yField="value"
          height={300}
          smooth
        />
      </Card>

      {lastRefreshTime && (
        <Alert
          message={`最后刷新时间：${lastRefreshTime.toLocaleString()}`}
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default RealtimeDashboard;
