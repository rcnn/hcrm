// 转诊记录类型定义

export type DepartmentType = 'orthokeratology' | 'refractive';

export type ReferralStatus =
  | 'pending' // 待跟进
  | 'contacted' // 已联系
  | 'visited' // 已到院
  | 'converted' // 已成交
  | 'failed'; // 未成交

export type UserRole =
  | 'optometrist' // 验光师
  | 'fitter' // 验配师
  | 'frame_sales' // 框架镜销售
  | 'orthokeratology_staff' // 角塑科
  | 'refractive_staff'; // 屈光科

export interface ClinicalIndicators {
  age?: number;
  myopiaProgress?: number; // 度数增长
  cornealThickness?: number; // 角膜厚度
  sphericalPower?: number; // 球镜度数
  cylindricalPower?: number; // 柱镜度数
  notes?: string;
}

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface Conversion {
  dealAmount: number;
  dealDate: Date;
  dealOwner: string;
  dealOwnerName?: string;
  products?: Product[];
  discounts?: number;
  notes?: string;
}

export interface Referral {
  id: string;
  sourceCustomerId: string; // 原始客户ID
  sourceCustomerName?: string; // 原始客户姓名
  referrerId: string; // 转诊发起人ID
  referrerName?: string; // 转诊发起人姓名
  referrerRole: UserRole;
  targetDepartment: DepartmentType;
  receiverId?: string; // 接收人（到院后分配）
  receiverName?: string;
  status: ReferralStatus;
  reason?: string; // 转诊原因
  notes?: string; // 备注
  clinicalIndicators?: ClinicalIndicators;
  createdAt: Date;
  updatedAt: Date;
  conversion?: Conversion;
}

// 转诊创建请求
export interface CreateReferralRequest {
  sourceCustomerId: string;
  targetDepartment: DepartmentType;
  reason?: string;
  notes?: string;
  clinicalIndicators?: ClinicalIndicators;
}

// 转诊状态更新请求
export interface UpdateReferralStatusRequest {
  status: ReferralStatus;
  notes?: string;
}

// 成交标记请求
export interface MarkConversionRequest {
  dealAmount: number;
  dealDate: Date;
  dealOwner: string;
  products?: Product[];
  discounts?: number;
  notes?: string;
}

// 业绩信息
export interface Commission {
  referrerCommission: number; // 转诊发起人业绩
  receiverCommission: number; // 接收人业绩
  total: number; // 总业绩
}

// 业绩计算详情
export interface CommissionCalculation {
  referralId: string;
  dealAmount: number;
  commissionRate: number;
  commission: {
    referrer: number;
    receiver: number;
    total: number;
  };
  calculationDetails: {
    baseAmount: number;
    rate: number;
    multipliers?: number;
  };
}

// 转诊统计
export interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  successRate: number;
  pendingReferrals: number;
  departmentStats: {
    orthokeratology: {
      count: number;
      converted: number;
    };
    refractive: {
      count: number;
      converted: number;
    };
  };
}

// 个人业绩统计
export interface PersonalCommissionStats {
  period: string;
  totalReferrals: number;
  convertedReferrals: number;
  successRate: number;
  commissions: {
    pending: number;
    confirmed: number;
    estimated: number;
  };
  breakdown: Array<{
    department: DepartmentType;
    referrals: number;
    conversions: number;
    commission: number;
  }>;
}

// 转诊分析数据
export interface ReferralAnalytics {
  summary: {
    totalReferrals: number;
    conversionRate: number;
    averageDealAmount: number;
  };
  trends: Array<{
    date: string;
    referrals: number;
    conversions: number;
  }>;
  topPerformers: Array<{
    userId: string;
    userName: string;
    referrals: number;
    conversions: number;
  }>;
}

// 线索池项
export interface LeadPoolItem {
  id: string;
  referralId: string;
  customerId: string;
  customerName: string;
  targetDepartment: DepartmentType;
  status: ReferralStatus;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  lastContactAt?: Date;
  nextFollowUpAt?: Date;
  notes?: string;
}
