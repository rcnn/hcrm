import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 模拟管理驾驶舱数据
const generateOverviewData = () => {
  // 生成院区排名数据
  const hospitalRanking = [
    { rank: 1, name: '总部医院', completionRate: 95 },
    { rank: 2, name: '东区医院', completionRate: 88 },
    { rank: 3, name: '西区医院', completionRate: 82 },
    { rank: 4, name: '南区医院', completionRate: 87 },
    { rank: 5, name: '北区医院', completionRate: 90 },
  ];

  // 生成流量流转数据
  const referralData = [
    { type: '角塑转介绍', value: 45 },
    { type: '屈光转介绍', value: 32 },
    { type: '框架镜转介绍', value: 23 },
  ];

  return {
    kpis: {
      newCustomersToday: Math.floor(Math.random() * 50) + 100,
      monthlyRevenue: Math.random() * 200 + 250,
      activeCustomers: Math.floor(Math.random() * 200) + 1200,
      avgOrderValue: Math.floor(Math.random() * 500) + 2000,
    },
    progressIndicators: {
      replacementRate: Math.floor(Math.random() * 20) + 80,
      revisitRate: Math.floor(Math.random() * 20) + 70,
      churnRate: Math.random() * 5 + 5,
      diseaseAvgPrice: Math.floor(Math.random() * 1000) + 4000,
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        type: '流失率',
        rate: Math.random() * 5 + 5,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        type: '复购率',
        rate: Math.random() * 10 + 30,
      })),
    ],
    hospitalRankings: hospitalRanking,
    referralData,
    alerts: [
      {
        id: '1',
        type: 'price_drop',
        severity: 'high',
        message: '客单价连续下降：近7天客单价下降超过15%',
        department: '运营部',
        timestamp: new Date(),
        status: 'active',
      },
      {
        id: '2',
        type: 'churn_spike',
        severity: 'medium',
        message: '流失率异常：北区医院流失率达到12.5%，超过预警阈值',
        department: '销售部',
        timestamp: new Date(),
        status: 'active',
      },
      {
        id: '3',
        type: 'conversion_drop',
        severity: 'low',
        message: '转化率提醒：本月目标完成率已达92%',
        department: '市场部',
        timestamp: new Date(),
        status: 'active',
      },
    ],
  };
};

// GET /api/dashboard/overview
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const hospitalId = searchParams.get('hospitalId');

    // 在实际应用中，这里会从数据库查询真实数据
    const data = generateOverviewData();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching overview dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取概览数据失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
