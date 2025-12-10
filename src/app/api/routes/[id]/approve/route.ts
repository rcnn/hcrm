import { NextRequest, NextResponse } from 'next/server';
import { mockRuleApprovals } from '../../../mock-data';

// GET /api/routes/:id/approve - 获取规则审批记录
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ruleId = params.id;
  const approvals = mockRuleApprovals.filter(a => a.ruleId === ruleId);

  return NextResponse.json({
    code: 200,
    data: approvals
  });
}

// POST /api/routes/:id/approve - 提交审批申请
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { comment, priority } = body;

    const newApproval = {
      id: `approval_${Date.now()}`,
      ruleId: params.id,
      ruleName: `规则 ${params.id}`,
      applicant: 'current_user',
      applyTime: new Date().toISOString(),
      status: 'pending',
      approvalLevel: 1,
      currentApprover: 'manager_001',
      approvalHistory: [],
      comment: comment || '',
      priority: priority || 'medium'
    };

    return NextResponse.json({
      code: 201,
      data: newApproval
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '提交审批失败' },
      { status: 500 }
    );
  }
}
