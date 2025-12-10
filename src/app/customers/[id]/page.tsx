'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Row, Col, Space, Button, Spin, Result, Tabs } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import CustomerBasicInfo from '@/components/customer/CustomerBasicInfo';
import ClinicalDataCard from '@/components/customer/ClinicalDataCard';
import ExaminationTimeline from '@/components/customer/ExaminationTimeline';
import RefractionChart from '@/components/customer/RefractionChart';
import AxialLengthChart from '@/components/customer/AxialLengthChart';
import ReferralButton from '@/components/referral/ReferralButton';
import { getCustomerById } from '@/lib/mock/customers';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <MainLayout>
        <Result
          status="404"
          title="客户不存在"
          subTitle="抱歉，您访问的客户档案不存在"
          extra={
            <Button type="primary" onClick={() => router.push('/customers')}>
              返回客户列表
            </Button>
          }
        />
      </MainLayout>
    );
  }

  const latestExamination = customer.examinations?.[0];

  const tabItems = [
    {
      key: 'overview',
      label: '档案概览',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <CustomerBasicInfo customer={customer} />
              <ClinicalDataCard examination={latestExamination} />
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <ExaminationTimeline examinations={customer.examinations} />
          </Col>
        </Row>
      ),
    },
    {
      key: 'charts',
      label: '数据趋势',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <RefractionChart examinations={customer.examinations} />
          </Col>
          <Col xs={24} xl={12}>
            <AxialLengthChart examinations={customer.examinations} age={customer.age} />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/customers')}>
                返回列表
              </Button>
              <h2 style={{ margin: 0 }}>{customer.name} - 客户档案</h2>
            </Space>
            <Space>
              <ReferralButton customer={customer} />
              <Button type="primary" icon={<EditOutlined />}>
                编辑资料
              </Button>
            </Space>
          </div>
          <Tabs defaultActiveKey="overview" items={tabItems} />
        </Space>
      </div>
    </MainLayout>
  );
}
