-- ========================================
-- 企业微信集成界面 - 数据库迁移脚本
-- 版本: v1.0
-- 创建时间: 2024-12-10
-- ========================================

-- 创建话术模板表
CREATE TABLE IF NOT EXISTS script_templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '模板名称',
  category VARCHAR(50) NOT NULL COMMENT '模板分类：复诊提醒/产品提醒/流失召回等',
  content TEXT NOT NULL COMMENT '模板内容，支持变量替换',
  variables JSON COMMENT '模板变量列表',
  is_public BOOLEAN DEFAULT FALSE COMMENT '是否公共模板',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
  created_by VARCHAR(50) NOT NULL COMMENT '创建人',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_category (category),
  INDEX idx_created_by (created_by),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话术模板表';

-- 创建聊天记录表
CREATE TABLE IF NOT EXISTS chat_records (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL COMMENT '客户ID',
  user_id VARCHAR(50) NOT NULL COMMENT '医助用户ID',
  channel VARCHAR(20) NOT NULL COMMENT '渠道：wecom/sms/call',
  sender_type VARCHAR(10) NOT NULL COMMENT '发送者类型：staff/customer/system',
  content TEXT NOT NULL COMMENT '消息内容',
  message_type VARCHAR(20) DEFAULT 'text' COMMENT '消息类型：text/image/file',
  attachments JSON COMMENT '附件信息',
  read_status VARCHAR(10) DEFAULT 'unread' COMMENT '已读状态：read/unread',
  external_id VARCHAR(100) COMMENT '外部系统消息ID',
  sent_at TIMESTAMP NOT NULL COMMENT '发送时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_customer (customer_id),
  INDEX idx_user (user_id),
  INDEX idx_channel (channel),
  INDEX idx_sent_at (sent_at),
  INDEX idx_external_id (external_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天记录表';

-- 创建聊天智能总结表
CREATE TABLE IF NOT EXISTS chat_summaries (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL COMMENT '客户ID',
  summary_date DATE NOT NULL COMMENT '总结日期',
  intention_level VARCHAR(20) COMMENT '意向等级：high/medium/low',
  key_points JSON COMMENT '关键要点列表',
  concerns JSON COMMENT '客户关注点',
  next_actions JSON COMMENT '后续行动建议',
  tags JSON COMMENT '客户标签',
  generated_tasks JSON COMMENT '生成的任务列表',
  created_by VARCHAR(50) COMMENT '总结生成人（AI或系统）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY uk_customer_date (customer_id, summary_date),
  INDEX idx_customer (customer_id),
  INDEX idx_intention (intention_level),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天智能总结表';

-- 创建消息发送日志表
CREATE TABLE IF NOT EXISTS message_logs (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL COMMENT '客户ID',
  user_id VARCHAR(50) NOT NULL COMMENT '发送人',
  channel VARCHAR(20) NOT NULL COMMENT '发送渠道：wecom/sms/call',
  message_type VARCHAR(20) DEFAULT 'text' COMMENT '消息类型',
  content TEXT NOT NULL COMMENT '消息内容',
  status VARCHAR(20) NOT NULL COMMENT '发送状态：pending/sent/failed/delivered/read',
  external_id VARCHAR(100) COMMENT '外部系统ID（如短信ID、呼叫ID）',
  scheduled_at TIMESTAMP NULL COMMENT '定时发送时间',
  sent_at TIMESTAMP NULL COMMENT '实际发送时间',
  delivered_at TIMESTAMP NULL COMMENT '送达时间',
  read_at TIMESTAMP NULL COMMENT '阅读时间',
  failure_reason TEXT COMMENT '失败原因',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_customer (customer_id),
  INDEX idx_user (user_id),
  INDEX idx_channel (channel),
  INDEX idx_status (status),
  INDEX idx_external_id (external_id),
  INDEX idx_scheduled_at (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息发送日志表';

-- 创建通知表
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL COMMENT '接收人',
  type VARCHAR(30) NOT NULL COMMENT '通知类型：task_reminder/customer_reply/system_alert',
  title VARCHAR(200) NOT NULL COMMENT '通知标题',
  content TEXT NOT NULL COMMENT '通知内容',
  status VARCHAR(10) DEFAULT 'unread' COMMENT '状态：read/unread',
  priority VARCHAR(10) DEFAULT 'normal' COMMENT '优先级：high/normal/low',
  data JSON COMMENT '扩展数据（如任务ID、客户ID等）',
  read_at TIMESTAMP NULL COMMENT '阅读时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- 创建侧边栏访问日志表
CREATE TABLE IF NOT EXISTS sidebar_access_logs (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
  customer_id VARCHAR(50) NOT NULL COMMENT '客户ID',
  access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
  duration INTEGER COMMENT '停留时长（秒）',
  actions JSON COMMENT '执行的操作列表',
  ip_address VARCHAR(50) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  INDEX idx_user (user_id),
  INDEX idx_customer (customer_id),
  INDEX idx_access_time (access_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='侧边栏访问日志表';

-- 插入系统默认话术模板
INSERT INTO script_templates (id, name, category, content, variables, is_public, created_by) VALUES
('TPL_FOLLOW_UP_001', '复查邀约', '复诊提醒', '{parentName}您好！距离{patientName}上次复查已过{daysSinceLastCheck}，上次检查数据显示右眼度数增长了{refractionChange}，建议及时复查。我们可以为您预约{availableDates}的号源。', '["parentName", "patientName", "daysSinceLastCheck", "refractionChange", "availableDates"]', true, 'system'),
('TPL_LENS_001', '换片提醒', '产品提醒', '{patientName}的镜片已佩戴{duration}，建议及时更换以确保矫正效果', '["patientName", "duration"]', true, 'system'),
('TPL_RECALL_001', '流失召回', '流失召回', '您好{parentName}，近期注意到{patientName}没有按时复查，为了眼部健康，建议及时联系我们安排复查', '["parentName", "patientName"]', true, 'system'),
('TPL_UPGRADE_001', '升单推荐', '升单推荐', '{parentName}您好，{patientName}的度数增长较快，建议考虑角膜塑形镜来控制度数增长', '["parentName", "patientName"]', true, 'system'),
('TPL_CARE_001', '新客户关怀', '客户关怀', '{parentName}您好，{patientName}的镜片佩戴还适应吗？有什么问题可以随时联系我们', '["parentName", "patientName"]', true, 'system')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  content = VALUES(content),
  updated_at = CURRENT_TIMESTAMP;

-- 插入Mock聊天记录
INSERT INTO chat_records (id, customer_id, user_id, channel, sender_type, content, message_type, read_status, sent_at) VALUES
('MSG001', 'C001', 'U001', 'wecom', 'staff', '您好，张先生，小明的镜片需要更换了', 'text', 'read', '2024-12-10 10:30:00'),
('MSG002', 'C001', 'U001', 'wecom', 'customer', '好的，大概什么时候可以更换？', 'text', 'read', '2024-12-10 10:35:00'),
('MSG003', 'C001', 'U001', 'wecom', 'staff', '我们可以为您预约本周五下午，您看方便吗？', 'text', 'unread', '2024-12-10 10:36:00')
ON DUPLICATE KEY UPDATE
  content = VALUES(content);

-- 插入Mock通知
INSERT INTO notifications (id, user_id, type, title, content, status, data) VALUES
('NOTIF_001', 'U001', 'task_reminder', '新任务提醒', '张小明的复查任务已到期', 'unread', '{"taskId": "T001", "customerId": "C001"}'),
('NOTIF_002', 'U001', 'customer_reply', '客户回复提醒', '张先生已回复您的消息', 'unread', '{"customerId": "C001", "messageId": "MSG002"}'),
('NOTIF_003', 'U001', 'system_alert', '系统预警', '客单价连续3天下降超过15%', 'read', '{"alertType": "price_anomaly"}')
ON DUPLICATE KEY UPDATE
  content = VALUES(content);

-- 创建视图：客户侧边栏数据视图
CREATE OR REPLACE VIEW customer_sidebar_view AS
SELECT
  c.id as customer_id,
  c.name as customer_name,
  c.parent_name as parent_name,
  c.parent_phone as parent_phone,
  c.last_check_date,
  c.current_product as product_type,
  c.notes,
  -- 获取最近一次检查数据
  (
    SELECT e.od_refraction
    FROM examinations e
    WHERE e.customer_id = c.id
    ORDER BY e.date DESC
    LIMIT 1
  ) as right_eye_refraction,
  (
    SELECT e.os_refraction
    FROM examinations e
    WHERE e.customer_id = c.id
    ORDER BY e.date DESC
    LIMIT 1
  ) as left_eye_refraction,
  -- 获取客户标签
  (
    SELECT JSON_ARRAYAGG(tag)
    FROM (
      SELECT DISTINCT
        CASE
          WHEN c.category = 'potential' THEN '潜在客户'
          WHEN c.category = 'converted' THEN '成交客户'
          WHEN c.category = 'upgrade' THEN '升单潜力'
          WHEN c.category = 'referral' THEN '转科潜力'
          WHEN c.category = 'churn' THEN '流失预警'
          ELSE c.category
        END as tag
      FROM customers
      WHERE id = c.id
    ) tags
  ) as tags,
  -- 待办任务数量
  (
    SELECT COUNT(*)
    FROM tasks t
    WHERE t.customer_id = c.id
    AND t.status IN ('pending', 'in_progress')
  ) as pending_tasks_count
FROM customers c
WHERE c.deleted_at IS NULL;

-- 创建存储过程：生成AI话术
DELIMITER //
CREATE PROCEDURE GenerateScript(
  IN p_customer_id VARCHAR(50),
  IN p_task_type VARCHAR(50),
  OUT p_script TEXT
)
BEGIN
  DECLARE v_template_content TEXT;
  DECLARE v_parent_name VARCHAR(100);
  DECLARE v_patient_name VARCHAR(100);
  DECLARE v_days_since_check INT;
  DECLARE v_refraction_change VARCHAR(50);

  -- 获取模板内容
  SELECT content INTO v_template_content
  FROM script_templates
  WHERE category = p_task_type
  AND is_active = TRUE
  LIMIT 1;

  -- 获取客户信息
  SELECT parent_name, name INTO v_parent_name, v_patient_name
  FROM customers
  WHERE id = p_customer_id;

  -- 计算距离上次检查天数
  SELECT DATEDIFF(NOW(), last_check_date) INTO v_days_since_check
  FROM customers
  WHERE id = p_customer_id;

  -- Mock度数变化
  SET v_refraction_change = '50度';

  -- 替换变量
  SET p_script = v_template_content;
  SET p_script = REPLACE(p_script, '{parentName}', v_parent_name);
  SET p_script = REPLACE(p_script, '{patientName}', v_patient_name);
  SET p_script = REPLACE(p_script, '{daysSinceLastCheck}', CONCAT(FLOOR(v_days_since_check / 30), '个月'));
  SET p_script = REPLACE(p_script, '{refractionChange}', v_refraction_change);
  SET p_script = REPLACE(p_script, '{availableDates}', '本周五/本周六');
END//
DELIMITER ;

-- 创建触发器：自动生成聊天总结
DELIMITER //
CREATE TRIGGER tr_chat_records_after_insert
AFTER INSERT ON chat_records
FOR EACH ROW
BEGIN
  DECLARE v_record_count INT;

  -- 当一个客户一天内聊天记录超过5条时，自动生成总结
  SELECT COUNT(*) INTO v_record_count
  FROM chat_records
  WHERE customer_id = NEW.customer_id
  AND DATE(sent_at) = DATE(NEW.sent_at);

  IF v_record_count >= 5 THEN
    INSERT INTO chat_summaries (
      id,
      customer_id,
      summary_date,
      intention_level,
      key_points,
      concerns,
      next_actions,
      tags,
      created_by
    ) VALUES (
      CONCAT('SUM_', NEW.customer_id, '_', DATE_FORMAT(NOW(), '%Y%m%d')),
      NEW.customer_id,
      DATE(NEW.sent_at),
      'medium',
      JSON_ARRAY('客户主动咨询'),
      JSON_ARRAY('关注时间安排'),
      JSON_ARRAY('持续跟进'),
      JSON_ARRAY('活跃客户'),
      'system'
    )
    ON DUPLICATE KEY UPDATE
      intention_level = VALUES(intention_level),
      updated_at = NOW();
  END IF;
END//
DELIMITER ;

-- 创建索引优化查询性能
CREATE INDEX idx_chat_records_customer_date ON chat_records(customer_id, sent_at DESC);
CREATE INDEX idx_message_logs_status_created ON message_logs(status, created_at DESC);
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status, created_at DESC);

-- 创建定时任务：清理过期通知
-- 注意：MySQL定时任务需要开启event_scheduler
-- SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS ev_cleanup_old_notifications
ON SCHEDULE EVERY 1 DAY
STARTS '2024-12-11 00:00:00'
DO
BEGIN
  DELETE FROM notifications
  WHERE status = 'read'
  AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

  DELETE FROM message_logs
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

  DELETE FROM sidebar_access_logs
  WHERE access_time < DATE_SUB(NOW(), INTERVAL 6 MONTH);
END;

-- 权限说明
-- GRANT SELECT, INSERT, UPDATE, DELETE ON script_templates TO 'app_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON chat_records TO 'app_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON chat_summaries TO 'app_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON message_logs TO 'app_user'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO 'app_user'@'%';
-- GRANT SELECT, INSERT ON sidebar_access_logs TO 'app_user'@'%';
-- GRANT EXECUTE ON PROCEDURE GenerateScript TO 'app_user'@'%';

-- 验证脚本
SELECT 'Tables created successfully' as status;
SELECT COUNT(*) as template_count FROM script_templates;
SELECT COUNT(*) as notification_count FROM notifications;
