'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Breadcrumb, Table, Button, Space, Tag, Input, Select } from 'antd';
import { HomeOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';

const { Search } = Input;
const { Option } = Select;

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

export default function RuleTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category) params.category = category;

      const response = await axios.get('/api/routes/templates', { params });
      setTemplates(response.data.data);
    } catch (error) {
      console.error('获取规则模板失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = (template: any) => {
    router.push(`/rules/new?templateId=${template.id}`);
  };

  const handlePreviewTemplate = (template: any) => {
    router.push(`/rules/new?templateId=${template.id}&preview=true`);
  };

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => CATEGORY_MAP[category] || category
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '适用场景',
      dataIndex: 'applicableScenarios',
      key: 'applicableScenarios',
      render: (scenarios: string[]) => (
        <Space wrap>
          {scenarios?.map((scenario: string) => (
            <Tag key={scenario}>{scenario}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewTemplate(record)}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleCreateFromTemplate(record)}
          >
            使用此模板
          </Button>
        </Space>
      )
    }
  ];

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/rules">规则配置</Breadcrumb.Item>
        <Breadcrumb.Item>规则模板</Breadcrumb.Item>
      </Breadcrumb>

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

          <Search
            style={{ width: 300 }}
            placeholder="搜索模板名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={fetchTemplates}
          />
        </div>

        <Table
          size="small"
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={templates.filter(t => {
            if (!searchText) return true;
            return t.name.toLowerCase().includes(searchText.toLowerCase());
          })}
        />
      </Card>
      </div>
    </MainLayout>
  );
}
