import axios from 'axios';
import {
  OverviewDashboardData,
  PersonalDashboardData,
  QualityDashboardData,
  Alert,
  AlertRule,
  FilterParams,
  ExportParams,
} from '@/types/dashboard';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 管理驾驶舱 API
 */

// 获取管理驾驶舱概览数据
export const fetchOverviewDashboard = async (params?: FilterParams): Promise<OverviewDashboardData> => {
  const response = await api.get('/dashboard/overview', { params });
  // API返回 { success, data, timestamp }，拦截器返回{ success, data, timestamp }，需要提取data.data
  return response.data?.data;
};

// 获取趋势图表数据
export const fetchTrendChart = async (params?: FilterParams) => {
  const response = await api.get('/dashboard/charts/trends', { params });
  return response.data;
};

/**
 * 个人看板 API
 */

// 获取个人看板数据
export const fetchPersonalDashboard = async (employeeId?: string): Promise<PersonalDashboardData> => {
  const response = await api.get('/dashboard/personal', {
    params: { employeeId },
  });
  return response.data;
};

/**
 * 质控看板 API
 */

// 获取质控数据
export const fetchQualityDashboard = async (params?: FilterParams): Promise<QualityDashboardData> => {
  const response = await api.get('/dashboard/quality', { params });
  return response.data;
};

/**
 * 预警中心 API
 */

// 获取预警列表
export const fetchAlerts = async (params?: {
  status?: 'active' | 'resolved';
  severity?: 'high' | 'medium' | 'low';
  department?: string;
}): Promise<{ alerts: Alert[] }> => {
  const response = await api.get('/dashboard/alerts', { params });
  return response.data;
};

// 配置预警规则
export const createAlertRule = async (rule: AlertRule) => {
  const response = await api.post('/dashboard/alerts/config', rule);
  return response.data;
};

// 处理预警
export const handleAlert = async (alertId: string, action: 'handle' | 'ignore', note?: string) => {
  const response = await api.post(`/dashboard/alerts/${alertId}/handle`, {
    action,
    note,
  });
  return response.data;
};

/**
 * 报表导出 API
 */

// 导出报表
export const exportReport = async (params: ExportParams): Promise<Blob> => {
  const response = await api.get('/dashboard/export', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * 实时数据更新
 */

// 订阅实时数据更新（Mock WebSocket）
export const subscribeToRealtimeData = (callback: (data: any) => void) => {
  // 模拟 WebSocket 连接 - 使用Mock数据保持一致性
  const interval = setInterval(() => {
    try {
      // 生成新的Mock数据（保持实时更新的感觉）
      const data = generateOverviewMockData();
      callback(data);
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  }, 5000); // 每5秒更新一次

  // 返回取消订阅函数
  return () => clearInterval(interval);
};

/**
 * Mock 数据生成器（开发环境使用）
 */

// 生成管理驾驶舱Mock数据
export const generateOverviewMockData = (): OverviewDashboardData => {
  return {
    kpis: {
      newCustomersToday: Math.floor(Math.random() * 50) + 100,
      monthlyRevenue: Math.random() * 200 + 250,
      activeCustomers: Math.floor(Math.random() * 200) + 1200,
      avgOrderValue: Math.floor(Math.random() * 500) + 2000,
    },
    progressIndicators: {
      replacementRate: Math.floor(Math.random() * 20) + 80,
      revisitRate: Math.floor(Math.random() * 20) + 70,
      churnRate: Math.random() * 5 + 5,
      diseaseAvgPrice: Math.floor(Math.random() * 1000) + 4000,
    },
    trends: [
      ...Array.from({ length: 12 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        type: '流失率',
        rate: Math.random() * 5 + 5,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        type: '复购率',
        rate: Math.random() * 10 + 30,
      })),
    ],
    hospitalRankings: Array.from({ length: 14 }, (_, i) => ({
      rank: i + 1,
      name: `${['总院', '东院', '西院', '南院', '北院'][i]}区`,
      completionRate: Math.floor(Math.random() * 15) + 85,
    })),
    referralData: [
      { type: '角塑转介绍', value: 45 },
      { type: '屈光转介绍', value: 32 },
      { type: '框架镜转介绍', value: 23 },
    ],
    alerts: Array.from({ length: 3 }, (_, i) => ({
      id: `alert_${i + 1}`,
      type: ['price_drop', 'churn_spike', 'conversion_drop'][i] as any,
      severity: ['high', 'medium', 'low'][i] as any,
      message: `第${i + 1}号预警：发现异常指标`,
      department: `${['总院', '东院', '西院'][i]}区`,
      timestamp: new Date(),
      status: 'active',
    })),
  };
};

// 生成个人看板Mock数据
export const generatePersonalMockData = (): PersonalDashboardData => {
  return {
    employeeInfo: {
      name: '张三',
      department: '视光中心',
      position: '视光师',
    },
    performance: {
      monthlyReferrals: {
        orthoK: Math.floor(Math.random() * 20) + 15,
        refractive: Math.floor(Math.random() * 15) + 10,
      },
      estimatedBonus: Math.floor(Math.random() * 5000) + 5000,
      taskCompletionRate: Math.floor(Math.random() * 15) + 85,
    },
    tasks: {
      todayPending: Math.floor(Math.random() * 10) + 3,
      weekCompleted: Math.floor(Math.random() * 20) + 25,
      timeoutRate: Math.random() * 5,
      avgResponseTime: `${Math.floor(Math.random() * 10) + 10}分钟`,
    },
    customers: {
      total: Math.floor(Math.random() * 100) + 150,
      newThisMonth: Math.floor(Math.random() * 30) + 20,
      activeRate: Math.random() * 20 + 70,
      upsellSuccessRate: Math.random() * 20 + 30,
    },
    ranking: {
      position: Math.floor(Math.random() * 10) + 1,
      teamSize: 32,
      vsLastMonth: Math.random() > 0.5 ? '+2' : '-1',
      targetCompletion: Math.floor(Math.random() * 15) + 85,
    },
  };
};

// 生成质控看板Mock数据
export const generateQualityMockData = (): QualityDashboardData => {
  return {
    executionControl: {
      taskCompletionRanking: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        department: `${['总院', '东院', '西院', '南院', '北院'][i % 5]}视光科`,
        completionRate: Math.floor(Math.random() * 15) + 85,
        status: i < 5 ? '优秀' : '良好',
      })),
      wechatReplyRate: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        employee: `员工${i + 1}`,
        replyRate: Math.floor(Math.random() * 10) + 90,
        avgResponseTime: `${Math.floor(Math.random() * 10) + 5}分钟`,
      })),
      sopCompliance: Math.floor(Math.random() * 10) + 85,
      timeoutTasks: Math.floor(Math.random() * 20) + 5,
    },
    operationControl: {
      priceAnomalies: Array.from({ length: 3 }, (_, i) => ({
        department: `${['东院', '西院', '南院'][i]}屈光科`,
        avgPrice: Math.floor(Math.random() * 500) + 1500,
        deviation: -(Math.random() * 20 + 5),
        status: '需关注',
      })),
      conversionAnomalies: Array.from({ length: 3 }, (_, i) => ({
        department: `${['总院', '东院', '北院'][i]}视光科`,
        conversionRate: Math.random() * 10 + 20,
        deviation: -(Math.random() * 15 + 5),
        status: '预警',
      })),
      churnAnomalies: Array.from({ length: 2 }, (_, i) => ({
        department: `${['西院', '南院'][i]}视光科`,
        churnRate: Math.random() * 5 + 10,
        deviation: Math.random() * 3 + 2,
        status: '预警',
      })),
    },
    rectification: {
      pendingOrders: Math.floor(Math.random() * 10) + 5,
      inProgress: Math.floor(Math.random() * 5) + 2,
      completed: Math.floor(Math.random() * 30) + 20,
      list: Array.from({ length: 5 }, (_, i) => ({
        id: `rect_${i + 1}`,
        department: `${['总院', '东院', '西院', '南院', '北院'][i]}区`,
        issue: `问题${i + 1}`,
        status: ['pending', 'in_progress', 'completed'][i % 3] as any,
        createdAt: new Date(),
        assignee: `负责人${i + 1}`,
      })),
    },
  };
};

export default api;
