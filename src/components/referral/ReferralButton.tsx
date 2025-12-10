'use client';

import React, { useState } from 'react';
import { Button, Modal, Form, Select, message, Tooltip } from 'antd';
import {
  ShareAltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { Customer } from '@/lib/types/customer';
import { DepartmentType } from '@/lib/types/referral';
import { referralValidation } from '@/lib/services/referralValidation';

interface ReferralButtonProps {
  customer: Customer;
  onReferralCreated?: (referralId: string) => void;
}

const ReferralButton: React.FC<ReferralButtonProps> = ({
  customer,
  onReferralCreated,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<any>(null);

  // 获取最新检查数据
  const latestExam = customer.examinations?.[0];

  // 初始化表单默认值
  React.useEffect(() => {
    if (modalVisible && latestExam) {
      const check = referralValidation.checkEligibility(customer.age, {
        myopiaProgress: 75, // TODO: 计算实际度数增长
        sphericalPower: latestExam.odRefraction,
        cornealThickness: 540, // TODO: 从检查数据获取
      });

      setValidation(check);

      form.setFieldsValue({
        targetDepartment: check.recommendedDepartment,
        reason: check.reasons[0] || '',
      });
    }
  }, [modalVisible, latestExam, customer.age, form]);

  // 处理转诊
  const handleReferral = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用API创建转诊
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCustomerId: customer.id,
          targetDepartment: values.targetDepartment,
          reason: values.reason,
          notes: values.notes,
          clinicalIndicators: {
            age: customer.age,
            myopiaProgress: 75, // TODO: 计算实际度数增长
            sphericalPower: latestExam?.odRefraction,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('创建转诊失败');
      }

      const result = await response.json();

      if (result.success) {
        message.success('转诊创建成功！');
        setModalVisible(false);
        form.resetFields();
        onReferralCreated?.(result.data.id);
      } else {
        throw new Error(result.message || '创建转诊失败');
      }
    } catch (error) {
      console.error('Referral error:', error);
      message.error('转诊创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 打开转诊对话框
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Tooltip title="一键转诊到其他科室">
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleOpenModal}
          size="large"
        >
          一键转诊
        </Button>
      </Tooltip>

      <Modal
        title="发起转诊"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setValidation(null);
        }}
        footer={null}
        width={600}
      >
        {validation && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              <strong>转诊建议</strong>
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              推荐科室：
              <span style={{ fontWeight: 'bold', color: '#1890ff', marginLeft: 8 }}>
                {validation.recommendedDepartment === 'orthokeratology' ? '角塑科' : '屈光科'}
              </span>
            </div>
            {validation.reasons.length > 0 && (
              <ul style={{ margin: '8px 0', paddingLeft: 20, fontSize: 13, color: '#666' }}>
                {validation.reasons.map((reason: string, index: number) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            )}
            {validation.warnings.length > 0 && (
              <div style={{ marginTop: 8, padding: 8, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  <strong>注意事项</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#666' }}>
                  {validation.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleReferral}
        >
          <Form.Item
            label="目标科室"
            name="targetDepartment"
            rules={[{ required: true, message: '请选择目标科室' }]}
          >
            <Select placeholder="请选择目标科室">
              <Select.Option value="orthokeratology">角塑科</Select.Option>
              <Select.Option value="refractive">屈光科</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="转诊原因"
            name="reason"
            rules={[{ required: true, message: '请输入转诊原因' }]}
          >
            <Select
              placeholder="请选择转诊原因"
              options={[
                { label: '度数增长过快，建议加强控制', value: '度数增长过快，建议加强控制' },
                { label: '年龄符合手术条件，推荐屈光手术', value: '年龄符合手术条件，推荐屈光手术' },
                { label: '角膜条件适合，建议验配角塑镜', value: '角膜条件适合，建议验配角塑镜' },
                { label: '患者主动要求转诊', value: '患者主动要求转诊' },
                { label: '其他', value: '其他' },
              ]}
            />
          </Form.Item>

          <Form.Item label="备注" name="notes">
            <Select
              mode="tags"
              placeholder="添加备注信息（可选）"
              maxTagCount={3}
              options={[
                { label: '度数增长较快，需密切随访', value: '度数增长较快，需密切随访' },
                { label: '患者配合度良好', value: '患者配合度良好' },
                { label: '家长对转诊方案接受度高', value: '家长对转诊方案接受度高' },
                { label: '建议优先安排', value: '建议优先安排' },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setValidation(null);
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认转诊
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReferralButton;
