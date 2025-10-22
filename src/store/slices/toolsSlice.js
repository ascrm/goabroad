/**
 * GoAbroad 工具状态管理
 * 管理各种工具的数据和缓存
 * 
 * TODO: 后续开发时实现具体功能
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 计算器结果缓存
  calculatorResults: {},
  
  // 汇率数据
  exchangeRates: {},
  
  // 工具使用历史
  usageHistory: [],
  
  // 收藏的工具
  favorites: [],
  
  // 加载状态
  loading: false,
  error: null,
};

// 创建 slice
const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    // TODO: 实现具体的 reducers
    setCalculatorResults: (state, action) => {
      state.calculatorResults = { ...state.calculatorResults, ...action.payload };
    },
    
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload;
    },
    
    setUsageHistory: (state, action) => {
      state.usageHistory = action.payload;
    },
    
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 导出 actions
export const {
  setCalculatorResults,
  setExchangeRates,
  setUsageHistory,
  setFavorites,
  clearError,
} = toolsSlice.actions;

// 导出 reducer
export default toolsSlice.reducer;
