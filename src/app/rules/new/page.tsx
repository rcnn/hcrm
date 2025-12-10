'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Breadcrumb, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import RuleEditor from '@/components/rules/RuleEditor';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';

export const dynamic = 'force-dynamic';

function NewRulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [copiedRule, setCopiedRule] = useState<any>(null);

  useEffect(() => {
    // 在 Next.js 中，可以通过 URL 参数传递数据
    const copyId = searchParams.get('copyId');
    if (copyId) {
      // TODO: 根据 copyId 获取规则数据
    }
  }, [searchParams]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('/api/rules', values);
      message.success('规则创建成功');
      router.push('/rules');
    } catch (error) {
      message.error('创建规则失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/rules');
  };

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
        <Breadcrumb.Item>新建规则</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="新建规则">
        <RuleEditor
          initialValues={copiedRule ? {
            ...copiedRule,
            name: copiedRule.name + ' (副本)'
          } : undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </Card>
      </div>
    </MainLayout>
  );
}

export default function NewRulePage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>加载中...</div>}>
      <NewRulePageContent />
    </Suspense>
  );
}
