/**
 * GoAbroad 社区状态管理
 * 管理社区帖子、评论、点赞、收藏等
 */

import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 当前激活的 Tab
  activeTab: 'recommend', // 'recommend', 'following', 'country', 'stage'
  
  // 帖子列表（按 Tab 分类）
  posts: {
    recommend: [],
    following: [],
    country: [],
    stage: [],
  },
  
  // 分页信息
  pagination: {
    recommend: { page: 1, hasMore: true },
    following: { page: 1, hasMore: true },
    country: { page: 1, hasMore: true },
    stage: { page: 1, hasMore: true },
  },
  
  // 当前帖子详情
  currentPost: null,
  
  // 评论列表
  comments: [],
  commentsPagination: { page: 1, hasMore: true },
  commentsSort: 'latest', // 'latest', 'hot'
  
  // 用户点赞的帖子 ID 列表
  likedPostIds: [],
  
  // 用户收藏的帖子 ID 列表
  favoritePostIds: [],
  
  // 用户点赞的评论 ID 列表
  likedCommentIds: [],
  
  // 用户关注的用户 ID 列表
  followingUserIds: [],
  
  // 筛选条件（国家和阶段 Tab）
  filters: {
    country: null, // '美国', '英国', '加拿大', ...
    stage: null, // '准备阶段', '申请中', '等offer', ...
    type: null, // '留学', '工作', '移民'
  },
  
  // 加载状态
  loading: false,
  refreshing: false,
  loadingMore: false,
  error: null,
};

// 创建 slice
const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    // 设置当前 Tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // 设置帖子列表
    setPosts: (state, action) => {
      const { tab, posts, reset = false } = action.payload;
      if (reset) {
        state.posts[tab] = posts;
      } else {
        state.posts[tab] = [...state.posts[tab], ...posts];
      }
    },
    
    // 设置分页信息
    setPagination: (state, action) => {
      const { tab, page, hasMore } = action.payload;
      state.pagination[tab] = { page, hasMore };
    },
    
    // 设置当前帖子详情
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    
    // 更新帖子数据（点赞、收藏数等）
    updatePost: (state, action) => {
      const { postId, updates } = action.payload;
      
      // 更新列表中的帖子
      Object.keys(state.posts).forEach(tab => {
        const index = state.posts[tab].findIndex(p => p.id === postId);
        if (index !== -1) {
          state.posts[tab][index] = { ...state.posts[tab][index], ...updates };
        }
      });
      
      // 更新当前帖子详情
      if (state.currentPost?.id === postId) {
        state.currentPost = { ...state.currentPost, ...updates };
      }
    },
    
    // 点赞/取消点赞帖子
    toggleLikePost: (state, action) => {
      const postId = action.payload;
      const isLiked = state.likedPostIds.includes(postId);
      
      if (isLiked) {
        state.likedPostIds = state.likedPostIds.filter(id => id !== postId);
      } else {
        state.likedPostIds.push(postId);
      }
      
      // 更新帖子点赞数
      Object.keys(state.posts).forEach(tab => {
        const post = state.posts[tab].find(p => p.id === postId);
        if (post) {
          post.likeCount += isLiked ? -1 : 1;
          post.isLiked = !isLiked;
        }
      });
      
      if (state.currentPost?.id === postId) {
        state.currentPost.likeCount += isLiked ? -1 : 1;
        state.currentPost.isLiked = !isLiked;
      }
    },
    
    // 收藏/取消收藏帖子
    toggleFavoritePost: (state, action) => {
      const postId = action.payload;
      const isFavorited = state.favoritePostIds.includes(postId);
      
      if (isFavorited) {
        state.favoritePostIds = state.favoritePostIds.filter(id => id !== postId);
      } else {
        state.favoritePostIds.push(postId);
      }
      
      // 更新帖子收藏数
      Object.keys(state.posts).forEach(tab => {
        const post = state.posts[tab].find(p => p.id === postId);
        if (post) {
          post.favoriteCount += isFavorited ? -1 : 1;
          post.isFavorited = !isFavorited;
        }
      });
      
      if (state.currentPost?.id === postId) {
        state.currentPost.favoriteCount += isFavorited ? -1 : 1;
        state.currentPost.isFavorited = !isFavorited;
      }
    },
    
    // 关注/取消关注用户
    toggleFollowUser: (state, action) => {
      const userId = action.payload;
      if (state.followingUserIds.includes(userId)) {
        state.followingUserIds = state.followingUserIds.filter(id => id !== userId);
      } else {
        state.followingUserIds.push(userId);
      }
    },
    
    // 设置评论列表
    setComments: (state, action) => {
      const { comments, reset = false } = action.payload;
      if (reset) {
        state.comments = comments;
      } else {
        state.comments = [...state.comments, ...comments];
      }
    },
    
    // 设置评论分页
    setCommentsPagination: (state, action) => {
      state.commentsPagination = action.payload;
    },
    
    // 设置评论排序
    setCommentsSort: (state, action) => {
      state.commentsSort = action.payload;
    },
    
    // 添加评论
    addComment: (state, action) => {
      state.comments.unshift(action.payload);
      
      // 更新帖子评论数
      if (state.currentPost) {
        state.currentPost.commentCount += 1;
      }
    },
    
    // 点赞/取消点赞评论
    toggleLikeComment: (state, action) => {
      const commentId = action.payload;
      const isLiked = state.likedCommentIds.includes(commentId);
      
      if (isLiked) {
        state.likedCommentIds = state.likedCommentIds.filter(id => id !== commentId);
      } else {
        state.likedCommentIds.push(commentId);
      }
      
      // 更新评论点赞数
      const comment = state.comments.find(c => c.id === commentId);
      if (comment) {
        comment.likeCount += isLiked ? -1 : 1;
        comment.isLiked = !isLiked;
      }
    },
    
    // 设置筛选条件
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // 清空筛选条件
    clearFilters: (state) => {
      state.filters = {
        country: null,
        stage: null,
        type: null,
      };
    },
    
    // 设置加载状态
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
    
    setLoadingMore: (state, action) => {
      state.loadingMore = action.payload;
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 添加新帖子到列表（发布成功后）
    addPost: (state, action) => {
      const newPost = action.payload;
      // 添加到所有相关 Tab 的开头
      Object.keys(state.posts).forEach(tab => {
        state.posts[tab].unshift(newPost);
      });
    },
    
    // 删除帖子
    deletePost: (state, action) => {
      const postId = action.payload;
      Object.keys(state.posts).forEach(tab => {
        state.posts[tab] = state.posts[tab].filter(p => p.id !== postId);
      });
      
      // 如果是当前查看的帖子，也清除
      if (state.currentPost?.id === postId) {
        state.currentPost = null;
      }
    },
    
    // 重置状态
    resetCommunity: () => initialState,
  },
});

// 导出 actions
export const {
  setActiveTab,
  setPosts,
  setPagination,
  setCurrentPost,
  updatePost,
  toggleLikePost,
  toggleFavoritePost,
  toggleFollowUser,
  setComments,
  setCommentsPagination,
  setCommentsSort,
  addComment,
  toggleLikeComment,
  setFilters,
  clearFilters,
  setLoading,
  setRefreshing,
  setLoadingMore,
  clearError,
  addPost,
  deletePost,
  resetCommunity,
} = communitySlice.actions;

// Selectors
export const selectActiveTab = (state) => state.community.activeTab;
export const selectPostsByTab = (tab) => (state) => state.community.posts[tab] || [];
export const selectCurrentPosts = (state) => state.community.posts[state.community.activeTab] || [];
export const selectCurrentPost = (state) => state.community.currentPost;
export const selectComments = (state) => state.community.comments;
export const selectIsPostLiked = (postId) => (state) => state.community.likedPostIds.includes(postId);
export const selectIsPostFavorited = (postId) => (state) => state.community.favoritePostIds.includes(postId);
export const selectIsUserFollowed = (userId) => (state) => state.community.followingUserIds.includes(userId);

// 导出 reducer
export default communitySlice.reducer;
