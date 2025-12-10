'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftOutlined,
  HistoryOutlined,
  DiffOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Card, Timeline, Button, Tag, Modal, Table, Typography, Space, Divider, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface RuleHistory {
  id: string;
  ruleId: string;
  version: number;
  changeLog: string;
  changedBy: string;
  changedAt: string;
  isActive: boolean;
  changeType: 'create' | 'update' | 'delete';
  previousVersion: number | null;
  ruleSnapshot: {
    name: string;
    category: string;
    description: string;
    conditions: any[];
    actions: any[];
    enabled: boolean;
    priority: number;
  };
}

export default function RuleHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;

  const [history, setHistory] = useState<RuleHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<RuleHistory | null>(null);
  const [compareVersions, setCompareVersions] = useState<[RuleHistory, RuleHistory] | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [ruleId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/routes/${ruleId}/history`);
      const result = await response.json();
      setHistory(result.data || []);
    } catch (error) {
      console.error('获取规则历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (version: RuleHistory) => {
    setSelectedVersion(version);
    setDetailModalVisible(true);
  };

  const handleCompare = (version1: RuleHistory, version2: RuleHistory) => {
    setCompareVersions([version1, version2]);
    setCompareModalVisible(true);
  };

  const handleRollback = (version: RuleHistory) => {
    Modal.confirm({
      title: '确认回滚',
      content: (
        <div>
          <p>确定要回滚到版本 v{version.version} 吗？</p>
          <p>回滚将创建新版本，并恢复到该历史版本的状态。</p>
        </div>
      ),
      onOk: async () => {
        setRollbackLoading(true);
        try {
          const response = await fetch(`/api/routes/${ruleId}/rollback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              targetVersion: version.version,
              reason: `回滚到版本 v${version.version}：${version.changeLog}`,
            }),
          });

          const result = await response.json();

          if (result.code === 200) {
            message.success(`回滚成功，新版本为 v${result.data.version}`);
            fetchHistory(); // 刷新历史列表
          } else {
            message.error(result.message || '回滚失败');
          }
        } catch (error) {
          console.error('回滚失败:', error);
          message.error('回滚失败');
        } finally {
          setRollbackLoading(false);
        }
      },
    });
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'green';
      case 'update':
        return 'blue';
      case 'delete':
        return 'red';
      default:
        return 'default';
    }
  };

  const getChangeTypeText = (type: string) => {
    switch (type) {
      case 'create':
        return '创建';
      case 'update':
        return '更新';
      case 'delete':
        return '删除';
      default:
        return type;
    }
  };

  const columns: ColumnsType<RuleHistory> = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      render: (version: number, record: RuleHistory) => (
        <Space>
          <Text strong>v{version}</Text>
          {record.isActive && <Tag color="gold">当前版本</Tag>}
        </Space>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type: string) => (
        <Tag color={getChangeTypeColor(type)}>
          {getChangeTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '变更说明',
      dataIndex: 'changeLog',
      key: 'changeLog',
      ellipsis: true,
    },
    {
      title: '变更人',
      dataIndex: 'changedBy',
      key: 'changedBy',
      width: 120,
    },
    {
      title: '变更时间',
      dataIndex: 'changedAt',
      key: 'changedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record: RuleHistory) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<DiffOutlined />}
            onClick={() => {
              const previousVersion = history.find(h => h.version === record.previousVersion);
              if (previousVersion) {
                handleCompare(previousVersion, record);
              }
            }}
            disabled={!record.previousVersion}
          >
            对比
          </Button>
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => handleRollback(record)}
            disabled={record.isActive}
            loading={rollbackLoading}
          >
            回滚
          </Button>
        </Space>
      ),
    },
  ];

  const renderCondition = (condition: any, index: number) => (
    <div key={index} style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4, marginBottom: 4 }}>
      <Text code>{condition.field}</Text>
      <Text> {condition.operator} </Text>
      <Text code>{String(condition.value)}</Text>
      {condition.andOr && <Tag style={{ marginLeft: 8 }}>{condition.andOr}</Tag>}
    </div>
  );

  const renderAction = (action: any, index: number) => (
    <div key={index} style={{ padding: '8px', background: '#f0f9ff', borderRadius: 4, marginBottom: 4 }}>
      <Tag color="blue">{action.type}</Tag>
      <pre style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
        {JSON.stringify(action.params, null, 2)}
      </pre>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push(`/rules/${ruleId}`)}
            >
              返回规则详情
            </Button>
            <Divider type="vertical" />
            <HistoryOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>规则版本历史</Title>
          </Space>
          <Text type="secondary">
            查看规则的所有历史版本，支持版本对比和回滚操作
          </Text>
        </Space>
      </Card>

      {/* Timeline View */}
      <Card style={{ marginTop: 24 }} title="版本时间线">
        <Timeline
          mode="left"
          items={history.map((item, index) => ({
            color: item.isActive ? 'gold' : 'blue',
            children: (
              <Card
                size="small"
                style={{ marginBottom: 8 }}
                title={
                  <Space>
                    <Tag color={getChangeTypeColor(item.changeType)}>
                      v{item.version}
                    </Tag>
                    {item.isActive && <Tag color="gold">当前版本</Tag>}
                  </Space>
                }
                extra={
                  <Space>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(item)}
                    >
                      查看
                    </Button>
                    {item.previousVersion && (
                      <Button
                        size="small"
                        icon={<DiffOutlined />}
                        onClick={() => {
                          const previousVersion = history.find(h => h.version === item.previousVersion);
                          if (previousVersion) {
                            handleCompare(previousVersion, item);
                          }
                        }}
                      >
                        对比
                      </Button>
                    )}
                    <Button
                      size="small"
                      icon={<HistoryOutlined />}
                      onClick={() => handleRollback(item)}
                      disabled={item.isActive}
                      loading={rollbackLoading}
                    >
                      回滚
                    </Button>
                  </Space>
                }
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Paragraph strong style={{ marginBottom: 4 }}>
                    {item.changeLog}
                  </Paragraph>
                  <Space size="small">
                    <UserOutlined />
                    <Text type="secondary">{item.changedBy}</Text>
                    <Divider type="vertical" />
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      {new Date(item.changedAt).toLocaleString('zh-CN')}
                    </Text>
                  </Space>
                </Space>
              </Card>
            ),
          }))}
        />
      </Card>

      {/* Table View */}
      <Card style={{ marginTop: 24 }} title="版本列表">
        <Table<RuleHistory>
          columns={columns}
          dataSource={history}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <TagOutlined />
            版本详情 v{selectedVersion?.version}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedVersion && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>基本信息</Title>
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>规则名称：</Text>
                    <Text>{selectedVersion.ruleSnapshot.name}</Text>
                  </div>
                  <div>
                    <Text strong>分类：</Text>
                    <Text>{selectedVersion.ruleSnapshot.category}</Text>
                  </div>
                  <div>
                    <Text strong>描述：</Text>
                    <Text>{selectedVersion.ruleSnapshot.description}</Text>
                  </div>
                  <div>
                    <Text strong>状态：</Text>
                    <Tag color={selectedVersion.ruleSnapshot.enabled ? 'green' : 'red'}>
                      {selectedVersion.ruleSnapshot.enabled ? '启用' : '禁用'}
                    </Tag>
                    <Text strong style={{ marginLeft: 16 }}>优先级：</Text>
                    <Tag>{selectedVersion.ruleSnapshot.priority}</Tag>
                  </div>
                </Space>
              </Card>
            </div>

            <div>
              <Title level={5}>条件配置</Title>
              <Card size="small">
                {selectedVersion.ruleSnapshot.conditions.map(renderCondition)}
              </Card>
            </div>

            <div>
              <Title level={5}>动作配置</Title>
              <Card size="small">
                {selectedVersion.ruleSnapshot.actions.map(renderAction)}
              </Card>
            </div>
          </Space>
        )}
      </Modal>

      {/* Compare Modal */}
      <Modal
        title="版本对比"
        open={compareModalVisible}
        onCancel={() => setCompareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCompareModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1000}
      >
        {compareVersions && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Old Version */}
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="default">v{compareVersions[0].version}</Tag>
                    <Text type="secondary">旧版本</Text>
                  </Space>
                }
                style={{ flex: 1 }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>规则名称：</Text>
                    <Text>{compareVersions[0].ruleSnapshot.name}</Text>
                  </div>
                  <div>
                    <Text strong>描述：</Text>
                    <Text>{compareVersions[0].ruleSnapshot.description}</Text>
                  </div>
                  <div>
                    <Text strong>条件数量：</Text>
                    <Text>{compareVersions[0].ruleSnapshot.conditions.length}</Text>
                  </div>
                  <div>
                    <Text strong>动作数量：</Text>
                    <Text>{compareVersions[0].ruleSnapshot.actions.length}</Text>
                  </div>
                </Space>
              </Card>

              {/* New Version */}
              <Card
                size="small"
                title={
                  <Space>
                    <Tag color="blue">v{compareVersions[1].version}</Tag>
                    <Text type="secondary">新版本</Text>
                  </Space>
                }
                style={{ flex: 1 }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>规则名称：</Text>
                    <Text>{compareVersions[1].ruleSnapshot.name}</Text>
                  </div>
                  <div>
                    <Text strong>描述：</Text>
                    <Text>{compareVersions[1].ruleSnapshot.description}</Text>
                  </div>
                  <div>
                    <Text strong>条件数量：</Text>
                    <Text>{compareVersions[1].ruleSnapshot.conditions.length}</Text>
                  </div>
                  <div>
                    <Text strong>动作数量：</Text>
                    <Text>{compareVersions[1].ruleSnapshot.actions.length}</Text>
                  </div>
                </Space>
              </Card>
            </div>

            <Divider>变更说明</Divider>
            <Card size="small">
              <Text>{compareVersions[1].changeLog}</Text>
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
}
