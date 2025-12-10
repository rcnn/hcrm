'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, Tabs, Select, Input, DatePicker, message, Modal, Form } from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { LeadPoolItem, ReferralStatus, DepartmentType } from '@/lib/types/referral';
import { leadPoolService } from '@/lib/services/leadPoolService';
import { mockUsers } from '@/lib/mock/users';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LeadPoolPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadPoolItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadPoolItem | null>(null);
  const [form] = Form.useForm();

  // 加载线索数据
  const loadLeads = async () => {
    setLoading(true);
    try {
      // TODO: 调用API获取线索池数据
      // const response = await fetch('/api/lead-pool');
      // const data = await response.json();

      // 模拟数据
      const mockLeads: LeadPoolItem[] = [
        {
          id: 'LEAD_001',
          referralId: 'REF_001',
          customerId: 'C001',
          customerName: '张小明',
          targetDepartment: 'orthokeratology',
          status: 'pending',
          priority: 'high',
          createdAt: new Date('2024-12-08'),
        },
        {
          id: 'LEAD_002',
          referralId: 'REF_002',
          customerId: 'C002',
          customerName: '李小红',
          targetDepartment: 'refractive',
          status: 'contacted',
          priority: 'medium',
          assignedTo: '1',
          assignedToName: '张医生',
          createdAt: new Date('2024-12-07'),
          lastContactAt: new Date('2024-12-08'),
          nextFollowUpAt: new Date('2024-12-10'),
        },
      ];

      setLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load leads:', error);
      message.error('加载线索数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // 状态标签渲染
  const renderStatusTag = (status: ReferralStatus) => {
    const statusMap = {
      pending: { color: 'orange', text: '待跟进' },
      contacted: { color: 'blue', text: '已联系' },
      visited: { color: 'purple', text: '已到院' },
      converted: { color: 'green', text: '已成交' },
      failed: { color: 'red', text: '未成交' },
    };

    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 科室标签渲染
  const renderDepartmentTag = (department: DepartmentType) => {
    const config =
      department === 'orthokeratology'
        ? { color: 'blue', text: '角塑科' }
        : { color: 'green', text: '屈光科' };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 优先级标签渲染
  const renderPriorityTag = (priority: string) => {
    const config =
      priority === 'high'
        ? { color: 'red', text: '高' }
        : priority === 'medium'
        ? { color: 'orange', text: '中' }
        : { color: 'default', text: '低' };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: '目标科室',
      dataIndex: 'targetDepartment',
      key: 'targetDepartment',
      width: 100,
      render: (department: DepartmentType) => renderDepartmentTag(department),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ReferralStatus) => renderStatusTag(status),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => renderPriorityTag(priority),
    },
    {
      title: '分配给',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 120,
      render: (name: string) => name || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '下次跟进',
      dataIndex: 'nextFollowUpAt',
      key: 'nextFollowUpAt',
      width: 120,
      render: (date: Date) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: LeadPoolItem) => (
        <Space size="small">
          {!record.assignedTo ? (
            <Button
              type="link"
              size="small"
              icon={<UserAddOutlined />}
              onClick={() => handleAssign(record)}
            >
              分配
            </Button>
          ) : (
            <Button type="link" size="small">
              跟进
            </Button>
          )}
          <Button type="link" size="small">
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 处理分配
  const handleAssign = (lead: LeadPoolItem) => {
    setSelectedLead(lead);
    setAssignModalVisible(true);
    form.setFieldsValue({
      assignedTo: lead.assignedTo,
      nextFollowUp: lead.nextFollowUpAt
        ? dayjs(lead.nextFollowUpAt)
        : dayjs().add(3, 'day'),
    });
  };

  // 提交分配
  const handleAssignSubmit = async (values: any) => {
    try {
      // TODO: 调用API分配线索
      // await fetch(`/api/lead-pool/${selectedLead?.id}/assign`, {
      //   method: 'POST',
      //   body: JSON.stringify(values),
      // });

      message.success('分配成功！');
      setAssignModalVisible(false);
      loadLeads();
    } catch (error) {
      console.error('Assign error:', error);
      message.error('分配失败，请重试');
    }
  };

  // 批量自动分配
  const handleBatchAssign = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要分配的线索');
      return;
    }

    try {
      // TODO: 调用API批量分配
      message.success(`已为 ${selectedRowKeys.length} 条线索执行自动分配`);
      setSelectedRowKeys([]);
      loadLeads();
    } catch (error) {
      console.error('Batch assign error:', error);
      message.error('批量分配失败');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>线索池管理</h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadLeads}>
                刷新
              </Button>
              <Button type="primary" icon={<UserAddOutlined />} onClick={handleBatchAssign}>
                批量自动分配
              </Button>
            </Space>
          </div>

          <Card>
            <Tabs
              defaultActiveKey="all"
              items={[
                {
                  key: 'all',
                  label: (
                    <span>
                      <TeamOutlined />
                      全部线索
                    </span>
                  ),
                  children: (
                    <Table
                      columns={columns}
                      dataSource={leads}
                      rowKey="id"
                      loading={loading}
                      rowSelection={{
                        selectedRowKeys,
                        onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys as string[]),
                      }}
                      pagination={{
                        total: leads.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条线索`,
                      }}
                    />
                  ),
                },
                {
                  key: 'pending',
                  label: (
                    <span>
                      <ClockCircleOutlined />
                      待跟进
                    </span>
                  ),
                  children: (
                    <Table
                      columns={columns}
                      dataSource={leads.filter((l) => l.status === 'pending')}
                      rowKey="id"
                      loading={loading}
                      pagination={{
                        total: leads.filter((l) => l.status === 'pending').length,
                        pageSize: 10,
                      }}
                    />
                  ),
                },
                {
                  key: 'converted',
                  label: (
                    <span>
                      <CheckCircleOutlined />
                      已成交
                    </span>
                  ),
                  children: (
                    <Table
                      columns={columns}
                      dataSource={leads.filter((l) => l.status === 'converted')}
                      rowKey="id"
                      loading={loading}
                      pagination={{
                        total: leads.filter((l) => l.status === 'converted').length,
                        pageSize: 10,
                      }}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Space>
      </div>

      {/* 分配线索对话框 */}
      <Modal
        title="分配线索"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAssignSubmit}>
          <Form.Item label="线索信息">
            <div>
              <strong>客户：</strong>
              {selectedLead?.customerName}
            </div>
            <div>
              <strong>目标科室：</strong>
              {selectedLead?.targetDepartment === 'orthokeratology' ? '角塑科' : '屈光科'}
            </div>
          </Form.Item>

          <Form.Item
            label="分配给"
            name="assignedTo"
            rules={[{ required: true, message: '请选择分配对象' }]}
          >
            <Select placeholder="请选择员工">
              {mockUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="下次跟进时间" name="nextFollowUp">
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="选择时间"
            />
          </Form.Item>

          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={3} placeholder="添加备注信息" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setAssignModalVisible(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认分配
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default LeadPoolPage;
