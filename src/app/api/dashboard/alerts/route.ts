import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 模拟预警数据
const generateAlertsData = () => {
  const alerts = [
    {
      id: 'alert_001',
      type: 'warning',
      title: '客单价连续下降',
      description: '近7天客单价下降超过15%，当前值较上月同期下降18.5%',
      department: '运营部',
      severity: 'high',
      status: 'active',
      createdAt: '2024-12-10T08:30:00Z',
      assignee: '张经理',
      metric: 'avgTransactionValue',
      currentValue: 3850,
      threshold: 4500,
      trend: 'down',
    },
    {
      id: 'alert_002',
      type: 'error',
      title: '企微回复超时率过高',
      description: '企微回复时间超过30分钟的比例达到25%，超出阈值15%',
      department: '客服部',
      severity: 'critical',
      status: 'active',
      createdAt: '2024-12-10T09:15:00Z',
      assignee: '李主管',
      metric: 'wechatResponseTime',
      currentValue: 35,
      threshold: 30,
      trend: 'up',
    },
    {
      id: 'alert_003',
      type: 'info',
      title: '月度目标达成提醒',
      description: '本月销售目标完成率已达92%，预计可按时完成',
      department: '销售部',
      severity: 'low',
      status: 'active',
      createdAt: '2024-12-10T10:00:00Z',
      assignee: '王总监',
      metric: 'monthlyTarget',
      currentValue: 92,
      threshold: 90,
      trend: 'up',
    },
    {
      id: 'alert_004',
      type: 'warning',
      title: '客户流失率上升',
      description: '本周客户流失率上升至5.2%，超过警戒线4%',
      department: '运营部',
      severity: 'high',
      status: 'acknowledged',
      createdAt: '2024-12-09T16:20:00Z',
      assignee: '赵经理',
      metric: 'churnRate',
      currentValue: 5.2,
      threshold: 4.0,
      trend: 'up',
    },
    {
      id: 'alert_005',
      type: 'success',
      title: '转介绍率创新高',
      description: '本月转介绍率达到28%，创历史新高',
      department: '市场部',
      severity: 'low',
      status: 'resolved',
      createdAt: '2024-12-08T11:00:00Z',
      assignee: '陈经理',
      metric: 'referralRate',
      currentValue: 28,
      threshold: 25,
      trend: 'up',
      resolvedAt: '2024-12-09T14:30:00Z',
      resolution: '继续保持现有推广策略',
    },
  ];

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    bySeverity: {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
    },
    byDepartment: {
      '运营部': alerts.filter(a => a.department === '运营部').length,
      '销售部': alerts.filter(a => a.department === '销售部').length,
      '客服部': alerts.filter(a => a.department === '客服部').length,
      '市场部': alerts.filter(a => a.department === '市场部').length,
    },
  };

  const alertTrends = Array.from({ length: 30 }, (_, i) => ({
    date: `12/${i + 1}`,
    count: Math.floor(Math.random() * 5) + 1,
    resolved: Math.floor(Math.random() * 4) + 1,
  }));

  return {
    alerts,
    alertStats,
    alertTrends,
  };
};

// GET /api/dashboard/alerts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const department = searchParams.get('department');
    const limit = parseInt(searchParams.get('limit') || '50');

    const data = generateAlertsData();

    // 过滤数据
    let filteredAlerts = data.alerts;
    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    if (department) {
      filteredAlerts = filteredAlerts.filter(alert => alert.department === department);
    }

    // 限制返回数量
    filteredAlerts = filteredAlerts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        alerts: filteredAlerts,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取预警数据失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/alerts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId, comment } = body;

    // 在实际应用中，这里会更新数据库
    // 模拟处理不同的操作
    switch (action) {
      case 'acknowledge':
        // 确认预警
        console.log(`Acknowledging alert ${alertId}`);
        break;
      case 'resolve':
        // 解决预警
        console.log(`Resolving alert ${alertId} with comment: ${comment}`);
        break;
      case 'assign':
        // 分配预警
        console.log(`Assigning alert ${alertId}`);
        break;
      default:
        throw new Error('Invalid action');
    }

    return NextResponse.json({
      success: true,
      message: `预警${action}操作成功`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing alert action:', error);
    return NextResponse.json(
      {
        success: false,
        message: '操作失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
