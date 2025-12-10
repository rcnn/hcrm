'use client';

import React from 'react';
import { Card, Space, Typography, Tag, Divider, List, Button, Avatar, Statistic, Row, Col, Empty } from 'antd';
import { UserOutlined, PhoneOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Customer } from '@/lib/types/customer';
import StatusTag from '@/components/common/StatusTag';

const { Text, Title } = Typography;

interface CustomerSidebarProps {
  customer: Customer | null;
  onViewDetail?: () => void;
}

// 模拟待办任务
const mockTodos = [
  { id: '1', title: '3天后复查提醒', status: 'pending', dueDate: '2024-12-13' },
  { id: '2', title: '配镜满意度回访', status: 'pending', dueDate: '2024-12-15' },
];

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ customer, onViewDetail }) => {
  if (!customer) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <Empty description="请选择客户查看档案" />
      </div>
    );
  }

  const latestExam = customer.examinations?.[0];
  const productColor = customer.currentProduct === '角塑' ? '#1890ff' : customer.currentProduct === '框架镜' ? '#52c41a' : '#999';

  return (
    <div style={{ padding: 12, maxWidth: 360, margin: '0 auto' }}>
      {/* 客户基本信息 */}
      <Card size="small" bodyStyle={{ padding: 12 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ margin: 0 }}>{customer.name}</Title>
              <Text type="secondary">{customer.age}岁 / {customer.gender === 'M' ? '男' : '女'}</Text>
            </div>
            <StatusTag status={customer.category} type="category" />
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Space size={4}>
            <PhoneOutlined />
            <Text copyable={{ text: customer.parentPhone }}>{customer.parentPhone}</Text>
          </Space>

          <Space size={4}>
            <Tag color={productColor} style={{ borderRadius: 0, margin: 0 }}>
              {customer.currentProduct}
            </Tag>
            <Text type="secondary">归属: {customer.ownerName}</Text>
          </Space>
        </Space>
      </Card>

      {/* 核心临床数据 */}
      <Card size="small" title="最新检查数据" style={{ marginTop: 12 }} bodyStyle={{ padding: 12 }}>
        {latestExam ? (
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Statistic
                title="右眼度数"
                value={latestExam.odRefraction}
                suffix="度"
                valueStyle={{ fontSize: 16, color: latestExam.odRefraction < -300 ? '#f5222d' : '#1890ff' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="左眼度数"
                value={latestExam.osRefraction}
                suffix="度"
                valueStyle={{ fontSize: 16, color: latestExam.osRefraction < -300 ? '#f5222d' : '#1890ff' }}
              />
            </Col>
            {latestExam.odAxialLength && (
              <>
                <Col span={12}>
                  <Statistic
                    title="右眼眼轴"
                    value={latestExam.odAxialLength}
                    precision={2}
                    suffix="mm"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="左眼眼轴"
                    value={latestExam.osAxialLength}
                    precision={2}
                    suffix="mm"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
              </>
            )}
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                检查日期: {new Date(latestExam.date).toLocaleDateString()}
              </Text>
            </Col>
          </Row>
        ) : (
          <Empty description="暂无检查数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      {/* 待办任务 */}
      <Card size="small" title="待办任务" style={{ marginTop: 12 }} bodyStyle={{ padding: '8px 12px' }}>
        <List
          size="small"
          dataSource={mockTodos}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Space>
                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                <div>
                  <Text style={{ display: 'block' }}>{item.title}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.dueDate}</Text>
                </div>
              </Space>
            </List.Item>
          )}
          locale={{ emptyText: '暂无待办' }}
        />
      </Card>

      {/* 操作按钮 */}
      <div style={{ marginTop: 12 }}>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Button type="primary" block icon={<EyeOutlined />} onClick={onViewDetail}>
            查看完整档案
          </Button>
          <Button block>发起任务</Button>
        </Space>
      </div>
    </div>
  );
};

export default CustomerSidebar;
