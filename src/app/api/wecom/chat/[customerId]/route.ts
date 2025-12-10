import { NextRequest, NextResponse } from 'next/server';

// Mock聊天记录
const mockChatRecords: Record<string, any[]> = {
  'C001': [
    {
      id: 'MSG001',
      timestamp: '2024-12-10T10:30:00',
      sender: 'staff',
      content: '您好，张先生，小明的镜片需要更换了',
      type: 'text',
      readStatus: 'read'
    },
    {
      id: 'MSG002',
      timestamp: '2024-12-10T10:35:00',
      sender: 'customer',
      content: '好的，大概什么时候可以更换？',
      type: 'text',
      readStatus: 'read'
    },
    {
      id: 'MSG003',
      timestamp: '2024-12-10T10:36:00',
      sender: 'staff',
      content: '我们可以为您预约本周五下午，您看方便吗？',
      type: 'text',
      readStatus: 'unread'
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const records = mockChatRecords[customerId] || [];

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedRecords = records.slice(start, end);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        total: records.length,
        records: paginatedRecords
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
