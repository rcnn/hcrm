import { NextRequest, NextResponse } from 'next/server';

// 模拟个人看板数据
const generatePersonalData = (employeeId?: string) => {
  // 模拟员工信息
  const employeeInfo = {
    id: employeeId || 'emp_001',
    name: '张三',
    role: '框架镜销售',
    department: '销售部',
    hospital: '总部医院',
    avatar: '/avatars/employee1.jpg',
    level: '高级销售',
    joinDate: '2022-03-15',
  };

  // 生成月度业绩数据
  const monthlyPerformance = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    revenue: Math.floor(Math.random() * 50000) + 30000,
    newCustomers: Math.floor(Math.random() * 30) + 20,
    referrals: Math.floor(Math.random() * 10) + 5,
  }));

  // 生成任务进度数据
  const taskProgress = {
    total: 45,
    completed: 32,
    inProgress: 8,
    pending: 5,
    completionRate: 71,
  };

  // 生成客户分析数据
  const customerAnalysis = {
    byAge: [
      { range: '0-18岁', count: 25, percentage: 15.2 },
      { range: '18-30岁', count: 45, percentage: 27.3 },
      { range: '30-45岁', count: 52, percentage: 31.5 },
      { range: '45-60岁', count: 28, percentage: 17.0 },
      { range: '60岁以上', count: 15, percentage: 9.0 },
    ],
    byProduct: [
      { type: '框架镜', count: 98, percentage: 59.4 },
      { type: '角塑镜', count: 45, percentage: 27.3 },
      { type: '隐形眼镜', count: 22, percentage: 13.3 },
    ],
    byChannel: [
      { channel: '线上咨询', count: 52, percentage: 31.5 },
      { channel: '门店来访', count: 78, percentage: 47.3 },
      { channel: '转介绍', count: 35, percentage: 21.2 },
    ],
  };

  // 生成转介绍数据
  const referralData = {
    totalReferrals: 35,
    successfulReferrals: 28,
    pendingReferrals: 7,
    estimatedBonus: 8400,
    actualBonus: 5600,
    topReferrers: [
      { name: '李四', referrals: 8, bonus: 1600 },
      { name: '王五', referrals: 6, bonus: 1200 },
      { name: '赵六', referrals: 5, bonus: 1000 },
    ],
  };

  // 生成排名数据
  const ranking = {
    monthlyRank: 5,
    totalEmployees: 28,
    score: 88.5,
    trends: [
      { month: '7月', rank: 8, score: 82 },
      { month: '8月', rank: 6, score: 85 },
      { month: '9月', rank: 5, score: 88.5 },
    ],
  };

  return {
    employeeInfo,
    monthlyPerformance,
    taskProgress,
    customerAnalysis,
    referralData,
    ranking,
  };
};

// GET /api/dashboard/personal
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get('employeeId') || undefined;
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // 在实际应用中，这里会从数据库查询真实数据
    const data = generatePersonalData(employeeId);

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching personal dashboard:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取个人看板数据失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
