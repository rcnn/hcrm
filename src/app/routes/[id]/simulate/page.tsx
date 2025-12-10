'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Breadcrumb, Form, InputNumber, Button, Alert, Descriptions, message } from 'antd';
import { HomeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function SimulateRulePage() {
  const params = useParams();
  const router = useRouter();
  const [rule, setRule] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRule();
  }, [params.id]);

  const fetchRule = async () => {
    try {
      const response = await axios.get(`/api/rules/${params.id}`);
      setRule(response.data.data);
    } catch (error) {
      message.error('获取规则详情失败');
    }
  };

  const handleTest = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/rules/${params.id}/test`, {
        testData: values
      });
      setTestResult(response.data.data);
    } catch (error) {
      message.error('测试规则失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/rules/execute', {
        params: {
          ruleId: params.id,
          startDate: '2024-12-01',
          endDate: '2024-12-10'
        }
      });
      setExecutionResult(response.data.data);
    } catch (error) {
      message.error('模拟执行失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
        <Breadcrumb.Item href={`/rules/${params.id}`}>{rule?.name}</Breadcrumb.Item>
        <Breadcrumb.Item>模拟执行</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="规则模拟与测试" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTest}
          initialValues={{
            'customer.age': 16,
            'daysSinceLastLensChange': 550,
            'refractionChange': 75
          }}
        >
          <Form.Item
            name="customer.age"
            label="客户年龄"
            rules={[{ required: true, message: '请输入客户年龄' }]}
          >
            <InputNumber size="small" min={0} max={120} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="daysSinceLastLensChange"
            label="距上次换片天数"
            rules={[{ required: true, message: '请输入天数' }]}
          >
            <InputNumber size="small" min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="refractionChange"
            label="度数变化"
            rules={[{ required: true, message: '请输入度数变化' }]}
          >
            <InputNumber size="small" min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<PlayCircleOutlined />}>
              测试规则
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {testResult && (
        <Card title="测试结果" style={{ marginBottom: 16 }}>
          <Alert
            message={testResult.matched ? '规则匹配成功' : '规则不匹配'}
            type={testResult.matched ? 'success' : 'warning'}
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Descriptions column={1}>
            <Descriptions.Item label="影响客户数量">{testResult.impactCount}</Descriptions.Item>
          </Descriptions>

          {testResult.matchedConditions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>条件匹配详情：</h4>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {JSON.stringify(testResult.matchedConditions, null, 2)}
              </pre>
            </div>
          )}

          {testResult.executedActions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>执行动作：</h4>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {JSON.stringify(testResult.executedActions, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}

      <Card title="批量模拟执行">
        <p>模拟规则在未来一段时间内的执行情况</p>
        <Button type="primary" onClick={handleSimulate} loading={loading} icon={<PlayCircleOutlined />}>
          开始模拟
        </Button>

        {executionResult && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="检查客户总数">{executionResult.totalCustomers}</Descriptions.Item>
              <Descriptions.Item label="匹配客户数">{executionResult.matchedCustomers}</Descriptions.Item>
              <Descriptions.Item label="生成任务数">{executionResult.generatedTasks}</Descriptions.Item>
              <Descriptions.Item label="执行耗时">{executionResult.executionTime}ms</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <h4>按条件统计：</h4>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {JSON.stringify(executionResult.breakdownByCondition, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
