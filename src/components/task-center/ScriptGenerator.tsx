'use client';

import React, { useState } from 'react';
import { Card, Button, Select, Input, Space, message, Typography } from 'antd';
import {
  ToolOutlined,
  CopyOutlined,
  WechatOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/stores/taskStore';

const { TextArea } = Input;
const { Title } = Typography;

interface ScriptGeneratorProps {
  taskId: string;
  onScriptGenerated?: (script: string) => void;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ taskId, onScriptGenerated }) => {
  const { currentTask, updateTaskStatus } = useTaskStore();
  const [script, setScript] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const scriptTemplates = [
    {
      id: 'follow_up_standard',
      name: '标准复查提醒',
      template:
        '{parentName}您好，距离{patientName}上次复查已过{daysSinceLastCheck}，上次检查数据显示右眼度数增长了{refractionChange}，建议及时复查。我们可以为您预约本周五下午的号源。',
    },
    {
      id: 'lens_replacement',
      name: '换片提醒',
      template:
        '{parentName}您好，{patientName}的镜片已佩戴{daysSinceLastCheck}，建议及时更换以保证矫正效果。我们本周六上午有号源，您看方便吗？',
    },
    {
      id: 'recall',
      name: '流失召回',
      template:
        '{parentName}您好，最近没有收到{patientName}的复查消息，孩子视力情况还好吗？我们这边有专业的视光师可以为您做免费检查。',
    },
    {
      id: 'referral',
      name: '转介绍',
      template:
        '{parentName}您好，感谢您对我们信任！如果您身边有朋友的孩子也需要视力检查，欢迎推荐给我们，新客户可享受首次免费检查。',
    },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // 模拟AI生成过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 根据任务类型和模板生成话术
      const template =
        scriptTemplates.find((t) => t.id === selectedTemplate) ||
        scriptTemplates.find((t) => {
          if (currentTask?.type === 'follow_up') return t.id === 'follow_up_standard';
          if (currentTask?.type === 'lens_replacement') return t.id === 'lens_replacement';
          if (currentTask?.type === 'recall') return t.id === 'recall';
          if (currentTask?.type === 'referral') return t.id === 'referral';
          return false;
        });

      if (template) {
        const generated = template.template
          .replace('{parentName}', '张先生')
          .replace('{patientName}', '小明')
          .replace('{daysSinceLastCheck}', '3个月')
          .replace('{refractionChange}', '50度');

        setScript(generated);
        onScriptGenerated?.(generated);

        // 更新任务的话术
        if (currentTask) {
          await updateTaskStatus(currentTask.id, currentTask.status, generated);
        }

        message.success('AI话术生成成功！');
      } else {
        message.warning('请选择话术模板');
      }
    } catch (error) {
      message.error('话术生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    message.success('已复制到剪贴板');
  };

  const handleSendToWeChat = () => {
    message.info('企业微信发送功能开发中...');
  };

  const handleSendSMS = () => {
    message.info('短信发送功能开发中...');
  };

  return (
    <Card title="AI话术生成">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={5}>话术模板</Title>
          <Select
            style={{ width: '100%' }}
            placeholder="选择模板"
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            options={scriptTemplates.map((template) => ({
              value: template.id,
              label: template.name,
            }))}
          />
        </div>

        <Button
          type="primary"
          icon={<ToolOutlined />}
          onClick={handleGenerate}
          loading={generating}
          block
        >
          生成AI话术
        </Button>

        <div>
          <Title level={5}>生成结果</Title>
          <TextArea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={6}
            placeholder="点击上方按钮生成个性化话术"
            style={{ fontSize: '14px' }}
          />
        </div>

        <Space wrap>
          <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!script}>
            复制话术
          </Button>
          <Button icon={<WechatOutlined />} onClick={handleSendToWeChat} disabled={!script}>
            发送到企业微信
          </Button>
          <Button icon={<MessageOutlined />} onClick={handleSendSMS} disabled={!script}>
            发送短信
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default ScriptGenerator;
