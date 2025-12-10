'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
  Grid,
  Tag,
  message,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  SwitcherOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore, initializeUserStore } from '@/stores/userStore';
import { UserRole } from '@/lib/types/user';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 角色映射
const roleLabels: Record<UserRole, string> = {
  medical_assistant: '视光医助',
  optometrist: '验光师',
  manager: '运营经理',
  executive: '管理层',
  sales: '框架镜销售',
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const screens = useBreakpoint();
  const { user, logout, switchRole, hasPermission } = useUserStore();

  // 初始化用户状态
  useEffect(() => {
    initializeUserStore();
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('role-')) {
      const role = key.replace('role-', '') as UserRole;
      switchRole(role);
      message.success(`已切换到${roleLabels[role]}角色`);
      return;
    }
    router.push(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      router.push('/login');
      message.success('已退出登录');
    } else if (key === 'profile') {
      message.info('个人资料功能开发中...');
    }
  };

  // 根据权限动态生成菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '管理驾驶舱',
    },
    ...(hasPermission('customer:view')
      ? [
          {
            key: '/customers',
            icon: <TeamOutlined />,
            label: '客户档案',
          },
        ]
      : []),
    ...(hasPermission('task:view')
      ? [
          {
            key: '/tasks',
            icon: <CheckSquareOutlined />,
            label: '任务中心',
          },
        ]
      : []),
    ...(hasPermission('analytics:view')
      ? [
          {
            key: '/analytics',
            icon: <BarChartOutlined />,
            label: '数据分析',
          },
        ]
      : []),
    ...(hasPermission('user:manage')
      ? [
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: '系统设置',
          },
        ]
      : []),
  ].filter(Boolean);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: handleUserMenuClick,
    },
    ...(user?.role === 'executive'
      ? [
          {
            key: 'switch-role',
            icon: <SwitcherOutlined />,
            label: '角色切换' as any,
            children: [
              {
                key: 'role-medical_assistant',
                label: (
                  <Space>
                    <span>视光医助</span>
                    {(user?.role as string) === 'medical_assistant' && <Tag color="#1890ff">当前</Tag>}
                  </Space>
                ),
                onClick: handleMenuClick,
              },
              {
                key: 'role-optometrist',
                label: (
                  <Space>
                    <span>验光师</span>
                    {(user?.role as string) === 'optometrist' && <Tag color="#1890ff">当前</Tag>}
                  </Space>
                ),
                onClick: handleMenuClick,
              },
              {
                key: 'role-manager',
                label: (
                  <Space>
                    <span>运营经理</span>
                    {(user?.role as string) === 'manager' && <Tag color="#1890ff">当前</Tag>}
                  </Space>
                ),
                onClick: handleMenuClick,
              },
              {
                key: 'role-executive',
                label: (
                  <Space>
                    <span>管理层</span>
                    {(user?.role as string) === 'executive' && <Tag color="#1890ff">当前</Tag>}
                  </Space>
                ),
                onClick: handleMenuClick,
              },
              {
                key: 'role-sales',
                label: (
                  <Space>
                    <span>框架镜销售</span>
                    {(user?.role as string) === 'sales' && <Tag color="#1890ff">当前</Tag>}
                  </Space>
                ),
                onClick: handleMenuClick,
              },
            ],
          },
          {
            type: 'divider' as const,
          },
        ] as any
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleUserMenuClick,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Title level={5} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'HCRM' : 'HCRM管理系统'}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, background: 'transparent' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 56,
              color: '#ffffff',
            }}
          />

          <Space>
            <Tag color="#ffffff" style={{ color: '#1890ff', borderRadius: 2 }}>
              {user ? roleLabels[user.role] : ''}
            </Tag>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Typography.Text style={{ color: '#ffffff' }}>
                  {user?.name || '用户'}
                </Typography.Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 0,
            minHeight: 'calc(100vh - 56px)',
            background: '#f5f5f5',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
