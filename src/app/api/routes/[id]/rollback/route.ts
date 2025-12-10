import { NextRequest, NextResponse } from 'next/server';
import { mockRules } from '../../../mock-data';

// POST /api/rules/:id/rollback - 回滚到历史版本
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { targetVersion, reason } = body;

    const rule = mockRules.find((r: any) => r.id === params.id);

    if (!rule) {
      return NextResponse.json(
        { code: 404, message: '规则不存在' },
        { status: 404 }
      );
    }

    // 在实际应用中，这里应该从历史表获取目标版本的数据
    // 并创建新版本

    return NextResponse.json({
      code: 200,
      data: {
        id: rule.id,
        version: rule.version + 1,
        rolledBackToVersion: targetVersion,
        updatedAt: new Date().toISOString(),
        reason: reason || ''
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '回滚失败' },
      { status: 500 }
    );
  }
}
