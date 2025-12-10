'use client';

import React, { useMemo, useState } from 'react';
import { Card, Select, Space, Typography, Row, Col, Statistic, Empty } from 'antd';
import { Line } from '@ant-design/charts';
import type { ExaminationRecord } from '@/lib/types/customer';

const { Text } = Typography;
const { Option } = Select;

interface RefractionChartProps {
  examinations: ExaminationRecord[];
}

type TimeRange = '6m' | '1y' | '2y' | '3y' | 'all';

const RefractionChart: React.FC<RefractionChartProps> = ({ examinations }) => {
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
      .filter((exam) => new Date(exam.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [examinations, timeRange]);

  const chartData = useMemo(() => {
    const data: { date: string; value: number; eye: string; isAbnormal?: boolean }[] = [];
    filteredData.forEach((exam) => {
      const dateStr = new Date(exam.date).toLocaleDateString('zh-CN', {
        year: '2-digit',
        month: '2-digit',
      });
      data.push({
        date: dateStr,
        value: Math.abs(exam.odRefraction),
        eye: '右眼(OD)',
        isAbnormal: exam.isAbnormal,
      });
      data.push({
        date: dateStr,
        value: Math.abs(exam.osRefraction),
        eye: '左眼(OS)',
        isAbnormal: exam.isAbnormal,
      });
    });
    return data;
  }, [filteredData]);

  const statistics = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    return {
      odChange: last.odRefraction - first.odRefraction,
      osChange: last.osRefraction - first.osRefraction,
      period: Math.round(
        (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24 * 30)
      ),
    };
  }, [filteredData]);

  if (examinations.length === 0) {
    return (
      <Card title="度数增长曲线" size="small">
        <Empty description="暂无检查数据" />
      </Card>
    );
  }

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'eye',
    smooth: true,
    color: ['#1890ff', '#52c41a'],
    yAxis: {
      title: { text: '度数（绝对值）' },
      min: 0,
    },
    xAxis: {
      title: { text: '日期' },
    },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      formatter: (datum: { eye: string; value: number; date: string }) => ({
        name: datum.eye,
        value: `-${datum.value}度`,
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
      title="度数增长曲线"
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
        <div style={{ height: 300 }}>
          <Line {...config} />
        </div>
        {statistics && (
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="右眼变化(OD)"
                value={statistics.odChange}
                precision={0}
                suffix="度"
                valueStyle={{ color: statistics.odChange < 0 ? '#f5222d' : '#52c41a', fontSize: 16 }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="左眼变化(OS)"
                value={statistics.osChange}
                precision={0}
                suffix="度"
                valueStyle={{ color: statistics.osChange < 0 ? '#f5222d' : '#52c41a', fontSize: 16 }}
              />
            </Col>
            <Col span={8}>
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

export default RefractionChart;
