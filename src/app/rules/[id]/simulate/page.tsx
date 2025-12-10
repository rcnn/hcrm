'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Breadcrumb, Button, Form, Input, InputNumber, Select, Space, Alert, Table, Descriptions, message } from 'antd';
import { HomeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface SimulationResult {
  matched: boolean;
  matchedConditions: any[];
  executedActions: any[];
  impactCount: number;
}

export default function RuleSimulatePage() {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;
  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [form] = Form.useForm();

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

  const handleSimulate = async (values: any) => {
    setSimulating(true);
    try {
      const response = await axios.post(`/api/rules/${ruleId}/test`, {
        testData: values
      });
      setResult(response.data.data);
    } catch (error) {
      message.error('模拟测试失败');
      setResult(null);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>加载中...</div>;
  }

  if (!rule) {
    return <div style={{ padding: 24 }}>规则不存在</div>;
  }

  const conditionColumns = [
    {
      title: '字段',
      dataIndex: 'field',
      key: 'field'
    },
    {
      title: '操作符',
      dataIndex: 'operator',
      key: 'operator',
      render: (operator: string) => {
        const map: Record<string, string> = {
          'gt': '大于',
          'lt': '小于',
          'gte': '大于等于',
          'lte': '小于等于',
          'eq': '等于'
        };
        return map[operator] || operator;
      }
    },
    {
      title: '期望值',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: '实际值',
      dataIndex: 'actualValue',
      key: 'actualValue'
    },
    {
      title: '是否匹配',
      dataIndex: 'matched',
      key: 'matched',
      render: (matched: boolean) => (
        <span style={{ color: matched ? '#52c41a' : '#ff4d4f' }}>
          {matched ? '✓' : '✗'}
        </span>
      )
    }
  ];

  const actionColumns = [
    {
      title: '动作类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const map: Record<string, string> = {
          'generate_task': '生成任务',
          'send_alert': '发送预警',
          'tag_customer': '标记客户',
          'refer_customer': '推荐转科'
        };
        return map[type] || type;
      }
    },
    {
      title: '参数',
      dataIndex: 'params',
      key: 'params',
      render: (params: any) => (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px' }}>
          {JSON.stringify(params, null, 2)}
        </pre>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
        <Breadcrumb.Item href={`/rules/${ruleId}`}>{rule.name}</Breadcrumb.Item>
        <Breadcrumb.Item>规则模拟</Breadcrumb.Item>
      </Breadcrumb>

      <Card title={`规则模拟 - ${rule.name}`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSimulate}
          initialValues={{
            age: 16,
            daysSinceLastLensChange: 550,
            refractionChange: 50,
            lensType: 'frame'
          }}
        >
          <Descriptions title="测试数据" bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="客户年龄">
              <Form.Item name="age" noStyle>
                <InputNumber min={0} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="距上次换片天数">
              <Form.Item name="daysSinceLastLensChange" noStyle>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="度数变化">
              <Form.Item name="refractionChange" noStyle>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="镜片类型">
              <Form.Item name="lensType" noStyle>
                <Select style={{ width: '100%' }}>
                  <Option value="frame">框架镜</Option>
                  <Option value="contact">隐形眼镜</Option>
                  <Option value="ortho-k">角膜塑形镜</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>

          <Space>
            <Button type="primary" htmlType="submit" icon={<PlayCircleOutlined />} loading={simulating}>
              运行模拟
            </Button>
            <Button onClick={() => router.back()}>
              返回
            </Button>
          </Space>
        </Form>

        {result && (
          <div style={{ marginTop: 24 }}>
            <Alert
              message={result.matched ? '规则匹配成功' : '规则未匹配'}
              description={
                result.matched
                  ? `该测试数据符合规则条件，将执行 ${result.executedActions.length} 个动作`
                  : '该测试数据不符合规则条件，不会执行任何动作'
              }
              type={result.matched ? 'success' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Card title="匹配的条件" size="small" style={{ marginBottom: 16 }}>
              <Table
                size="small"
                dataSource={result.matchedConditions.map((c: any, index: number) => ({
                  ...c,
                  key: index,
                  actualValue: form.getFieldValue(c.field?.split('.')[1]) || 'N/A'
                }))}
                columns={conditionColumns}
                pagination={false}
              />
            </Card>

            <Card title="执行的动作" size="small">
              <Table
                size="small"
                dataSource={result.executedActions.map((a: any, index: number) => ({
                  ...a,
                  key: index
                }))}
                columns={actionColumns}
                pagination={false}
              />
            </Card>

            <Alert
              message={`预计影响 ${result.impactCount} 个客户`}
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
