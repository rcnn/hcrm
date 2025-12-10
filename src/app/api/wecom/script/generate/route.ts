import { NextRequest, NextResponse } from 'next/server';

interface GenerateScriptRequest {
  customerId: string;
  taskType: string;
  customVariables?: Record<string, any>;
}

// 话术模板库
const scriptTemplates = {
  follow_up: {
    id: 'TPL_FOLLOW_UP_001',
    name: '复查邀约',
    category: '复诊提醒',
    content: '{parentName}您好！距离{patientName}上次复查已过{daysSinceLastCheck}，上次检查数据显示右眼度数增长了{refractionChange}，建议及时复查。我们可以为您预约{availableDates}的号源。',
    variables: ['parentName', 'patientName', 'daysSinceLastCheck', 'refractionChange', 'availableDates']
  },
  lens_replacement: {
    id: 'TPL_LENS_001',
    name: '换片提醒',
    category: '产品提醒',
    content: '{patientName}的镜片已佩戴{duration}，建议及时更换以确保矫正效果。',
    variables: ['patientName', 'duration']
  },
  recall: {
    id: 'TPL_RECALL_001',
    name: '流失召回',
    category: '流失召回',
    content: '您好{parentName}，近期注意到{patientName}没有按时复查，为了眼部健康，建议及时联系我们安排复查。',
    variables: ['parentName', 'patientName']
  }
};

// Mock客户数据
const mockCustomers: Record<string, any> = {
  'C001': {
    id: 'C001',
    name: '张小明',
    parentName: '张先生',
    lastCheckDate: '2024-10-15',
    refractionChange: '50度'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScriptRequest = await request.json();
    const { customerId, taskType, customVariables = {} } = body;

    // 获取模板
    const template = scriptTemplates[taskType as keyof typeof scriptTemplates];
    if (!template) {
      return NextResponse.json(
        { code: 400, message: 'Invalid task type' },
        { status: 400 }
      );
    }

    // 获取客户数据
    const customer = mockCustomers[customerId];
    if (!customer) {
      return NextResponse.json(
        { code: 404, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // 计算天数
    const lastCheckDate = new Date(customer.lastCheckDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastCheckDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 构建变量
    const variables = {
      parentName: customer.parentName,
      patientName: customer.name,
      daysSinceLastCheck: `${Math.floor(diffDays / 30)}个月`,
      refractionChange: customer.refractionChange,
      availableDates: ['本周五', '本周六'],
      duration: '8个月',
      ...customVariables
    };

    // 替换变量
    let script = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      script = script.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        script,
        template: {
          id: template.id,
          name: template.name,
          category: template.category
        },
        variables
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
