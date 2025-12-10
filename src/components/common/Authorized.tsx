'use client';

import React from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { UserRole } from '@/lib/types/user';

interface AuthorizedProps {
  permission?: string;
  role?: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限控制组件
 * 根据权限或角色控制子组件的显示
 */
export default function Authorized({
  permission,
  role,
  children,
  fallback,
}: AuthorizedProps) {
  const router = useRouter();
  const { hasPermission, currentRole, isAuthenticated } = useUserStore();

  // 检查是否已认证
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Result
        status="403"
        title="未登录"
        subTitle="请先登录系统"
        extra={
          <Button type="primary" onClick={() => router.push('/login')}>
            去登录
          </Button>
        }
      />
    );
  }

  // 检查权限
  if (permission && !hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有访问此页面的权限"
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard')}>
            返回首页
          </Button>
        }
      />
    );
  }

  // 检查角色
  if (role && currentRole !== role) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您的角色权限不足"
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard')}>
            返回首页
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}

/**
 * 高阶组件版本
 */
export function withAuthorized<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthorizedProps, 'children'>
) {
  return function AuthorizedComponent(props: P) {
    return (
      <Authorized {...options}>
        <Component {...props} />
      </Authorized>
    );
  };
}
