import { NextRequest, NextResponse } from 'next/server';

interface CompleteTaskRequest {
  taskId: string;
  remark?: string;
  nextActions?: any[];
}

// Mock任务数据
const mockTasks: Record<string, any> = {
  'T001': {
    id: 'T001',
    title: '复查邀约',
    type: 'follow_up',
    status: 'pending',
    priority: 'high',
    customerId: 'C001',
    createdAt: '2024-12-10T09:00:00',
    remarks: []
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: CompleteTaskRequest = await request.json();
    const { taskId, remark, nextActions = [] } = body;

    if (!taskId) {
      return NextResponse.json(
        { code: 400, message: 'Missing taskId' },
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

    // 更新任务状态
    task.status = 'completed';
    task.completedAt = new Date().toISOString();

    // 添加备注
    if (remark) {
      task.remarks = task.remarks || [];
      task.remarks.push({
        id: `R_${Date.now()}`,
        content: remark,
        createdBy: 'current_user',
        createdAt: new Date().toISOString()
      });
    }

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        taskId: task.id,
        status: task.status,
        completedAt: task.completedAt,
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
