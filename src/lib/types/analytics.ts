export interface KPIMetrics {
  newCustomersToday: number;
  monthlyRevenue: number;
  activeCustomers: number;
  avgOrderValue: number;
  replacementRate: number;
  revisitRate: number;
  churnRate: number;
  conversionRate: number;
}

export interface TrendData {
  month: string;
  churnRate: number;
  revisitRate: number;
  revenue: number;
  newCustomers: number;
}

export interface DepartmentRanking {
  id: string;
  name: string;
  hospital: string;
  rank: number;
  completionRate: number;
  taskCompletion: number;
  replyRate: number;
  sopRate: number;
  overdueTasks: number;
  score: number;
  change?: number; // 排名变化
}

export interface Alert {
  id: string;
  type: 'price_drop' | 'churn_spike' | 'conversion_drop' | 'overdue';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  department: string;
  timestamp: string;
  status: 'active' | 'resolved';
  actionUrl?: string;
}
