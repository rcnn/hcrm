'use client';

import React from 'react';
import { Result, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: 500,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
        }}
        bodyStyle={{ padding: 40 }}
      >
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有访问此页面的权限"
          extra={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button onClick={() => router.back()}>返回上一页</Button>
              <Button type="primary" onClick={() => router.push('/dashboard')}>
                返回首页
              </Button>
              <Button type="primary" onClick={() => router.push('/login')}>
                重新登录
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  );
}
