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
  FileTextOutlined,
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

  // 处理水平菜单点击，包括子菜单项
  const handleHorizontalMenuClick = ({ key }: { key: string }) => {
    // 处理规则配置子菜单
    if (key === '/rules' || key === '/rules/templates' || key === '/rules/statistics') {
      router.push(key);
      return;
    }
    // 处理主菜单
    handleMenuClick({ key });
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
    ...(hasPermission('rules:manage')
      ? [
          {
            key: 'rules-group',
            label: '规则配置',
            icon: <FileTextOutlined />,
            children: [
              {
                key: '/rules',
                label: '规则列表',
              },
              {
                key: '/rules/templates',
                label: '规则模板',
              },
              {
                key: '/rules/statistics',
                label: '执行统计',
              },
            ],
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
    <>
      {/* 医疗顶部菜单样式 */}
      <style>{`
        .medical-top-menu .ant-menu-item {
          height: 64px !important;
          line-height: 64px !important;
          color: #ffffff !important;
          margin: 0 2px !important;
          padding: 0 16px !important;
        }

        .medical-top-menu .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }

        .medical-top-menu .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          font-weight: 500 !important;
        }

        .medical-top-menu .ant-menu-item-selected a,
        .medical-top-menu .ant-menu-item-selected a:hover {
          color: #ffffff !important;
        }

        .medical-top-menu .ant-menu-submenu-title {
          height: 64px !important;
          line-height: 64px !important;
          color: #ffffff !important;
          margin: 0 2px !important;
          padding: 0 16px !important;
        }

        .medical-top-menu .ant-menu-submenu-title:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }

        .medical-top-menu .ant-menu-submenu > .ant-menu {
          background-color: #212b36 !important;
          border-radius: 4px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          padding: 8px 0 !important;
        }

        .medical-top-menu .ant-menu-submenu .ant-menu-item {
          color: #ffffff !important;
          height: 36px !important;
          line-height: 36px !important;
          margin: 0 !important;
          padding: 0 16px !important;
        }

        .medical-top-menu .ant-menu-submenu .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #337eff !important;
        }

        .medical-top-menu .ant-menu-submenu .ant-menu-item-selected {
          background-color: #337eff !important;
          color: #ffffff !important;
        }
      `}</style>

      <Layout style={{ minHeight: '100vh' }}>
        {/* 顶部导航栏 - 医疗蓝色主题 */}
        <Header
          style={{
            padding: '0 0',
            background: '#337eff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: '64px',
            lineHeight: '64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '64px',
              padding: '0 24px',
              justifyContent: 'space-between',
            }}
          >
            {/* 左侧：Logo和系统名称 */}
            <Typography.Title
              level={4}
              style={{
                margin: 0,
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 20,
                lineHeight: '64px',
                minWidth: 200,
              }}
            >
              HCRM医疗管理系统
            </Typography.Title>

            {/* 中间：主菜单导航 */}
            <Menu
              mode="horizontal"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={handleHorizontalMenuClick}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 14,
                flex: 1,
                marginLeft: '40px',
              }}
              theme="dark"
              subMenuOpenDelay={0.1}
              subMenuCloseDelay={0.1}
              selectable
              className="medical-top-menu"
            />

            {/* 右侧：用户信息和操作区 */}
            <Space size={24}>
              {/* 主要操作按钮 - 新建客户 */}
              <Button
                type="primary"
                icon={<UserOutlined />}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#ffffff',
                  color: '#337eff',
                  border: 'none',
                }}
              >
                + 新建客户
              </Button>

              {/* 角色信息 */}
              <Typography.Text style={{ color: '#ffffff', fontSize: 14 }}>
                {user ? roleLabels[user.role] : ''}
              </Typography.Text>

              {/* 用户信息下拉 */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Typography.Text style={{ color: '#ffffff', fontSize: 14 }}>
                    {user?.name || '用户'}
                  </Typography.Text>
                  <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#ffffff', color: '#337eff' }} />
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* 主要内容区域 */}
        <Content
          style={{
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: '#f5f5f5',
            position: 'relative',
          }}
        >
          {children}
        </Content>
      </Layout>
    </>
  );
}
