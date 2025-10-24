/**
 * GoAbroad UI 状态管理
 * 管理全局 UI 状态，如加载、模态框、提示等
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 全局加载状态
  loading: false,
  loadingMessage: '',
  
  // 模态框状态
  modal: {
    isVisible: false,
    type: null, // 'confirm', 'alert', 'custom'
    title: '',
    content: '',
    onConfirm: null,
    onCancel: null,
  },
  
  // Toast 提示
  toast: {
    isVisible: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    message: '',
    duration: 3000,
  },
  
  // 网络状态
  isOnline: true,
  
  // 应用状态
  appState: 'active', // 'active', 'background', 'inactive'
  
  // 键盘状态
  keyboardHeight: 0,
  isKeyboardVisible: false,
  
  // 主题状态
  theme: 'light', // 'light', 'dark'
  
  // 语言设置
  language: 'zh-CN',
  
  // Tab 角标数据
  unreadCount: 0, // 未读消息数量（社区 Tab）
};

// 创建 slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.message || '';
    },
    
    // 显示模态框
    showModal: (state, action) => {
      state.modal = {
        isVisible: true,
        type: action.payload.type,
        title: action.payload.title,
        content: action.payload.content,
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      };
    },
    
    // 隐藏模态框
    hideModal: (state) => {
      state.modal = {
        isVisible: false,
        type: null,
        title: '',
        content: '',
        onConfirm: null,
        onCancel: null,
      };
    },
    
    // 显示 Toast
    showToast: (state, action) => {
      state.toast = {
        isVisible: true,
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      };
    },
    
    // 隐藏 Toast
    hideToast: (state) => {
      state.toast = {
        isVisible: false,
        type: 'info',
        message: '',
        duration: 3000,
      };
    },
    
    // 设置网络状态
    setNetworkStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    // 设置应用状态
    setAppState: (state, action) => {
      state.appState = action.payload;
    },
    
    // 设置键盘状态
    setKeyboardState: (state, action) => {
      state.keyboardHeight = action.payload.height;
      state.isKeyboardVisible = action.payload.visible;
    },
    
    // 设置主题
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    // 设置语言
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    
    // 设置未读消息数量
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    
    // 重置 UI 状态
    resetUI: (state) => {
      return initialState;
    },
  },
});

// 导出 actions
export const {
  setLoading,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setNetworkStatus,
  setAppState,
  setKeyboardState,
  setTheme,
  setLanguage,
  setUnreadCount,
  resetUI,
} = uiSlice.actions;

// 导出 reducer
export default uiSlice.reducer;
