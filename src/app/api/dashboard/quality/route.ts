import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 模拟质控看板数据
const generateQualityData = () => {
  // 生成执行质控数据
  const executionQuality = {
    taskCompletionRanking: [
      { rank: 1, name: '东区医院', completionRate: 96, trend: 'up' },
      { rank: 2, name: '总部医院', completionRate: 95, trend: 'up' },
      { rank: 3, name: '西区医院', completionRate: 92, trend: 'down' },
      { rank: 4, name: '南区医院', completionRate: 88, trend: 'up' },
      { rank: 5, name: '北区医院', completionRate: 85, trend: 'down' },
    ],
    wechatResponseRate: {
      average: 92.5,
      target: 95,
      byHospital: [
        { hospital: '东区医院', rate: 96, responseTime: 15 },
        { hospital: '总部医院', rate: 95, responseTime: 18 },
        { hospital: '西区医院', rate: 91, responseTime: 22 },
        { hospital: '南区医院', rate: 89, responseTime: 25 },
        { hospital: '北区医院', rate: 87, responseTime: 28 },
      ],
    },
    taskCompletionTrend: Array.from({ length: 30 }, (_, i) => ({
      date: `12/${i + 1}`,
      rate: 85 + Math.random() * 15,
    })),
  };

  // 生成经营质控数据
  const businessQuality = {
    avgTransactionValue: {
      current: 3850,
      previous: 4200,
      change: -8.3,
      trend: 'down',
      byHospital: [
        { hospital: '东区医院', value: 4200, change: 5.2 },
        { hospital: '总部医院', value: 4100, change: 2.1 },
        { hospital: '西区医院', value: 3900, change: -3.5 },
        { hospital: '南区医院', value: 3700, change: -6.8 },
        { hospital: '北区医院', value: 3500, change: -12.3 },
      ],
    },
    conversionRate: {
      current: 62.5,
      target: 65,
      trend: 'up',
      byStage: [
        { stage: '初诊-复诊', rate: 85, target: 88 },
        { stage: '复诊-成交', rate: 72, target: 75 },
        { stage: '成交-转介绍', rate: 28, target: 30 },
      ],
    },
    churnRate: {
      current: 4.2,
      target: 3.5,
      trend: 'down',
      byDepartment: [
        { department: '角塑科', rate: 3.2 },
        { department: '框架科', rate: 4.8 },
        { department: '隐形科', rate: 5.5 },
      ],
    },
  };

  // 生成整改单数据
  const rectificationOrders = [
    {
      id: 'RO_001',
      type: '任务完成率低',
      department: '北区医院',
      assignee: '李四',
      priority: 'high',
      status: 'pending',
      createdAt: '2024-12-08T10:00:00Z',
      dueDate: '2024-12-15T10:00:00Z',
      description: '连续3天任务完成率低于80%，需要加强跟进',
    },
    {
      id: 'RO_002',
      type: '企微回复超时',
      department: '西区医院',
      assignee: '王五',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-12-07T14:00:00Z',
      dueDate: '2024-12-12T14:00:00Z',
      description: '企微回复时效超过30分钟，需要优化流程',
    },
    {
      id: 'RO_003',
      type: '客单价异常下降',
      department: '南区医院',
      assignee: '赵六',
      priority: 'high',
      status: 'completed',
      createdAt: '2024-12-05T09:00:00Z',
      dueDate: '2024-12-10T09:00:00Z',
      description: '7天内客单价下降超过15%，已完成整改',
    },
  ];

  // 生成质控报表数据
  const qualityReport = {
    summary: {
      totalOrders: rectificationOrders.length,
      pendingOrders: rectificationOrders.filter(o => o.status === 'pending').length,
      inProgressOrders: rectificationOrders.filter(o => o.status === 'in_progress').length,
      completedOrders: rectificationOrders.filter(o => o.status === 'completed').length,
    },
    trends: Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}月`,
      issues: Math.floor(Math.random() * 10) + 5,
      resolved: Math.floor(Math.random() * 8) + 4,
    })),
  };

  return {
    executionQuality,
    businessQuality,
    rectificationOrders,
    qualityReport,
  };
};

// GET /api/dashboard/quality
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const hospitalId = searchParams.get('hospitalId');
    const department = searchParams.get('department');

    // 在实际应用中，这里会从数据库查询真实数据
    const data = generateQualityData();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching quality dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取质控数据失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
