'use client';

import React from 'react';
import { Card, Space, Button, message } from 'antd';
import {
  CheckOutlined,
  MessageOutlined,
  FileExcelOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface QuickActionsProps {
  onBatchComplete?: () => void;
  onBatchSend?: () => void;
  onExportReport?: () => void;
  onOpenRuleConfig?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onBatchComplete,
  onBatchSend,
  onExportReport,
  onOpenRuleConfig,
}) => {
  const handleBatchComplete = () => {
    message.success('批量完成功能开发中...');
    onBatchComplete?.();
  };

  const handleBatchSend = () => {
    message.success('批量发送功能开发中...');
    onBatchSend?.();
  };

  const handleExportReport = () => {
    message.success('正在导出报表...');
    onExportReport?.();
  };

  const handleOpenRuleConfig = () => {
    message.info('打开规则配置...');
    onOpenRuleConfig?.();
  };

  return (
    <Card title="快速操作">
      <Space size="middle" wrap>
        <Space.Compact>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleBatchComplete}
          >
            批量完成
          </Button>
          <Button icon={<MessageOutlined />} onClick={handleBatchSend}>
            批量发送
          </Button>
        </Space.Compact>
        <Button icon={<FileExcelOutlined />} onClick={handleExportReport}>
          导出报表
        </Button>
        <Button icon={<SettingOutlined />} onClick={handleOpenRuleConfig}>
          规则配置
        </Button>
      </Space>
    </Card>
  );
};

export default QuickActions;
