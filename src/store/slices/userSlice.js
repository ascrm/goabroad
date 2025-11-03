/**
 * GoAbroad 用户信息状态管理
 * 管理用户个人资料、偏好设置、等级等
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import userApi from '@/src/services/api/modules/userApi';

// 初始状态
const initialState = {
  // 用户资料
  profile: {
    id: null,
    username: '',
    nickname: '',
    email: '',
    phone: '',
    avatarUrl: null,  // 改为 avatarUrl（与API文档一致）
    bio: '',
    location: '',
    birthday: null,
    gender: null,
    nationality: '',
    language: 'zh-CN',
    level: 1,
    status: 'ACTIVE',
    badges: [],
    // 注意：targetCountry, targetType, targetDate, currentStatus 已移至 preferences.onboarding
  },
  
  // 用户统计信息
  stats: {
    postCount: 0,        // 改为 postCount（与API文档一致）
    followerCount: 0,    // 改为 followerCount（与API文档一致）
    followingCount: 0,
    likesCount: 0,
    collectCount: 0,
  },
  
  // 用户偏好
  preferences: {
    theme: 'light', // 'light', 'dark', 'auto'
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
    // 首次登录引导数据
    onboarding: {
      completed: false,
      targetCountries: [], // 目标国家列表
      purpose: null, // 'study', 'work', 'immigration', 'explore'
      departureTime: null, // '3months', '6months', '1year', '1-2years', 'flexible'
      currentStatus: null, // 'student', 'graduate', 'working', 'unemployed'
    },
  },
  
  // 用户等级和积分
  points: 0,
  experience: 0,
  
  // 用户内容数据
  posts: {
    items: [],
    pagination: null,
    loading: false,
  },
  favorites: {
    items: [],
    pagination: null,
    loading: false,
  },
  
  // 关注关系
  following: {
    items: [],
    pagination: null,
    loading: false,
  },
  followers: {
    items: [],
    pagination: null,
    loading: false,
  },
  
  // 加载状态
  loading: false,
  error: null,
};

// ==================== 异步 Thunks ====================

// 获取用户资料（可以是当前用户或其他用户）
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 更新当前用户资料
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 上传头像
export const uploadUserAvatar = createAsyncThunk(
  'user/uploadUserAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadAvatar(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 获取用户发布的帖子
export const fetchUserPosts = createAsyncThunk(
  'user/fetchUserPosts',
  async ({ userId, page = 1, pageSize = 20, type = 'all' }, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserPosts(userId, { page, pageSize, type });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 获取用户收藏的帖子
export const fetchUserFavorites = createAsyncThunk(
  'user/fetchUserFavorites',
  async ({ page = 1, pageSize = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserFavorites({ page, pageSize });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 关注用户
export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.followUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 取消关注用户
export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.unfollowUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 获取关注列表
export const fetchUserFollowing = createAsyncThunk(
  'user/fetchUserFollowing',
  async ({ userId, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserFollowing(userId, { page, pageSize });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 获取粉丝列表
export const fetchUserFollowers = createAsyncThunk(
  'user/fetchUserFollowers',
  async ({ userId, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserFollowers(userId, { page, pageSize });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 检查关注状态
export const checkFollowStatus = createAsyncThunk(
  'user/checkFollowStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.checkFollowStatus(userId);
      return { userId, isFollowing: response.data.isFollowing };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 搜索用户
export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ keyword, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await userApi.searchUsers({ keyword, page, pageSize });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 批量获取用户信息
export const fetchBatchUsers = createAsyncThunk(
  'user/fetchBatchUsers',
  async (userIds, { rejectWithValue }) => {
    try {
      const response = await userApi.getBatchUsers(userIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 更新用户偏好（本地存储）
export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      // 这里只是本地存储，不调用API
      return preferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 创建 slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 更新用户资料（本地更新，不调用 API）
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    
    // 更新用户偏好（本地更新，不调用 API）
    updatePreferencesLocal: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // 增加积分
    addPoints: (state, action) => {
      state.points += action.payload;
      // 简单的等级计算（每100积分升一级）
      const newLevel = Math.floor(state.points / 100) + 1;
      if (newLevel > state.profile.level) {
        state.profile.level = newLevel;
      }
    },
    
    // 增加经验值
    addExperience: (state, action) => {
      state.experience += action.payload;
    },
    
    // 更新统计信息
    updateStatsLocal: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // 重置用户数据
    resetUser: () => {
      return initialState;
    },
    
    // 清空帖子列表
    clearPosts: (state) => {
      state.posts = initialState.posts;
    },
    
    // 清空收藏列表
    clearFavorites: (state) => {
      state.favorites = initialState.favorites;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ 获取用户资料 ============
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        // 如果返回了统计信息，也更新stats
        if (action.payload.stats) {
          state.stats = { ...state.stats, ...action.payload.stats };
        }
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ============ 更新用户资料 ============
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ============ 上传头像 ============
      .addCase(uploadUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload 包含 { avatarUrl, thumbnailUrl }（根据API文档）
        if (action.payload.avatarUrl) {
          state.profile.avatarUrl = action.payload.avatarUrl;
        }
        state.error = null;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ============ 获取用户帖子 ============
      .addCase(fetchUserPosts.pending, (state) => {
        state.posts.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts.loading = false;
        const { items, pagination } = action.payload;
        
        // 如果是第一页，替换；否则追加
        if (pagination.currentPage === 1) {
          state.posts.items = items;
        } else {
          state.posts.items = [...state.posts.items, ...items];
        }
        state.posts.pagination = pagination;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.posts.loading = false;
        state.error = action.payload;
      })
      
      // ============ 获取用户收藏 ============
      .addCase(fetchUserFavorites.pending, (state) => {
        state.favorites.loading = true;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.favorites.loading = false;
        const { items, pagination } = action.payload;
        
        // 如果是第一页，替换；否则追加
        if (pagination.currentPage === 1) {
          state.favorites.items = items;
        } else {
          state.favorites.items = [...state.favorites.items, ...items];
        }
        state.favorites.pagination = pagination;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.favorites.loading = false;
        state.error = action.payload;
      })
      
      // ============ 关注用户 ============
      .addCase(followUser.fulfilled, (state, action) => {
        const { data } = action.payload;
        // 更新关注数
        if (data.followersCount !== undefined) {
          state.stats.followingCount = (state.stats.followingCount || 0) + 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ============ 取消关注用户 ============
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { data } = action.payload;
        // 更新关注数
        if (data.followersCount !== undefined) {
          state.stats.followingCount = Math.max(0, (state.stats.followingCount || 0) - 1);
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ============ 获取关注列表 ============
      .addCase(fetchUserFollowing.pending, (state) => {
        state.following.loading = true;
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.following.loading = false;
        const { items, pagination } = action.payload;
        
        // 如果是第一页，替换；否则追加
        if (pagination.currentPage === 1) {
          state.following.items = items;
        } else {
          state.following.items = [...state.following.items, ...items];
        }
        state.following.pagination = pagination;
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.following.loading = false;
        state.error = action.payload;
      })
      
      // ============ 获取粉丝列表 ============
      .addCase(fetchUserFollowers.pending, (state) => {
        state.followers.loading = true;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.followers.loading = false;
        const { items, pagination } = action.payload;
        
        // 如果是第一页，替换；否则追加
        if (pagination.currentPage === 1) {
          state.followers.items = items;
        } else {
          state.followers.items = [...state.followers.items, ...items];
        }
        state.followers.pagination = pagination;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.followers.loading = false;
        state.error = action.payload;
      })
      
      // ============ 更新用户偏好 ============
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      });
  },
});

// 导出 actions
export const {
  clearError,
  updateProfileLocal,
  updatePreferencesLocal,
  addPoints,
  addExperience,
  updateStatsLocal,
  resetUser,
  clearPosts,
  clearFavorites,
} = userSlice.actions;

// 导出选择器（Selectors）
export const selectUserProfile = (state) => state.user.profile;
export const selectUserStats = (state) => state.user.stats;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectUserPosts = (state) => state.user.posts;
export const selectUserFavorites = (state) => state.user.favorites;
export const selectUserFollowing = (state) => state.user.following;
export const selectUserFollowers = (state) => state.user.followers;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

// 导出 reducer
export default userSlice.reducer;
