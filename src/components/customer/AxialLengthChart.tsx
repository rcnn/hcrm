'use client';

import React, { useMemo, useState } from 'react';
import { Card, Select, Space, Typography, Row, Col, Statistic, Empty, Alert } from 'antd';
import { Line } from '@ant-design/charts';
import { WarningOutlined } from '@ant-design/icons';
import type { ExaminationRecord } from '@/lib/types/customer';

const { Text } = Typography;
const { Option } = Select;

interface AxialLengthChartProps {
  examinations: ExaminationRecord[];
  age?: number; // 用于正常发育曲线对比
}

type TimeRange = '6m' | '1y' | '2y' | '3y' | 'all';

// 正常眼轴增长参考值（mm/年）
const NORMAL_GROWTH_RATE = 0.2; // 儿童正常增长约0.1-0.2mm/年
const WARNING_GROWTH_RATE = 0.4; // 超过0.4mm/年需预警

const AxialLengthChart: React.FC<AxialLengthChartProps> = ({ examinations, age }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '6m':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '2y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 2));
        break;
      case '3y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 3));
        break;
      default:
        startDate = new Date(0);
    }

    return examinations
      .filter((exam) => new Date(exam.date) >= startDate && (exam.odAxialLength || exam.osAxialLength))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [examinations, timeRange]);

  const chartData = useMemo(() => {
    const data: { date: string; value: number; type: string }[] = [];
    filteredData.forEach((exam) => {
      const dateStr = new Date(exam.date).toLocaleDateString('zh-CN', {
        year: '2-digit',
        month: '2-digit',
      });
      if (exam.odAxialLength) {
        data.push({
          date: dateStr,
          value: exam.odAxialLength,
          type: '右眼(OD)',
        });
      }
      if (exam.osAxialLength) {
        data.push({
          date: dateStr,
          value: exam.osAxialLength,
          type: '左眼(OS)',
        });
      }
    });
    return data;
  }, [filteredData]);

  const statistics = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    const months = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
    const years = months / 12;

    const odGrowth = (last.odAxialLength || 0) - (first.odAxialLength || 0);
    const osGrowth = (last.osAxialLength || 0) - (first.osAxialLength || 0);

    return {
      odGrowth,
      osGrowth,
      odGrowthRate: years > 0 ? odGrowth / years : 0,
      osGrowthRate: years > 0 ? osGrowth / years : 0,
      period: Math.round(months),
    };
  }, [filteredData]);

  const hasWarning = statistics && (statistics.odGrowthRate > WARNING_GROWTH_RATE || statistics.osGrowthRate > WARNING_GROWTH_RATE);

  if (examinations.filter(e => e.odAxialLength || e.osAxialLength).length === 0) {
    return (
      <Card title="眼轴增长曲线" size="small">
        <Empty description="暂无眼轴数据" />
      </Card>
    );
  }

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#1890ff', '#52c41a'],
    yAxis: {
      title: { text: '眼轴长度(mm)' },
      min: Math.floor(Math.min(...chartData.map(d => d.value)) - 0.5),
      max: Math.ceil(Math.max(...chartData.map(d => d.value)) + 0.5),
    },
    xAxis: {
      title: { text: '日期' },
    },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      formatter: (datum: { type: string; value: number }) => ({
        name: datum.type,
        value: `${datum.value.toFixed(2)}mm`,
      }),
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1500,
      },
    },
  };

  return (
    <Card
      title="眼轴增长曲线"
      size="small"
      extra={
        <Select value={timeRange} onChange={setTimeRange} style={{ width: 100 }} size="small">
          <Option value="6m">近6个月</Option>
          <Option value="1y">近1年</Option>
          <Option value="2y">近2年</Option>
          <Option value="3y">近3年</Option>
          <Option value="all">全部</Option>
        </Select>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {hasWarning && (
          <Alert
            message="眼轴增长预警"
            description="眼轴年增长速度超过0.4mm，建议加强控制。"
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        )}
        <div style={{ height: 300 }}>
          <Line {...config} />
        </div>
        {statistics && (
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="右眼增长(OD)"
                value={statistics.odGrowth}
                precision={2}
                suffix="mm"
                valueStyle={{
                  color: statistics.odGrowthRate > WARNING_GROWTH_RATE ? '#f5222d' : '#52c41a',
                  fontSize: 16,
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="左眼增长(OS)"
                value={statistics.osGrowth}
                precision={2}
                suffix="mm"
                valueStyle={{
                  color: statistics.osGrowthRate > WARNING_GROWTH_RATE ? '#f5222d' : '#52c41a',
                  fontSize: 16,
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="年增长率(OD)"
                value={statistics.odGrowthRate}
                precision={2}
                suffix="mm/年"
                valueStyle={{
                  color: statistics.odGrowthRate > WARNING_GROWTH_RATE ? '#f5222d' : '#52c41a',
                  fontSize: 16,
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="统计周期"
                value={statistics.period}
                suffix="个月"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
          </Row>
        )}
      </Space>
    </Card>
  );
};

export default AxialLengthChart;
