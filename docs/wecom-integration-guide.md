# 企业微信集成界面使用指南

## 概述

企业微信集成界面实现了"聊办一体"的高效工作体验，通过侧边栏集成、AI话术生成和多渠道触达等功能，帮助医助减少系统切换，提升工作效率。

## 功能特性

### 1. 企业微信侧边栏
- **客户档案概览**：展示精简版客户信息、核心临床数据、产品类型和客户标签
- **待办任务列表**：显示该客户相关的所有任务，支持任务优先级、截止时间展示和一键完成
- **快捷操作**：查看完整客户档案、生成个性化话术、发起企业微信聊天等

### 2. AI话术助手
- **智能话术生成**：基于客户检查数据和任务类型自动生成个性化话术
- **多种话术模板**：支持换片提醒、复查邀约、流失召回等多种场景
- **话术编辑**：支持在线编辑话术内容、变量插入和模板保存

### 3. 多渠道触达
- **企业微信消息**：一键发送话术给客户，支持图文消息和已读状态跟踪
- **短信发送（Mock）**：话术转换为短信格式，支持批量发送
- **AI外呼（Mock）**：自动拨打电话，播放预设话术

### 4. 聊天记录集成
- **会话存档**：企业微信聊天记录归档（Mock），自动提取关键信息
- **智能总结**：AI自动提取客户意向等级、记录未到院原因、标记客户关注点
- **记录回填**：自动回填至HCRM系统，更新客户标签，生成跟进任务

## 快速开始

### 1. 访问功能

在浏览器中打开以下路径：
```
http://localhost:3000/wecom/sidebar/C001
```

### 2. 演示流程

1. **打开侧边栏**：页面加载后，点击"打开企业微信侧边栏"按钮
2. **查看客户信息**：在侧边栏中查看客户基本信息和检查数据
3. **查看待办任务**：浏览客户相关的待办任务列表
4. **生成AI话术**：
   - 点击任务行的"话术"按钮
   - 系统自动生成个性化话术
   - 可以编辑话术内容
   - 点击"发送"按钮发送消息
5. **完成任务**：点击任务的"完成"按钮标记任务完成

### 3. API测试

可以使用以下API端点进行测试：

#### 获取侧边栏数据
```bash
curl http://localhost:3000/api/wecom/sidebar/C001
```

#### 生成AI话术
```bash
curl -X POST http://localhost:3000/api/wecom/script/generate \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "C001",
    "taskType": "follow_up"
  }'
```

#### 发送消息
```bash
curl -X POST http://localhost:3000/api/wecom/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "C001",
    "content": "测试消息",
    "channel": "wecom"
  }'
```

## 技术实现

### 前端架构

```
src/components/wecom/
├── WeComSidebar.tsx          # 侧边栏主组件
└── WeComSidebar.module.css   # 样式文件
```

### 后端API

```
src/app/api/wecom/
├── sidebar/[customerId]/     # 侧边栏数据
├── script/
│   ├── generate/             # AI话术生成
│   └── templates/            # 话术模板管理
├── message/
│   └── send/                 # 消息发送
├── chat/
│   ├── [customerId]/         # 聊天记录
│   └── summary/              # 智能总结
├── notification/
│   ├── send/                 # 发送通知
│   └── list/                 # 通知列表
└── task/
    ├── complete/             # 完成任务
    └── remark/               # 添加备注
```

### 数据库设计

详见：`database/migrations/008_wecom_integration.sql`

主要表结构：
- `script_templates`：话术模板表
- `chat_records`：聊天记录表
- `chat_summaries`：聊天智能总结表
- `message_logs`：消息发送日志表
- `notifications`：通知表
- `sidebar_access_logs`：侧边栏访问日志表

## 话术模板

### 默认模板

系统预置了以下话术模板：

1. **复查邀约**
   - 模板ID：`TPL_FOLLOW_UP_001`
   - 变量：parentName, patientName, daysSinceLastCheck, refractionChange, availableDates

2. **换片提醒**
   - 模板ID：`TPL_LENS_001`
   - 变量：patientName, duration

3. **流失召回**
   - 模板ID：`TPL_RECALL_001`
   - 变量：parentName, patientName

4. **升单推荐**
   - 模板ID：`TPL_UPGRADE_001`
   - 变量：parentName, patientName

5. **新客户关怀**
   - 模板ID：`TPL_CARE_001`
   - 变量：parentName, patientName

### 自定义模板

可以通过API创建自定义话术模板：

```bash
curl -X POST http://localhost:3000/api/wecom/script/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "自定义模板",
    "category": "自定义分类",
    "content": "您好{parentName}，{patientName}的情况...",
    "variables": ["parentName", "patientName"],
    "isPublic": false
  }'
```

## Mock数据说明

### 当前Mock实现

- **企业微信API**：完全Mock，模拟真实API响应
- **短信发送**：完全Mock，不实际发送短信
- **AI外呼**：完全Mock，不实际拨打电话
- **聊天记录**：使用预设数据展示效果

### 真实API接入

后续接入真实API需要：

1. **企业微信开发者权限**
   - 申请企业微信开发者账号
   - 获取 corpId、agentId 等参数
   - 配置可信域名和JS-SDK

2. **短信服务**
   - 集成阿里云短信服务或腾讯云短信服务
   - 配置AccessKey和短信模板

3. **AI外呼服务**
   - 集成科大讯飞或百度AI外呼服务
   - 配置语音合成和语音识别

## 移动端适配

侧边栏采用响应式设计，支持移动端访问：

- **宽度适配**：移动端自动调整为全屏宽度
- **触摸优化**：所有可点击元素最小尺寸44px
- **性能优化**：数据懒加载、图片压缩、离线缓存

## 性能优化

### 前端优化
- 使用React Query进行数据缓存
- 组件懒加载
- 图片懒加载和压缩
- 骨架屏提升感知性能

### 后端优化
- Redis缓存热点数据
- 数据库索引优化
- 分页查询减少数据传输
- 异步任务处理

### 监控指标
- API响应时间 < 500ms
- 侧边栏首屏加载 < 1秒
- 缓存命中率 > 80%
- 并发用户数 > 100

## 安全考虑

### 数据安全
- 所有API需要认证
- 敏感数据加密存储
- 聊天记录访问审计
- XSS和SQL注入防护

### 隐私保护
- 手机号脱敏显示（138****8888）
- 定期数据清理
- 用户操作日志记录
- 权限控制

## 常见问题

### Q: 如何添加新的话术模板？
A: 通过POST `/api/wecom/script/templates`接口创建，或在数据库中直接插入数据。

### Q: 侧边栏加载慢怎么办？
A: 检查网络连接，查看API响应时间。可以通过Redis缓存优化。

### Q: 如何修改Mock数据？
A: 在对应的API路由文件中修改Mock数据，如 `src/app/api/wecom/sidebar/[customerId]/route.ts`。

### Q: 企业微信API如何接入？
A: 需要申请企业微信开发者权限，然后替换Mock实现为真实API调用。

### Q: 支持哪些浏览器？
A: 支持Chrome 80+、Safari 13+、Firefox 75+、Edge 80+。

## 版本历史

### v1.0 (2024-12-10)
- 初始版本发布
- 实现侧边栏展示
- 实现AI话术生成
- 实现多渠道消息发送
- 实现聊天记录管理
- 实现智能总结
- 实现通知推送

## 技术支持

如有技术问题，请联系：
- 开发团队：dev-team@company.com
- 产品团队：product@company.com

## 相关文档

- [API设计文档](../devspec/changes/008-proposal/api-design.md)
- [数据库设计文档](../devspec/changes/008-proposal/database-design.md)
- [系统设计文档](../devspec/changes/008-proposal/design.md)
- [项目README](../README.md)
