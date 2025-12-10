import { NextRequest, NextResponse } from 'next/server';

interface AddRemarkRequest {
  taskId: string;
  remark: string;
}

// Mock任务数据
const mockTasks: Record<string, any> = {
  'T001': {
    id: 'T001',
    title: '复查邀约',
    remarks: []
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: AddRemarkRequest = await request.json();
    const { taskId, remark } = body;

    if (!taskId || !remark) {
      return NextResponse.json(
        { code: 400, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const task = mockTasks[taskId];
    if (!task) {
      return NextResponse.json(
        { code: 404, message: 'Task not found' },
        { status: 404 }
      );
    }

    // 添加备注
    const newRemark = {
      id: `R_${Date.now()}`,
      content: remark,
      createdBy: 'current_user',
      createdAt: new Date().toISOString()
    };

    task.remarks = task.remarks || [];
    task.remarks.push(newRemark);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        taskId: task.id,
        remarks: task.remarks
      }
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
