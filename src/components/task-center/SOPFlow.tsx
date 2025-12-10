'use client';

import React, { useState } from 'react';
import { Card, Tabs, List, Tag, Space, Typography, Collapse, Empty } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import type { TaskType } from '@/lib/types/task';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

interface SOPFlowProps {
  taskType: TaskType;
}

const SOPFlow: React.FC<SOPFlowProps> = ({ taskType }) => {
  const [activeTab, setActiveTab] = useState('flow');

  const sopFlows = {
    follow_up: {
      title: '复查提醒标准流程',
      steps: [
        {
          id: 1,
          title: '任务创建与分配',
          description: '系统自动创建复查提醒任务，分配给对应医助/客服',
          checkpoints: ['任务自动生成', '责任人分配', '截止时间设定'],
          tips: '确保任务在合适时间分配，避免过早或过晚',
        },
        {
          id: 2,
          title: '客户信息核实',
          description: '查看客户基本信息、历史检查记录、联系方式',
          checkpoints: ['核对客户姓名', '确认联系方式', '查看历史记录'],
          tips: '确保客户信息准确，避免联系错误',
        },
        {
          id: 3,
          title: '话术生成与个性化',
          description: '使用AI生成个性化话术，根据客户情况调整',
          checkpoints: ['生成标准话术', '个性化调整', '检查内容完整'],
          tips: '话术要温馨友好，突出专业性',
        },
        {
          id: 4,
          title: '客户联系与沟通',
          description: '通过企业微信或电话联系客户，预约复查时间',
          checkpoints: ['礼貌问候', '说明来意', '预约时间', '发送地址'],
          tips: '保持耐心，倾听客户需求',
        },
        {
          id: 5,
          title: '记录与跟进',
          description: '记录客户反馈，更新任务状态，安排后续跟进',
          checkpoints: ['记录反馈信息', '更新任务状态', '标记完成'],
          tips: '及时记录客户反馈，为后续服务提供参考',
        },
      ],
    },
    lens_replacement: {
      title: '换片提醒标准流程',
      steps: [
        {
          id: 1,
          title: '换片周期计算',
          description: '根据客户佩戴时间判断是否需要换片提醒',
          checkpoints: ['查看佩戴时间', '评估换片需求', '创建提醒任务'],
          tips: '一般建议8-12个月更换一次',
        },
        {
          id: 2,
          title: '镜片状态评估',
          description: '评估客户当前镜片状态，了解磨损情况',
          checkpoints: ['询问佩戴感受', '了解清洗方式', '评估磨损程度'],
          tips: '关心客户佩戴体验，提供专业建议',
        },
        {
          id: 3,
          title: '换片方案沟通',
          description: '与客户沟通换片方案，推荐合适产品',
          checkpoints: ['介绍换片方案', '说明价格政策', '预约到院时间'],
          tips: '突出换片的必要性和紧迫性',
        },
        {
          id: 4,
          title: '预约与确认',
          description: '确认换片时间，提供到院指引',
          checkpoints: ['确认预约时间', '发送到院地址', '提醒携带物品'],
          tips: '提供详细指引，提升客户体验',
        },
      ],
    },
    recall: {
      title: '流失召回标准流程',
      steps: [
        {
          id: 1,
          title: '流失原因分析',
          description: '分析客户流失原因，制定召回策略',
          checkpoints: ['查看历史记录', '分析流失原因', '制定召回计划'],
          tips: '了解真实流失原因，针对性召回',
        },
        {
          id: 2,
          title: '建立联系',
          description: '主动联系流失客户，关心近况',
          checkpoints: ['礼貌问候', '了解现状', '表达关心'],
          tips: '态度真诚，不要过于商业化',
        },
        {
          id: 3,
          title: '价值传递',
          description: '传递专业价值，邀请客户重新体验',
          checkpoints: ['介绍新服务', '提供优惠政策', '邀请体验'],
          tips: '突出专业优势和服务价值',
        },
        {
          id: 4,
          title: '持续跟进',
          description: '定期跟进，保持联系',
          checkpoints: ['定期关怀', '节日问候', '邀请参与活动'],
          tips: '建立长期关系，不要急于求成',
        },
      ],
    },
    referral: {
      title: '转介绍标准流程',
      steps: [
        {
          id: 1,
          title: '转介绍机会识别',
          description: '识别合适的转介绍时机和客户',
          checkpoints: ['评估满意度', '判断推荐意愿', '时机选择'],
          tips: '在客户满意时提出转介绍请求',
        },
        {
          id: 2,
          title: '转介绍政策说明',
          description: '向客户介绍转介绍政策和优惠',
          checkpoints: ['说明优惠政策', '介绍奖励机制', '明确流程'],
          tips: '政策要清晰，奖励要有吸引力',
        },
        {
          id: 3,
          title: '提供转介绍材料',
          description: '提供宣传资料和推荐码',
          checkpoints: ['发送宣传资料', '提供推荐码', '说明使用方法'],
          tips: '材料要专业，方便客户分享',
        },
        {
          id: 4,
          title: '跟踪转化结果',
          description: '跟踪转介绍效果，及时反馈',
          checkpoints: ['关注推荐进度', '及时反馈结果', '兑现奖励'],
          tips: '及时反馈结果，维护客户信任',
        },
      ],
    },
  };

  const scriptLibrary = [
    {
      category: '开场白',
      scripts: [
        '您好，我是XX眼科的医助小李，感谢您选择我们的服务...',
        '张先生您好，距离小明上次复查已经3个月了...',
        '王女士您好，最近孩子的视力情况怎么样？...',
      ],
    },
    {
      category: '异议处理',
      scripts: [
        '我理解您的担心，视力检查是非常重要的...',
        '这个价格包含了全套服务，性价比很高...',
        '我们可以先安排一次免费检查，您看怎么样？...',
      ],
    },
    {
      category: '结束语',
      scripts: [
        '感谢您的信任，我们期待为您服务...',
        '请保持联系，如有疑问随时找我...',
        '祝您生活愉快，期待您的到来...',
      ],
    },
  ];

  const currentFlow = sopFlows[taskType] || sopFlows.follow_up;

  return (
    <div className="sop-flow">
      <Card title="SOP标准作业流程">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="流程指引" key="flow">
            <Title level={4}>{currentFlow.title}</Title>
            <List
              itemLayout="vertical"
              dataSource={currentFlow.steps}
              renderItem={(step) => (
                <List.Item
                  key={step.id}
                  style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}
                >
                  <div style={{ width: '100%' }}>
                    <Space align="start" style={{ width: '100%' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {step.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ marginTop: 0 }}>
                          {step.title}
                        </Title>
                        <Paragraph>{step.description}</Paragraph>

                        <div style={{ marginTop: 12 }}>
                          <Text strong>检查清单：</Text>
                          <div style={{ marginTop: 8 }}>
                            {step.checkpoints.map((checkpoint, index) => (
                              <Tag key={index} icon={<CheckCircleOutlined />} color="success">
                                {checkpoint}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginTop: 12, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
                          <Space>
                            <BulbOutlined style={{ color: '#faad14' }} />
                            <Text type="secondary">{step.tips}</Text>
                          </Space>
                        </div>
                      </div>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="话术库" key="scripts">
            <Collapse defaultActiveKey={['0']}>
              {scriptLibrary.map((category, index) => (
                <Panel header={category.category} key={index}>
                  <List
                    dataSource={category.scripts}
                    renderItem={(script) => (
                      <List.Item style={{ cursor: 'pointer' }}>
                        <Text>{script}</Text>
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SOPFlow;
