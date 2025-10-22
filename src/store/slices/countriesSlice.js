/**
 * GoAbroad 国家信息状态管理
 * 管理国家列表、详情、筛选等
 * 
 * TODO: 后续开发时实现具体功能
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 国家列表
  countries: [],
  
  // 当前选中的国家
  selectedCountry: null,
  
  // 筛选条件
  filters: {
    region: null,
    language: null,
    cost: null,
    difficulty: null,
  },
  
  // 搜索关键词
  searchKeyword: '',
  
  // 加载状态
  loading: false,
  error: null,
};

// 创建 slice
const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    // TODO: 实现具体的 reducers
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 导出 actions
export const {
  setCountries,
  setSelectedCountry,
  setFilters,
  setSearchKeyword,
  clearError,
} = countriesSlice.actions;

// 导出 reducer
export default countriesSlice.reducer;
