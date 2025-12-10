# HCRM 客户档案管理系统架构文档

## 项目概述

**项目名称：** HCRM 客户长期价值管理系统 - 前端应用

**版本：** 1.0.0

**技术栈：**
- **框架：** Next.js 14.2.33
- **语言：** TypeScript 5.x
- **状态管理：** Zustand 4.4.7
- **UI 组件库：** Ant Design 5.11.0
- **图表库：** @ant-design/charts 2.6.6
- **构建工具：** Webpack / Next.js 内置
- **包管理器：** npm 9.x

## 目录结构

```
hcrm-client-management/
├── public/                      # 静态资源
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API 路由
│   │   │   ├── commissions/     # 佣金管理 API
│   │   │   ├── dashboard/       # 仪表盘 API
│   │   │   ├── mock-data.ts     # Mock 数据
│   │   │   ├── referrals/       # 转诊 API
│   │   │   ├── routes/          # 规则管理 API
│   │   │   ├── rules/           # 规则配置 API
│   │   │   └── wecom/           # 企微 API
│   │   ├── customers/           # 客户管理页面
│   │   │   ├── [id]/            # 客户详情页
│   │   │   └── page.tsx         # 客户列表页
│   │   ├── dashboard/           # 仪表盘页面
│   │   ├── lead-pool/           # 线索池页面
│   │   ├── rules/               # 规则管理页面
│   │   │   ├── new/             # 新建规则页
│   │   │   └── page.tsx         # 规则列表页
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   ├── components/              # React 组件
│   │   ├── charts/              # 图表组件
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   ├── ScatterChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── DrillDownChart.tsx
│   │   │   ├── LazyChart.tsx
│   │   │   ├── MemoizedChart.tsx
│   │   │   └── MultiDimensionFilter.tsx
│   │   ├── common/              # 通用组件
│   │   │   ├── Authorized.tsx   # 权限控制组件
│   │   │   ├── KPICard.tsx      # KPI 卡片
│   │   │   ├── RankingTable.tsx # 排名表格
│   │   │   ├── StatusTag.tsx    # 状态标签
│   │   │   └── ...
│   │   ├── dashboard/           # 仪表盘组件
│   │   │   ├── OverviewDashboard.tsx
│   │   │   ├── PersonalDashboard.tsx
│   │   │   ├── QualityDashboard.tsx
│   │   │   ├── RealtimeDashboard.tsx
│   │   │   ├── AlertCenter.tsx
│   │   │   ├── GaugeCard.tsx
│   │   │   └── AlertItem.tsx
│   │   ├── layout/              # 布局组件
│   │   │   └── MainLayout.tsx
│   │   ├── referral/            # 转诊组件
│   │   │   └── ReferralButton.tsx
│   │   └── wecom/               # 企微组件
│   │       └── WeComSidebar.tsx
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useAutoRefresh.ts    # 自动刷新 Hook
│   │   ├── useChartDataCache.ts # 图表数据缓存 Hook
│   │   └── useWebSocket.ts      # WebSocket Hook
│   ├── lib/                     # 工具库
│   │   ├── mock/                # Mock 数据
│   │   │   ├── customers.ts     # 客户模拟数据
│   │   │   └── users.ts         # 用户模拟数据
│   │   └── types/               # 类型定义
│   │       ├── customer.ts      # 客户类型
│   │       ├── user.ts          # 用户类型
│   │       ├── dashboard.ts     # 仪表盘类型
│   │       └── referral.ts      # 转诊类型
│   ├── services/                # 服务层
│   │   └── api/                 # API 服务
│   │       └── dashboard.ts     # 仪表盘 API 服务
│   ├── stores/                  # Zustand 状态管理
│   │   ├── customerStore.ts     # 客户状态
│   │   └── userStore.ts         # 用户状态
│   └── utils/                   # 工具函数
│       └── export.ts            # 导出工具
├── docs/                        # 文档
│   ├── ARCHITECTURE.md          # 架构文档
│   └── testing-guide.md         # 测试指南
├── devspec/                     # 开发规范
│   └── changes/                 # 变更记录
│       └── 003-proposal/        # 第三个变更提案
│           └── tasks.md         # 任务清单
├── .eslintrc.json               # ESLint 配置
├── .gitignore                   # Git 忽略文件
├── next.config.js               # Next.js 配置
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript 配置
└── README.md                    # 项目说明
```

## 核心模块

### 1. 客户管理模块

**路径：** `src/app/customers/`

**功能：**
- 客户列表展示与搜索
- 客户详情查看
- 权限控制（基于用户角色）
- 筛选与排序功能

**关键组件：**
- `page.tsx` - 客户列表页面
- `[id]/page.tsx` - 客户详情页面

**状态管理：**
- `src/stores/customerStore.ts` - 客户状态管理
  - 分页状态
  - 筛选状态
  - 排序状态
  - 选中客户状态

### 2. 图表可视化模块

**路径：** `src/components/charts/`

**功能：**
- 多种图表类型支持
- 懒加载优化
- 数据缓存机制
- 响应式设计

**图表类型：**
- 折线图（LineChart）
- 柱状图（BarChart）
- 饼图（PieChart）
- 面积图（AreaChart）
- 散点图（ScatterChart）
- 雷达图（RadarChart）
- 下钻图表（DrillDownChart）

**缓存系统：**
- `src/hooks/useChartDataCache.ts` - 图表数据缓存 Hook
  - 支持 TTL（生存时间）
  - 自动清理过期缓存
  - 并发请求防重复
  - 预加载功能

### 3. 权限控制系统

**路径：** `src/components/common/Authorized.tsx`

**功能：**
- 基于角色的权限控制
- 页面级权限验证
- 组件级权限控制

**用户角色：**
- `medical_assistant` - 视光医助/客服
- `optometrist` - 验光师/验配师
- `manager` - 视光运营经理
- `executive` - 管理层
- `sales` - 框架镜销售

**权限规则：**
- 管理层和执行层：可查看所有客户
- 普通员工：只能查看自己负责的客户

### 4. 仪表盘模块

**路径：** `src/components/dashboard/`

**仪表盘类型：**
- `OverviewDashboard` - 管理驾驶舱
- `PersonalDashboard` - 个人看板
- `QualityDashboard` - 质控看板
- `RealtimeDashboard` - 实时看板

**核心功能：**
- KPI 指标展示
- 趋势分析
- 排名统计
- 异常预警
- 数据导出

### 5. API 层

**路径：** `src/app/api/`

**API 模块：**
- `dashboard/` - 仪表盘数据 API
- `rules/` - 规则管理 API
- `referrals/` - 转诊 API
- `commissions/` - 佣金 API
- `wecom/` - 企微 API

**数据管理：**
- `src/app/api/mock-data.ts` - Mock 数据定义
- `src/lib/mock/` - 模拟数据生成器

## 数据流架构

### 状态管理

使用 Zustand 进行状态管理，数据流如下：

```
用户操作 -> Component -> Store Action -> State 更新 -> Component 渲染
                     |
                     v
               API 调用 -> Mock 数据 -> State 更新
```

### 权限验证流程

```
用户访问页面 -> 检查登录状态 -> 检查角色权限 -> 渲染/拒绝访问
```

### 图表数据流

```
组件加载 -> 检查缓存 -> 缓存命中？-> 是 -> 直接使用
                      |
                      v
                    否 -> 调用数据生成器 -> 存储缓存 -> 渲染
```

## 技术特性

### 1. 性能优化

- **图表懒加载：** 使用 React.lazy 和 Suspense
- **数据缓存：** 自定义缓存 Hook，减少重复计算
- **分页加载：** 减少单次渲染数据量
- **组件 memo：** 避免不必要的重渲染

### 2. 类型安全

- **TypeScript：** 全项目使用 TypeScript
- **类型定义：** 集中在 `src/lib/types/`
- **严格模式：** 启用严格类型检查

### 3. 代码质量

- **ESLint：** 代码规范检查
- **Prettier：** 代码格式化
- **Husky：** Git 钩子，确保提交质量

### 4. 响应式设计

- **Ant Design Grid：** 响应式栅格系统
- **断点支持：** xs/sm/md/lg/xl 五级断点
- **移动端适配：** 支持手机和平板设备

## 部署架构

### 开发环境

- **开发服务器：** Next.js Dev Server
- **端口：** 3000-3002（自动检测可用端口）
- **热更新：** 支持代码热重载

### 生产环境

- **构建命令：** `npm run build`
- **静态导出：** `npm run export`
- **部署平台：** 可部署到 Vercel、Netlify 等

## 依赖关系

### 核心依赖

```json
{
  "next": "^14.0.0",           // React 框架
  "react": "^18.2.0",          // UI 库
  "antd": "^5.11.0",           // UI 组件库
  "@ant-design/charts": "^2.6.6", // 图表库
  "zustand": "^4.4.7",         // 状态管理
  "axios": "^1.6.0",           // HTTP 客户端
  "dayjs": "^1.11.10",         // 日期处理
  "lodash": "^4.17.21",        // 工具库
  "mockjs": "^1.1.0"           // Mock 数据
}
```

### 开发依赖

```json
{
  "typescript": "^5.0.0",              // 类型检查
  "@types/node": "^20.0.0",            // Node.js 类型
  "@types/react": "^18.2.0",           // React 类型
  "@types/lodash": "^4.14.202",        // Lodash 类型
  "eslint": "^8.0.0",                  // 代码规范
  "@typescript-eslint/eslint-plugin": "^6.0.0", // TypeScript ESLint
  "prettier": "^3.0.0"                 // 代码格式化
}
```

## 扩展性设计

### 1. 组件扩展

- **组合式设计：** 组件可复用，易于组合
- **插件化架构：** 图表组件支持插件扩展
- **自定义 Hook：** 业务逻辑可提取为自定义 Hook

### 2. 功能扩展

- **模块化设计：** 功能模块相互独立
- **API 抽象层：** 易于替换为真实 API
- **状态管理扩展：** Zustand 支持中间件

### 3. 数据扩展

- **类型安全：** TypeScript 确保数据结构一致性
- **Mock 数据生成器：** 易于生成测试数据
- **数据缓存机制：** 支持分布式缓存扩展

## 最佳实践

### 1. 代码组织

- **按功能划分：** 按业务功能组织文件和目录
- **单一职责：** 每个文件职责单一
- **命名规范：** 使用清晰的命名约定

### 2. 性能优化

- **懒加载：** 大型组件使用懒加载
- **缓存策略：** 合理使用缓存减少重复计算
- **防抖节流：** 用户输入使用防抖节流

### 3. 错误处理

- **错误边界：** 使用 React Error Boundary
- **类型守卫：** TypeScript 类型守卫确保安全
- **异常捕获：** API 调用异常处理

### 4. 测试策略

- **单元测试：** Jest + Testing Library
- **E2E 测试：** Playwright 或 Cypress
- **类型测试：** 通过 TypeScript 确保类型安全

## 监控与维护

### 1. 性能监控

- **Web Vitals：** 监控核心性能指标
- **Bundle 分析：** 使用 webpack-bundle-analyzer
- **内存监控：** 监控内存使用情况

### 2. 日志管理

- **控制台日志：** 开发环境调试
- **错误上报：** 生产环境错误收集
- **性能日志：** 关键操作性能记录

### 3. 版本管理

- **语义化版本：** 遵循 semver 规范
- **变更日志：** 详细记录每次变更
- **Git 规范：** 使用 Conventional Commits

## 未来规划

### 1. 技术升级

- **Next.js 15：** 跟随框架升级
- **React 19：** 使用最新 React 特性
- **新图表库：** 考虑替换为更强大的图表库

### 2. 功能增强

- **国际化：** 添加 i18n 多语言支持
- **主题切换：** 支持亮色/暗色主题
- **PWA：** 支持离线访问

### 3. 性能提升

- **SSR/SSG：** 优化首屏加载速度
- **CDN 加速：** 静态资源 CDN 部署
- **缓存优化：** 更智能的缓存策略

### 4. 生态扩展

- **微前端：** 考虑微前端架构
- **插件系统：** 支持插件扩展
- **开放平台：** 提供开放 API

## 总结

HCRM 客户档案管理系统采用现代化的技术栈和架构设计，具备以下特点：

1. **技术先进：** 使用 Next.js 14、TypeScript、Zustand 等现代化技术
2. **架构清晰：** 模块化设计，职责分离，易于维护和扩展
3. **性能优异：** 多项性能优化措施，保证用户体验
4. **类型安全：** 全链路类型检查，减少运行时错误
5. **可扩展性强：** 良好的架构设计支持功能扩展

该系统为 HCRM 业务提供了完整的前端解决方案，支持客户管理、数据可视化、权限控制等核心功能，为企业数字化转型提供了有力支撑。
