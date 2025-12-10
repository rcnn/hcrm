'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, List, Tag, Button, Spin, Empty, Card, Space, Divider } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  BellOutlined
} from '@ant-design/icons';

interface Customer {
  id: string;
  name: string;
  parentName: string;
  phone: string;
  lastCheckDate: string;
  refraction: {
    rightEye: string;
    leftEye: string;
  };
  productType: string;
  wearDuration: string;
  tags: string[];
}

interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  dueDate: string;
  status: string;
  description: string;
}

interface WeComSidebarProps {
  customerId: string | null;
  visible: boolean;
  onClose: () => void;
}

const WeComSidebar: React.FC<WeComSidebarProps> = ({
  customerId,
  visible,
  onClose
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);

  useEffect(() => {
    if (visible && customerId) {
      fetchSidebarData();
    }
  }, [visible, customerId]);

  const fetchSidebarData = async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/wecom/sidebar/${customerId}`);
      const data = await response.json();

      if (data.code === 200) {
        setCustomer(data.data.customer);
        setTasks(data.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const handleGenerateScript = (task: Task) => {
    setSelectedTask(task);
    setShowScriptModal(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/wecom/task/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          remark: '已通过企微侧边栏完成任务'
        }),
      });

      if (response.ok) {
        // 更新本地任务状态
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? { ...task, status: 'completed' } : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <Drawer
      title="客户档案"
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      className="wecom-sidebar"
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : !customer ? (
        <Empty description="暂无客户数据" />
      ) : (
        <div className="sidebar-content">
          {/* 客户概览 */}
          <Card size="small" className="customer-card">
            <div className="customer-header">
              <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div className="customer-info">
                <h3 style={{ margin: 0 }}>{customer.name}</h3>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  监护人：{customer.parentName}
                </p>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  {customer.phone}
                </p>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className="customer-details">
              <div className="detail-row">
                <span className="detail-label">最近检查：</span>
                <span className="detail-value">{customer.lastCheckDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">当前度数：</span>
                <span className="detail-value">
                  右 {customer.refraction.rightEye} / 左 {customer.refraction.leftEye}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">产品类型：</span>
                <span className="detail-value">{customer.productType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">佩戴时长：</span>
                <span className="detail-value">{customer.wearDuration}</span>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              {customer.tags.map((tag) => (
                <Tag key={tag} color="blue" style={{ marginBottom: '4px' }}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>

          {/* 待办任务 */}
          <Card
            size="small"
            className="task-card"
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待办任务</span>
              </Space>
            }
            extra={
              <Tag color="processing">{tasks.filter(t => t.status === 'pending').length}</Tag>
            }
          >
            <List
              size="small"
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  style={{
                    padding: '12px 8px',
                    background: task.status === 'completed' ? '#f5f5f5' : 'transparent',
                    opacity: task.status === 'completed' ? 0.6 : 1
                  }}
                  actions={[
                    task.status === 'pending' && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handleCompleteTask(task.id)}
                        icon={<CheckCircleOutlined />}
                      >
                        完成
                      </Button>
                    ),
                    task.status === 'pending' && (
                      <Button
                        size="small"
                        onClick={() => handleGenerateScript(task)}
                        icon={<MessageOutlined />}
                      >
                        话术
                      </Button>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{task.title}</span>
                        <Tag color={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {task.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          截止：{task.dueDate}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 快捷操作 */}
          <Card size="small" title="快捷操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                icon={<UserOutlined />}
                onClick={() => window.open(`/customers/${customer.id}`, '_blank')}
              >
                查看完整档案
              </Button>
              <Button
                block
                icon={<MessageOutlined />}
                onClick={() => handleGenerateScript(tasks[0])}
                disabled={!tasks.length}
              >
                生成AI话术
              </Button>
              <Button
                block
                type="primary"
                icon={<SendOutlined />}
                disabled={!tasks.length}
              >
                发起企业微信
              </Button>
            </Space>
          </Card>

          {/* 通知中心 */}
          <Card
            size="small"
            title={
              <Space>
                <BellOutlined />
                <span>通知</span>
              </Space>
            }
          >
            <List
              size="small"
              dataSource={[
                {
                  id: 1,
                  title: '客户已回复消息',
                  time: '10分钟前'
                }
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      )}

      {/* AI话术弹窗 */}
      {showScriptModal && selectedTask && (
        <ScriptModal
          customerId={customerId!}
          taskType={selectedTask.type}
          onClose={() => {
            setShowScriptModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </Drawer>
  );
};

// AI话术弹窗组件
interface ScriptModalProps {
  customerId: string;
  taskType: string;
  onClose: () => void;
}

const ScriptModal: React.FC<ScriptModalProps> = ({ customerId, taskType, onClose }) => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
    generateScript();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/wecom/script/templates');
      const data = await response.json();
      if (data.code === 200) {
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const generateScript = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wecom/script/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          taskType,
        }),
      });

      const data = await response.json();
      if (data.code === 200) {
        setScript(data.data.script);
      }
    } catch (error) {
      console.error('Failed to generate script:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const response = await fetch('/api/wecom/message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          content: script,
          channel: 'wecom',
        }),
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="script-modal">
      <div className="script-content">
        <h3>AI话术生成</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin /> 正在生成话术...
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                话术模板
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '6px',
                  borderRadius: '2px',
                  border: '1px solid #d9d9d9'
                }}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  if (template) {
                    setScript(template.content);
                  }
                }}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                生成的话术
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '2px',
                  border: '1px solid #d9d9d9',
                  fontSize: '13px'
                }}
              />
            </div>

            <Space>
              <Button size="small" onClick={generateScript}>
                重新生成
              </Button>
              <Button type="primary" size="small" onClick={handleSend}>
                发送
              </Button>
              <Button size="small" onClick={onClose}>
                取消
              </Button>
            </Space>
          </>
        )}
      </div>
    </div>
  );
};

export default WeComSidebar;
