'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Card, Select, Input, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined, DeleteOutlined, PlayCircleOutlined, AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';

const { Option } = Select;
const { Search } = Input;

const CATEGORY_MAP: Record<string, string> = {
  'lens_change_reminder': '换片提醒规则',
  'refraction_warning': '度数增长预警',
  'quality_warning': '质控预警',
  'upgrade_potential': '升单潜力',
  'referral_rules': '转科推荐',
  'churn_warning': '流失预警'
};

const CATEGORY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '换片提醒规则', value: 'lens_change_reminder' },
  { label: '度数增长预警', value: 'refraction_warning' },
  { label: '质控预警', value: 'quality_warning' },
  { label: '升单潜力', value: 'upgrade_potential' },
  { label: '转科推荐', value: 'referral_rules' },
  { label: '流失预警', value: 'churn_warning' }
];

export default function RulesPage() {
  const router = useRouter();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [enabled, setEnabled] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        pageSize: pagination.pageSize
      };
      if (category) params.category = category;
      if (enabled !== '') params.enabled = enabled;

      const response = await axios.get('/api/rules', { params });
      setRules(response.data.data.list);
      setPagination(prev => ({ ...prev, total: response.data.data.total }));
    } catch (error) {
      message.error('获取规则列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [category, enabled, pagination.current]);

  const handleCreate = () => {
    router.push('/rules/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/rules/${id}`);
  };

  const handleCopy = async (id: string) => {
    try {
      const response = await axios.get(`/api/rules/${id}`);
      const rule = response.data.data;
      // 在 Next.js 中，不能直接传递 state，应该使用 URL 参数或全局状态
      router.push(`/rules/new?copyId=${id}`);
    } catch (error) {
      message.error('复制规则失败');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条规则吗？',
      onOk: async () => {
        try {
          await axios.delete(`/api/rules/${id}`);
          message.success('删除成功');
          fetchRules();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleSimulate = (id: string) => {
    router.push(`/rules/${id}/simulate`);
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Button type="link" onClick={() => handleEdit(record.id)}>
          {text}
        </Button>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => CATEGORY_MAP[category] || category
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? '#52c41a' : '#8c8c8c'} style={{ borderRadius: 0 }}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 70
    },
    {
      title: '最后修改',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN')
    },
    {
      title: '修改人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(record.id)}>
            复制
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleSimulate(record.id)}>
            模拟
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Select
            style={{ width: 200 }}
            value={category}
            onChange={setCategory}
            placeholder="选择分类"
          >
            {CATEGORY_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <Select
            style={{ width: 120 }}
            value={enabled}
            onChange={setEnabled}
            placeholder="状态"
          >
            <Option value="">全部</Option>
            <Option value="true">启用</Option>
            <Option value="false">禁用</Option>
          </Select>

          <Search
            style={{ width: 300 }}
            placeholder="搜索规则名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={() => {}}
          />

          <Space>
            <Button icon={<AppstoreOutlined />} onClick={() => router.push('/rules/templates')}>
              规则模板
            </Button>
            <Button icon={<BarChartOutlined />} onClick={() => router.push('/rules/statistics')}>
              执行统计
            </Button>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ float: 'right' }}>
            新建规则
          </Button>
        </div>

        <Table
          size="small"
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={rules}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            }
          }}
        />
      </Card>
      </div>
    </MainLayout>
  );
}
