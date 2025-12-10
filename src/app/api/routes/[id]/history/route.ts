import { NextRequest, NextResponse } from 'next/server';
import { mockRuleHistory } from '../../../mock-data';

// GET /api/routes/:id/history - 获取规则历史版本列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ruleId = params.id;
  const history = mockRuleHistory
    .filter((h: any) => h.ruleId === ruleId)
    .sort((a: any, b: any) => b.version - a.version);

  return NextResponse.json({
    code: 200,
    data: history
  });
}
