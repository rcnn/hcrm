# HCRM前端UI设计规范

## 概述
基于Ant Design 5.x设计系统，为HCRM客户长期价值管理模块制定的UI设计规范。

## 设计原则
1. **简洁清晰** - 信息层级分明，视觉焦点突出
2. **一致性** - 统一的视觉语言和交互模式
3. **易用性** - 符合用户习惯，操作直观
4. **响应式** - 适配PC端和移动端

## 颜色系统

### 主色调
- **品牌蓝（Primary）**: `#1890ff`
  - 用于顶部导航栏、活动标签、关键按钮
  - 医疗系统中象征信任、专业和稳定
  - 代表：角塑、正向操作、主要交互

### 背景色
- **主背景**: `#ffffff` (纯白色)
  - 提供清晰阅读背景，减轻视觉疲劳
- **次要背景**: `#fafafa` (极浅灰色)
  - 用于分割区域、非活跃状态

### 状态色/强调色
- **成功绿（Success）**: `#52c41a`
  - 已确认、已完成、正在进行
  - 代表：已完成任务、成交客户、复查到院、绿色方块标签

- **警告橙（Warning）**: `#faad14`
  - 警告、待处理、需要关注
  - 代表：潜在客户、超时预警、次要状态

- **错误红（Error）**: `#f5222d`
  - 警告、停止、异常状态
  - 代表：已超时任务、流失客户、异常数据、"停止"按钮

- **中性灰（Gray）**: `#8c8c8c`
  - 非活动状态、分割线、禁用状态
  - 用于：次要文字、边框线、禁用按钮

### 文字色
- **主文字色**: `#262626` (深灰黑)
- **次要文字色**: `#595959` (中灰)
- **辅助文字色**: `#8c8c8c` (浅灰)

### 客户分类标签色
- **潜在客户**: `#fa8c16` (橙色) + 小色块标签
- **成交客户**: `#52c41a` (绿色) + 小色块标签
- **升单潜力**: `#1890ff` (蓝色) + 小色块标签
- **转科潜力**: `#722ed1` (紫色) + 小色块标签
- **流失预警**: `#f5222d` (红色) + 小色块标签

## 字体系统

### 字号层级
- **页面标题**: 18px / 1.5 / 600 (顶部导航标题)
- **区域标题**: 16px / 1.5 / 500 (卡片标题、模块标题)
- **正文**: 14px / 1.5 / 400 (主要文本内容)
- **表格文字**: 13px / 1.5 / 400 (表格数据)
- **辅助文字**: 12px / 1.5 / 400 (标签、说明文字)
- **小字**: 11px / 1.4 / 400 (状态标签、徽章)

### 字体族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
```

### 字体族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

## 间距系统

### 基础间距单位
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **xxl**: 32px

### 常用间距（信息密集型布局）
- **表格单元格内边距**: 8px (水平) × 4px (垂直)
- **卡片内边距**: 16px
- **表格行间距**: 0px (紧凑排列)
- **组件外边距**: 8px / 12px
- **区块间距**: 16px / 24px
- **页面边距**: 24px

## 边框与圆角

### 边框
- **边框宽度**: 1px
- **边框颜色**: `#d9d9d9`
- **分割线**: `#f0f0f0`
- **表格边框**: 1px solid #f0f0f0

### 圆角（扁平化设计）
- **按钮圆角**: 2px (矩形按钮)
- **卡片圆角**: 2px
- **输入框圆角**: 2px
- **Tag圆角**: 2px
- **标签圆角**: 0px (方形小色块)

## 阴影系统（扁平化，极少使用）

### 极轻微阴影
```css
/* 仅在悬浮状态使用 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
```

### 弹窗阴影
```css
/* 仅在Modal、Drawer等弹出层使用 */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```

### 卡片和按钮
- **默认状态**: 无阴影（扁平化）
- **悬浮状态**: 极轻微阴影
- **活跃状态**: 无阴影，通过颜色变化反馈

## 组件规范

### 按钮（Button - 矩形扁平化）
```tsx
// 主要按钮 - 蓝色填充（核心操作）
<Button type="primary" size="small" icon={<PlusOutlined />}>
  新建客户
</Button>

// 次要按钮 - 蓝色描边
<Button size="small" icon={<SearchOutlined />}>
  搜索
</Button>

// 危险按钮 - 红色
<Button danger size="small" icon={<DeleteOutlined />}>
  删除
</Button>

// 文本按钮 - 无边框
<Button type="link" size="small">
  高级操作
</Button>

// 图标按钮 - 纯图标
<Button size="small" icon={<SettingOutlined />} />
```

**按钮规范：**
- 尺寸：主要使用 `size="small"` (32px高)
- 圆角：2px（矩形）
- 主要操作：蓝色填充 `#1890ff`
- 次要操作：蓝色描边
- 危险操作：红色 `#f5222d`
- 文字链接：蓝色无边框

### 标签（Tag - 小色块标签）
```tsx
// 客户分类标签（方形小色块）
<Tag color="#fa8c16" style={{ borderRadius: 0, padding: '0 4px' }}>
  潜在
</Tag>
<Tag color="#52c41a" style={{ borderRadius: 0, padding: '0 4px' }}>
  成交
</Tag>
<Tag color="#1890ff" style={{ borderRadius: 0, padding: '0 4px' }}>
  升单
</Tag>
<Tag color="#722ed1" style={{ borderRadius: 0, padding: '0 4px' }}>
  转科
</Tag>
<Tag color="#f5222d" style={{ borderRadius: 0, padding: '0 4px' }}>
  流失
</Tag>

// 状态指示（Badge）
<Badge status="processing" text="进行中" />
<Badge status="success" text="已完成" />
<Badge status="error" text="已超时" />
<Badge status="warning" text="待处理" />
```

**标签规范：**
- 形状：方形（borderRadius: 0）
- 高度：20px
- 颜色：使用状态色系统
- 用于：客户分类、状态标记、关键属性标识

### 卡片（Card - 扁平化）
```tsx
<Card
  title="客户列表"
  extra={<a href="#">更多</a>}
  bordered={false}
  style={{ borderRadius: 2 }}
  headStyle={{ borderBottom: '1px solid #f0f0f0' }}
>
  {/* 内容 */}
</Card>
```

**卡片规范：**
- 背景：白色 `#ffffff`
- 边框：1px solid #f0f0f0（可选）
- 圆角：2px
- 阴影：无（扁平化）
- 分割：使用细线分隔头部和内容

### 表格（Table - 高密度信息展示）
```tsx
<Table
  size="small" // 关键：使用小尺寸表格
  rowKey="id"
  columns={[
    {
      title: '客户姓名',
      dataIndex: 'name',
      width: 100,
      ellipsis: true, // 超长文本省略
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 60,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} style={{ borderRadius: 0, padding: '0 4px' }}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]}
  dataSource={dataSource}
  pagination={{
    pageSize: 50, // 每页更多数据
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  }}
  rowSelection={{
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  }}
  // 斑马纹效果
  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
/>
```

**表格规范（信息密集型）：**
- 尺寸：始终使用 `size="small"`
- 行高：32px（紧凑）
- 字体：13px
- 斑马纹：浅色背景交替 (#fafafa 和 #ffffff)
- 列宽：合理分配，避免水平滚动
- 省略：长文本使用 ellipsis
- 分页：每页50条数据，快速跳转
- 边框：1px solid #f0f0f0

### 统计数字（Statistic）
```tsx
<Statistic
  title="换片提醒"
  value={lensReplacementTasks}
  prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
  suffix="个"
  precision={0}
  valueStyle={{ color: '#1890ff', fontSize: 18, fontWeight: 500 }}
/>
```

**统计数字规范：**
- 标题：12px，次要文字色
- 数值：18px，主文字色
- 图标：14px，状态色
- 对齐：左对齐（信息密集型）

### 进度条（Progress）
```tsx
// 线性进度条（紧凑型）
<Progress
  percent={70}
  strokeColor="#1890ff"
  size="small"
  showInfo={false} // 仅在空间受限时隐藏数值
/>

// 环形进度条
<Progress
  type="circle"
  percent={75}
  size={80}
  format={(percent) => `${percent}%`}
  strokeColor={{
    '0%': '#108ee9',
    '100%': '#52c41a',
  }}
/>

// 状态进度条
<Progress
  percent={90}
  status="success"
  strokeColor="#52c41a"
  size="small"
/>
```

**进度条规范：**
- 线性：高度4px，使用 `size="small"`
- 环形：直径80-100px
- 颜色：根据状态使用状态色
- 反馈：整行变色表示状态（如绿色表示已处理）

## 布局规范

### 页面布局（经典三段式）
```
┌─────────────────────────────────────┐
│ 顶部导航栏 (56px)                     │
│ 蓝色背景 #1890ff                      │
├──────────────┬──────────────────────┤
│              │                      │
│  左侧侧边栏   │     主体内容区        │
│   (240px)    │                      │
│              │   表格为主           │
│   列表选择   │   信息密集展示        │
│              │                      │
│              │                      │
└──────────────┴──────────────────────┘
```

**布局规范：**
- 顶部导航栏：56px高，蓝色背景 `#1890ff`
- 左侧侧边栏：240px宽，白色背景
- 主体内容区：剩余空间，白色背景
- 页面边距：24px
- 模块间距：16px

### 卡片网格（紧凑布局）
```tsx
<Row gutter={[12, 12]}>
  <Col span={6}>
    <Card size="small">统计卡片</Card>
  </Col>
  <Col span={6}>
    <Card size="small">统计卡片</Card>
  </Col>
</Row>
```

### 内容区域
- **页面标题**: 18px, 16px下边距
- **卡片标题**: 16px, 12px下边距
- **内容区内边距**: 12px (紧凑)
- **模块间距**: 12px / 16px
- **表格单元格**: 8px × 4px (水平 × 垂直)

## 图标系统

### 使用图标库
```tsx
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
```

### 图标尺寸
- **默认**: 14px
- **小号**: 12px
- **大号**: 16px / 18px

## 交互规范

### 状态反馈（明确、及时）
- **Hover**: 背景色变浅 `#fafafa` (5%加深)
- **Active**: 背景色 `#f0f0f0` (10%加深)
- **Focus**: 蓝色边框 `#1890ff` + 2px
- **Selected**: 蓝色背景 `#e6f7ff`
- **Disabled**: 灰色 `#f5f5f5` + 文字 `#d9d9d9`
- **整行反馈**: 已处理行变绿色背景 `#f6ffed`

### 加载状态（快速反馈）
- **按钮**: 显示 `loading` 状态
- **页面**: 显示Skeleton骨架屏（紧凑型）
- **表格**: 显示 `loading` 蒙层
- **数据**: 使用 `Spin` 组件

### 反馈提示（清晰明确）
- **成功**: Toast + `CheckCircleOutlined` (绿色)
- **错误**: Toast + `CloseCircleOutlined` (红色)
- **警告**: Alert + `ExclamationCircleOutlined` (橙色)
- **信息**: Modal + `InfoCircleOutlined` (蓝色)

### 操作效率（1-2次点击）
- **关键操作**: 1次点击直接执行
- **批量操作**: 支持多选 + 一键执行
- **快速筛选**: 提供快速筛选标签
- **快捷键**: 支持键盘快捷操作

## 响应式设计（适配多端）

### 断点
- **xs**: < 576px (手机竖屏)
- **sm**: ≥ 576px (手机横屏)
- **md**: ≥ 768px (平板)
- **lg**: ≥ 992px (桌面小屏)
- **xl**: ≥ 1200px (桌面大屏)

### 多端适配策略
- **桌面端 (≥992px)**: 完整三段式布局，侧边栏固定展开
- **平板端 (768-991px)**: 左侧菜单可折叠，内容区自适应
- **移动端 (<768px)**:
  - 侧边栏折叠为Drawer
  - 表格自动转为卡片列表
  - 按钮加大至最小44px触摸区域
  - 字体不小于12px

### 企业微信侧边栏（移动端）
- **宽度**: 100%全屏
- **布局**: 垂直排列，紧凑间距
- **操作**: 大按钮，易于触摸
- **数据**: 精简展示，核心信息优先

## 数据可视化规范

### 图表配色（专业医疗风格）
```tsx
const chartColors = [
  '#1890ff', // 主色-蓝
  '#52c41a', // 成功-绿
  '#faad14', // 警告-橙
  '#f5222d', // 错误-红
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#fa8c16', // 橙色
];
```

### 图表规范
- **标题**: 14px, #262626, 500
- **图例**: 12px, #595959, 右上方
- **网格线**: #f0f0f0, 虚线
- **数据点**: 小圆点，突出显示
- **动画**: 简洁流畅，无过度装饰
- **交互**: 支持Tooltip和缩放

### 医疗专业图表
- **趋势图**: Line Chart，蓝色主线
- **对比图**: Column Chart，多色对比
- **占比图**: Pie Chart，分段清晰
- **仪表盘**: Gauge，显示完成率

## 无障碍规范（医疗系统必需）

1. **键盘导航**: 支持Tab键切换所有交互元素
2. **焦点管理**: 清晰的焦点指示器（蓝色边框2px）
3. **语义化**: 正确使用HTML语义标签（table、thead、tbody）
4. **对比度**: 文字对比度≥4.5:1，确保长时间阅读舒适
5. **替代文本**: 图片和图标添加alt/title属性
6. **状态标识**: 通过颜色+文字双重标识状态（色盲友好）

## 主题定制（Less变量）

### 基础变量
```less
@primary-color: #1890ff;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #f5222d;
@font-size-base: 14px;
@font-size-sm: 12px;
@font-size-lg: 16px;
@border-radius-base: 2px;
@border-radius-sm: 2px;
@border-radius-lg: 2px;

// 表格紧凑型
@table-padding-vertical: 4px;
@table-padding-horizontal: 8px;
@table-row-hover-bg: #fafafa;
@table-selected-row-bg: #e6f7ff;

// 按钮
@btn-border-radius-base: 2px;
@btn-border-radius-sm: 2px;

// 间距
@padding-xs: 4px;
@padding-sm: 8px;
@padding-md: 12px;
@padding-lg: 16px;
@padding-xl: 24px;
```

### 深色模式（预留）
- 预留dark主题切换能力
- 颜色变量反向映射
- 图表主题适配
- 医疗专业色彩保持

## 最佳实践（医疗系统）

### 设计原则
1. **准确性优先** - 信息排布逻辑清晰，避免误读
2. **效率至上** - 关键操作在1-2次点击内完成
3. **可读性强** - 配色柔和，文字清晰，长时间工作舒适
4. **扩展性好** - 布局能容纳更多数据列和复杂筛选条件
5. **扁平化设计** - 无阴影、无渐变、干净现代
6. **功能驱动** - 设计服务于功能，而非视觉美观

### 开发建议
1. **表格优先** - 表格是核心组件，优先优化表格性能
2. **信息密度** - 充分利用屏幕空间，单屏展示更多信息
3. **状态反馈** - 明确的视觉反馈，特别是整行变色
4. **快速操作** - 提供批量操作、快捷键等高效操作方式
5. **移动适配** - 企业微信侧边栏单独优化
6. **数据准确性** - 所有数据展示必须准确可靠

### 性能优化
1. **表格虚拟滚动** - 大数据量时使用虚拟滚动
2. **懒加载** - 图片和非关键数据懒加载
3. **缓存策略** - 合理使用React.memo和useMemo
4. **代码分割** - 按路由和功能模块分割代码

## 参考资源
- [Ant Design官方文档](https://ant.design)
- [Ant Design Charts文档](https://charts.ant.design)
- [Ant Design Pro组件](https://procomponents.ant.design)
- [医疗软件UI设计规范](https://www.ant-design.com.cn)