export type UserRole =
  | 'medical_assistant'  // 视光医助/客服
  | 'optometrist'        // 验光师/验配师
  | 'manager'           // 视光运营经理
  | 'executive'         // 管理层
  | 'sales';            // 框架镜销售

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  department: string;
  hospital?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string; // 如 'customer:view', 'task:create'
  description: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
}
