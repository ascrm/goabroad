/**
 * GoAbroad 阴影系统
 * 适配 React Native 的阴影样式
 */

import { Platform } from 'react-native';

/**
 * 创建跨平台阴影样式
 * iOS 使用 shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android 使用 elevation
 */
const createShadow = (elevation, shadowColor = '#000000') => {
  if (Platform.OS === 'ios') {
    // iOS 阴影配置
    const shadowOpacity = elevation * 0.015; // 根据高度调整透明度
    const shadowRadius = elevation * 0.5;     // 根据高度调整模糊半径
    
    return {
      shadowColor,
      shadowOffset: {
        width: 0,
        height: elevation * 0.25, // 根据高度调整偏移
      },
      shadowOpacity: Math.min(shadowOpacity, 0.3), // 最大透明度 0.3
      shadowRadius: Math.max(shadowRadius, 1),     // 最小半径 1
    };
  }
  
  // Android 阴影配置
  return {
    elevation,
  };
};

// 阴影级别
export const shadows = {
  // 无阴影
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // 小阴影 - 用于小按钮、标签
  sm: createShadow(2),

  // 中等阴影 - 用于卡片、按钮
  md: createShadow(4),

  // 大阴影 - 用于悬浮卡片、弹出菜单
  lg: createShadow(8),

  // 超大阴影 - 用于模态框、抽屉
  xl: createShadow(12),

  // 特大阴影 - 用于全屏模态框
  '2xl': createShadow(16),

  // 极大阴影 - 用于强调的浮动元素
  '3xl': createShadow(24),
};

// 特殊用途阴影
export const specialShadows = {
  // 按钮按下状态（阴影减弱）
  buttonPressed: createShadow(1),
  
  // 卡片悬停状态（阴影加强）
  cardHover: createShadow(6),
  
  // 底部导航栏阴影（向上投射）
  bottomBar: Platform.OS === 'ios' ? {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } : {
    elevation: 8,
  },
  
  // 顶部导航栏阴影（向下投射）
  topBar: Platform.OS === 'ios' ? {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },

  // 浮动操作按钮（FAB）
  fab: createShadow(6),

  // 下拉菜单
  dropdown: createShadow(8),

  // 对话框
  dialog: createShadow(16),

  // 抽屉
  drawer: Platform.OS === 'ios' ? {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  } : {
    elevation: 16,
  },
};

// 内阴影效果（通过边框模拟，React Native 不支持真正的 inset shadow）
export const innerShadows = {
  sm: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  md: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  lg: {
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
};

// 光晕效果（用于聚焦状态）
export const glows = {
  primary: Platform.OS === 'ios' ? {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
  
  success: Platform.OS === 'ios' ? {
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
  
  warning: Platform.OS === 'ios' ? {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
  
  error: Platform.OS === 'ios' ? {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
};

// 组件阴影映射
export const componentShadows = {
  card: shadows.md,
  button: shadows.sm,
  floatingButton: shadows.lg,
  modal: shadows['2xl'],
  dropdown: specialShadows.dropdown,
  navbar: specialShadows.topBar,
  tabBar: specialShadows.bottomBar,
  drawer: specialShadows.drawer,
};

// 导出所有阴影配置
export default {
  shadows,
  specialShadows,
  innerShadows,
  glows,
  componentShadows,
  createShadow,
};

