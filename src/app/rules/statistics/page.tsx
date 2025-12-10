'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  Space,
  Typography,
  Tag,
  Progress,
  Tooltip
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  executionTime: string;
  status: 'success' | 'warning' | 'error';
  matchedCustomers: number;
  triggeredActions: number;
  executionDuration: number;
  executedBy: string;
  executionContext: {
    triggerType: 'schedule' | 'manual';
    totalCustomersScanned: number;
  };
}

interface RuleStats {
  ruleId: string;
  ruleName: string;
  totalExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  totalMatches: number;
  totalActions: number;
  lastExecution: string;
  status: 'active' | 'inactive';
}

export default function RuleStatisticsPage() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [stats, setStats] = useState<RuleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [ruleFilter, setRuleFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [dateRange, ruleFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟获取执行日志数据
      const mockLogs: ExecutionLog[] = [
        {
          id: 'log_001',
          ruleId: 'rule_001',
          ruleName: '换片提醒-550天',
          executionTime: '2024-12-10T08:30:00Z',
          status: 'success',
          matchedCustomers: 45,
          triggeredActions: 45,
          executionDuration: 120,
          executedBy: 'system',
          executionContext: {
            triggerType: 'schedule',
            totalCustomersScanned: 1200
          }
        },
        {
          id: 'log_002',
          ruleId: 'rule_002',
          ruleName: '青少年度数预警',
          executionTime: '2024-12-10T09:15:00Z',
          status: 'success',
          matchedCustomers: 23,
          triggeredActions: 23,
          executionDuration: 95,
          executedBy: 'system',
          executionContext: {
            triggerType: 'schedule',
            totalCustomersScanned: 800
          }
        },
        {
          id: 'log_003',
          ruleId: 'rule_003',
          ruleName: '任务超时预警',
          executionTime: '2024-12-10T10:00:00Z',
          status: 'warning',
          matchedCustomers: 8,
          triggeredActions: 5,
          executionDuration: 180,
          executedBy: 'system',
          executionContext: {
            triggerType: 'schedule',
            totalCustomersScanned: 500
          }
        },
        {
          id: 'log_004',
          ruleId: 'rule_001',
          ruleName: '换片提醒-550天',
          executionTime: '2024-12-09T08:30:00Z',
          status: 'success',
          matchedCustomers: 42,
          triggeredActions: 42,
          executionDuration: 110,
          executedBy: 'system',
          executionContext: {
            triggerType: 'schedule',
            totalCustomersScanned: 1180
          }
        },
        {
          id: 'log_005',
          ruleId: 'rule_004',
          ruleName: '升单潜力-框架转角塑',
          executionTime: '2024-12-09T14:20:00Z',
          status: 'success',
          matchedCustomers: 15,
          triggeredActions: 12,
          executionDuration: 85,
          executedBy: 'user_001',
          executionContext: {
            triggerType: 'manual',
            totalCustomersScanned: 300
          }
        }
      ];

      setLogs(mockLogs);

      // 计算统计数据
      const ruleStatsMap = new Map<string, RuleStats>();
      mockLogs.forEach(log => {
        if (!ruleStatsMap.has(log.ruleId)) {
          ruleStatsMap.set(log.ruleId, {
            ruleId: log.ruleId,
            ruleName: log.ruleName,
            totalExecutions: 0,
            successRate: 0,
            avgExecutionTime: 0,
            totalMatches: 0,
            totalActions: 0,
            lastExecution: '',
            status: 'active'
          });
        }

        const stat = ruleStatsMap.get(log.ruleId)!;
        stat.totalExecutions++;
        stat.totalMatches += log.matchedCustomers;
        stat.totalActions += log.triggeredActions;
        stat.lastExecution = log.executionTime;
      });

      // 计算成功率和平均执行时间
      mockLogs.forEach(log => {
        const stat = ruleStatsMap.get(log.ruleId)!;
        const successCount = mockLogs.filter(l => l.ruleId === log.ruleId && l.status === 'success').length;
        stat.successRate = (successCount / stat.totalExecutions) * 100;
        stat.avgExecutionTime = mockLogs
          .filter(l => l.ruleId === log.ruleId)
          .reduce((sum, l) => sum + l.executionDuration, 0) / stat.totalExecutions;
      });

      setStats(Array.from(ruleStatsMap.values()));
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const logColumns: ColumnsType<ExecutionLog> = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
    },
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      key: 'executionTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === 'success' ? 'green' : status === 'warning' ? 'orange' : 'red';
        const text = status === 'success' ? '成功' : status === 'warning' ? '警告' : '失败';
        const icon = status === 'success' ? <CheckCircleOutlined /> : status === 'warning' ? <ClockCircleOutlined /> : <CloseCircleOutlined />;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: '匹配客户',
      dataIndex: 'matchedCustomers',
      key: 'matchedCustomers',
      width: 100,
      render: (count: number) => <Text strong>{count}</Text>,
    },
    {
      title: '触发动作',
      dataIndex: 'triggeredActions',
      key: 'triggeredActions',
      width: 100,
    },
    {
      title: '执行耗时(ms)',
      dataIndex: 'executionDuration',
      key: 'executionDuration',
      width: 120,
      render: (duration: number) => <Text>{duration}ms</Text>,
    },
    {
      title: '执行者',
      dataIndex: 'executedBy',
      key: 'executedBy',
      width: 100,
    },
    {
      title: '匹配率',
      key: 'matchRate',
      width: 120,
      render: (_, record) => {
        const rate = (record.matchedCustomers / record.executionContext.totalCustomersScanned * 100).toFixed(1);
        return (
          <Tooltip title={`${record.matchedCustomers}/${record.executionContext.totalCustomersScanned}`}>
            <Progress percent={parseFloat(rate)} size="small" />
          </Tooltip>
        );
      },
    },
  ];

  const statColumns: ColumnsType<RuleStats> = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
    },
    {
      title: '执行次数',
      dataIndex: 'totalExecutions',
      key: 'totalExecutions',
      width: 100,
      render: (count: number) => <Statistic value={count} valueStyle={{ fontSize: '14px' }} />,
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 150,
      render: (rate: number) => (
        <Progress
          percent={rate}
          status={rate >= 90 ? 'success' : rate >= 70 ? 'active' : 'exception'}
          size="small"
        />
      ),
    },
    {
      title: '平均耗时',
      dataIndex: 'avgExecutionTime',
      key: 'avgExecutionTime',
      width: 120,
      render: (time: number) => <Text>{time.toFixed(0)}ms</Text>,
    },
    {
      title: '总匹配数',
      dataIndex: 'totalMatches',
      key: 'totalMatches',
      width: 100,
    },
    {
      title: '总动作数',
      dataIndex: 'totalActions',
      key: 'totalActions',
      width: 100,
    },
    {
      title: '最后执行',
      dataIndex: 'lastExecution',
      key: 'lastExecution',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
  ];

  // 计算总体统计
  const totalStats = {
    totalExecutions: logs.length,
    successRate: logs.length > 0 ? (logs.filter(l => l.status === 'success').length / logs.length * 100) : 0,
    avgExecutionTime: logs.length > 0 ? logs.reduce((sum, l) => sum + l.executionDuration, 0) / logs.length : 0,
    totalMatches: logs.reduce((sum, l) => sum + l.matchedCustomers, 0),
    totalActions: logs.reduce((sum, l) => sum + l.triggeredActions, 0),
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: 1600, margin: '0 auto' }}>
      {/* Header */}
      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            <BarChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>规则执行统计</Title>
          </Space>
          <Text type="secondary">
            分析规则执行情况、性能指标和匹配效果
          </Text>
        </Space>
      </Card>

      {/* Filters */}
      <Card style={{ marginTop: 24 }}>
        <Space wrap>
          <Select
            style={{ width: 200 }}
            placeholder="选择规则"
            value={ruleFilter}
            onChange={setRuleFilter}
          >
            <Select.Option value="all">所有规则</Select.Option>
            <Select.Option value="rule_001">换片提醒-550天</Select.Option>
            <Select.Option value="rule_002">青少年度数预警</Select.Option>
            <Select.Option value="rule_003">任务超时预警</Select.Option>
            <Select.Option value="rule_004">升单潜力-框架转角塑</Select.Option>
          </Select>
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setDateRange([
                  dates[0]?.toISOString() || '',
                  dates[1]?.toISOString() || ''
                ]);
              } else {
                setDateRange(null);
              }
            }}
          />
        </Space>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总执行次数"
              value={totalStats.totalExecutions}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均成功率"
              value={totalStats.successRate}
              suffix="%"
              prefix={<SafetyOutlined />}
              precision={1}
              valueStyle={{ color: totalStats.successRate >= 90 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均执行耗时"
              value={totalStats.avgExecutionTime}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总匹配客户"
              value={totalStats.totalMatches}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Rule Performance Table */}
      <Card style={{ marginTop: 24 }} title="规则性能统计">
        <Table<RuleStats>
          columns={statColumns}
          dataSource={stats}
          rowKey="ruleId"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Execution Logs */}
      <Card style={{ marginTop: 24 }} title="执行日志">
        <Table<ExecutionLog>
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      </div>
    </MainLayout>
  );
}
