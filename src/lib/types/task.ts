export type TaskType =
  | 'lens_replacement'  // 换片提醒
  | 'follow_up'        // 复查提醒
  | 'recall'           // 流失召回
  | 'referral';        // 转介绍跟进

export type TaskStatus =
  | 'pending'        // 未开始
  | 'in_progress'    // 进行中
  | 'completed'      // 已完成
  | 'overdue'        // 已超时
  | 'delayed';       // 已延期

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  customerId: string;
  customerName: string;
  assignedTo: string; // 责任人ID
  assignedToName: string; // 责任人姓名
  createdAt: string;
  dueAt: string;
  completedAt?: string;
  notes?: string;
  script?: string; // AI生成的话术
  isOverdue?: boolean;
  overdueHours?: number;
  createdBy: string; // 创建人
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  lensReplacement: number;
  followUp: number;
  recall: number;
  referral: number;
}
