import { NextRequest, NextResponse } from 'next/server';

// 模拟预警规则数据
const generateAlertRulesData = () => {
  const rules = [
    {
      id: 'rule_001',
      name: '客单价异常预警',
      description: '当客单价连续下降超过阈值时触发预警',
      metric: 'avgTransactionValue',
      condition: 'decrease',
      threshold: 15,
      timeWindow: 7,
      severity: 'high',
      enabled: true,
      department: '运营部',
      assignees: ['张经理', '李主管'],
      actions: ['send_email', 'send_wechat'],
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-12-01T14:30:00Z',
    },
    {
      id: 'rule_002',
      name: '企微回复超时预警',
      description: '当企微平均回复时间超过阈值时触发预警',
      metric: 'wechatResponseTime',
      condition: 'greater_than',
      threshold: 30,
      timeWindow: 1,
      severity: 'critical',
      enabled: true,
      department: '客服部',
      assignees: ['李主管', '王经理'],
      actions: ['send_email', 'send_sms'],
      createdAt: '2024-10-15T09:00:00Z',
      updatedAt: '2024-11-20T16:20:00Z',
    },
    {
      id: 'rule_003',
      name: '客户流失率预警',
      description: '当客户流失率超过阈值时触发预警',
      metric: 'churnRate',
      condition: 'greater_than',
      threshold: 4.0,
      timeWindow: 7,
      severity: 'high',
      enabled: true,
      department: '运营部',
      assignees: ['赵经理'],
      actions: ['send_email'],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2024-11-15T11:45:00Z',
    },
    {
      id: 'rule_004',
      name: '任务完成率预警',
      description: '当任务完成率低于阈值时触发预警',
      metric: 'taskCompletionRate',
      condition: 'less_than',
      threshold: 80,
      timeWindow: 3,
      severity: 'medium',
      enabled: false,
      department: '管理部',
      assignees: ['陈总监'],
      actions: ['send_wechat'],
      createdAt: '2024-08-01T10:00:00Z',
      updatedAt: '2024-12-01T09:30:00Z',
    },
    {
      id: 'rule_005',
      name: '月度目标达成预警',
      description: '当月度目标完成进度低于预期时触发预警',
      metric: 'monthlyTarget',
      condition: 'less_than',
      threshold: 85,
      timeWindow: 30,
      severity: 'low',
      enabled: true,
      department: '销售部',
      assignees: ['王总监'],
      actions: ['send_email', 'send_wechat'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z',
    },
  ];

  const ruleStats = {
    total: rules.length,
    enabled: rules.filter(r => r.enabled).length,
    disabled: rules.filter(r => !r.enabled).length,
    bySeverity: {
      critical: rules.filter(r => r.severity === 'critical').length,
      high: rules.filter(r => r.severity === 'high').length,
      medium: rules.filter(r => r.severity === 'medium').length,
      low: rules.filter(r => r.severity === 'low').length,
    },
    byDepartment: {
      '运营部': rules.filter(r => r.department === '运营部').length,
      '销售部': rules.filter(r => r.department === '销售部').length,
      '客服部': rules.filter(r => r.department === '客服部').length,
      '管理部': rules.filter(r => r.department === '管理部').length,
    },
  };

  const availableMetrics = [
    { value: 'avgTransactionValue', label: '客单价', unit: '元' },
    { value: 'wechatResponseTime', label: '企微回复时间', unit: '分钟' },
    { value: 'churnRate', label: '客户流失率', unit: '%' },
    { value: 'taskCompletionRate', label: '任务完成率', unit: '%' },
    { value: 'monthlyTarget', label: '月度目标完成度', unit: '%' },
    { value: 'conversionRate', label: '转化率', unit: '%' },
    { value: 'referralRate', label: '转介绍率', unit: '%' },
  ];

  const availableActions = [
    { value: 'send_email', label: '发送邮件' },
    { value: 'send_wechat', label: '发送企微' },
    { value: 'send_sms', label: '发送短信' },
    { value: 'create_task', label: '创建任务' },
  ];

  return {
    rules,
    ruleStats,
    availableMetrics,
    availableActions,
  };
};

// GET /api/dashboard/alerts/rules
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const enabled = searchParams.get('enabled');
    const department = searchParams.get('department');
    const severity = searchParams.get('severity');

    const data = generateAlertRulesData();

    // 过滤数据
    let filteredRules = data.rules;
    if (enabled !== null) {
      const enabledBool = enabled === 'true';
      filteredRules = filteredRules.filter(rule => rule.enabled === enabledBool);
    }
    if (department) {
      filteredRules = filteredRules.filter(rule => rule.department === department);
    }
    if (severity) {
      filteredRules = filteredRules.filter(rule => rule.severity === severity);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        rules: filteredRules,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching alert rules:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取预警规则失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/alerts/rules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      metric,
      condition,
      threshold,
      timeWindow,
      severity,
      department,
      assignees,
      actions,
    } = body;

    // 验证必填字段
    if (!name || !metric || !condition || threshold === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少必填字段',
        },
        { status: 400 }
      );
    }

    // 在实际应用中，这里会保存到数据库
    const newRule = {
      id: `rule_${Date.now()}`,
      name,
      description,
      metric,
      condition,
      threshold,
      timeWindow,
      severity,
      enabled: true,
      department,
      assignees,
      actions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newRule,
      message: '创建预警规则成功',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating alert rule:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建预警规则失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/alerts/rules
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少规则ID',
        },
        { status: 400 }
      );
    }

    // 在实际应用中，这里会更新数据库
    const updatedRule = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedRule,
      message: '更新预警规则成功',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating alert rule:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新预警规则失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
