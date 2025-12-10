'use client';

import React from 'react';
import { Descriptions, Tag, Card } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Customer } from '@/lib/types/customer';
import StatusTag from '@/components/common/StatusTag';

interface CustomerBasicInfoProps {
  customer: Customer;
}

const CustomerBasicInfo: React.FC<CustomerBasicInfoProps> = ({ customer }) => {
  const productColor = customer.currentProduct === '角塑' ? '#1890ff' : '#52c41a';

  return (
    <Card title="基本信息" size="small">
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="患者姓名">
          <UserOutlined style={{ marginRight: 8 }} />
          {customer.name}
        </Descriptions.Item>
        <Descriptions.Item label="年龄/性别">
          {customer.age}岁 / {customer.gender === 'M' ? '男' : '女'}
        </Descriptions.Item>
        <Descriptions.Item label="家长姓名">{customer.parentName}</Descriptions.Item>
        <Descriptions.Item label="联系电话">
          <PhoneOutlined style={{ marginRight: 8 }} />
          {customer.parentPhone}
        </Descriptions.Item>
        <Descriptions.Item label="客户分类">
          <StatusTag status={customer.category} type="category" />
        </Descriptions.Item>
        <Descriptions.Item label="当前产品">
          <Tag color={productColor} style={{ borderRadius: 0 }}>
            {customer.currentProduct}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="归属员工">{customer.ownerName}</Descriptions.Item>
        <Descriptions.Item label="所属院区">{customer.hospital || '-'}</Descriptions.Item>
        <Descriptions.Item label="建档日期">
          <CalendarOutlined style={{ marginRight: 8 }} />
          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="最近到院">
          {customer.lastVisitDate ? new Date(customer.lastVisitDate).toLocaleDateString() : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default CustomerBasicInfo;
