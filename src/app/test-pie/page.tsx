'use client';

import React from 'react';
import { Card } from 'antd';
import { Pie } from '@ant-design/charts';
import { generateOverviewMockData } from '@/services/api/dashboard';

export default function TestPiePage() {
  // 直接测试referralData
  const mockData = generateOverviewMockData();
  const referralData = mockData.referralData;

  console.log('测试页面 - ReferralData:', referralData);

  const pieConfig = {
    data: referralData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>全院流量流转图表测试</h1>
      <Card title="测试数据">
        <pre>{JSON.stringify(referralData, null, 2)}</pre>
      </Card>
      <Card title="图表显示" style={{ marginTop: 16 }}>
        <Pie {...pieConfig} />
      </Card>
    </div>
  );
}
