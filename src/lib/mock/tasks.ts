import { Task, TaskType, TaskStatus, TaskStats } from '@/lib/types/task';
import { mockCustomers } from './customers';
import { mockUsers } from './users';

// 生成模拟任务数据
export const mockTasks: Task[] = [
  {
    id: 'T001',
    type: 'lens_replacement',
    status: 'pending',
    priority: 'high',
    customerId: 'C001',
    customerName: '张小明',
    assignedTo: '2',
    assignedToName: '李护士',
    createdAt: '2024-12-09T00:00:00Z',
    dueAt: '2024-12-10T00:00:00Z',
    createdBy: '3',
    updatedAt: '2024-12-09T00:00:00Z',
    script: '张伟您好，距离小明上次复查已过3个月，建议及时复查...',
  },
  {
    id: 'T002',
    type: 'follow_up',
    status: 'in_progress',
    priority: 'medium',
    customerId: 'C002',
    customerName: '李小红',
    assignedTo: '2',
    assignedToName: '李护士',
    createdAt: '2024-12-08T00:00:00Z',
    dueAt: '2024-12-12T00:00:00Z',
    createdBy: '3',
    updatedAt: '2024-12-09T00:00:00Z',
    notes: '已联系客户，预约本周五复查',
  },
  {
    id: 'T003',
    type: 'recall',
    status: 'completed',
    priority: 'high',
    customerId: 'C005',
    customerName: '刘小刚',
    assignedTo: '2',
    assignedToName: '李护士',
    createdAt: '2024-12-01T00:00:00Z',
    dueAt: '2024-12-05T00:00:00Z',
    completedAt: '2024-12-04T00:00:00Z',
    createdBy: '3',
    updatedAt: '2024-12-04T00:00:00Z',
    notes: '客户已同意到院复查',
  },
  {
    id: 'T004',
    type: 'referral',
    status: 'overdue',
    priority: 'medium',
    customerId: 'C003',
    customerName: '王小龙',
    assignedTo: '1',
    assignedToName: '张医生',
    createdAt: '2024-12-01T00:00:00Z',
    dueAt: '2024-12-03T00:00:00Z',
    createdBy: '3',
    updatedAt: '2024-12-01T00:00:00Z',
    isOverdue: true,
    overdueHours: 120,
  },
  {
    id: 'T005',
    type: 'lens_replacement',
    status: 'pending',
    priority: 'medium',
    customerId: 'C003',
    customerName: '王小龙',
    assignedTo: '1',
    assignedToName: '张医生',
    createdAt: '2024-12-09T00:00:00Z',
    dueAt: '2024-12-15T00:00:00Z',
    createdBy: '3',
    updatedAt: '2024-12-09T00:00:00Z',
  },
];

// 根据ID获取任务
export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find((task) => task.id === id);
};

// 根据归属人获取任务
export const getTasksByAssignedTo = (assignedTo: string): Task[] => {
  return mockTasks.filter((task) => task.assignedTo === assignedTo);
};

// 根据状态获取任务
export const getTasksByStatus = (status: TaskStatus): Task[] => {
  return mockTasks.filter((task) => task.status === status);
};

// 根据类型获取任务
export const getTasksByType = (type: TaskType): Task[] => {
  return mockTasks.filter((task) => task.type === type);
};

// 搜索任务
export const searchTasks = (keyword: string): Task[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockTasks.filter(
    (task) =>
      task.customerName.toLowerCase().includes(lowerKeyword) ||
      task.notes?.toLowerCase().includes(lowerKeyword)
  );
};

// 获取任务统计
export const getTaskStats = (assignedTo?: string): TaskStats => {
  let tasks = mockTasks;
  if (assignedTo) {
    tasks = getTasksByAssignedTo(assignedTo);
  }

  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.status === 'overdue').length,
    lensReplacement: tasks.filter((t) => t.type === 'lens_replacement').length,
    followUp: tasks.filter((t) => t.type === 'follow_up').length,
    recall: tasks.filter((t) => t.type === 'recall').length,
    referral: tasks.filter((t) => t.type === 'referral').length,
  };
};

// 完成任务
export const completeTask = (id: string): Task | undefined => {
  const task = getTaskById(id);
  if (task) {
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
  }
  return task;
};

// 更新任务状态
export const updateTaskStatus = (id: string, status: TaskStatus, notes?: string): Task | undefined => {
  const task = getTaskById(id);
  if (task) {
    task.status = status;
    if (notes) {
      task.notes = notes;
    }
    task.updatedAt = new Date().toISOString();
    if (status === 'completed') {
      task.completedAt = new Date().toISOString();
    }
  }
  return task;
};
