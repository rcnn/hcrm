'use client';

import { Card, Typography, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" size="small">
            <Typography.Title level={2} style={{ marginBottom: 0 }}>
              <RocketOutlined /> HCRM客户长期价值管理系统
            </Typography.Title>
            <Typography.Text type="secondary">
              基于Next.js + React + TypeScript + Ant Design构建
            </Typography.Text>
          </Space>
        </Card>

        <Card title="系统特色">
          <Space direction="vertical" size="small">
            <Typography.Text>✓ 扁平化医疗级UI设计</Typography.Text>
            <Typography.Text>✓ 高密度信息展示</Typography.Text>
            <Typography.Text>✓ 5种角色权限管理</Typography.Text>
            <Typography.Text>✓ 完整Mock数据支持</Typography.Text>
            <Typography.Text>✓ 响应式布局（PC + 移动端）</Typography.Text>
          </Space>
        </Card>

        <Card title="快速导航">
          <Space direction="vertical" size="small">
            <Typography.Text>
              📊 <a href="/dashboard">管理驾驶舱</a>
            </Typography.Text>
            <Typography.Text>
              👥 <a href="/customers">客户档案管理</a>
            </Typography.Text>
            <Typography.Text>
              📋 <a href="/tasks">任务中心</a>
            </Typography.Text>
            <Typography.Text>
              📈 <a href="/analytics">数据分析</a>
            </Typography.Text>
            <Typography.Text>
              ⚙️ <a href="/rules">规则配置引擎</a>
            </Typography.Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
