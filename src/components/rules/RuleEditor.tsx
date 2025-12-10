'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Space, Divider, Row, Col, Switch, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Condition {
  field: string;
  operator: string;
  value: any;
  andOr?: 'AND' | 'OR';
}

interface Action {
  type: string;
  params: Record<string, any>;
}

interface RuleEditorProps {
  initialValues?: {
    name: string;
    category: string;
    description?: string;
    conditions: Condition[];
    actions: Action[];
    enabled: boolean;
    priority: number;
  };
  onSave: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const FIELD_OPTIONS = [
  { label: '客户年龄', value: 'customer.age' },
  { label: '距上次换片天数', value: 'daysSinceLastLensChange' },
  { label: '度数变化', value: 'refractionChange' },
  { label: '镜片类型', value: 'customer.lensType' },
  { label: '最近就诊时间', value: 'lastVisitDate' }
];

const OPERATOR_OPTIONS = [
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于等于', value: 'lte' },
  { label: '等于', value: 'eq' }
];

const ACTION_TYPES = [
  { label: '生成任务', value: 'generate_task' },
  { label: '发送预警', value: 'send_alert' },
  { label: '标记客户', value: 'tag_customer' },
  { label: '推荐转科', value: 'refer_customer' }
];

export default function RuleEditor({ initialValues, onSave, onCancel, loading }: RuleEditorProps) {
  const [form] = Form.useForm();
  const [conditions, setConditions] = useState<Condition[]>(initialValues?.conditions || []);
  const [actions, setActions] = useState<Action[]>(initialValues?.actions || []);

  const handleAddCondition = () => {
    setConditions([...conditions, {
      field: '',
      operator: '',
      value: '',
      andOr: conditions.length > 0 ? 'AND' : undefined
    }]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const handleAddAction = () => {
    setActions([...actions, {
      type: '',
      params: {}
    }]);
  };

  const handleRemoveAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    setActions(newActions);
  };

  const handleActionChange = (index: number, field: string, value: any) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setActions(newActions);
  };

  const handleActionParamChange = (index: number, paramKey: string, value: any) => {
    const newActions = [...actions];
    newActions[index] = {
      ...newActions[index],
      params: { ...newActions[index].params, [paramKey]: value }
    };
    setActions(newActions);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const ruleData = {
        ...values,
        conditions,
        actions
      };
      onSave(ruleData);
    } catch (error) {
      message.error('请完善表单信息');
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialValues?.name || '',
          category: initialValues?.category || 'lens_change_reminder',
          description: initialValues?.description || '',
          enabled: initialValues?.enabled ?? true,
          priority: initialValues?.priority || 100
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="规则名称"
              rules={[{ required: true, message: '请输入规则名称' }]}
            >
              <Input size="small" placeholder="例如：换片提醒-550天" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="规则分类"
              rules={[{ required: true, message: '请选择规则分类' }]}
            >
              <Select size="small" placeholder="选择分类">
                <Option value="lens_change_reminder">换片提醒规则</Option>
                <Option value="refraction_warning">度数增长预警</Option>
                <Option value="quality_warning">质控预警</Option>
                <Option value="upgrade_potential">升单潜力</Option>
                <Option value="referral_rules">转科推荐</Option>
                <Option value="churn_warning">流失预警</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="规则描述">
          <Input.TextArea size="small" rows={2} placeholder="请描述规则的作用和适用范围" />
        </Form.Item>

        <Divider orientation="left">条件配置</Divider>

        <div style={{ marginBottom: 16 }}>
          <Button type="dashed" onClick={handleAddCondition} icon={<PlusOutlined />} size="small">
            添加条件
          </Button>
        </div>

        {conditions.map((condition, index) => (
          <Card key={index} size="small" style={{ marginBottom: 8 }}>
            <Row gutter={8} align="middle">
              <Col span={6}>
                <Select
                  size="small"
                  value={condition.field}
                  onChange={(value) => handleConditionChange(index, 'field', value)}
                  placeholder="选择字段"
                  style={{ width: '100%' }}
                >
                  {FIELD_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  size="small"
                  value={condition.operator}
                  onChange={(value) => handleConditionChange(index, 'operator', value)}
                  placeholder="操作符"
                  style={{ width: '100%' }}
                >
                  {OPERATOR_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <InputNumber
                  size="small"
                  value={condition.value}
                  onChange={(value) => handleConditionChange(index, 'value', value)}
                  placeholder="值"
                  style={{ width: '100%' }}
                />
              </Col>
              {index > 0 && (
                <Col span={4}>
                  <Select
                    size="small"
                    value={condition.andOr}
                    onChange={(value) => handleConditionChange(index, 'andOr', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="AND">AND</Option>
                    <Option value="OR">OR</Option>
                  </Select>
                </Col>
              )}
              <Col span={index > 0 ? 4 : 8}>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCondition(index)}
                >
                  删除
                </Button>
              </Col>
            </Row>
          </Card>
        ))}

        <Divider orientation="left">动作配置</Divider>

        <div style={{ marginBottom: 16 }}>
          <Button type="dashed" onClick={handleAddAction} icon={<PlusOutlined />} size="small">
            添加动作
          </Button>
        </div>

        {actions.map((action, index) => (
          <Card key={index} size="small" style={{ marginBottom: 8 }}>
            <Row gutter={8} align="middle">
              <Col span={6}>
                <Select
                  size="small"
                  value={action.type}
                  onChange={(value) => handleActionChange(index, 'type', value)}
                  placeholder="选择动作类型"
                  style={{ width: '100%' }}
                >
                  {ACTION_TYPES.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={14}>
                {action.type === 'generate_task' && (
                  <Space>
                    <InputNumber
                      size="small"
                      value={action.params.reminderDays}
                      onChange={(value) => handleActionParamChange(index, 'reminderDays', value)}
                      placeholder="提前天数"
                    />
                    <Select
                      size="small"
                      value={action.params.channels}
                      onChange={(value) => handleActionParamChange(index, 'channels', value)}
                      mode="multiple"
                      placeholder="通知渠道"
                      style={{ minWidth: 150 }}
                    >
                      <Option value="wechat">企微</Option>
                      <Option value="sms">短信</Option>
                      <Option value="call">AI外呼</Option>
                    </Select>
                  </Space>
                )}
                {action.type === 'send_alert' && (
                  <Space>
                    <Select
                      size="small"
                      value={action.params.priority}
                      onChange={(value) => handleActionParamChange(index, 'priority', value)}
                      placeholder="优先级"
                    >
                      <Option value="high">高</Option>
                      <Option value="medium">中</Option>
                      <Option value="low">低</Option>
                    </Select>
                    <Select
                      size="small"
                      value={action.params.channels}
                      onChange={(value) => handleActionParamChange(index, 'channels', value)}
                      mode="multiple"
                      placeholder="通知渠道"
                    >
                      <Option value="wechat">企微</Option>
                      <Option value="email">邮件</Option>
                    </Select>
                  </Space>
                )}
              </Col>
              <Col span={4}>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveAction(index)}
                >
                  删除
                </Button>
              </Col>
            </Row>
          </Card>
        ))}

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="enabled" label="启用状态" valuePropName="checked">
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="priority" label="优先级">
              <InputNumber size="small" min={0} max={1000} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
