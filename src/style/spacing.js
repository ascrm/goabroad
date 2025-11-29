/**
 * GoAbroad 间距系统
 * 基于 8px 网格系统
 */

// 基础间距单位（8px）
export const BASE_UNIT = 8;

// 间距值（基于 8px 网格）
export const spacing = {
  xs: 4,      // 0.5x - 超小间距
  sm: 8,      // 1x - 小间距
  md: 16,     // 2x - 中等间距
  lg: 24,     // 3x - 大间距
  xl: 32,     // 4x - 超大间距
  '2xl': 48,  // 6x - 特大间距
  '3xl': 64,  // 8x - 极大间距
  '4xl': 80,  // 10x - 超极大间距
  '5xl': 96,  // 12x - 最大间距
};

// 内边距预设（padding）
export const padding = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
};

// 外边距预设（margin）
export const margin = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
};

// 间隙预设（gap，用于 flexbox/grid）
export const gap = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
};

// 组件特定间距
export const componentSpacing = {
  // 按钮内边距
  button: {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    large: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  },

  // 卡片内边距
  card: {
    padding: spacing.lg,
    paddingSmall: spacing.md,
    paddingLarge: spacing.xl,
  },

  // 列表项内边距
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  // 表单输入框
  input: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  // 屏幕/容器边距
  screen: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // 导航栏高度
  navbar: {
    height: 56,
    paddingHorizontal: spacing.lg,
  },

  // 标签页高度
  tabBar: {
    height: 64,
    paddingVertical: spacing.sm,
  },

  // 底部安全区域
  safeArea: {
    bottom: spacing.lg,
  },
};

// 布局间距（用于页面布局）
export const layout = {
  // 容器宽度
  containerMaxWidth: 1200,
  
  // 栅格间距
  gridGap: spacing.md,
  
  // 区块间距
  sectionSpacing: spacing['2xl'],
  
  // 元素间距
  elementSpacing: spacing.md,
  
  // 分组间距
  groupSpacing: spacing.lg,
};

// 图标尺寸
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// 头像尺寸
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  '3xl': 96,
};

// 导出函数：获取倍数间距
export const getSpacing = (multiplier) => BASE_UNIT * multiplier;

// 导出所有间距配置
export default {
  BASE_UNIT,
  spacing,
  padding,
  margin,
  gap,
  componentSpacing,
  layout,
  iconSize,
  avatarSize,
  getSpacing,
};

