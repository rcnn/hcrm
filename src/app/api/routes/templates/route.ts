import { NextRequest, NextResponse } from 'next/server';
import { mockTemplates } from '../../mock-data';

export const dynamic = 'force-dynamic';

// GET /api/rules/templates - 获取规则模板
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  let templates = [...mockTemplates];

  // 按分类筛选
  if (category) {
    templates = templates.filter(t => t.category === category);
  }

  return NextResponse.json({
    code: 200,
    data: templates
  });
}
