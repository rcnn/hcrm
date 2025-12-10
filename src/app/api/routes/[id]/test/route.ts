import { NextRequest, NextResponse } from 'next/server';
import { mockRules } from '../../../mock-data';

// POST /api/rules/:id/test - 测试规则
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { testData } = body;

    const rule = mockRules.find((r: any) => r.id === params.id);

    if (!rule) {
      return NextResponse.json(
        { code: 404, message: '规则不存在' },
        { status: 404 }
      );
    }

    // 模拟规则评估
    const matchedConditions: any[] = [];
    let allConditionsMatch = true;

    // 简单的条件匹配逻辑
    for (const condition of rule.conditions) {
      const fieldValue = testData[condition.field];
      let conditionMatch = false;

      switch (condition.operator) {
        case 'gt':
          conditionMatch = fieldValue > condition.value;
          break;
        case 'lt':
          conditionMatch = fieldValue < condition.value;
          break;
        case 'gte':
          conditionMatch = fieldValue >= condition.value;
          break;
        case 'lte':
          conditionMatch = fieldValue <= condition.value;
          break;
        case 'eq':
          conditionMatch = fieldValue === condition.value;
          break;
      }

      if (conditionMatch) {
        matchedConditions.push({
          field: condition.field,
          value: fieldValue,
          operator: condition.operator,
          expected: condition.value,
          match: true
        });
      } else {
        matchedConditions.push({
          field: condition.field,
          value: fieldValue,
          operator: condition.operator,
          expected: condition.value,
          match: false
        });
        if (condition.andOr === 'AND' || condition.andOr === undefined) {
          allConditionsMatch = false;
        }
      }
    }

    const matched = allConditionsMatch;

    // 如果匹配，执行动作
    const executedActions = matched ? rule.actions : [];

    // 模拟影响客户数量
    const impactCount = matched ? Math.floor(Math.random() * 200) + 50 : 0;

    return NextResponse.json({
      code: 200,
      data: {
        matched,
        matchedConditions,
        executedActions,
        impactCount,
        testData
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '测试规则失败' },
      { status: 500 }
    );
  }
}
