# 规则配置引擎导航菜单说明

## 概述
规则配置引擎已完全集成到主导航系统中，用户可以通过左侧菜单访问所有规则功能。

## 导航菜单位置
在主界面左侧导航栏中，**规则配置**菜单位于客户档案和任务中心之间。

## 菜单结构

### 主菜单：规则配置 📄
- **图标**：FileTextOutlined
- **权限要求**：需要 `rules:manage` 权限
- **可见角色**：
  - 运营经理 (manager)
  - 管理层 (executive)

### 子菜单项

#### 1. 规则列表
- **路径**：`/rules`
- **功能**：
  - 查看所有规则
  - 创建新规则
  - 编辑/删除规则
  - 筛选和搜索

#### 2. 规则模板
- **路径**：`/rules/templates`
- **功能**：
  - 查看预定义模板
  - 基于模板创建规则
  - 管理模板库

#### 3. 执行统计
- **路径**：`/rules/statistics`
- **功能**：
  - 查看规则执行统计
  - 分析性能指标
  - 查看执行日志

## 权限说明

### 新增权限：rules:manage
- **权限ID**：16
- **权限名称**：规则管理
- **权限代码**：`rules:manage`
- **描述**：管理规则配置系统

### 角色权限分配

| 角色 | 规则相关权限 |
|------|-------------|
| 视光医助 (medical_assistant) | 无 |
| 验光师 (optometrist) | 无 |
| **运营经理 (manager)** | `rule:view`, `rule:edit`, **`rules:manage`** |
| **管理层 (executive)** | `rule:view`, **`rules:manage`** |
| 框架镜销售 (sales) | 无 |

## 页面访问流程

1. **登录系统**
   - 使用 manager 或 executive 角色登录
   - 默认密码：123456

2. **访问规则配置**
   - 点击左侧菜单「规则配置」
   - 选择子菜单项

3. **功能页面**
   - 规则列表 → 规则详情 → 历史/审批/模拟
   - 规则模板 → 选择模板 → 创建规则
   - 执行统计 → 查看数据 → 分析性能

## 技术实现

### 统一布局
所有规则页面均使用统一的 `MainLayout` 组件，提供一致的用户界面：
- 左侧导航菜单
- 顶部操作栏
- 统一的页面结构

### 文件修改

#### 1. 导航菜单 (`src/components/layout/MainLayout.tsx`)
- ✅ 添加规则配置菜单项
- ✅ 导入 FileTextOutlined 图标
- ✅ 配置子菜单项

#### 2. 权限系统 (`src/lib/mock/users.ts`)
- ✅ 添加 `rules:manage` 权限定义
- ✅ 为 manager 和 executive 角色分配权限

#### 3. 页面布局
所有规则页面均已集成 MainLayout：
- ✅ `src/app/rules/page.tsx` - 规则列表
- ✅ `src/app/rules/templates/page.tsx` - 规则模板
- ✅ `src/app/rules/statistics/page.tsx` - 执行统计
- ✅ `src/app/rules/new/page.tsx` - 新建规则

#### 4. 子页面（通过路由访问）
以下页面从规则详情页访问，已包含完整导航：
- ✅ `src/app/rules/[id]/page.tsx` - 规则详情
- ✅ `src/app/rules/[id]/history/page.tsx` - 版本历史
- ✅ `src/app/rules/[id]/approve/page.tsx` - 审批流程
- ✅ `src/app/rules/[id]/simulate/page.tsx` - 模拟测试

### API 路由
所有规则相关的 API 路由已就绪：
- `/api/rules` - 规则列表 CRUD
- `/api/routes/{id}/history` - 版本历史
- `/api/routes/{id}/approve` - 审批流程
- `/api/routes/{id}/rollback` - 版本回滚

### 页面组件
已实现的页面组件：
- `src/app/rules/page.tsx` - 规则列表
- `src/app/rules/[id]/page.tsx` - 规则详情
- `src/app/rules/[id]/history/page.tsx` - 版本历史
- `src/app/rules/[id]/approve/page.tsx` - 审批流程
- `src/app/rules/statistics/page.tsx` - 执行统计
- `src/app/rules/templates/page.tsx` - 规则模板

## 使用示例

### 演示账户
```
用户名: manager (或 wangmanager)
密码: 123456
角色: 运营经理
```

### 演示流程
1. 登录 manager 账户
2. 点击「规则配置」→「规则列表」
3. 查看规则详情（点击任意规则）
4. 查看「历史」标签页
5. 查看「审批」标签页
6. 返回列表，点击「执行统计」

## 注意事项
- 只有具有 `rules:manage` 权限的用户才能看到规则配置菜单
- 规则历史、审批、统计页面需要从规则详情页访问
- 所有功能基于 Mock 数据，无需真实后端
- 所有页面均使用统一的 MainLayout，提供一致的导航体验

---
**更新时间**：2025-12-10
**状态**：✅ 完整集成、统一布局、TypeScript检查通过
