-- =====================================================
-- 规则配置引擎数据库Schema
-- 创建时间: 2024-12-10
-- 描述: 规则引擎相关表结构定义
-- =====================================================

-- 1. 规则主表
CREATE TABLE IF NOT EXISTS rules (
  id VARCHAR(50) PRIMARY KEY COMMENT '规则ID',
  name VARCHAR(200) NOT NULL COMMENT '规则名称',
  category VARCHAR(50) NOT NULL COMMENT '规则分类',
  description TEXT COMMENT '规则描述',
  conditions JSON NOT NULL COMMENT '条件配置（JSON格式）',
  actions JSON NOT NULL COMMENT '动作配置（JSON格式）',
  enabled BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
  priority INTEGER NOT NULL DEFAULT 100 COMMENT '优先级（数值越大优先级越高）',
  version INTEGER NOT NULL DEFAULT 1 COMMENT '版本号',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  created_by VARCHAR(50) NOT NULL COMMENT '创建人',
  updated_by VARCHAR(50) NOT NULL COMMENT '最后更新人',
  effective_from TIMESTAMP NULL COMMENT '生效开始时间',
  effective_to TIMESTAMP NULL COMMENT '生效结束时间',
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '软删除标记',
  INDEX idx_category (category),
  INDEX idx_enabled (enabled),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则主表';

-- 2. 规则历史表
CREATE TABLE IF NOT EXISTS rule_history (
  id VARCHAR(50) PRIMARY KEY COMMENT '历史记录ID',
  rule_id VARCHAR(50) NOT NULL COMMENT '规则ID',
  version INTEGER NOT NULL COMMENT '历史版本号',
  name VARCHAR(200) NOT NULL COMMENT '规则名称',
  category VARCHAR(50) NOT NULL COMMENT '规则分类',
  conditions JSON NOT NULL COMMENT '条件配置',
  actions JSON NOT NULL COMMENT '动作配置',
  enabled BOOLEAN NOT NULL COMMENT '是否启用',
  priority INTEGER NOT NULL COMMENT '优先级',
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '变更时间',
  changed_by VARCHAR(50) NOT NULL COMMENT '变更人',
  comment TEXT COMMENT '变更说明',
  diff JSON COMMENT '变更差异（JSON格式）',
  FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
  INDEX idx_rule_id (rule_id),
  INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则历史表';

-- 3. 规则模板表
CREATE TABLE IF NOT EXISTS rule_templates (
  id VARCHAR(50) PRIMARY KEY COMMENT '模板ID',
  name VARCHAR(200) NOT NULL COMMENT '模板名称',
  category VARCHAR(50) NOT NULL COMMENT '规则分类',
  description TEXT COMMENT '模板描述',
  default_config JSON NOT NULL COMMENT '默认配置',
  applicable_scenarios JSON COMMENT '适用场景',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  created_by VARCHAR(50) NOT NULL COMMENT '创建人',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则模板表';

-- 4. 规则执行记录表
CREATE TABLE IF NOT EXISTS rule_executions (
  id VARCHAR(50) PRIMARY KEY COMMENT '执行记录ID',
  rule_id VARCHAR(50) NOT NULL COMMENT '规则ID',
  execution_date DATE NOT NULL COMMENT '执行日期',
  total_customers INTEGER NOT NULL DEFAULT 0 COMMENT '检查客户总数',
  matched_customers INTEGER NOT NULL DEFAULT 0 COMMENT '匹配客户数',
  generated_tasks INTEGER NOT NULL DEFAULT 0 COMMENT '生成任务数',
  execution_time_ms INTEGER NOT NULL COMMENT '执行耗时（毫秒）',
  status ENUM('success', 'failed', 'partial') NOT NULL DEFAULT 'success' COMMENT '执行状态',
  error_message TEXT COMMENT '错误信息（如果执行失败）',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
  INDEX idx_rule_id_date (rule_id, execution_date),
  INDEX idx_execution_date (execution_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则执行记录表';

-- 5. 规则执行明细表
CREATE TABLE IF NOT EXISTS rule_execution_details (
  id VARCHAR(50) PRIMARY KEY COMMENT '明细ID',
  execution_id VARCHAR(50) NOT NULL COMMENT '执行记录ID',
  rule_id VARCHAR(50) NOT NULL COMMENT '规则ID',
  customer_id VARCHAR(50) NOT NULL COMMENT '客户ID',
  matched_conditions JSON COMMENT '匹配的条件',
  executed_actions JSON COMMENT '执行的动作',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (execution_id) REFERENCES rule_executions(id) ON DELETE CASCADE,
  FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
  INDEX idx_execution_id (execution_id),
  INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则执行明细表';

-- 6. 规则审批表
CREATE TABLE IF NOT EXISTS rule_approvals (
  id VARCHAR(50) PRIMARY KEY COMMENT '审批记录ID',
  rule_id VARCHAR(50) NOT NULL COMMENT '规则ID',
  version INTEGER NOT NULL COMMENT '待审批的版本',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审批状态',
  submitted_by VARCHAR(50) NOT NULL COMMENT '提交人',
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  reviewed_by VARCHAR(50) COMMENT '审批人',
  reviewed_at TIMESTAMP NULL COMMENT '审批时间',
  comment TEXT COMMENT '审批意见',
  FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE,
  INDEX idx_rule_id (rule_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则审批表';

-- 7. 规则分类表
CREATE TABLE IF NOT EXISTS rule_categories (
  id VARCHAR(50) PRIMARY KEY COMMENT '分类ID',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT '分类代码',
  name VARCHAR(100) NOT NULL COMMENT '分类名称',
  description TEXT COMMENT '分类描述',
  icon VARCHAR(50) COMMENT '图标',
  sort_order INTEGER NOT NULL DEFAULT 0 COMMENT '排序',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否启用',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规则分类表';

-- =====================================================
-- 初始化数据
-- =====================================================

-- 插入规则分类基础数据
INSERT INTO rule_categories (id, code, name, description, sort_order) VALUES
('cat_001', 'lens_change_reminder', '换片提醒规则', '管理镜片更换提醒相关规则', 1),
('cat_002', 'refraction_warning', '度数增长预警', '管理度数增长预警规则', 2),
('cat_003', 'quality_warning', '质控预警', '管理服务质量预警规则', 3),
('cat_004', 'upgrade_potential', '升单潜力', '管理客户升单潜力识别规则', 4),
('cat_005', 'referral_rules', '转科推荐', '管理客户转科推荐规则', 5),
('cat_006', 'churn_warning', '流失预警', '管理客户流失预警规则', 6)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

-- 插入规则模板初始数据
INSERT INTO rule_templates (id, name, category, description, default_config, applicable_scenarios, created_by) VALUES
('tpl_001', '默认换片提醒', 'lens_change_reminder', '适用于大多数客户的通用换片提醒规则',
 '{"reminderCycle": 550, "advanceDays": 30, "channels": ["wechat"]}',
 '["青少年", "成人", "老年"]', 'system'),

('tpl_002', '青少年度数预警', 'refraction_warning', '针对青少年的度数快速增长预警',
 '{"timeFrame": "6months", "threshold": 50, "ageGroup": "teen"}',
 '["青少年"]', 'system'),

('tpl_003', '任务超时预警', 'quality_warning', '客服任务处理超时预警',
 '{"taskType": "customer_service", "timeoutHours": 24, "priority": "high"}',
 '["客服", "运营"]', 'system')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

-- =====================================================
-- 创建视图
-- =====================================================

-- 规则执行统计视图
CREATE OR REPLACE VIEW v_rule_execution_stats AS
SELECT
  r.id as rule_id,
  r.name as rule_name,
  r.category,
  COUNT(re.id) as total_executions,
  SUM(re.total_customers) as total_customers_checked,
  SUM(re.matched_customers) as total_customers_matched,
  AVG(re.execution_time_ms) as avg_execution_time,
  SUM(CASE WHEN re.status = 'success' THEN 1 ELSE 0 END) as successful_executions,
  SUM(CASE WHEN re.status = 'failed' THEN 1 ELSE 0 END) as failed_executions
FROM rules r
LEFT JOIN rule_executions re ON r.id = re.rule_id
WHERE r.is_deleted = FALSE
GROUP BY r.id, r.name, r.category;

-- =====================================================
-- 创建存储过程
-- =====================================================

DELIMITER //

-- 获取规则最新版本的存储过程
CREATE PROCEDURE IF NOT EXISTS GetLatestRuleVersion(
  IN p_rule_id VARCHAR(50),
  OUT p_version INTEGER,
  OUT p_conditions JSON,
  OUT p_actions JSON
)
BEGIN
  SELECT
    version,
    conditions,
    actions
  INTO p_version, p_conditions, p_actions
  FROM rules
  WHERE id = p_rule_id AND is_deleted = FALSE
  ORDER BY version DESC
  LIMIT 1;
END //

DELIMITER ;

-- =====================================================
-- 创建索引（额外的性能优化）
-- =====================================================

-- 为JSON字段创建虚拟列索引（MySQL 5.7+）
ALTER TABLE rules ADD INDEX idx_category_enabled (category, enabled);
ALTER TABLE rule_executions ADD INDEX idx_status_date (status, execution_date);

-- 复合索引优化查询性能
CREATE INDEX idx_rules_category_enabled ON rules(category, enabled, is_deleted);
CREATE INDEX idx_executions_rule_date ON rule_executions(rule_id, execution_date, status);
