'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Input, Select, Space, Button, Card, Slider, Row, Col, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import StatusTag from '@/components/common/StatusTag';
import { mockCustomers } from '@/lib/mock/customers';
import type { Customer, ProductType } from '@/lib/types/customer';
import { useUserStore } from '@/stores/userStore';

const { Option } = Select;

export default function CustomersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>();

  // 权限控制：根据用户角色和归属员工过滤客户
  const filterCustomersByPermission = (customers: Customer[]): Customer[] => {
    if (!isAuthenticated || !user) {
      message.warning('未登录，无法访问客户数据');
      return [];
    }

    // 管理层和执行层可以查看所有客户
    if (user.role === 'manager' || user.role === 'executive') {
      return customers;
    }

    // 医助、验光师、销售只能查看自己负责的客户
    if (['medical_assistant', 'optometrist', 'sales'].includes(user.role)) {
      return customers.filter(customer => customer.owner === user.id);
    }

    return customers;
  };

  // 获取可显示的客户列表
  const [displayCustomers, setDisplayCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const filtered = filterCustomersByPermission(mockCustomers);
    setDisplayCustomers(filtered);
  }, [user, isAuthenticated]);

  const handleViewDetail = (id: string) => {
    router.push(`/customers/${id}`);
  };

  const columns = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 60,
      align: 'center' as const,
      sorter: (a: Customer, b: Customer) => a.age - b.age,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 60,
      align: 'center' as const,
      render: (gender: string) => (gender === 'M' ? '男' : '女'),
    },
    {
      title: '客户分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => <StatusTag status={category} type="category" />,
    },
    {
      title: '当前产品',
      dataIndex: 'currentProduct',
      key: 'currentProduct',
      width: 100,
      render: (product: string) => (
        <span
          style={{
            padding: '0 4px',
            background: product === '角塑' ? '#e6f7ff' : product === '框架镜' ? '#f6ffed' : '#f5f5f5',
            color: product === '角塑' ? '#1890ff' : product === '框架镜' ? '#52c41a' : '#999',
            borderRadius: 0,
          }}
        >
          {product}
        </span>
      ),
    },
    {
      title: '归属员工',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '建档日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      sorter: (a: Customer, b: Customer) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Customer) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 应用搜索和筛选条件
  const filteredCustomers = displayCustomers.filter((customer) => {
    const matchKeyword =
      !searchKeyword ||
      customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      customer.parentName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      customer.parentPhone.includes(searchKeyword);
    const matchCategory = !selectedCategory || customer.category === selectedCategory;
    const matchProduct = !selectedProduct || customer.currentProduct === selectedProduct;
    const matchAge = customer.age >= ageRange[0] && customer.age <= ageRange[1];
    return matchKeyword && matchCategory && matchProduct && matchAge;
  });

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      medical_assistant: '医助',
      optometrist: '验光师',
      manager: '运营经理',
      executive: '管理层',
      sales: '销售',
    };
    return roleMap[role] || role;
  };

  // 获取权限提示文本
  const getPermissionHint = () => {
    if (!isAuthenticated || !user) {
      return '请先登录系统';
    }

    if (user.role === 'manager' || user.role === 'executive') {
      return `当前角色：${getRoleDisplayName(user.role)} - 可查看所有客户`;
    }

    return `当前角色：${getRoleDisplayName(user.role)} - 仅可查看负责的客户`;
  };

  return (
    <MainLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>客户档案管理</h2>
              <div style={{ marginTop: 8 }}>
                <Tag color="blue">{getPermissionHint()}</Tag>
              </div>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>
              新建客户
            </Button>
          </div>

          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Input.Search
                  placeholder="搜索姓名/手机号"
                  allowClear
                  style={{ width: '100%' }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={setSearchKeyword}
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  placeholder="客户分类"
                  allowClear
                  style={{ width: '100%' }}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  <Option value="potential">潜在客户</Option>
                  <Option value="converted">成交客户</Option>
                  <Option value="upgrade">升单潜力</Option>
                  <Option value="referral">转科潜力</Option>
                  <Option value="churn">流失预警</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  placeholder="产品类型"
                  allowClear
                  style={{ width: '100%' }}
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                >
                  <Option value="角塑">角塑</Option>
                  <Option value="框架镜">框架镜</Option>
                  <Option value="无">无</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap' }}>年龄:</span>
                  <Slider
                    range
                    min={0}
                    max={20}
                    value={ageRange}
                    onChange={(value) => setAgeRange(value as [number, number])}
                    style={{ flex: 1 }}
                  />
                  <span style={{ whiteSpace: 'nowrap' }}>{ageRange[0]}-{ageRange[1]}岁</span>
                </div>
              </Col>
            </Row>

            <Table
              size="small"
              dataSource={filteredCustomers}
              columns={columns}
              rowKey="id"
              pagination={{
                total: filteredCustomers.length,
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
            />
          </Card>
        </Space>
      </div>
    </MainLayout>
  );
}
