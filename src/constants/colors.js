/**
 * GoAbroad 色彩系统
 * 基于产品设计文档的色彩规范
 */

// 主色调 - 深蓝色系
export const primary = {
  900: '#1E3A8A', // 最深
  800: '#1E40AF',
  700: '#1D4ED8',
  600: '#2563EB', // 标准主色
  500: '#3B82F6',
  400: '#60A5FA',
  300: '#93C5FD',
  200: '#BFDBFE',
  100: '#DBEAFE',
  50: '#EFF6FF',  // 最浅
};

// 辅助色 - 成功色（绿色）
export const success = {
  900: '#14532D',
  800: '#166534',
  700: '#15803D',
  600: '#16A34A',
  500: '#22C55E',
  400: '#4ADE80',
  300: '#86EFAC',
  200: '#BBF7D0',
  100: '#DCFCE7',
  50: '#F0FDF4',
};

// 辅助色 - 警告色（橙色）
export const warning = {
  900: '#7C2D12',
  800: '#9A3412',
  700: '#C2410C',
  600: '#EA580C',
  500: '#F97316',
  400: '#FB923C',
  300: '#FDBA74',
  200: '#FED7AA',
  100: '#FFEDD5',
  50: '#FFF7ED',
};

// 辅助色 - 错误色（红色）
export const error = {
  900: '#7F1D1D',
  800: '#991B1B',
  700: '#B91C1C',
  600: '#DC2626',
  500: '#EF4444',
  400: '#F87171',
  300: '#FCA5A5',
  200: '#FECACA',
  100: '#FEE2E2',
  50: '#FEF2F2',
};

// 辅助色 - 信息色（蓝色）
export const info = {
  900: '#0C4A6E',
  800: '#075985',
  700: '#0369A1',
  600: '#0284C7',
  500: '#0EA5E9',
  400: '#38BDF8',
  300: '#7DD3FC',
  200: '#BAE6FD',
  100: '#E0F2FE',
  50: '#F0F9FF',
};

// 中性色 - 灰度系统
export const gray = {
  900: '#111827', // 最深 - 主要文本
  800: '#1F2937',
  700: '#374151',
  600: '#4B5563', // 次要文本
  500: '#6B7280',
  400: '#9CA3AF', // 辅助文本
  300: '#D1D5DB', // 边框
  200: '#E5E7EB', // 分割线
  100: '#F3F4F6', // 背景
  50: '#F9FAFB',  // 最浅背景
};

// 背景色
export const background = {
  primary: '#FFFFFF',
  secondary: gray[50],
  tertiary: gray[100],
  dark: gray[900],
};

// 文本色
export const text = {
  primary: gray[900],
  secondary: gray[600],
  tertiary: gray[400],
  inverse: '#FFFFFF',
  link: primary[600],
  error: error[600],
  success: success[600],
  warning: warning[600],
};

// 边框色
export const border = {
  light: gray[200],
  default: gray[300],
  dark: gray[400],
  focus: primary[600],
};

// 状态色（用于反馈）
export const status = {
  success: success[600],
  warning: warning[600],
  error: error[600],
  info: info[600],
};

// 特殊用途色
export const special = {
  overlay: 'rgba(0, 0, 0, 0.5)',     // 遮罩层
  backdrop: 'rgba(0, 0, 0, 0.3)',    // 背景遮罩
  shadow: 'rgba(0, 0, 0, 0.1)',      // 阴影
  divider: gray[200],                 // 分割线
  disabled: gray[300],                // 禁用状态
  placeholder: gray[400],             // 占位符
};

// 分类专用配色方案（根据AI提示词设计文档）
export const categoryColors = {
  // 推荐 - 多彩混合（默认主题色）
  recommend: {
    primary: primary[600],
    background: gray[50],
    accent: primary[400],
  },
  // 留学 - 深蓝 + 金色（学术感）
  study: {
    primary: '#1E40AF', // 深蓝
    secondary: '#F59E0B', // 金色
    background: '#FEFEFE', // 象牙白
    tagBg: {
      hot: error[50],
      recommended: primary[50],
      migration: success[50],
      value: warning[50],
      art: info[50],
    },
  },
  // 工作 - 深灰 + 橙色（商务感）
  work: {
    primary: '#374151', // 深灰
    secondary: '#F97316', // 橙色
    salary: '#10B981', // 绿色（薪资）
    accent: primary[600],
    tagBg: primary[50],
  },
  // 签证 - 蓝绿 + 白色（清新专业）
  visa: {
    primary: '#0EA5E9', // 蓝绿
    gradient: ['#3B82F6', '#06B6D4'], // 渐变蓝
    success: '#22C55E', // 通过率绿色
    warning: warning[600],
    error: error[600],
    background: '#F0F9FF', // 极浅蓝
  },
  // 生活 - 暖色调（粉、橙、黄）
  life: {
    gradients: ['#F472B6', '#FB923C', '#FBBF24'], // 粉、橙、黄
    overlay: 'rgba(0, 0, 0, 0.4)',
    accent: primary[600],
  },
  // 其他 - 中性灰色系（简洁）
  other: {
    primary: gray[900],
    secondary: gray[600],
    tertiary: gray[400],
    accent: primary[600],
    background: '#FFFFFF',
  },
};

// 导出所有颜色
export const colors = {
  primary,
  success,
  warning,
  error,
  info,
  gray,
  background,
  text,
  border,
  status,
  special,
  categoryColors,
  // 常用颜色快捷方式
  white: '#FFFFFF',
  black: '#000000',
};

export default colors;

