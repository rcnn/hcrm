import axios from 'axios';
import type { Task, TaskStatus, TaskStats, TaskType } from '@/lib/types/task';
import {
  mockTasks,
  getTaskById,
  getTasksByAssignedTo,
  getTaskStats as getMockTaskStats,
  updateTaskStatus as updateMockTaskStatus,
  searchTasks as searchMockTasks,
} from '@/lib/mock/tasks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const taskService = {
  // 获取任务列表
  getTasks: async (params?: {
    page?: number;
    pageSize?: number;
    type?: TaskType;
    status?: TaskStatus;
    assignedTo?: string;
  }): Promise<{ data: Task[]; total: number }> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
      // return response.data;

      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filteredTasks = [...mockTasks];

      if (params?.type) {
        filteredTasks = filteredTasks.filter((t) => t.type === params.type);
      }

      if (params?.status) {
        filteredTasks = filteredTasks.filter((t) => t.status === params.status);
      }

      if (params?.assignedTo) {
        filteredTasks = filteredTasks.filter((t) => t.assignedTo === params.assignedTo);
      }

      const total = filteredTasks.length;
      const pageSize = params?.pageSize || 20;
      const page = params?.page || 1;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: filteredTasks.slice(start, end),
        total,
      };
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  },

  // 获取任务详情
  getTaskById: async (id: string): Promise<Task> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
      // return response.data;

      const task = getTaskById(id);
      if (!task) {
        throw new Error('任务不存在');
      }

      return task;
    } catch (error) {
      console.error('获取任务详情失败:', error);
      throw error;
    }
  },

  // 更新任务状态
  updateTaskStatus: async (
    id: string,
    status: TaskStatus,
    notes?: string
  ): Promise<Task> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { status, notes });
      // return response.data;

      const task = updateMockTaskStatus(id, status, notes);
      if (!task) {
        throw new Error('任务不存在');
      }

      return task;
    } catch (error) {
      console.error('更新任务状态失败:', error);
      throw error;
    }
  },

  // 批量操作任务
  batchUpdateTasks: async (
    taskIds: string[],
    action: { type: string; payload?: any }
  ): Promise<void> => {
    try {
      // TODO: 替换为真实API调用
      // await axios.post(`${API_BASE_URL}/tasks/batch`, { taskIds, action });

      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock实现
      console.log('批量操作任务:', { taskIds, action });
    } catch (error) {
      console.error('批量操作任务失败:', error);
      throw error;
    }
  },

  // 生成AI话术
  generateScript: async (taskId: string): Promise<string> => {
    try {
      // TODO: 替换为真实AI API调用
      // const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/script`);
      // return response.data.script;

      const task = getTaskById(taskId);
      if (!task) {
        throw new Error('任务不存在');
      }

      // 模拟AI生成延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const scriptTemplates: Record<string, string> = {
        follow_up:
          '张先生您好，距离小明上次复查已过3个月，上次检查数据显示右眼度数增长了50度，建议及时复查。我们可以为您预约本周五下午的号源。',
        lens_replacement:
          '张先生您好，小明的镜片已佩戴8个月，建议及时更换以保证矫正效果。我们本周六上午有号源，您看方便吗？',
        recall:
          '张先生您好，最近没有收到小明的复查消息，孩子视力情况还好吗？我们这边有专业的视光师可以为您做免费检查。',
        referral:
          '张先生您好，感谢您对我们信任！如果您身边有朋友的孩子也需要视力检查，欢迎推荐给我们，新客户可享受首次免费检查。',
      };

      return scriptTemplates[task.type] || '您好，我是XX眼科的医助...';
    } catch (error) {
      console.error('生成AI话术失败:', error);
      throw error;
    }
  },

  // 获取超时任务
  getOverdueTasks: async (): Promise<Task[]> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.get(`${API_BASE_URL}/tasks/overdue`);
      // return response.data;

      const now = new Date();
      return mockTasks.filter((task) => {
        if (task.status === 'completed') return false;
        const dueTime = new Date(task.dueAt);
        const hoursDiff = (now.getTime() - dueTime.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 24;
      });
    } catch (error) {
      console.error('获取超时任务失败:', error);
      throw error;
    }
  },

  // 搜索任务
  searchTasks: async (query: string): Promise<Task[]> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.post(`${API_BASE_URL}/tasks/search`, { query });
      // return response.data;

      return searchMockTasks(query);
    } catch (error) {
      console.error('搜索任务失败:', error);
      throw error;
    }
  },

  // 获取任务统计
  getTaskStats: async (assignedTo?: string): Promise<TaskStats> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.get(`${API_BASE_URL}/tasks/stats`, {
      //   params: { assignedTo },
      // });
      // return response.data;

      return getMockTaskStats(assignedTo);
    } catch (error) {
      console.error('获取任务统计失败:', error);
      throw error;
    }
  },

  // 完成任务
  completeTask: async (id: string): Promise<Task> => {
    try {
      // TODO: 替换为真实API调用
      // const response = await axios.post(`${API_BASE_URL}/tasks/${id}/complete`);
      // return response.data;

      const task = getTaskById(id);
      if (!task) {
        throw new Error('任务不存在');
      }

      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.updatedAt = new Date().toISOString();

      return task;
    } catch (error) {
      console.error('完成任务失败:', error);
      throw error;
    }
  },
};
