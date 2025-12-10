export type CustomerCategory =
  | 'potential'    // 潜在客户
  | 'converted'    // 成交客户
  | 'upgrade'      // 升单潜力
  | 'referral'     // 转科潜力
  | 'churn';       // 流失预警

export type ProductType = '角塑' | '框架镜' | '无';

export interface ExaminationRecord {
  id: string;
  customerId: string;
  date: string; // ISO date string
  odRefraction: number; // 右眼度数
  osRefraction: number; // 左眼度数
  odAxialLength?: number; // 右眼轴长
  osAxialLength?: number; // 左眼轴长
  odVisualAcuity?: number; // 右眼视力
  osVisualAcuity?: number; // 左眼视力
  odK1?: number; // 右眼角膜曲率K1
  odK2?: number; // 右眼角膜曲率K2
  osK1?: number; // 左眼角膜曲率K1
  osK2?: number; // 左眼角膜曲率K2
  intraocularPressure?: number; // 眼压
  notes?: string; // 备注
  isAbnormal?: boolean; // 是否异常
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  parentName: string;
  parentPhone: string;
  category: CustomerCategory;
  currentProduct: ProductType;
  owner: string; // 归属员工ID
  ownerName: string; // 归属员工姓名
  hospital?: string; // 所属院区
  firstVisitDate?: string; // 首次到院日期
  lastVisitDate?: string;  // 最近到院日期
  lastCheckDate?: string;  // 最近检查日期
  notes?: string; // 备注
  examinations: ExaminationRecord[];
  createdAt: string;
  updatedAt: string;
}
