/**
 * GoAbroad 字体系统
 * 基于产品设计文档的字体规范
 */

// 字体家族
export const fontFamily = {
  // 中文字体
  chinese: "'PingFang SC', 'Microsoft YaHei', sans-serif",
  
  // 英文/数字字体
  english: "'SF Pro Display', 'Roboto', sans-serif",
  
  // 系统默认字体
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  
  // 等宽字体（用于代码）
  mono: "'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace",
};

// 字号（单位：px）
export const fontSize = {
  h1: 32,      // 大标题
  h2: 28,      // 二级标题
  h3: 24,      // 三级标题
  h4: 20,      // 四级标题
  h5: 18,      // 五级标题
  h6: 16,      // 六级标题
  xlarge: 18,  // 超大正文
  large: 16,   // 大正文
  base: 14,    // 基础正文
  medium: 14,  // 中等（同base）
  small: 13,   // 小字
  xsmall: 12,  // 超小字
  tiny: 12,    // 极小字（同xsmall）
};

// 字重
export const fontWeight = {
  light: '300',        // 细体
  regular: '400',      // 常规
  medium: '500',       // 中等
  semibold: '600',     // 半粗
  bold: '700',         // 粗体
  extrabold: '800',    // 超粗
};

// 行高（相对于字号的倍数）
export const lineHeight = {
  tight: 1.2,    // 紧凑
  normal: 1.5,   // 正常
  relaxed: 1.75, // 宽松
  loose: 2,      // 很宽松
};

// 字间距（letter spacing）
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
};

// 预定义的文本样式
export const textStyles = {
  // 标题样式
  h1: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize.h3,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSize.h4,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.h5,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.h6,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 正文样式
  bodyLarge: {
    fontSize: fontSize.large,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 按钮/标签样式
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },

  // 说明文字
  caption: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  captionBold: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // 标签样式
  label: {
    fontSize: fontSize.xsmall,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
  },

  // 链接样式
  link: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: 'underline',
  },

  // 输入框文字
  input: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // 占位符文字
  placeholder: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
};

// 导出所有字体配置
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,
};

export default typography;

