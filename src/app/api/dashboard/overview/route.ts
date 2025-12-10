import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 模拟管理驾驶舱数据
const generateOverviewData = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const currentMonth = new Date().getMonth();

  // 生成趋势数据
  const trendData = months.map((month, index) => ({
    month,
    churnRate: 3 + Math.random() * 3,
    revisitRate: 80 + Math.random() * 10,
  }));

  // 生成院区排名数据
  const hospitalRanking = [
    { rank: 1, name: '总部医院', hospital: '总部', completionRate: 95, score: 95, trend: 'up' },
    { rank: 2, name: '东区医院', hospital: '东区', completionRate: 88, score: 88, trend: 'up' },
    { rank: 3, name: '西区医院', hospital: '西区', completionRate: 85, score: 85, trend: 'down' },
    { rank: 4, name: '南区医院', hospital: '南区', completionRate: 82, score: 82, trend: 'up' },
    { rank: 5, name: '北区医院', hospital: '北区', completionRate: 78, score: 78, trend: 'down' },
  ];

  // 生成流量流转数据
  const flowData = [
    { stage: '初诊', count: 1200, percentage: 100 },
    { stage: '复诊', count: 980, percentage: 81.7 },
    { stage: '成交', count: 750, percentage: 62.5 },
    { stage: '转介绍', count: 320, percentage: 26.7 },
  ];

  return {
    kpiCards: {
      newCustomersToday: Math.floor(Math.random() * 50) + 50,
      newCustomersYesterday: Math.floor(Math.random() * 50) + 45,
      monthlyRevenue: (Math.random() * 500 + 800).toFixed(2),
      monthlyRevenueGrowth: (Math.random() * 20 - 5).toFixed(2),
      totalCustomers: Math.floor(Math.random() * 5000) + 8000,
      totalCustomersGrowth: (Math.random() * 10 + 5).toFixed(2),
      activePatients: Math.floor(Math.random() * 2000) + 3000,
      activePatientsGrowth: (Math.random() * 15 + 3).toFixed(2),
      avgTransactionValue: (Math.random() * 2000 + 3000).toFixed(2),
      avgTransactionGrowth: (Math.random() * 12 - 3).toFixed(2),
    },
    trendAnalysis: {
      churnRate: {
        current: trendData[currentMonth].churnRate,
        data: trendData,
        target: 3.5,
      },
      revisitRate: {
        current: trendData[currentMonth].revisitRate,
        data: trendData,
        target: 85,
      },
    },
    hospitalRanking,
    flowAnalysis: flowData,
    alerts: [
      {
        id: '1',
        type: 'warning',
        title: '客单价连续下降',
        description: '近7天客单价下降超过15%',
        department: '运营部',
        timestamp: new Date().toISOString(),
        severity: 'high',
      },
      {
        id: '2',
        type: 'info',
        title: '月度目标达成提醒',
        description: '本月目标完成率已达92%',
        department: '销售部',
        timestamp: new Date().toISOString(),
        severity: 'medium',
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
