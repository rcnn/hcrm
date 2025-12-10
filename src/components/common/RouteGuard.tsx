'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useUserStore } from '@/stores/userStore';
import { UserRole } from '@/lib/types/user';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
}

// 路由权限配置
const routePermissions: Record<string, { permission?: string; role?: UserRole }> = {
  '/dashboard': {},
  '/customers': { permission: 'customer:view' },
  '/tasks': { permission: 'task:view' },
  '/analytics': { permission: 'analytics:view' },
  '/settings': { permission: 'user:manage' },
};

/**
 * 路由守卫组件
 * 用于保护需要认证和权限的页面
 */
export default function RouteGuard({
  children,
  requiredPermission,
  requiredRole,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasPermission, currentRole, user } = useUserStore();

  useEffect(() => {
    // 如果未登录，重定向到登录页
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
      return;
    }

    // 如果已登录且在登录页，重定向到仪表板
    if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
      return;
    }

    // 检查路由级别的权限
    const routeConfig = routePermissions[pathname];
    if (routeConfig && isAuthenticated) {
      const { permission, role } = routeConfig;

      if (permission && !hasPermission(permission)) {
        router.push('/403');
        return;
      }

      if (role && currentRole !== role) {
        router.push('/403');
        return;
      }
    }

    // 检查组件级别的权限
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/403');
      return;
    }

    if (requiredRole && currentRole !== requiredRole) {
      router.push('/403');
      return;
    }
  }, [isAuthenticated, pathname, hasPermission, currentRole, requiredPermission, requiredRole, router]);

  // 如果未登录且不在登录页，显示加载状态
  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 高阶组件版本的路由守卫
 */
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
