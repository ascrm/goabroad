/**
 * GoAbroad 国家信息状态管理
 * 管理国家列表、详情、筛选等
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
    type: 'all', // all, hot, study, work, immigration
    region: null,
    language: null,
    cost: null,
    difficulty: null,
  },
  
  // 搜索关键词
  searchKeyword: '',
  
  // 收藏的国家列表
  favorites: [],
  
  // 加载状态
  loading: false,
  error: null,
};

// 创建 slice
const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    // 设置国家列表
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.loading = false;
    },
    
    // 设置当前选中的国家
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    
    // 设置筛选条件
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // 设置搜索关键词
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    
    // 切换收藏状态
    toggleFavorite: (state, action) => {
      const countryId = action.payload;
      const index = state.favorites.indexOf(countryId);
      
      if (index > -1) {
        // 已收藏，取消收藏
        state.favorites.splice(index, 1);
      } else {
        // 未收藏，添加收藏
        state.favorites.push(countryId);
      }
    },
    
    // 设置加载状态
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // 设置错误信息
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // 清除错误
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
  toggleFavorite,
  setLoading,
  setError,
  clearError,
} = countriesSlice.actions;

// Selectors
export const selectAllCountries = (state) => state.countries.countries;
export const selectSelectedCountry = (state) => state.countries.selectedCountry;
export const selectFilters = (state) => state.countries.filters;
export const selectFavorites = (state) => state.countries.favorites;
export const selectIsLoading = (state) => state.countries.loading;

// 导出 reducer
export default countriesSlice.reducer;
