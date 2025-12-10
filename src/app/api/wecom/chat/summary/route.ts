import { NextRequest, NextResponse } from 'next/server';

interface ChatRecord {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface SummaryRequest {
  customerId: string;
  chatRecords: ChatRecord[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json();
    const { customerId, chatRecords } = body;

    if (!customerId || !chatRecords || chatRecords.length === 0) {
      return NextResponse.json(
        { code: 400, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock智能总结逻辑
    const summary = generateMockSummary(chatRecords);

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        summary,
        generatedTasks: summary.intentionLevel === 'high' ? [
          {
            title: '邀约复查',
            type: 'follow_up',
            priority: 'high',
            dueDate: '2024-12-15'
          }
        ] : []
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockSummary(chatRecords: ChatRecord[]) {
  // 简单的关键词匹配模拟AI分析
  const allContent = chatRecords.map(r => r.content).join(' ');

  let intentionLevel = 'medium';
  const keyPoints: string[] = [];
  const concerns: string[] = [];
  const nextActions: string[] = [];
  const tags: string[] = [];

  // 检测意向等级
  if (allContent.includes('好的') || allContent.includes('可以') || allContent.includes('方便')) {
    intentionLevel = 'high';
    keyPoints.push('客户配合度高');
    tags.push('意向强');
  } else if (allContent.includes('考虑') || allContent.includes('商量')) {
    intentionLevel = 'medium';
    tags.push('考虑中');
  } else {
    intentionLevel = 'low';
    tags.push('犹豫');
  }

  // 检测关注点
  if (allContent.includes('度数') || allContent.includes('增长')) {
    concerns.push('担心度数增长');
    keyPoints.push('关注度数控制');
    nextActions.push('强调近视防控重要性');
  }

  if (allContent.includes('价格') || allContent.includes('费用')) {
    concerns.push('关注价格');
    nextActions.push('提供优惠方案');
  }

  if (allContent.includes('时间') || allContent.includes('什么时候')) {
    keyPoints.push('关注时间安排');
    nextActions.push('提供灵活预约时间');
  }

  // 生成后续行动建议
  if (intentionLevel === 'high') {
    nextActions.push('邀约复查', '推荐防控方案');
  } else if (intentionLevel === 'medium') {
    nextActions.push('持续跟进', '提供成功案例');
  } else {
    nextActions.push('定期关怀', '发送护眼知识');
  }

  return {
    intentionLevel,
    keyPoints,
    concerns,
    nextActions,
    tags
  };
}
