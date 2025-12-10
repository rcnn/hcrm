# HCRM客户长期价值管理模块 - 项目文档

## 文档概览

### 需求文档
- **[用户需求文档 (URD)](./requirement.md)** - 基于用户故事的需求描述，涵盖5种角色的核心诉求
- **[产品需求规格说明书 (PRD)](./prd.md)** - 详细的功能需求和技术规格说明

### 设计规范
- **[UI设计规范](./UI-DESIGN-GUIDE.md)** - 基于现有系统风格的医疗级UI设计指南，扁平化、信息密集型、专业高效
- **[现有系统UI分析](./ui.md)** - 现有系统界面风格分析，扁平化设计、蓝色主题、高密度表格

### 开发计划
- **[开发任务汇总](../devspec/changes/tasks.md)** - 完整的前端开发计划和任务分解
- **[DevSpec Proposals](../devspec/changes/)** - 8个独立的开发提案，每个提案都有详细的UI设计说明

## 核心功能模块

### 1. 项目基础架构
**提案编号：** 001
**开发周期：** 3天
**优先级：** P0

Next.js + React + TypeScript项目搭建，包括：
- 技术栈选型与配置
- 项目结构设计
- Mock数据架构
- 基础组件开发

### 2. 用户认证与权限系统
**提案编号：** 002
**开发周期：** 4天
**优先级：** P0

5种角色用户管理：
- 视光医助/客服 (U01)
- 验光师/验配师 (U02)
- 视光运营经理 (U03)
- 管理层 (U04)
- 框架镜销售 (U05)

### 3. 客户档案管理
**提案编号：** 003
**开发周期：** 5天
**优先级：** P1

- 客户列表与搜索
- 眼健康档案可视化（度数/眼轴增长曲线）
- 客户分类管理
- 企业微信侧边栏集成

### 4. 任务中心与SOP系统
**提案编号：** 004
**开发周期：** 6天
**优先级：** P0

- 自动化任务推送
- AI个性化话术生成
- 任务状态管理
- 超时预警系统

### 5. 数据可视化看板
**提案编号：** 005
**开发周期：** 6天
**优先级：** P1

- 管理驾驶舱（集团/院级）
- 个人看板（员工视角）
- 质控红黑榜
- 异常预警管理

### 6. 规则配置引擎
**提案编号：** 006
**开发周期：** 5天
**优先级：** P1

- 可视化规则配置
- 换片提醒周期设置
- 度数增长预警阈值
- 规则模拟与测试

### 7. 业绩归属与转介绍
**提案编号：** 007
**开发周期：** 5天
**优先级：** P1

- 跨科室客户流转
- 线索溯源与跟进
- 业绩自动核算
- 奖金计算与排名

### 8. 企业微信集成
**提案编号：** 008
**开发周期：** 5天
**优先级：** P1

- 企业微信侧边栏
- AI话术助手
- 多渠道触达
- 聊天记录集成

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14+ | React框架 |
| TypeScript | 5.0+ | 类型安全 |
| Ant Design | 最新 | UI组件库 |
| Zustand | 最新 | 状态管理 |
| Recharts | 最新 | 数据可视化 |
| Tailwind CSS | 最新 | 样式方案 |

## 开发时间线

```
Week 1: 基础架构 + 用户权限
Week 2-3: 客户档案 + 任务中心
Week 4: 数据看板
Week 5: 规则配置引擎
Week 6: 业绩归属 + 企业微信集成
```

**总开发时间：** 29-32天（6周）

## Mock数据说明

所有API接口使用Mock数据，包括：
- 用户与角色数据
- 客户档案数据（含眼健康数据）
- 任务与SOP数据
- 经营指标数据
- 规则配置数据

## 角色与权限

| 角色 | 主要功能 | 数据权限 |
|------|----------|----------|
| 视光医助/客服 | 任务执行、客户维护 | 分配给自己的客户 |
| 验光师/验配师 | 临床数据查看、转科推荐 | 本人名下客户 |
| 视光运营经理 | 规则配置、质控监控 | 全局数据 |
| 管理层 | 经营数据查看 | 管理驾驶舱数据 |
| 框架镜销售 | 升单识别、转介绍 | 自己客户或公海 |

## UI设计亮点

### 基于现有系统的医疗级设计
- **扁平化设计** - 无阴影、无渐变、干净现代，专业医疗风格
- **信息密集型** - 高密度表格，单屏展示更多数据，充分利用屏幕空间
- **功能驱动** - 设计服务于功能，而非视觉美观，效率至上
- **经典三段式** - 顶部导航 + 左侧侧边栏 + 主体内容区
- **明确反馈** - 整行变色表示状态，清晰的视觉反馈机制

### 颜色系统（医疗专业）
- **品牌蓝**: `#1890ff` - 顶部导航、主要按钮、角塑客户
- **成功绿**: `#52c41a` - 已完成、成交客户、绿色方块标签
- **警告橙**: `#faad14` - 警告、待处理、潜在客户
- **错误红**: `#f5222d` - 停止、异常、流失预警、"停止"按钮
- **方形标签** - 客户分类使用方形小色块标签（borderRadius: 0）

### 组件特色
- **高密度表格** - `size="small"`，行高32px，每页50条数据，斑马纹效果
- **矩形按钮** - 2px圆角，`size="small"`，扁平化设计
- **紧凑布局** - 表格单元格8px×4px，模块间距12px
- **专业图表** - @ant-design/charts，医疗专业配色，简洁流畅

## 设计演进

### v2.0 更新（根据现有系统风格调整）
基于您提供的现有系统界面截图，我们调整了UI设计方案：

1. **扁平化设计** - 移除所有阴影和渐变，采用干净现代的扁平化风格
2. **信息密集型** - 表格行高从48px降至32px，字体从14px降至13px
3. **高密度表格** - 表格单元格内边距8px×4px，每页显示50条数据
4. **方形标签** - 客户分类标签改为方形（borderRadius: 0），使用小色块
5. **矩形按钮** - 圆角从6px降至2px，主要使用`size="small"`
6. **整行反馈** - 已处理行变绿色背景 `#f6ffed`，提供明确状态反馈
7. **紧凑间距** - 模块间距从24px降至12-16px，提高空间利用率

## 项目特色

1. **全生命周期管理** - 从筛查到复购的完整闭环
2. **数据驱动决策** - 可视化看板和智能预警
3. **跨科室协作** - 打破壁垒的流量流转机制
4. **智能化运营** - AI话术生成和自动化任务
5. **移动端优化** - 企业微信侧边栏深度集成

## 更多信息

- 查看完整需求：[requirement.md](./requirement.md)
- 查看技术规格：[prd.md](./prd.md)
- 查看现有系统UI分析：[ui.md](./ui.md)
- 查看UI设计规范（v2.0）：[UI-DESIGN-GUIDE.md](./UI-DESIGN-GUIDE.md)
- 查看开发计划：[devspec/changes/tasks.md](../devspec/changes/tasks.md)
- 查看所有提案：[devspec/changes/](../devspec/changes/)



### 📁 devspec/changes/

Change proposals and implementation tracking.

| Change | Type | Status | Reference |
|--------|------|--------|-----------|
| **001-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/001-proposal/proposal.md)<br>[Design](devspec/changes/001-proposal/design.md) |
| **002-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/002-proposal/proposal.md) |
| **003-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/003-proposal/proposal.md)<br>[API Design](devspec/changes/003-proposal/api-design.md) |
| **004-proposal** | Feature | ✅ Completed | [View Change](devspec/changes/004-proposal/proposal.md)<br>[Design](devspec/changes/004-proposal/design.md) |
| **005-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/005-proposal/proposal.md)<br>[Design](devspec/changes/005-proposal/design.md) |
| **006-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/006-proposal/proposal.md) |
| **007-proposal** | Feature | 🚀 In Progress | [View Change](devspec/changes/007-proposal/proposal.md)<br>[API Design](devspec/changes/007-proposal/api-design.md) |

## 📚 Documentation

- *No additional documentation found*
- *Create documentation directories (guides/, api/, tutorials/, reference/) to organize your docs*
- *Documentation will be automatically indexed here when added*
