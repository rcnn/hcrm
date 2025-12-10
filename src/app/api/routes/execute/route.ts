import { NextRequest, NextResponse } from 'next/server';
import { mockRules } from '../../mock-data';
export const dynamic = 'force-dynamic';

// GET /api/rules/execute - 模拟规则执行
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ruleId = searchParams.get('ruleId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const rule = mockRules.find(r => r.id === ruleId);

  if (!rule) {
    return NextResponse.json(
      { code: 404, message: '规则不存在' },
      { status: 404 }
    );
  }

  // 模拟执行结果
  const totalCustomers = 1500;
  const matchedCustomers = Math.floor(totalCustomers * 0.15); // 约15%匹配
  const generatedTasks = matchedCustomers;

  // 按条件统计
  const breakdownByCondition: Record<string, number> = {};
  for (const condition of rule.conditions) {
    breakdownByCondition[`${condition.field} ${condition.operator} ${condition.value}`] =
      Math.floor(Math.random() * 200) + 50;
  }

  return NextResponse.json({
    code: 200,
    data: {
      ruleId,
      ruleName: rule.name,
      executionDate: new Date().toISOString().split('T')[0],
      period: {
        start: startDate || '2024-12-01',
        end: endDate || '2024-12-10'
      },
      totalCustomers,
      matchedCustomers,
      generatedTasks,
      breakdownByCondition,
      executionTime: Math.floor(Math.random() * 5000) + 1000 // 1-6秒
    }
  });
}
