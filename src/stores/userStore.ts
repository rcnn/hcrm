import { create } from 'zustand';
import { User, UserRole, Permission } from '@/lib/types/user';
import { mockLogin, getPermissionsByRole, hasPermission } from '@/lib/mock/users';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole | null;
  permissions: Permission[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  currentRole: null,
  permissions: [],

  login: async (username: string, password: string) => {
    const user = await mockLogin(username, password);
    if (!user) {
      throw new Error('登录失败');
    }

    const permissions = getPermissionsByRole(user.role);

    set({
      user,
      isAuthenticated: true,
      currentRole: user.role,
      permissions,
    });

    // 将用户信息存储到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hcrm_user', JSON.stringify(user));
      localStorage.setItem('hcrm_permissions', JSON.stringify(permissions));
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentRole: null,
      permissions: [],
    });

    // 清除localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hcrm_user');
      localStorage.removeItem('hcrm_permissions');
    }
  },

  switchRole: (role: UserRole) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, role };
      const permissions = getPermissionsByRole(role);

      set({
        user: updatedUser,
        currentRole: role,
        permissions,
      });

      // 更新localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hcrm_user', JSON.stringify(updatedUser));
        localStorage.setItem('hcrm_permissions', JSON.stringify(permissions));
      }
    }
  },

  hasPermission: (permission: string) => {
    const { currentRole } = get();
    if (!currentRole) return false;
    return hasPermission(currentRole, permission);
  },
}));

// 初始化用户状态的函数（仅在客户端调用）
export const initializeUserStore = () => {
  if (typeof window === 'undefined') return;

  try {
    const savedUser = localStorage.getItem('hcrm_user');
    const savedPermissions = localStorage.getItem('hcrm_permissions');

    if (savedUser && savedPermissions) {
      const user = JSON.parse(savedUser);
      const permissions = JSON.parse(savedPermissions);
      useUserStore.setState({
        user,
        isAuthenticated: true,
        currentRole: user.role,
        permissions,
      });
    }
  } catch (error) {
    console.error('Failed to restore user session:', error);
    localStorage.removeItem('hcrm_user');
    localStorage.removeItem('hcrm_permissions');
  }
};
