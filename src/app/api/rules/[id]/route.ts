import { NextRequest, NextResponse } from 'next/server';
import { mockRules } from '../../mock-data';

// GET /api/rules/:id - 获取规则详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rule = mockRules.find((r: any) => r.id === params.id);

  if (!rule) {
    return NextResponse.json(
      { code: 404, message: '规则不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    code: 200,
    data: rule
  });
}

// PUT /api/rules/:id - 更新规则
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      description,
      conditions,
      actions,
      enabled,
      priority,
      effectiveFrom,
      effectiveTo
    } = body;

    const ruleIndex = mockRules.findIndex((r: any) => r.id === params.id);

    if (ruleIndex === -1) {
      return NextResponse.json(
        { code: 404, message: '规则不存在' },
        { status: 404 }
      );
    }

    const updatedRule = {
      ...mockRules[ruleIndex],
      name: name || mockRules[ruleIndex].name,
      category: category || mockRules[ruleIndex].category,
      description: description !== undefined ? description : mockRules[ruleIndex].description,
      conditions: conditions || mockRules[ruleIndex].conditions,
      actions: actions || mockRules[ruleIndex].actions,
      enabled: enabled !== undefined ? enabled : mockRules[ruleIndex].enabled,
      priority: priority !== undefined ? priority : (mockRules[ruleIndex] as any).priority,
      version: mockRules[ruleIndex].version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current_user'
    };

    // 在实际应用中，这里应该更新数据库
    // mockRules[ruleIndex] = updatedRule;

    return NextResponse.json({
      code: 200,
      data: {
        id: updatedRule.id,
        version: updatedRule.version,
        updatedAt: updatedRule.updatedAt
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '更新规则失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/rules/:id - 删除规则
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ruleIndex = mockRules.findIndex((r: any) => r.id === params.id);

  if (ruleIndex === -1) {
    return NextResponse.json(
      { code: 404, message: '规则不存在' },
      { status: 404 }
    );
  }

  // 在实际应用中，这里应该软删除
  // mockRules[ruleIndex].is_deleted = true;

  return NextResponse.json({
    code: 200,
    data: {
      message: '规则删除成功'
    }
  });
}
