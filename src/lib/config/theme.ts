import { theme } from 'antd';

// 扁平化医疗风格主题配置
export const medicalTheme = {
  token: {
    // 颜色系统
    colorPrimary: '#1890ff', // 品牌蓝
    colorSuccess: '#52c41a', // 成功绿
    colorWarning: '#faad14', // 警告橙
    colorError: '#f5222d',   // 错误红
    colorInfo: '#1890ff',    // 信息蓝
    colorTextBase: '#262626', // 主文字色
    colorBgBase: '#ffffff',  // 主背景色

    // 字体
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif`,

    // 边框和圆角
    borderRadius: 2,         // 矩形按钮
    borderRadiusSM: 2,
    borderRadiusLG: 2,

    // 组件高度
    controlHeight: 32,       // 小号按钮高度
    controlHeightSM: 24,
    controlHeightLG: 40,

    // 间距
    padding: 16,
    paddingSM: 8,
    paddingLG: 24,
    margin: 16,
    marginSM: 8,
    marginLG: 24,

    // 表格
    tableRowHoverBg: '#fafafa',
    tableSelectedRowBg: '#e6f7ff',
  },

  components: {
    // 表格组件
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#fafafa',
      rowSelectedBg: '#e6f7ff',
      rowHeight: 32,        // 高密度表格
      fontSize: 13,
      headerColor: '#262626',
      headerSortActiveBg: '#f0f0f0',
      headerSortHoverBg: '#f5f5f5',
    },

    // 标签组件
    Tag: {
      borderRadius: 0,      // 方形标签
      paddingInline: 4,
      fontSize: 12,
      lineHeight: 20,
    },

    // 按钮组件
    Button: {
      borderRadius: 2,      // 矩形按钮
      controlHeight: 32,
      controlHeightSM: 24,
      controlHeightLG: 40,
      fontSize: 14,
      fontWeight: 400,
    },

    // 卡片组件
    Card: {
      borderRadius: 2,
      headerFontSize: 16,
      paddingLG: 16,
    },

    // 输入框组件
    Input: {
      borderRadius: 2,
      controlHeight: 32,
      fontSize: 14,
    },

    // 选择器组件
    Select: {
      borderRadius: 2,
      controlHeight: 32,
      fontSize: 14,
    },

    // 菜单组件
    Menu: {
      itemBorderRadius: 2,
      itemMarginInline: 4,
      itemMarginBlock: 2,
    },

    // 列表组件
    List: {
      itemPadding: '4px 8px',
      headerPadding: '4px 8px',
      footerPadding: '4px 8px',
    },

    // 进度条组件
    Progress: {
      borderRadius: 2,
      defaultColor: '#1890ff',
    },

    // 徽章组件
    Badge: {
      fontSize: 12,
    },
  },
};
