// API路由配置 - 规则配置引擎
import { NextRequest, NextResponse } from 'next/server';

// 模拟数据存储
const mockRules = [
  {
    id: 'rule_001',
    name: '换片提醒-550天',
    category: 'lens_change_reminder',
    description: '客户佩戴镜片满550天后触发换片提醒',
    conditions: [
      {
        field: 'daysSinceLastLensChange',
        operator: 'gte',
        value: 550,
        andOr: 'AND'
      },
      {
        field: 'customer.age',
        operator: 'lte',
        value: 18,
        andOr: 'OR'
      }
    ],
    actions: [
      {
        type: 'generate_task',
        params: {
          taskType: 'lens_change_reminder',
          reminderDays: 30,
          channels: ['wechat', 'sms']
        }
      }
    ],
    enabled: true,
    priority: 100,
    version: 3,
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-12-10T10:30:00Z',
    createdBy: '张三',
    updatedBy: '李四'
  },
  {
    id: 'rule_002',
    name: '青少年度数预警',
    category: 'refraction_warning',
    description: '青少年半年内度数增长超过50度触发预警',
    conditions: [
      {
        field: 'customer.age',
        operator: 'lte',
        value: 18,
        andOr: 'AND'
      },
      {
        field: 'refractionChange',
        operator: 'gte',
        value: 50,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'send_alert',
        params: {
          alertType: 'refraction_warning',
          channels: ['wechat'],
          priority: 'high'
        }
      }
    ],
    enabled: true,
    priority: 90,
    version: 2,
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2024-12-05T14:20:00Z',
    createdBy: '李四',
    updatedBy: '王五'
  },
  {
    id: 'rule_003',
    name: '任务超时预警',
    category: 'quality_warning',
    description: '客服任务处理超过24小时未回复触发预警',
    conditions: [
      {
        field: 'taskType',
        operator: 'eq',
        value: 'customer_service',
        andOr: 'AND'
      },
      {
        field: 'responseTime',
        operator: 'gt',
        value: 24,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'send_alert',
        params: {
          alertType: 'timeout_warning',
          channels: ['email', 'wechat'],
          priority: 'high'
        }
      }
    ],
    enabled: true,
    priority: 95,
    version: 1,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z',
    createdBy: '王五',
    updatedBy: '王五'
  },
  {
    id: 'rule_004',
    name: '升单潜力-框架转角塑',
    category: 'upgrade_potential',
    description: '16岁以下框架镜客户，半年内度数增长≥50度，推荐角塑',
    conditions: [
      {
        field: 'customer.age',
        operator: 'lte',
        value: 16,
        andOr: 'AND'
      },
      {
        field: 'customer.lensType',
        operator: 'eq',
        value: 'frame',
        andOr: 'AND'
      },
      {
        field: 'refractionChange',
        operator: 'gte',
        value: 50,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'generate_task',
        params: {
          taskType: 'upgrade_suggestion',
          taskPriority: 'medium',
          channels: ['wechat']
        }
      }
    ],
    enabled: true,
    priority: 85,
    version: 1,
    createdAt: '2024-12-01T14:00:00Z',
    updatedAt: '2024-12-01T14:00:00Z',
    createdBy: '赵六',
    updatedBy: '赵六'
  },
  {
    id: 'rule_005',
    name: '转科推荐-屈光手术',
    category: 'referral_rules',
    description: '18岁以上度数稳定的客户，推荐屈光手术',
    conditions: [
      {
        field: 'customer.age',
        operator: 'gte',
        value: 18,
        andOr: 'AND'
      },
      {
        field: 'refractionChange',
        operator: 'lte',
        value: 25,
        andOr: 'AND'
      },
      {
        field: 'customer.cornealThickness',
        operator: 'gte',
        value: 480,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'refer_customer',
        params: {
          department: 'refractive_surgery',
          incentiveAmount: 500,
          channels: ['wechat', 'phone']
        }
      }
    ],
    enabled: true,
    priority: 80,
    version: 1,
    createdAt: '2024-12-05T09:00:00Z',
    updatedAt: '2024-12-05T09:00:00Z',
    createdBy: '孙七',
    updatedBy: '孙七'
  },
  {
    id: 'rule_006',
    name: '流失预警-30天未到店',
    category: 'churn_warning',
    description: '客户超过30天未到店复查，触发流失预警',
    conditions: [
      {
        field: 'daysSinceLastVisit',
        operator: 'gte',
        value: 30,
        andOr: 'AND'
      },
      {
        field: 'customer.totalVisits',
        operator: 'gte',
        value: 3,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'generate_task',
        params: {
          taskType: 'retention_call',
          priority: 'medium',
          channels: ['phone', 'wechat']
        }
      }
    ],
    enabled: true,
    priority: 75,
    version: 1,
    createdAt: '2024-12-08T11:00:00Z',
    updatedAt: '2024-12-08T11:00:00Z',
    createdBy: '周八',
    updatedBy: '周八'
  },
  {
    id: 'rule_007',
    name: '企微回复时效预警',
    category: 'quality_warning',
    description: '企微消息4小时未回复触发预警',
    conditions: [
      {
        field: 'channel',
        operator: 'eq',
        value: 'wechat',
        andOr: 'AND'
      },
      {
        field: 'responseTime',
        operator: 'gt',
        value: 4,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'send_alert',
        params: {
          alertType: 'wechat_response_warning',
          channels: ['email'],
          priority: 'medium'
        }
      }
    ],
    enabled: false,
    priority: 70,
    version: 1,
    createdAt: '2024-11-10T16:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    createdBy: '吴九',
    updatedBy: '郑十'
  },
  {
    id: 'rule_008',
    name: '3个月度数预警',
    category: 'refraction_warning',
    description: '任意客户3个月内度数增长超过25度触发预警',
    conditions: [
      {
        field: 'refractionChange',
        operator: 'gte',
        value: 25,
        andOr: 'AND'
      },
      {
        field: 'timeWindow',
        operator: 'eq',
        value: 3,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'send_alert',
        params: {
          alertType: 'rapid_refraction_change',
          channels: ['wechat'],
          priority: 'high'
        }
      }
    ],
    enabled: true,
    priority: 88,
    version: 2,
    createdAt: '2024-10-20T13:00:00Z',
    updatedAt: '2024-12-07T15:30:00Z',
    createdBy: '钱十一',
    updatedBy: '钱十一'
  },
  {
    id: 'rule_009',
    name: '客单价异常预警',
    category: 'quality_warning',
    description: '连续3天客单价下降超过15%触发预警',
    conditions: [
      {
        field: 'consecutiveDays',
        operator: 'gte',
        value: 3,
        andOr: 'AND'
      },
      {
        field: 'priceDrop',
        operator: 'gte',
        value: 15,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'send_alert',
        params: {
          alertType: 'price_anomaly',
          channels: ['email', 'wechat'],
          priority: 'high'
        }
      }
    ],
    enabled: true,
    priority: 92,
    version: 1,
    createdAt: '2024-12-06T10:00:00Z',
    updatedAt: '2024-12-06T10:00:00Z',
    createdBy: '李四',
    updatedBy: '李四'
  },
  {
    id: 'rule_010',
    name: '青少年专属换片提醒',
    category: 'lens_change_reminder',
    description: '18岁以下客户佩戴镜片365天后触发换片提醒',
    conditions: [
      {
        field: 'customer.age',
        operator: 'lte',
        value: 18,
        andOr: 'AND'
      },
      {
        field: 'daysSinceLastLensChange',
        operator: 'gte',
        value: 365,
        andOr: 'AND'
      }
    ],
    actions: [
      {
        type: 'generate_task',
        params: {
          taskType: 'lens_change_reminder',
          reminderDays: 7,
          channels: ['wechat', 'phone', 'sms']
        }
      }
    ],
    enabled: true,
    priority: 98,
    version: 1,
    createdAt: '2024-12-09T09:00:00Z',
    updatedAt: '2024-12-09T09:00:00Z',
    createdBy: '张三',
    updatedBy: '张三'
  }
];

const mockTemplates = [
  {
    id: 'template_001',
    name: '默认换片提醒模板',
    category: 'lens_change_reminder',
    description: '适用于大多数客户的通用换片提醒规则',
    defaultConfig: {
      reminderCycle: 550,
      advanceDays: 30,
      channels: ['wechat']
    },
    applicableScenarios: ['青少年', '成人']
  },
  {
    id: 'template_002',
    name: '青少年度数预警模板',
    category: 'refraction_warning',
    description: '针对青少年的度数快速增长预警',
    defaultConfig: {
      timeFrame: '6months',
      threshold: 50,
      ageGroup: 'teen'
    },
    applicableScenarios: ['青少年']
  },
  {
    id: 'template_003',
    name: '任务超时预警模板',
    category: 'quality_warning',
    description: '客服任务处理超时预警',
    defaultConfig: {
      taskType: 'customer_service',
      timeoutHours: 24,
      priority: 'high'
    },
    applicableScenarios: ['客服', '运营']
  },
  {
    id: 'template_004',
    name: '升单潜力识别模板',
    category: 'upgrade_potential',
    description: '识别有升单潜力的客户，如框架镜转角塑',
    defaultConfig: {
      minAge: 8,
      maxAge: 16,
      refractionThreshold: 50,
      lensType: 'frame'
    },
    applicableScenarios: ['青少年', '角塑科']
  },
  {
    id: 'template_005',
    name: '转科推荐模板',
    category: 'referral_rules',
    description: '推荐合适的客户到其他科室',
    defaultConfig: {
      minAge: 18,
      stabilityThreshold: 25,
      department: 'refractive_surgery'
    },
    applicableScenarios: ['成人', '屈光科']
  },
  {
    id: 'template_006',
    name: '流失预警模板',
    category: 'churn_warning',
    description: '识别可能流失的客户',
    defaultConfig: {
      noVisitDays: 30,
      minTotalVisits: 3,
      taskType: 'retention_call'
    },
    applicableScenarios: ['运营', '客服']
  },
  {
    id: 'template_007',
    name: '企微回复预警模板',
    category: 'quality_warning',
    description: '企微消息回复时效监控',
    defaultConfig: {
      responseTime: 4,
      channels: ['wechat'],
      priority: 'medium'
    },
    applicableScenarios: ['客服', '运营']
  },
  {
    id: 'template_008',
    name: '3个月度数预警模板',
    category: 'refraction_warning',
    description: '短期度数变化快速预警',
    defaultConfig: {
      timeFrame: 3,
      threshold: 25,
      alertChannels: ['wechat']
    },
    applicableScenarios: ['青少年', '成人']
  },
  {
    id: 'template_009',
    name: '客单价异常预警模板',
    category: 'quality_warning',
    description: '监控客单价异常波动',
    defaultConfig: {
      consecutiveDays: 3,
      dropThreshold: 15,
      priority: 'high'
    },
    applicableScenarios: ['销售', '运营']
  },
  {
    id: 'template_010',
    name: '青少年快速换片模板',
    category: 'lens_change_reminder',
    description: '针对青少年缩短换片周期',
    defaultConfig: {
      reminderCycle: 365,
      advanceDays: 7,
      channels: ['wechat', 'phone', 'sms']
    },
    applicableScenarios: ['青少年']
  },
  {
    id: 'template_011',
    name: '季度检查提醒模板',
    category: 'lens_change_reminder',
    description: '定期眼健康检查提醒',
    defaultConfig: {
      intervalDays: 90,
      taskType: 'checkup_reminder',
      channels: ['wechat']
    },
    applicableScenarios: ['全部客户']
  },
  {
    id: 'template_012',
    name: '新客户关怀模板',
    category: 'quality_warning',
    description: '新客户首次配镜后的关怀提醒',
    defaultConfig: {
      daysAfterFirstVisit: 7,
      taskType: 'care_call',
      channels: ['phone']
    },
    applicableScenarios: ['新客户', '客服']
  }
];

// 规则执行日志数据
const mockRuleExecutionLogs = [
  {
    id: 'log_001',
    ruleId: 'rule_001',
    ruleName: '换片提醒-550天',
    executionTime: '2024-12-09T08:30:00Z',
    status: 'success',
    matchedCustomers: 45,
    triggeredActions: 45,
    executionDuration: 120,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-09T08:00:00Z',
      totalCustomersScanned: 1200
    },
    errorMessage: null
  },
  {
    id: 'log_002',
    ruleId: 'rule_002',
    ruleName: '青少年度数预警',
    executionTime: '2024-12-09T09:15:00Z',
    status: 'success',
    matchedCustomers: 12,
    triggeredActions: 12,
    executionDuration: 85,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-09T09:00:00Z',
      totalCustomersScanned: 800
    },
    errorMessage: null
  },
  {
    id: 'log_003',
    ruleId: 'rule_003',
    ruleName: '任务超时预警',
    executionTime: '2024-12-09T10:00:00Z',
    status: 'warning',
    matchedCustomers: 8,
    triggeredActions: 8,
    executionDuration: 95,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-09T10:00:00Z',
      totalCustomersScanned: 500
    },
    errorMessage: null
  },
  {
    id: 'log_004',
    ruleId: 'rule_004',
    ruleName: '升单潜力-框架转角塑',
    executionTime: '2024-12-09T11:20:00Z',
    status: 'success',
    matchedCustomers: 23,
    triggeredActions: 23,
    executionDuration: 110,
    executedBy: 'system',
    executionContext: {
      triggerType: 'manual',
      triggerUser: '张三',
      totalCustomersScanned: 600
    },
    errorMessage: null
  },
  {
    id: 'log_005',
    ruleId: 'rule_005',
    ruleName: '转科推荐-屈光手术',
    executionTime: '2024-12-09T14:30:00Z',
    status: 'success',
    matchedCustomers: 15,
    triggeredActions: 15,
    executionDuration: 105,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-09T14:00:00Z',
      totalCustomersScanned: 900
    },
    errorMessage: null
  },
  {
    id: 'log_006',
    ruleId: 'rule_001',
    ruleName: '换片提醒-550天',
    executionTime: '2024-12-08T08:30:00Z',
    status: 'success',
    matchedCustomers: 42,
    triggeredActions: 42,
    executionDuration: 115,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-08T08:00:00Z',
      totalCustomersScanned: 1180
    },
    errorMessage: null
  },
  {
    id: 'log_007',
    ruleId: 'rule_006',
    ruleName: '流失预警-30天未到店',
    executionTime: '2024-12-08T15:00:00Z',
    status: 'success',
    matchedCustomers: 67,
    triggeredActions: 67,
    executionDuration: 150,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-08T15:00:00Z',
      totalCustomersScanned: 1500
    },
    errorMessage: null
  },
  {
    id: 'log_008',
    ruleId: 'rule_008',
    ruleName: '3个月度数预警',
    executionTime: '2024-12-07T16:00:00Z',
    status: 'error',
    matchedCustomers: 0,
    triggeredActions: 0,
    executionDuration: 200,
    executedBy: 'system',
    executionContext: {
      triggerType: 'schedule',
      scheduleTime: '2024-12-07T16:00:00Z',
      totalCustomersScanned: 750
    },
    errorMessage: '数据库连接超时'
  }
];

// 规则历史版本数据
const mockRuleHistory = [
  {
    id: 'hist_001',
    ruleId: 'rule_001',
    version: 3,
    changeLog: '优化提醒时间，从500天调整为550天',
    changedBy: '李四',
    changedAt: '2024-12-10T10:30:00Z',
    isActive: true,
    changeType: 'update',
    previousVersion: 2,
    ruleSnapshot: {
      name: '换片提醒-550天',
      category: 'lens_change_reminder',
      description: '客户佩戴镜片满550天后触发换片提醒',
      conditions: [
        {
          field: 'daysSinceLastLensChange',
          operator: 'gte',
          value: 550,
          andOr: 'AND'
        },
        {
          field: 'customer.age',
          operator: 'lte',
          value: 18,
          andOr: 'OR'
        }
      ],
      actions: [
        {
          type: 'generate_task',
          params: {
            taskType: 'lens_change_reminder',
            reminderDays: 30,
            channels: ['wechat', 'sms']
          }
        }
      ],
      enabled: true,
      priority: 100
    }
  },
  {
    id: 'hist_002',
    ruleId: 'rule_001',
    version: 2,
    changeLog: '增加年龄条件筛选',
    changedBy: '王五',
    changedAt: '2024-11-15T14:20:00Z',
    isActive: false,
    changeType: 'update',
    previousVersion: 1,
    ruleSnapshot: {
      name: '换片提醒-500天',
      category: 'lens_change_reminder',
      description: '客户佩戴镜片满500天后触发换片提醒',
      conditions: [
        {
          field: 'daysSinceLastLensChange',
          operator: 'gte',
          value: 500,
          andOr: 'AND'
        }
      ],
      actions: [
        {
          type: 'generate_task',
          params: {
            taskType: 'lens_change_reminder',
            reminderDays: 30,
            channels: ['wechat', 'sms']
          }
        }
      ],
      enabled: true,
      priority: 100
    }
  },
  {
    id: 'hist_003',
    ruleId: 'rule_001',
    version: 1,
    changeLog: '初始版本创建',
    changedBy: '张三',
    changedAt: '2024-11-01T08:00:00Z',
    isActive: false,
    changeType: 'create',
    previousVersion: null,
    ruleSnapshot: {
      name: '换片提醒-500天',
      category: 'lens_change_reminder',
      description: '客户佩戴镜片满500天后触发换片提醒',
      conditions: [
        {
          field: 'daysSinceLastLensChange',
          operator: 'gte',
          value: 500,
          andOr: 'AND'
        }
      ],
      actions: [
        {
          type: 'generate_task',
          params: {
            taskType: 'lens_change_reminder',
            reminderDays: 30,
            channels: ['wechat']
          }
        }
      ],
      enabled: true,
      priority: 100
    }
  },
  {
    id: 'hist_004',
    ruleId: 'rule_002',
    version: 2,
    changeLog: '调整度数增长阈值从30度到50度',
    changedBy: '钱十一',
    changedAt: '2024-12-07T15:30:00Z',
    isActive: true,
    changeType: 'update',
    previousVersion: 1,
    ruleSnapshot: {
      name: '青少年度数预警',
      category: 'refraction_warning',
      description: '青少年半年内度数增长超过50度触发预警',
      conditions: [
        {
          field: 'customer.age',
          operator: 'lte',
          value: 18,
          andOr: 'AND'
        },
        {
          field: 'refractionChange',
          operator: 'gte',
          value: 50,
          andOr: 'AND'
        }
      ],
      actions: [
        {
          type: 'send_alert',
          params: {
            alertType: 'refraction_warning',
            channels: ['wechat'],
            priority: 'high'
          }
        }
      ],
      enabled: true,
      priority: 90
    }
  },
  {
    id: 'hist_005',
    ruleId: 'rule_002',
    version: 1,
    changeLog: '初始版本创建',
    changedBy: '李四',
    changedAt: '2024-10-15T09:00:00Z',
    isActive: false,
    changeType: 'create',
    previousVersion: null,
    ruleSnapshot: {
      name: '青少年度数预警',
      category: 'refraction_warning',
      description: '青少年半年内度数增长超过30度触发预警',
      conditions: [
        {
          field: 'customer.age',
          operator: 'lte',
          value: 18,
          andOr: 'AND'
        },
        {
          field: 'refractionChange',
          operator: 'gte',
          value: 30,
          andOr: 'AND'
        }
      ],
      actions: [
        {
          type: 'send_alert',
          params: {
            alertType: 'refraction_warning',
            channels: ['wechat'],
            priority: 'medium'
          }
        }
      ],
      enabled: true,
      priority: 90
    }
  }
];

// 规则审批数据
const mockRuleApprovals = [
  {
    id: 'approval_001',
    ruleId: 'rule_010',
    ruleName: '青少年专属换片提醒',
    applicant: '张三',
    applyTime: '2024-12-09T09:00:00Z',
    status: 'pending',
    approvalLevel: 1,
    currentApprover: '李四',
    approvalHistory: [],
    comment: '新增规则，需要审批',
    priority: 'medium'
  },
  {
    id: 'approval_002',
    ruleId: 'rule_001',
    ruleName: '换片提醒-550天',
    applicant: '李四',
    applyTime: '2024-12-10T10:00:00Z',
    status: 'approved',
    approvalLevel: 2,
    currentApprover: null,
    approvalHistory: [
      {
        approver: '王五',
        action: 'approved',
        time: '2024-12-10T11:00:00Z',
        comment: '同意修改'
      },
      {
        approver: '赵六',
        action: 'approved',
        time: '2024-12-10T14:00:00Z',
        comment: '修改合理，同意上线'
      }
    ],
    comment: '优化提醒时间',
    priority: 'high'
  },
  {
    id: 'approval_003',
    ruleId: 'rule_009',
    ruleName: '客单价异常预警',
    applicant: '孙七',
    applyTime: '2024-12-08T16:00:00Z',
    status: 'rejected',
    approvalLevel: 1,
    currentApprover: null,
    approvalHistory: [
      {
        approver: '周八',
        action: 'rejected',
        time: '2024-12-09T09:00:00Z',
        comment: '阈值设置不合理，需要重新调整'
      }
    ],
    comment: '新增客单价监控规则',
    priority: 'low'
  }
];

export {
  mockRules,
  mockTemplates,
  mockRuleExecutionLogs,
  mockRuleHistory,
  mockRuleApprovals,
};
