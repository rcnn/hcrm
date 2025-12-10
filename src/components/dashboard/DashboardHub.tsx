'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, Tabs } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
} from '@ant-design/icons';
import OverviewDashboard from './OverviewDashboard';
import PersonalDashboard from './PersonalDashboard';
import QualityDashboard from './QualityDashboard';
import AlertCenter from './AlertCenter';

const { Title } = Typography;
const { TabPane } = Tabs;

/**
 * 仪表盘中心
 * 整合所有看板类型的统一入口
 */
const DashboardHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        size="large"
        tabBarStyle={{ margin: '16px 24px 0 24px' }}
      >
        <TabPane
          tab={
            <span>
              <DashboardOutlined />
              管理驾驶舱
            </span>
          }
          key="overview"
        >
          <OverviewDashboard />
        </TabPane>

        <TabPane
          tab={
            <span>
              <UserOutlined />
              个人看板
            </span>
          }
          key="personal"
        >
          <PersonalDashboard />
        </TabPane>

        <TabPane
          tab={
            <span>
              <SafetyCertificateOutlined />
              质控红黑榜
            </span>
          }
          key="quality"
        >
          <QualityDashboard />
        </TabPane>

        <TabPane
          tab={
            <span>
              <BellOutlined />
              预警中心
            </span>
          }
          key="alerts"
        >
          <AlertCenter />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardHub;
