'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useUserStore } from '@/stores/userStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      router.push('/dashboard');
    } catch (error) {
      message.error('登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async (role: string) => {
    setLoading(true);
    try {
      // 使用角色名作为用户名进行Mock登录
      await login(role, '123456');
      message.success(`以${role}角色登录成功`);
      router.push('/dashboard');
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
        }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
            HCRM客户长期价值管理系统
          </h1>
          <p style={{ color: '#8c8c8c', fontSize: 14 }}>
            Healthcare Customer Relationship Management
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          size="small"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="用户名"
              size="small"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="密码"
              size="small"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="small"
              style={{ height: 32 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0', fontSize: 12 }}>
          <span style={{ color: '#8c8c8c' }}>演示账号快速登录</span>
        </Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Button
            size="small"
            onClick={() => handleMockLogin('medical_assistant')}
            loading={loading}
          >
            视光医助
          </Button>
          <Button
            size="small"
            onClick={() => handleMockLogin('optometrist')}
            loading={loading}
          >
            验光师
          </Button>
          <Button
            size="small"
            onClick={() => handleMockLogin('manager')}
            loading={loading}
          >
            运营经理
          </Button>
          <Button
            size="small"
            onClick={() => handleMockLogin('executive')}
            loading={loading}
          >
            管理层
          </Button>
          <Button
            size="small"
            onClick={() => handleMockLogin('sales')}
            loading={loading}
            style={{ gridColumn: '1 / -1' }}
          >
            框架镜销售
          </Button>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button
            type="link"
            size="small"
            icon={<QrcodeOutlined />}
            style={{ fontSize: 12 }}
          >
            企业微信扫码登录（演示）
          </Button>
        </div>
      </Card>
    </div>
  );
}
