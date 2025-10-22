/**
 * GoAbroad 设计系统入口文件
 * 统一导出所有设计系统配置
 */

// 导出主题配置
export { darkTheme, lightTheme, default as theme } from './theme';

// 导出颜色系统
export {
    background, border, colors, error, gray, info, primary, special, status, success, text, warning
} from './colors';

// COLORS 别名导出（方便使用）
export { colors as COLORS } from './colors';

// 导出字体系统
export {
    fontFamily,
    fontSize,
    fontWeight, letterSpacing, lineHeight, textStyles, typography
} from './typography';

// 导出间距系统
export { avatarSize, BASE_UNIT, componentSpacing, gap, getSpacing, iconSize, layout, margin, padding, spacing, default as spacingConfig } from './spacing';

// 导出阴影系统
export {
    componentShadows, glows, innerShadows, shadows, default as shadowsConfig, specialShadows
} from '../styles/shadows';

// 从主题中导出其他配置
export {
    animation, borderRadius,
    borderWidth, breakpoints,
    components, opacity, zIndex
} from './theme';

