'use client';

import React, { useState } from 'react';
import { Card, Modal, Table, Tag } from 'antd';
import { LineChart, BarChart, PieChart } from './index';
import type { ChartData } from '@/types/dashboard';

interface DrillDownChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartData[];
  xField: string;
  yField: string;
  seriesField?: string;
  title?: string;
  height?: number;
  onDrillDown?: (data: ChartData) => void;
}

const DrillDownChart: React.FC<DrillDownChartProps> = ({
  type,
  data,
  xField,
  yField,
  seriesField,
  title,
  height = 300,
  onDrillDown,
}) => {
  const [selectedData, setSelectedData] = useState<ChartData | null>(null);
  const [drillDownData, setDrillDownData] = useState<ChartData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 模拟下钻数据
  const generateDrillDownData = (selectedItem: ChartData): ChartData[] => {
    const baseData = [];
    for (let i = 0; i < 10; i++) {
      baseData.push({
        id: `${selectedItem[xField]}_${i}`,
        name: `${selectedItem[xField]} 明细 ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.5 ? 'completed' : 'pending',
      });
    }
    return baseData;
  };

  const handlePointClick = (data: any) => {
    const selectedItem = data?.datum || data;
    if (!selectedItem) return;

    setSelectedData(selectedItem);
    const drillData = generateDrillDownData(selectedItem);
    setDrillDownData(drillData);
    setModalVisible(true);

    if (onDrillDown) {
      onDrillDown(selectedItem);
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      xField,
      yField,
      seriesField,
      height,
      onEvent: (chart: any, event: any) => {
        if (event.type === 'pointclick') {
          handlePointClick(event.data);
        }
      },
    };

    switch (type) {
      case 'line':
        return <LineChart {...commonProps} />;
      case 'bar':
        return <BarChart {...commonProps} />;
      case 'pie':
        return <PieChart {...commonProps} angleField={yField} colorField={xField} />;
      case 'area':
        return <LineChart {...commonProps} />;
      default:
        return <LineChart {...commonProps} />;
    }
  };

  const drillDownColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      sorter: (a: ChartData, b: ChartData) => a.value - b.value,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => (
        <Tag color={text === 'completed' ? 'green' : 'orange'}>{text === 'completed' ? '已完成' : '进行中'}</Tag>
      ),
    },
  ];

  return (
    <>
      <Card title={title} size="small" style={{ marginBottom: 16 }}>
        {renderChart()}
        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
          💡 点击图表中的数据点查看详细数据
        </div>
      </Card>

      <Modal
        title={`${selectedData?.[xField]} - 详细数据`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        <Table
          dataSource={drillDownData}
          columns={drillDownColumns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </>
  );
};

export default DrillDownChart;
