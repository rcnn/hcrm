import { User, UserRole, Permission } from '@/lib/types/user';

// 权限配置
export const permissions: Record<string, Permission> = {
  // 客户相关权限
  'customer:view': { id: '1', name: '查看客户', code: 'customer:view', description: '查看客户列表和详情' },
  'customer:create': { id: '2', name: '创建客户', code: 'customer:create', description: '创建新客户档案' },
  'customer:edit': { id: '3', name: '编辑客户', code: 'customer:edit', description: '编辑客户信息' },
  'customer:delete': { id: '4', name: '删除客户', code: 'customer:delete', description: '删除客户档案' },

  // 任务相关权限
  'task:view': { id: '5', name: '查看任务', code: 'task:view', description: '查看任务列表' },
  'task:create': { id: '6', name: '创建任务', code: 'task:create', description: '创建新任务' },
  'task:edit': { id: '7', name: '编辑任务', code: 'task:edit', description: '编辑任务信息' },
  'task:complete': { id: '8', name: '完成任务', code: 'task:complete', description: '完成任务' },

  // 数据看板权限
  'analytics:view': { id: '9', name: '查看数据看板', code: 'analytics:view', description: '查看数据分析看板' },
  'analytics:export': { id: '10', name: '导出数据', code: 'analytics:export', description: '导出分析数据' },

  // 规则配置权限
  'rule:view': { id: '11', name: '查看规则', code: 'rule:view', description: '查看规则配置' },
  'rule:edit': { id: '12', name: '编辑规则', code: 'rule:edit', description: '编辑规则配置' },

  // 业绩管理权限
  'performance:view': { id: '13', name: '查看业绩', code: 'performance:view', description: '查看业绩数据' },
  'performance:manage': { id: '14', name: '管理业绩', code: 'performance:manage', description: '管理业绩归属' },

  // 用户管理权限
  'user:manage': { id: '15', name: '用户管理', code: 'user:manage', description: '管理系统用户' },
};

// 角色权限映射
export const rolePermissions: Record<UserRole, string[]> = {
  medical_assistant: [
    'customer:view',
    'customer:create',
    'customer:edit',
    'task:view',
    'task:create',
    'task:complete',
  ],
  optometrist: [
    'customer:view',
    'customer:create',
    'customer:edit',
    'task:view',
    'task:create',
    'task:complete',
    'analytics:view',
  ],
  manager: [
    'customer:view',
    'customer:create',
    'customer:edit',
    'customer:delete',
    'task:view',
    'task:create',
    'task:edit',
    'task:complete',
    'analytics:view',
    'analytics:export',
    'rule:view',
    'rule:edit',
    'performance:view',
    'performance:manage',
  ],
  executive: [
    'customer:view',
    'task:view',
    'analytics:view',
    'analytics:export',
    'rule:view',
    'performance:view',
  ],
  sales: [
    'customer:view',
    'customer:create',
    'customer:edit',
    'task:view',
    'task:create',
    'task:complete',
    'analytics:view',
    'performance:view',
  ],
};

// 生成模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    name: '张医生',
    username: 'zhangdoctor',
    role: 'optometrist',
    department: '视光科',
    hospital: '总部医院',
    email: 'zhang@hcrm.com',
    phone: '13800138001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '李护士',
    username: 'linurse',
    role: 'medical_assistant',
    department: '视光科',
    hospital: '总部医院',
    email: 'li@hcrm.com',
    phone: '13800138002',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: '王经理',
    username: 'wangmanager',
    role: 'manager',
    department: '运营中心',
    hospital: '总部医院',
    email: 'wang@hcrm.com',
    phone: '13800138003',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: '赵总',
    username: 'zhaozong',
    role: 'executive',
    department: '管理层',
    hospital: '总部医院',
    email: 'zhao@hcrm.com',
    phone: '13800138004',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: '孙销售',
    username: 'sunxiaoshou',
    role: 'sales',
    department: '视光科',
    hospital: '总部医院',
    email: 'sun@hcrm.com',
    phone: '13800138005',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// 根据角色获取用户列表
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter((user) => user.role === role);
};

// 根据ID获取用户
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// 模拟登录 - 支持用户名或角色名登录
export const mockLogin = async (username: string, password: string): Promise<User | null> => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 支持使用角色名直接登录（用于演示）
  const user = mockUsers.find((u) => u.username === username || u.role === username);
  if (user && password === '123456') {
    return user;
  }
  return null;
};

// 根据角色获取权限列表
export const getPermissionsByRole = (role: UserRole): Permission[] => {
  const permissionCodes = rolePermissions[role] || [];
  return permissionCodes.map((code) => permissions[code]).filter(Boolean);
};

// 检查用户是否有指定权限
export const hasPermission = (role: UserRole, permission: string): boolean => {
  const permissionCodes = rolePermissions[role] || [];
  return permissionCodes.includes(permission);
};
