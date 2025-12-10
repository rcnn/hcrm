import { NextRequest, NextResponse } from 'next/server';

interface SendMessageRequest {
  customerId: string;
  content: string;
  type?: string;
  channel: 'wecom' | 'sms' | 'call';
  attachments?: any[];
}

// 消息日志存储（Mock）
const messageLogs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { customerId, content, type = 'text', channel, attachments = [] } = body;

    if (!customerId || !content || !channel) {
      return NextResponse.json(
        { code: 400, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 生成消息ID
    const messageId = `MSG_${channel.toUpperCase()}_${Date.now()}`;

    // 记录消息日志
    const logEntry = {
      id: messageId,
      customerId,
      channel,
      messageType: type,
      content,
      attachments,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    messageLogs.push(logEntry);

    // 模拟发送延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock发送逻辑
    let result;
    switch (channel) {
      case 'wecom':
        result = await sendWeComMessage(content);
        break;
      case 'sms':
        result = await sendSMS(content);
        break;
      case 'call':
        result = await initiateAICall(content);
        break;
      default:
        return NextResponse.json(
          { code: 400, message: 'Unsupported channel' },
          { status: 400 }
        );
    }

    // 更新日志状态
    const logIndex = messageLogs.findIndex(log => log.id === messageId);
    if (logIndex !== -1) {
      messageLogs[logIndex] = {
        ...messageLogs[logIndex],
        status: 'sent',
        sentAt: new Date().toISOString(),
        externalId: (result as any).externalId
      };
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWeComMessage(content: string) {
  // Mock企业微信消息发送
  return {
    messageId: `WECOM_${Date.now()}`,
    status: 'sent',
    sentAt: new Date().toISOString(),
    deliveryStatus: 'delivered'
  };
}

async function sendSMS(content: string) {
  // Mock短信发送
  return {
    smsId: `SMS_${Date.now()}`,
    status: 'scheduled',
    estimatedDelivery: new Date(Date.now() + 60000).toISOString()
  };
}

async function initiateAICall(content: string) {
  // MockAI外呼
  return {
    callId: `CALL_${Date.now()}`,
    status: 'initiated',
    estimatedDuration: 120
  };
}
