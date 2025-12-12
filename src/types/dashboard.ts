// 数据可视化看板系统 - TypeScript 类型定义

// KPI指标数据
export interface KPIData {
  newCustomersToday: number;
  monthlyRevenue: number;
  activeCustomers: number;
  avgOrderValue: number;
}

// 进度指标
export interface ProgressIndicator {
  replacementRate: number;
  revisitRate: number;
  churnRate: number;
  diseaseAvgPrice: number;
}

// 趋势数据
export interface TrendData {
  month: string;
  type: string;
  rate: number;
}

// 排名数据
export interface RankingData {
  rank: number;
  name: string;
  completionRate: number;
}

// 预警信息
export interface Alert {
  id: string;
  type: 'price_drop' | 'churn_spike' | 'conversion_drop' | 'timeout_task';
  severity: 'high' | 'medium' | 'low';
  message: string;
  department: string;
  timestamp: Date;
  status: 'active' | 'resolved';
  threshold?: number;
  currentValue?: number;
}

// 个人业绩数据
export interface PersonalPerformance {
  monthlyReferrals: {
    orthoK: number;
    refractive: number;
  };
  estimatedBonus: number;
  taskCompletionRate: number;
}

// 员工排名
export interface EmployeeRanking {
  position: number;
  teamSize: number;
  vsLastMonth: string;
  targetCompletion: number;
}

// 任务概览数据
export interface TaskOverview {
  todayPending: number;
  weekCompleted: number;
  timeoutRate: number;
  avgResponseTime: string;
}

// 客户分析数据
export interface CustomerAnalysis {
  total: number;
  newThisMonth: number;
  activeRate: number;
  upsellSuccessRate: number;
}

// 质控执行数据
export interface ExecutionControl {
  taskCompletionRanking: Array<{
    rank: number;
    department: string;
    completionRate: number;
    status: string;
  }>;
  wechatReplyRate: Array<{
    rank: number;
    employee: string;
    replyRate: number;
    avgResponseTime: string;
  }>;
  sopCompliance: number;
  timeoutTasks: number;
}

// 经营质控数据
export interface OperationControl {
  priceAnomalies: Array<{
    department: string;
    avgPrice: number;
    deviation: number;
    status: string;
  }>;
  conversionAnomalies: Array<{
    department: string;
    conversionRate: number;
    deviation: number;
    status: string;
  }>;
  churnAnomalies?: Array<{
    department: string;
    churnRate: number;
    deviation: number;
    status: string;
  }>;
}

// 整改单管理
export interface RectificationManagement {
  pendingOrders: number;
  inProgress: number;
  completed: number;
  list?: Array<{
    id: string;
    department: string;
    issue: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: Date;
    assignee: string;
  }>;
}

// 管理驾驶舱完整数据
export interface OverviewDashboardData {
  kpis: KPIData;
  progressIndicators: ProgressIndicator;
  trends: TrendData[];
  hospitalRankings: RankingData[];
  referralData: Array<{
    type: string;
    value: number;
  }>;
  alerts: Alert[];
}

// 个人看板完整数据
export interface PersonalDashboardData {
  employeeInfo: {
    name: string;
    department: string;
    position: string;
  };
  performance: PersonalPerformance;
  tasks: TaskOverview;
  customers: CustomerAnalysis;
  ranking: EmployeeRanking;
}

// 质控看板完整数据
export interface QualityDashboardData {
  executionControl: ExecutionControl;
  operationControl: OperationControl;
  rectification: RectificationManagement;
}

// 仪表盘类型
export type DashboardType = 'overview' | 'personal' | 'quality' | 'alerts';

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// 流量流转数据
export interface FlowData {
  name: string;
  value: number;
  [key: string]: any;
}

// 预警规则配置
export interface AlertRule {
  ruleType: 'price_drop' | 'churn_spike' | 'conversion_drop' | 'timeout_task';
  threshold: number;
  duration: number;
  departments: string[];
  notificationMethods: ('wechat' | 'email' | 'system')[];
}

// 筛选参数
export interface FilterParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  department?: string;
  category?: string;
}

// 导出参数
export interface ExportParams {
  type: 'overview' | 'quality' | 'personal';
  format: 'pdf' | 'excel';
  period: string;
  departments?: string[];
}
