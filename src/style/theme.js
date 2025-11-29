/**
 * GoAbroad 主题配置
 * 集成所有设计系统配置
 */

import colors from './colors';
import shadowsConfig from './shadows';
import spacingConfig from './spacing';
import typography from './typography';

// 圆角系统
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// 边框宽度
export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
};

// 透明度
export const opacity = {
  transparent: 0,
  low: 0.1,
  medium: 0.5,
  high: 0.8,
  opaque: 1,
};

// 动画时长（毫秒）
export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Z-index 层级
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  notification: 1500,
  overlay: 9999,
};

// 断点（用于响应式设计）
export const breakpoints = {
  xs: 0,      // 小手机
  sm: 375,    // 标准手机
  md: 768,    // 平板竖屏
  lg: 1024,   // 平板横屏
  xl: 1280,   // 小屏桌面
  '2xl': 1536, // 大屏桌面
};

// 组件默认样式
export const components = {
  // 按钮
  Button: {
    borderRadius: borderRadius.md,
    minHeight: 44, // iOS 推荐的最小可点击区域
    paddingHorizontal: spacingConfig.spacing.lg,
    paddingVertical: spacingConfig.spacing.md,
  },
  
  // 输入框
  Input: {
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.thin,
    minHeight: 48,
    paddingHorizontal: spacingConfig.spacing.md,
    paddingVertical: spacingConfig.spacing.md,
  },
  
  // 卡片
  Card: {
    borderRadius: borderRadius.lg,
    padding: spacingConfig.spacing.lg,
    backgroundColor: colors.background.primary,
  },
  
  // 模态框
  Modal: {
    borderRadius: borderRadius.xl,
    padding: spacingConfig.spacing.xl,
    backgroundColor: colors.background.primary,
  },
  
  // 标签
  Tag: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacingConfig.spacing.md,
    paddingVertical: spacingConfig.spacing.xs,
  },
  
  // 头像
  Avatar: {
    borderRadius: borderRadius.full,
    size: spacingConfig.avatarSize.md,
  },
  
  // 徽章
  Badge: {
    borderRadius: borderRadius.full,
    minWidth: 20,
    minHeight: 20,
    paddingHorizontal: spacingConfig.spacing.xs,
  },
  
  // 分割线
  Divider: {
    height: borderWidth.hairline,
    backgroundColor: colors.border.light,
  },
};

// 主题配置对象
const theme = {
  // 颜色
  colors,
  
  // 字体
  typography,
  
  // 间距
  spacing: spacingConfig.spacing,
  padding: spacingConfig.padding,
  margin: spacingConfig.margin,
  gap: spacingConfig.gap,
  componentSpacing: spacingConfig.componentSpacing,
  layout: spacingConfig.layout,
  iconSize: spacingConfig.iconSize,
  avatarSize: spacingConfig.avatarSize,
  
  // 阴影
  shadows: shadowsConfig.shadows,
  specialShadows: shadowsConfig.specialShadows,
  innerShadows: shadowsConfig.innerShadows,
  glows: shadowsConfig.glows,
  componentShadows: shadowsConfig.componentShadows,
  
  // 圆角
  borderRadius,
  
  // 边框
  borderWidth,
  
  // 透明度
  opacity,
  
  // 动画
  animation,
  
  // Z-index
  zIndex,
  
  // 断点
  breakpoints,
  
  // 组件
  components,
};

// 亮色主题（默认）
export const lightTheme = theme;

// 暗色主题（可选，后续扩展）
export const darkTheme = {
  ...theme,
  colors: {
    ...colors,
    background: {
      primary: '#05060C',
      secondary: '#0F111C',
      tertiary: '#171B2A',
      dark: '#F5F6F8',
    },
    text: {
      primary: '#F5F6FB',
      secondary: '#9CA2BB',
      tertiary: '#757C95',
      inverse: '#05060C',
      link: colors.primary[300],
      error: colors.error[400],
      success: colors.success[400],
      warning: colors.warning[400],
    },
    border: {
      light: '#1F2433',
      default: '#2B3042',
      dark: '#3D4257',
      focus: colors.primary[400],
    },
  },
};

// 导出默认主题
export default theme;

