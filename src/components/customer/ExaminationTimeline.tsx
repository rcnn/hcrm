'use client';

import React from 'react';
import { Timeline, Card, Typography, Tag, Space } from 'antd';
import { FileTextOutlined, WarningOutlined } from '@ant-design/icons';
import type { ExaminationRecord } from '@/lib/types/customer';

const { Text } = Typography;

interface ExaminationTimelineProps {
  examinations: ExaminationRecord[];
  maxItems?: number;
}

const ExaminationTimeline: React.FC<ExaminationTimelineProps> = ({
  examinations,
  maxItems = 10,
}) => {
  const sortedExams = [...examinations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  if (sortedExams.length === 0) {
    return (
      <Card title="检查记录" size="small">
        <Text type="secondary">暂无检查记录</Text>
      </Card>
    );
  }

  return (
    <Card title="检查记录" size="small">
      <Timeline
        items={sortedExams.map((exam, index) => ({
          color: exam.isAbnormal ? 'red' : 'blue',
          dot: exam.isAbnormal ? <WarningOutlined style={{ color: '#f5222d' }} /> : <FileTextOutlined />,
          children: (
            <div key={exam.id}>
              <Space direction="vertical" size={4}>
                <Space>
                  <Text strong>{new Date(exam.date).toLocaleDateString()}</Text>
                  {exam.isAbnormal && (
                    <Tag color="red" style={{ borderRadius: 0 }}>
                      异常
                    </Tag>
                  )}
                </Space>
                <Text type="secondary">
                  右眼: {exam.odRefraction}度 | 左眼: {exam.osRefraction}度
                </Text>
                {(exam.odAxialLength || exam.osAxialLength) && (
                  <Text type="secondary">
                    眼轴: OD {exam.odAxialLength?.toFixed(2)}mm | OS {exam.osAxialLength?.toFixed(2)}mm
                  </Text>
                )}
                {exam.notes && <Text type="secondary">{exam.notes}</Text>}
              </Space>
            </div>
          ),
        }))}
      />
      {examinations.length > maxItems && (
        <Text type="secondary">共 {examinations.length} 条记录，显示最近 {maxItems} 条</Text>
      )}
    </Card>
  );
};

export default ExaminationTimeline;
