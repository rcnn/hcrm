'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Input, message } from 'antd';
import WeComSidebar from '@/components/wecom/WeComSidebar';
import { DashboardOutlined, CustomerServiceOutlined } from '@ant-design/icons';

export default function WeComSidebarPage({
  params
}: {
  params: { customerId: string }
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [testCustomerId, setTestCustomerId] = useState('C001');

  const handleOpenSidebar = (customerId: string) => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px' }}>企业微信集成界面</h1>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                演示企业微信侧边栏集成、AI话术生成和多渠道触达功能
              </p>
            </div>
            <DashboardOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
        </Card>

        {/* 功能演示区 */}
        <Card title="功能演示" style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ marginBottom: '12px', color: '#666' }}>
              请输入客户ID来演示侧边栏功能（默认：C001）
            </p>
            <Space>
              <Input
                placeholder="客户ID"
                value={testCustomerId}
                onChange={(e) => setTestCustomerId(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<CustomerServiceOutlined />}
                onClick={() => handleOpenSidebar(testCustomerId)}
              >
                打开企业微信侧边栏
              </Button>
            </Space>
          </div>

          <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '4px' }}>
            <h4 style={{ marginTop: 0 }}>功能说明：</h4>
            <ul style={{ marginBottom: 0 }}>
              <li>展示客户核心信息（姓名、度数、产品类型等）</li>
              <li>显示待办任务列表，支持快速完成和生成话术</li>
              <li>AI话术生成，基于客户数据和任务类型自动生成个性化话术</li>
              <li>快捷操作：查看完整档案、发起企业微信聊天等</li>
              <li>通知中心：显示客户回复提醒和系统通知</li>
            </ul>
          </div>
        </Card>

        {/* API接口说明 */}
        <Card title="API接口文档" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>侧边栏数据</h4>
              <code style={{ fontSize: '12px' }}>
                GET /api/wecom/sidebar/:customerId
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                获取客户侧边栏展示数据
              </p>
            </div>

            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>AI话术生成</h4>
              <code style={{ fontSize: '12px' }}>
                POST /api/wecom/script/generate
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                基于客户数据和任务类型生成话术
              </p>
            </div>

            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>消息发送</h4>
              <code style={{ fontSize: '12px' }}>
                POST /api/wecom/message/send
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                发送企业微信/短信/外呼消息
              </p>
            </div>

            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>聊天记录</h4>
              <code style={{ fontSize: '12px' }}>
                GET /api/wecom/chat/:customerId
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                获取客户聊天记录列表
              </p>
            </div>

            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>智能总结</h4>
              <code style={{ fontSize: '12px' }}>
                POST /api/wecom/chat/summary
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                AI分析聊天记录生成总结
              </p>
            </div>

            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
              <h4 style={{ marginTop: 0 }}>通知推送</h4>
              <code style={{ fontSize: '12px' }}>
                POST /api/wecom/notification/send
              </code>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
                发送系统通知给用户
              </p>
            </div>
          </div>
        </Card>

        {/* Mock数据说明 */}
        <Card title="Mock数据说明">
          <div style={{ background: '#fff7e6', padding: '16px', borderRadius: '4px', border: '1px solid #ffd591' }}>
            <h4 style={{ marginTop: 0, color: '#d46b08' }}>⚠️ 重要提示</h4>
            <ul style={{ marginBottom: 0 }}>
              <li>企业微信API：当前使用Mock实现，实际接入需要申请企业微信开发者权限</li>
              <li>短信发送：完全Mock，仅返回模拟响应</li>
              <li>AI外呼：完全Mock，仅返回模拟响应</li>
              <li>聊天记录：使用模拟数据，展示界面效果</li>
              <li>所有API接口预留真实接入能力，可平滑切换</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* 企业微信侧边栏 */}
      <WeComSidebar
        customerId={testCustomerId}
        visible={sidebarVisible}
        onClose={handleCloseSidebar}
      />
    </div>
  );
}
