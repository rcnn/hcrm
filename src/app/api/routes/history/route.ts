import { NextRequest, NextResponse } from 'next/server';

// GET /api/rules/history - 获取规则历史
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ruleId = searchParams.get('ruleId');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  if (!ruleId) {
    return NextResponse.json(
      { code: 400, message: '缺少ruleId参数' },
      { status: 400 }
    );
  }

  // 模拟历史数据
  const mockHistory = [
    {
      version: 3,
      changedBy: '李四',
      changedAt: '2024-12-10T10:30:00Z',
      changes: [
        {
          field: 'actions[0].params.reminderDays',
          oldValue: 30,
          newValue: 7
        }
      ],
      comment: '调整提前提醒天数'
    },
    {
      version: 2,
      changedBy: '张三',
      changedAt: '2024-11-15T14:20:00Z',
      changes: [
        {
          field: 'conditions[0].value',
          oldValue: 500,
          newValue: 550
        }
      ],
      comment: '调整换片周期为550天'
    },
    {
      version: 1,
      changedBy: '张三',
      changedAt: '2024-11-01T08:00:00Z',
      changes: [],
      comment: '初始创建'
    }
  ];

  const total = mockHistory.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const history = mockHistory.slice(start, end);

  return NextResponse.json({
    code: 200,
    data: {
      ruleId,
      history,
      total
    }
  });
}
