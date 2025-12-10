'use client';

import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Space } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface FilterOption {
  label: string;
  value: string;
}

interface MultiDimensionFilterProps {
  timeOptions?: FilterOption[];
  hospitalOptions?: FilterOption[];
  departmentOptions?: FilterOption[];
  productOptions?: FilterOption[];
  onFilterChange?: (filters: FilterParams) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export interface FilterParams {
  timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  hospitalId?: string;
  department?: string;
  productType?: string;
}

const MultiDimensionFilter: React.FC<MultiDimensionFilterProps> = ({
  timeOptions = [
    { label: '今日', value: 'day' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '本季度', value: 'quarter' },
    { label: '本年', value: 'year' },
    { label: '自定义', value: 'custom' },
  ],
  hospitalOptions = [
    { label: '全部院区', value: '' },
    { label: '总部医院', value: 'headquarters' },
    { label: '东区医院', value: 'east' },
    { label: '西区医院', value: 'west' },
    { label: '南区医院', value: 'south' },
    { label: '北区医院', value: 'north' },
  ],
  departmentOptions = [
    { label: '全部科室', value: '' },
    { label: '角塑科', value: 'orthokeratology' },
    { label: '框架科', value: 'frame' },
    { label: '隐形科', value: 'contact' },
    { label: '综合科', value: 'general' },
  ],
  productOptions = [
    { label: '全部产品', value: '' },
    { label: '框架镜', value: 'frame_glasses' },
    { label: '角塑镜', value: 'ortho_k' },
    { label: '隐形眼镜', value: 'contact_lens' },
    { label: '太阳镜', value: 'sunglasses' },
  ],
  onFilterChange,
  onRefresh,
  loading = false,
}) => {
  const [filters, setFilters] = React.useState<FilterParams>({
    timeRange: 'month',
  });

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      handleFilterChange('startDate', dates[0].format('YYYY-MM-DD'));
      handleFilterChange('endDate', dates[1].format('YYYY-MM-DD'));
      handleFilterChange('timeRange', 'custom');
    }
  };

  const handleTimeRangeChange = (value: string) => {
    handleFilterChange('timeRange', value);

    // 根据时间范围自动设置日期
    const now = dayjs();
    let startDate: dayjs.Dayjs;
    let endDate: dayjs.Dayjs = now;

    switch (value) {
      case 'day':
        startDate = now.startOf('day');
        break;
      case 'week':
        startDate = now.startOf('week');
        break;
      case 'month':
        startDate = now.startOf('month');
        break;
      case 'quarter':
        startDate = now.startOf('quarter' as any);
        break;
      case 'year':
        startDate = now.startOf('year');
        break;
      default:
        return;
    }

    handleFilterChange('startDate', startDate.format('YYYY-MM-DD'));
    handleFilterChange('endDate', endDate.format('YYYY-MM-DD'));
  };

  const handleReset = () => {
    const defaultFilters: FilterParams = {
      timeRange: 'month',
    };
    setFilters(defaultFilters);

    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>时间范围</div>
          <Select
            style={{ width: '100%' }}
            value={filters.timeRange}
            onChange={handleTimeRangeChange}
            options={timeOptions}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>自定义日期</div>
          <RangePicker
            style={{ width: '100%' }}
            onChange={handleRangeChange}
            disabled={filters.timeRange !== 'custom'}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>院区</div>
          <Select
            style={{ width: '100%' }}
            value={filters.hospitalId}
            onChange={(value) => handleFilterChange('hospitalId', value)}
            options={hospitalOptions}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>科室</div>
          <Select
            style={{ width: '100%' }}
            value={filters.department}
            onChange={(value) => handleFilterChange('department', value)}
            options={departmentOptions}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>产品类型</div>
          <Select
            style={{ width: '100%' }}
            value={filters.productType}
            onChange={(value) => handleFilterChange('productType', value)}
            options={productOptions}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>&nbsp;</div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              icon={<FilterOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default MultiDimensionFilter;
