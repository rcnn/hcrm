'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Breadcrumb, Button, Space, Tag, Descriptions, message, Modal, Tabs } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import RuleEditor from '@/components/rules/RuleEditor';
import axios from 'axios';

const { TabPane } = Tabs;

const CATEGORY_MAP: Record<string, string> = {
  'lens_change_reminder': '换片提醒规则',
  'refraction_warning': '度数增长预警',
  'quality_warning': '质控预警',
  'upgrade_potential': '升单潜力',
  'referral_rules': '转科推荐',
  'churn_warning': '流失预警'
};

export default function RuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;
  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

  useEffect(() => {
    fetchRule();
  }, [ruleId]);

  const fetchRule = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/rules/${ruleId}`);
      setRule(response.data.data);
    } catch (error) {
      message.error('获取规则详情失败');
      router.push('/rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await axios.put(`/api/rules/${ruleId}`, values);
      message.success('规则更新成功');
      setEditing(false);
      fetchRule();
    } catch (error) {
      message.error('更新规则失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条规则吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await axios.delete(`/api/rules/${ruleId}`);
          message.success('删除成功');
          router.push('/rules');
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleSimulate = () => {
    router.push(`/rules/${ruleId}/simulate`);
  };

  const handleViewHistory = () => {
    router.push(`/rules/${ruleId}/history`);
  };

  const handleApproval = () => {
    router.push(`/rules/${ruleId}/approve`);
  };

  if (loading) {
    return <div style={{ padding: 24 }}>加载中...</div>;
  }

  if (!rule) {
    return <div style={{ padding: 24 }}>规则不存在</div>;
  }

  if (editing) {
    return (
      <div style={{ padding: 24 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
          <Breadcrumb.Item>{rule.name}</Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          title={`编辑规则 - ${rule.name}`}
          extra={
            <Button onClick={() => setEditing(false)}>
              取消
            </Button>
          }
        >
          <RuleEditor
            initialValues={rule}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            loading={loading}
          />
        </Card>
      </div>
    );
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
        title={rule.name}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              编辑
            </Button>
            <Button icon={<HistoryOutlined />} onClick={handleViewHistory}>
              历史
            </Button>
            <Button icon={<FileTextOutlined />} onClick={handleApproval}>
              审批
            </Button>
            <Button icon={<PlayCircleOutlined />} onClick={handleSimulate}>
              模拟
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
              删除
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="detail">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="规则ID">{rule.id}</Descriptions.Item>
              <Descriptions.Item label="规则名称">{rule.name}</Descriptions.Item>
              <Descriptions.Item label="分类">
                <Tag>{CATEGORY_MAP[rule.category] || rule.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={rule.enabled ? '#52c41a' : '#8c8c8c'}>
                  {rule.enabled ? '启用' : '禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">{rule.priority}</Descriptions.Item>
              <Descriptions.Item label="版本">v{rule.version}</Descriptions.Item>
              <Descriptions.Item label="创建人">{rule.createdBy}</Descriptions.Item>
              <Descriptions.Item label="最后修改人">{rule.updatedBy}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(rule.createdAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="最后修改时间">
                {new Date(rule.updatedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {rule.description || '无'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="条件配置" key="conditions">
            <div style={{ marginTop: 16 }}>
              {rule.conditions && rule.conditions.length > 0 ? (
                rule.conditions.map((condition: any, index: number) => (
                  <Card key={index} size="small" style={{ marginBottom: 8 }}>
                    <Descriptions column={1}>
                      <Descriptions.Item label="字段">{condition.field}</Descriptions.Item>
                      <Descriptions.Item label="操作符">
                        {condition.operator === 'gt' ? '大于' :
                         condition.operator === 'lt' ? '小于' :
                         condition.operator === 'gte' ? '大于等于' :
                         condition.operator === 'lte' ? '小于等于' :
                         condition.operator === 'eq' ? '等于' : condition.operator}
                      </Descriptions.Item>
                      <Descriptions.Item label="值">{condition.value}</Descriptions.Item>
                      {condition.andOr && (
                        <Descriptions.Item label="逻辑关系">{condition.andOr}</Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                ))
              ) : (
                <div>暂无条件配置</div>
              )}
            </div>
          </TabPane>

          <TabPane tab="动作配置" key="actions">
            <div style={{ marginTop: 16 }}>
              {rule.actions && rule.actions.length > 0 ? (
                rule.actions.map((action: any, index: number) => (
                  <Card key={index} size="small" style={{ marginBottom: 8 }}>
                    <Descriptions column={1}>
                      <Descriptions.Item label="动作类型">
                        {action.type === 'generate_task' ? '生成任务' :
                         action.type === 'send_alert' ? '发送预警' :
                         action.type === 'tag_customer' ? '标记客户' :
                         action.type === 'refer_customer' ? '推荐转科' : action.type}
                      </Descriptions.Item>
                      <Descriptions.Item label="参数">
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(action.params, null, 2)}
                        </pre>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))
              ) : (
                <div>暂无动作配置</div>
              )}
            </div>
          </TabPane>

          {rule.effectiveFrom && (
            <TabPane tab="生效时间" key="schedule">
              <Descriptions column={1}>
                <Descriptions.Item label="生效开始时间">
                  {new Date(rule.effectiveFrom).toLocaleString('zh-CN')}
                </Descriptions.Item>
                {rule.effectiveTo && (
                  <Descriptions.Item label="生效结束时间">
                    {new Date(rule.effectiveTo).toLocaleString('zh-CN')}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </TabPane>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
