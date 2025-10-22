/**
 * GoAbroad 社区状态管理
 * 管理社区帖子、评论、点赞等
 * 
 * TODO: 后续开发时实现具体功能
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 帖子列表
  posts: [],
  
  // 当前帖子详情
  currentPost: null,
  
  // 评论列表
  comments: [],
  
  // 用户点赞的帖子
  likedPosts: [],
  
  // 筛选条件
  filters: {
    category: null,
    sortBy: 'latest', // 'latest', 'popular', 'trending'
  },
  
  // 加载状态
  loading: false,
  error: null,
};

// 创建 slice
const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    // TODO: 实现具体的 reducers
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    
    setLikedPosts: (state, action) => {
      state.likedPosts = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

// 导出 actions
export const {
  setPosts,
  setCurrentPost,
  setComments,
  setLikedPosts,
  setFilters,
  clearError,
} = communitySlice.actions;

// 导出 reducer
export default communitySlice.reducer;
