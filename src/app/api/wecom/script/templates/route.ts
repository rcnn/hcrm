import { NextRequest, NextResponse } from 'next/server';

// 话术模板数据
const templates = [
  {
    id: 'TPL_FOLLOW_UP_001',
    name: '复查邀约',
    category: '复诊提醒',
    content: '{parentName}您好！距离{patientName}上次复查已过{daysSinceLastCheck}，上次检查数据显示右眼度数增长了{refractionChange}，建议及时复查。我们可以为您预约{availableDates}的号源。',
    variables: ['parentName', 'patientName', 'daysSinceLastCheck', 'refractionChange', 'availableDates'],
    isPublic: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: 'TPL_LENS_001',
    name: '换片提醒',
    category: '产品提醒',
    content: '{patientName}的镜片已佩戴{duration}，建议及时更换以确保矫正效果',
    variables: ['patientName', 'duration'],
    isPublic: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: 'TPL_RECALL_001',
    name: '流失召回',
    category: '流失召回',
    content: '您好{parentName}，近期注意到{patientName}没有按时复查，为了眼部健康，建议及时联系我们安排复查',
    variables: ['parentName', 'patientName'],
    isPublic: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // 过滤模板
    let filteredTemplates = templates;
    if (category) {
      filteredTemplates = templates.filter(t => t.category === category);
    }

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTemplates = filteredTemplates.slice(start, end);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        total: filteredTemplates.length,
        templates: paginatedTemplates
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, content, variables, isPublic = false } = body;

    if (!name || !category || !content) {
      return NextResponse.json(
        { code: 400, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTemplate = {
      id: `TPL_${Date.now()}`,
      name,
      category,
      content,
      variables: variables || [],
      isPublic,
      createdBy: 'current_user',
      createdAt: new Date().toISOString()
    };

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: newTemplate
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
