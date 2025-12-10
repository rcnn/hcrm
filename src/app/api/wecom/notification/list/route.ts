import { NextRequest, NextResponse } from 'next/server';

// Mock通知数据
const mockNotifications = [
  {
    id: 'NOTIF_001',
    type: 'task_reminder',
    title: '新任务提醒',
    content: '张小明的复查任务已到期',
    status: 'unread',
    createdAt: '2024-12-10T11:57:00',
    data: {
      taskId: 'T001',
      customerId: 'C001'
    }
  },
  {
    id: 'NOTIF_002',
    type: 'customer_reply',
    title: '客户回复提醒',
    content: '张先生已回复您的消息',
    status: 'unread',
    createdAt: '2024-12-10T10:35:00',
    data: {
      customerId: 'C001',
      messageId: 'MSG002'
    }
  },
  {
    id: 'NOTIF_003',
    type: 'system_alert',
    title: '系统预警',
    content: '客单价连续3天下降超过15%',
    status: 'read',
    createdAt: '2024-12-09T09:00:00',
    data: {
      alertType: 'price_anomaly'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!userId) {
      return NextResponse.json(
        { code: 400, message: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // 过滤通知
    let filtered = mockNotifications;
    if (status) {
      filtered = filtered.filter(n => n.status === status);
    }

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        total: filtered.length,
        notifications: paginated
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
