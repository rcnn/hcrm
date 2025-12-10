'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Typography, Divider } from 'antd';
import { EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import type { ExaminationRecord } from '@/lib/types/customer';

const { Text } = Typography;

interface ClinicalDataCardProps {
  examination?: ExaminationRecord;
}

const ClinicalDataCard: React.FC<ClinicalDataCardProps> = ({ examination }) => {
  if (!examination) {
    return (
      <Card title="临床数据" size="small">
        <Text type="secondary">暂无检查记录</Text>
      </Card>
    );
  }

  return (
    <Card title="最新临床数据" size="small" extra={<Text type="secondary">{new Date(examination.date).toLocaleDateString()}</Text>}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Divider orientation="left" plain>
            <EyeOutlined /> 屈光度数
          </Divider>
        </Col>
        <Col span={12}>
          <Statistic
            title="右眼度数 (OD)"
            value={examination.odRefraction}
            precision={0}
            suffix="度"
            valueStyle={{ color: examination.odRefraction < -300 ? '#f5222d' : '#1890ff' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="左眼度数 (OS)"
            value={examination.osRefraction}
            precision={0}
            suffix="度"
            valueStyle={{ color: examination.osRefraction < -300 ? '#f5222d' : '#1890ff' }}
          />
        </Col>

        {(examination.odAxialLength || examination.osAxialLength) && (
          <>
            <Col span={24}>
              <Divider orientation="left" plain>
                <LineChartOutlined /> 眼轴长度
              </Divider>
            </Col>
            <Col span={12}>
              <Statistic
                title="右眼眼轴 (OD)"
                value={examination.odAxialLength}
                precision={2}
                suffix="mm"
                valueStyle={{ color: (examination.odAxialLength || 0) > 26 ? '#f5222d' : '#52c41a' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="左眼眼轴 (OS)"
                value={examination.osAxialLength}
                precision={2}
                suffix="mm"
                valueStyle={{ color: (examination.osAxialLength || 0) > 26 ? '#f5222d' : '#52c41a' }}
              />
            </Col>
          </>
        )}

        {(examination.odVisualAcuity || examination.osVisualAcuity) && (
          <>
            <Col span={24}>
              <Divider orientation="left" plain>
                视力
              </Divider>
            </Col>
            <Col span={12}>
              <Statistic
                title="右眼视力 (OD)"
                value={examination.odVisualAcuity}
                precision={1}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="左眼视力 (OS)"
                value={examination.osVisualAcuity}
                precision={1}
              />
            </Col>
          </>
        )}

        {examination.intraocularPressure && (
          <>
            <Col span={24}>
              <Divider orientation="left" plain>
                眼压
              </Divider>
            </Col>
            <Col span={24}>
              <Statistic
                title="眼压"
                value={examination.intraocularPressure}
                suffix="mmHg"
                valueStyle={{
                  color:
                    examination.intraocularPressure > 21 || examination.intraocularPressure < 10
                      ? '#f5222d'
                      : '#52c41a',
                }}
              />
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
};

export default ClinicalDataCard;
