import { NextRequest, NextResponse } from 'next/server';
import { mockRules } from '../mock-data';

export const dynamic = 'force-dynamic';

// GET /api/rules - 获取规则列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const enabled = searchParams.get('enabled');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  let filteredRules = [...mockRules];

  // 按分类筛选
  if (category) {
    filteredRules = filteredRules.filter(rule => rule.category === category);
  }

  // 按状态筛选
  if (enabled !== null) {
    const enabledBool = enabled === 'true';
    filteredRules = filteredRules.filter(rule => rule.enabled === enabledBool);
  }

  // 分页
  const total = filteredRules.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredRules.slice(start, end);

  return NextResponse.json({
    code: 200,
    data: {
      total,
      list
    }
  });
}

// POST /api/rules - 创建规则
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      description,
      conditions,
      actions,
      enabled = true,
      priority = 100,
      effectiveFrom
    } = body;

    // 验证必填字段
    if (!name || !category || !conditions || !actions) {
      return NextResponse.json(
        { code: 400, message: '缺少必填字段' },
        { status: 400 }
      );
    }

    const newRule = {
      id: `rule_${Date.now()}`,
      name,
      category,
      description: description || '',
      conditions,
      actions,
      enabled,
      priority,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user',
      updatedBy: 'current_user',
      effectiveFrom: effectiveFrom || null
    };

    // 在实际应用中，这里应该保存到数据库
    // mockRules.push(newRule);

    return NextResponse.json(
      {
        code: 201,
        data: {
          id: newRule.id,
          version: newRule.version,
          createdAt: newRule.createdAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '创建规则失败' },
      { status: 500 }
    );
  }
}
