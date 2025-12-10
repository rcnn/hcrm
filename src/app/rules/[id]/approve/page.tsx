'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import {
  Card,
  Button,
  Space,
  Tag,
  Timeline,
  Typography,
  Divider,
  Form,
  Input,
  Select,
  message,
  Modal,
  Descriptions
} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ApprovalRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  applicant: string;
  applyTime: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalLevel: number;
  currentApprover: string | null;
  approvalHistory: Array<{
    approver: string;
    action: 'approved' | 'rejected';
    time: string;
    comment: string;
  }>;
  comment: string;
  priority: 'high' | 'medium' | 'low';
}

export default function RuleApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;

  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchApprovals();
  }, [ruleId]);

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`/api/routes/${ruleId}/approve`);
      const result = await response.json();
      setApprovals(result.data || []);
    } catch (error) {
      console.error('获取审批记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApproval = async (values: any) => {
    try {
      const response = await fetch(`/api/routes/${ruleId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.code === 201) {
        message.success('审批申请提交成功');
        setSubmitModalVisible(false);
        form.resetFields();
        fetchApprovals();
      } else {
        message.error(result.message || '提交失败');
      }
    } catch (error) {
      console.error('提交审批失败:', error);
      message.error('提交失败');
    }
  };

  const handleApprovalAction = async (approvalId: string, action: 'approved' | 'rejected', comment: string) => {
    try {
      // 模拟审批操作
      const updatedHistory = [
        ...(selectedApproval?.approvalHistory || []),
        {
          approver: 'current_user',
          action,
          time: new Date().toISOString(),
          comment
        }
      ];

      message.success(action === 'approved' ? '审批通过' : '审批拒绝');
      setActionModalVisible(false);
      fetchApprovals();
    } catch (error) {
      console.error('审批操作失败:', error);
      message.error('审批操作失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'blue';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return priority;
    }
  };

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
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>规则审批流程</Title>
          </Space>
          <Text type="secondary">
            管理规则的审批流程，查看审批历史和当前审批状态
          </Text>
        </Space>
      </Card>

      {/* Submit Button */}
      <Card style={{ marginTop: 24 }}>
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => setSubmitModalVisible(true)}
          >
            提交审批申请
          </Button>
        </Space>
      </Card>

      {/* Approval List */}
      <Card style={{ marginTop: 24 }} title="审批记录">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
        ) : approvals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无审批记录
          </div>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {approvals.map((approval) => (
              <Card
                key={approval.id}
                size="small"
                title={
                  <Space>
                    <Tag color={getStatusColor(approval.status)}>
                      {getStatusText(approval.status)}
                    </Tag>
                    <Text strong>{approval.ruleName}</Text>
                  </Space>
                }
                extra={
                  <Space>
                    <Tag color={getPriorityColor(approval.priority)}>
                      优先级：{getPriorityText(approval.priority)}
                    </Tag>
                    {approval.status === 'pending' && (
                      <Button
                        size="small"
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => {
                          setSelectedApproval(approval);
                          setActionModalVisible(true);
                        }}
                      >
                        审批
                      </Button>
                    )}
                  </Space>
                }
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="申请人">
                    <Space>
                      <UserOutlined />
                      <Text>{approval.applicant}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="申请时间">
                    <Space>
                      <ClockCircleOutlined />
                      <Text>{new Date(approval.applyTime).toLocaleString('zh-CN')}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="当前审批人">
                    <Text>{approval.currentApprover || '无'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="审批级别">
                    <Text>第 {approval.approvalLevel} 级</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="申请说明" span={2}>
                    <Paragraph>{approval.comment || '无'}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>

                {approval.approvalHistory.length > 0 && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <Title level={5}>审批历史</Title>
                    <Timeline
                      items={approval.approvalHistory.map((history, index) => ({
                        color: history.action === 'approved' ? 'green' : 'red',
                        children: (
                          <Card key={index} size="small" style={{ background: '#fafafa' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Space>
                                <Tag color={history.action === 'approved' ? 'green' : 'red'}>
                                  {history.action === 'approved' ? '通过' : '拒绝'}
                                </Tag>
                                <Text strong>{history.approver}</Text>
                                <Text type="secondary">
                                  {new Date(history.time).toLocaleString('zh-CN')}
                                </Text>
                              </Space>
                              {history.comment && (
                                <Paragraph style={{ margin: 0 }}>
                                  {history.comment}
                                </Paragraph>
                              )}
                            </Space>
                          </Card>
                        ),
                      }))}
                    />
                  </>
                )}
              </Card>
            ))}
          </Space>
        )}
      </Card>

      {/* Submit Approval Modal */}
      <Modal
        title="提交审批申请"
        open={submitModalVisible}
        onCancel={() => {
          setSubmitModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitApproval}
        >
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select>
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label="申请说明"
          >
            <TextArea
              rows={4}
              placeholder="请输入申请说明..."
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setSubmitModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Approval Action Modal */}
      <Modal
        title="审批操作"
        open={actionModalVisible}
        onCancel={() => {
          setActionModalVisible(false);
          setSelectedApproval(null);
        }}
        footer={null}
      >
        {selectedApproval && (
          <Form
            layout="vertical"
            onFinish={(values) => {
              handleApprovalAction(selectedApproval.id, values.action, values.comment);
            }}
          >
            <Form.Item
              name="action"
              label="审批结果"
              rules={[{ required: true, message: '请选择审批结果' }]}
            >
              <Select placeholder="请选择审批结果">
                <Select.Option value="approved">
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    通过
                  </Space>
                </Select.Option>
                <Select.Option value="rejected">
                  <Space>
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    拒绝
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="comment"
              label="审批意见"
            >
              <TextArea
                rows={4}
                placeholder="请输入审批意见..."
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setActionModalVisible(false);
                  setSelectedApproval(null);
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
