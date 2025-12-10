import { NextRequest, NextResponse } from 'next/server';

interface SendNotificationRequest {
  userId: string;
  type: 'task_reminder' | 'customer_reply' | 'system_alert';
  title: string;
  content: string;
  data?: Record<string, any>;
}

// Mock通知存储
const notifications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();
    const { userId, type, title, content, data = {} } = body;

    if (!userId || !type || !title || !content) {
      return NextResponse.json(
        { code: 400, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notificationId = `NOTIF_${Date.now()}`;
    const notification = {
      id: notificationId,
      userId,
      type,
      title,
      content,
      status: 'unread',
      priority: 'normal' as const,
      data,
      createdAt: new Date().toISOString()
    };

    notifications.push(notification);

    // 模拟推送延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        notificationId,
        status: 'sent',
        sentAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
