'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { Option } = Select;

interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: string;
  threshold: number;
  timeWindow: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  department: string;
  assignees: string[];
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AlertRulesPage() {
  const router = useRouter();
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [form] = Form.useForm();

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard/alerts/rules');
      if (response.data.success) {
        setRules(response.data.data.rules);
      }
    } catch (error) {
      message.error('获取预警规则失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // 在实际应用中，这里会调用删除 API
      message.success('删除成功');
      fetchRules();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRule) {
        // 更新规则
        await axios.put('/api/dashboard/alerts/rules', {
          id: editingRule.id,
          ...values,
        });
        message.success('更新成功');
      } else {
        // 创建规则
        await axios.post('/api/dashboard/alerts/rules', values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchRules();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleToggleStatus = async (rule: AlertRule) => {
    try {
      await axios.put('/api/dashboard/alerts/rules', {
        id: rule.id,
        enabled: !rule.enabled,
      });
      message.success('状态更新成功');
      fetchRules();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: AlertRule) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '监控指标',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string) => {
        const metricMap: Record<string, string> = {
          avgTransactionValue: '客单价',
          wechatResponseTime: '企微回复时间',
          churnRate: '客户流失率',
          taskCompletionRate: '任务完成率',
          monthlyTarget: '月度目标',
        };
        return metricMap[text] || text;
      },
    },
    {
      title: '预警条件',
      key: 'condition',
      render: (_: any, record: AlertRule) => {
        const conditionMap: Record<string, string> = {
          greater_than: `> ${record.threshold}`,
          less_than: `< ${record.threshold}`,
          increase: `增长 > ${record.threshold}%`,
          decrease: `下降 > ${record.threshold}%`,
        };
        return conditionMap[record.condition] || '';
      },
    },
    {
      title: '时间窗口',
      dataIndex: 'timeWindow',
      key: 'timeWindow',
      render: (value: number) => `${value}天`,
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (value: string) => {
        const colorMap = {
          critical: 'red',
          high: 'orange',
          medium: 'blue',
          low: 'green',
        };
        const labelMap = {
          critical: '紧急',
          high: '高',
          medium: '中',
          low: '低',
        };
        return <Tag color={colorMap[value as keyof typeof colorMap]}>{labelMap[value as keyof typeof labelMap]}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => assignees.join(', '),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AlertRule) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条规则吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="预警规则配置"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchRules}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建规则
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rules}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRule ? '编辑预警规则' : '新建预警规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="例如：客单价异常预警" />
          </Form.Item>

          <Form.Item name="description" label="规则描述">
            <Input.TextArea rows={3} placeholder="请描述规则的作用和适用范围" />
          </Form.Item>

          <Form.Item name="metric" label="监控指标" rules={[{ required: true, message: '请选择监控指标' }]}>
            <Select placeholder="选择监控指标">
              <Option value="avgTransactionValue">客单价</Option>
              <Option value="wechatResponseTime">企微回复时间</Option>
              <Option value="churnRate">客户流失率</Option>
              <Option value="taskCompletionRate">任务完成率</Option>
              <Option value="monthlyTarget">月度目标</Option>
            </Select>
          </Form.Item>

          <Form.Item name="condition" label="预警条件" rules={[{ required: true, message: '请选择预警条件' }]}>
            <Select placeholder="选择预警条件">
              <Option value="greater_than">大于</Option>
              <Option value="less_than">小于</Option>
              <Option value="increase">增长超过</Option>
              <Option value="decrease">下降超过</Option>
            </Select>
          </Form.Item>

          <Form.Item name="threshold" label="阈值" rules={[{ required: true, message: '请输入阈值' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="输入阈值" />
          </Form.Item>

          <Form.Item name="timeWindow" label="时间窗口（天）" rules={[{ required: true, message: '请输入时间窗口' }]}>
            <InputNumber style={{ width: '100%' }} min={1} max={30} placeholder="天数" />
          </Form.Item>

          <Form.Item name="severity" label="严重程度" rules={[{ required: true, message: '请选择严重程度' }]}>
            <Select placeholder="选择严重程度">
              <Option value="critical">紧急</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>

          <Form.Item name="department" label="负责部门" rules={[{ required: true, message: '请选择负责部门' }]}>
            <Select placeholder="选择负责部门">
              <Option value="运营部">运营部</Option>
              <Option value="销售部">销售部</Option>
              <Option value="客服部">客服部</Option>
              <Option value="市场部">市场部</Option>
            </Select>
          </Form.Item>

          <Form.Item name="assignees" label="负责人" rules={[{ required: true, message: '请选择负责人' }]}>
            <Select mode="tags" placeholder="选择或输入负责人">
              <Option value="张经理">张经理</Option>
              <Option value="李主管">李主管</Option>
              <Option value="王总监">王总监</Option>
              <Option value="赵经理">赵经理</Option>
            </Select>
          </Form.Item>

          <Form.Item name="actions" label="通知方式" rules={[{ required: true, message: '请选择通知方式' }]}>
            <Select mode="multiple" placeholder="选择通知方式">
              <Option value="send_email">发送邮件</Option>
              <Option value="send_wechat">发送企微</Option>
              <Option value="send_sms">发送短信</Option>
              <Option value="create_task">创建任务</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
