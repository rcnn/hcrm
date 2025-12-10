import { create } from 'zustand';
import { Task, TaskStatus, TaskStats } from '@/lib/types/task';
import {
  mockTasks,
  getTasksByAssignedTo,
  getTasksByStatus,
  getTaskById,
  getTaskStats,
  updateTaskStatus,
} from '@/lib/mock/tasks';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  taskStats: TaskStats;
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus, notes?: string) => Promise<void>;
  getTasksByAssignedTo: (assignedTo: string) => Task[];
  refreshStats: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,
  currentTask: null,
  taskStats: getTaskStats(),
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    // TODO: 调用API获取任务列表
    await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟API延迟
    set({ loading: false });
  },

  fetchTaskById: async (id: string) => {
    set({ loading: true });
    const task = getTaskById(id);
    set({ currentTask: task || null, loading: false });
  },

  updateTaskStatus: async (id: string, status: TaskStatus, notes?: string) => {
    const updatedTask = updateTaskStatus(id, status, notes);
    if (updatedTask) {
      const tasks = get().tasks.map((t) => (t.id === id ? updatedTask : t));
      set({ tasks, currentTask: updatedTask });
      get().refreshStats();
    }
  },

  getTasksByAssignedTo: (assignedTo: string) => {
    return getTasksByAssignedTo(assignedTo);
  },

  refreshStats: () => {
    const stats = getTaskStats();
    set({ taskStats: stats });
  },
}));
