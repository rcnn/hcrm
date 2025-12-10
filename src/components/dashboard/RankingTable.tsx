'use client';

import React from 'react';
import { Table, Badge, Progress, Tag, TableProps } from 'antd';

interface RankingItem {
  rank: number;
  name: string;
  completionRate: number;
  status?: string;
  [key: string]: any;
}

interface RankingTableProps {
  data: RankingItem[];
  columns?: TableProps<RankingItem>['columns'];
  loading?: boolean;
  pagination?: TableProps<RankingItem>['pagination'];
  onRowClick?: (record: RankingItem) => void;
  size?: 'small' | 'middle' | 'large';
}

/**
 * 排名表格组件（性能优化版）
 * 使用React.memo优化渲染性能
 */
const RankingTable: React.FC<RankingTableProps> = ({
  data,
  columns,
  loading = false,
  pagination = false,
  onRowClick,
  size = 'small',
}) => {
  const defaultColumns: TableProps<RankingItem>['columns'] = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      align: 'center' as const,
      render: (rank: number) => (
        <Badge
          count={rank}
          style={{
            backgroundColor: rank <= 3 ? '#faad14' : '#d9d9d9',
          }}
        />
      ),
    },
    {
      title: '院区/员工',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      key: 'completionRate',
      align: 'center' as const,
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 80 ? '#1890ff' : '#faad14'}
          format={(percent) => `${percent}%`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status?: string) => {
        if (!status) return null;
        const getColor = () => {
          if (status === '优秀') return '#52c41a';
          if (status === '良好') return '#1890ff';
          if (status === '需关注') return '#faad14';
          if (status === '预警') return '#f5222d';
          return '#d9d9d9';
        };

        return (
          <Tag color={getColor()} style={{ borderRadius: 0 }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  const mergedColumns = columns || defaultColumns;

  return (
    <Table
      size={size}
      dataSource={data}
      columns={mergedColumns}
      pagination={pagination}
      loading={loading}
      rowKey="rank"
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        style: onRowClick ? { cursor: 'pointer' } : undefined,
      })}
    />
  );
};

// 使用React.memo优化性能，只在props变化时重新渲染
const MemoizedRankingTable = React.memo(RankingTable);
MemoizedRankingTable.displayName = 'RankingTable';

export default MemoizedRankingTable;
