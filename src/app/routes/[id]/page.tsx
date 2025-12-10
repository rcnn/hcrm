'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Breadcrumb, Descriptions, Tag, Button, Space, Tabs, Table, message } from 'antd';
import { HomeOutlined, EditOutlined, HistoryOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import RuleEditor from '@/components/rules/RuleEditor';

const CATEGORY_MAP: Record<string, string> = {
  'lens_change_reminder': '换片提醒规则',
  'refraction_warning': '度数增长预警',
  'quality_warning': '质控预警',
  'upgrade_potential': '升单潜力',
  'referral_rules': '转科推荐',
  'churn_warning': '流失预警'
};

export default function RuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchRule = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/rules/${params.id}`);
      setRule(response.data.data);
    } catch (error) {
      message.error('获取规则详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/api/rules/history`, {
        params: { ruleId: params.id }
      });
      setHistory(response.data.data.history);
    } catch (error) {
      console.error('获取历史失败');
    }
  };

  useEffect(() => {
    fetchRule();
    fetchHistory();
  }, [params.id]);

  const handleSave = async (values: any) => {
    try {
      await axios.put(`/api/rules/${params.id}`, values);
      message.success('规则更新成功');
      setEditing(false);
      fetchRule();
    } catch (error) {
      message.error('更新规则失败');
    }
  };

  const historyColumns = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80
    },
    {
      title: '修改人',
      dataIndex: 'changedBy',
      key: 'changedBy',
      width: 100
    },
    {
      title: '修改时间',
      dataIndex: 'changedAt',
      key: 'changedAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN')
    },
    {
      title: '修改说明',
      dataIndex: 'comment',
      key: 'comment'
    }
  ];

  if (loading) {
    return <div style={{ padding: 24 }}>加载中...</div>;
  }

  if (!rule) {
    return <div style={{ padding: 24 }}>规则不存在</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
        <Breadcrumb.Item>{rule.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="规则详情"
        extra={
          !editing && (
            <Space>
              <Button icon={<PlayCircleOutlined />} onClick={() => router.push(`/rules/${params.id}/simulate`)}>
                模拟执行
              </Button>
              <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
                编辑
              </Button>
            </Space>
          )
        }
      >
        {!editing ? (
          <Tabs
            items={[
              {
                key: 'detail',
                label: '基本信息',
                children: (
                  <Descriptions column={2}>
                    <Descriptions.Item label="规则名称">{rule.name}</Descriptions.Item>
                    <Descriptions.Item label="分类">
                      <Tag>{CATEGORY_MAP[rule.category]}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="描述" span={2}>{rule.description}</Descriptions.Item>
                    <Descriptions.Item label="状态">
                      <Tag color={rule.enabled ? '#52c41a' : '#8c8c8c'}>
                        {rule.enabled ? '启用' : '禁用'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">{rule.priority}</Descriptions.Item>
                    <Descriptions.Item label="版本">{rule.version}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                      {new Date(rule.createdAt).toLocaleString('zh-CN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="最后修改">
                      {new Date(rule.updatedAt).toLocaleString('zh-CN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人">{rule.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="修改人">{rule.updatedBy}</Descriptions.Item>
                    <Descriptions.Item label="条件" span={2}>
                      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                        {JSON.stringify(rule.conditions, null, 2)}
                      </pre>
                    </Descriptions.Item>
                    <Descriptions.Item label="动作" span={2}>
                      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                        {JSON.stringify(rule.actions, null, 2)}
                      </pre>
                    </Descriptions.Item>
                  </Descriptions>
                )
              },
              {
                key: 'history',
                label: (
                  <span>
                    <HistoryOutlined />
                    版本历史
                  </span>
                ),
                children: (
                  <Table
                    size="small"
                    rowKey="version"
                    columns={historyColumns}
                    dataSource={history}
                    pagination={false}
                  />
                )
              }
            ]}
          />
        ) : (
          <RuleEditor
            initialValues={rule}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        )}
      </Card>
    </div>
  );
}
