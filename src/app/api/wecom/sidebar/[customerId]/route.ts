import { NextRequest, NextResponse } from 'next/server';

// Mock客户数据
const mockCustomers: Record<string, any> = {
  'C001': {
    id: 'C001',
    name: '张小明',
    parentName: '张先生',
    phone: '138****8888',
    lastCheckDate: '2024-10-15',
    refraction: {
      rightEye: '-2.50',
      leftEye: '-2.75'
    },
    productType: '角膜塑形镜',
    wearDuration: '8个月',
    tags: ['高风险', '复诊']
  }
};

// Mock任务数据
const mockTasks: Record<string, any[]> = {
  'C001': [
    {
      id: 'T001',
      title: '复查邀约',
      type: 'follow_up',
      priority: 'high',
      dueDate: '2024-12-15',
      status: 'pending',
      description: '距离上次复查已3个月，需要邀约复查'
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = mockCustomers[customerId];
    const tasks = mockTasks[customerId] || [];

    if (!customer) {
      return NextResponse.json(
        { code: 404, message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        customer,
        tasks
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
