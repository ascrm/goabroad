/**
 * GoAbroad 用户信息状态管理
 * 管理用户个人资料、偏好设置、等级等
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 用户资料
  profile: {
    id: null,
    name: '',
    email: '',
    phone: '',
    avatar: null,
    bio: '',
    location: '',
    birthday: null,
    gender: null,
    nationality: '',
    language: 'zh-CN',
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
    study: {
      targetCountry: null,
      studyLevel: null,
      startDate: null,
      budget: null,
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
  level: 1,
  points: 0,
  experience: 0,
  
  // 统计信息
  stats: {
    loginDays: 0,
    studyDays: 0,
    completedTasks: 0,
    communityPosts: 0,
    communityLikes: 0,
  },
  
  // 加载状态
  loading: false,
  error: null,
};

// 异步 thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: 实现实际的获取用户资料 API 调用
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: '1',
            name: '测试用户',
            email: 'test@example.com',
            phone: '+86 138****8888',
            avatar: null,
            bio: '正在准备出国留学',
            location: '北京',
            birthday: '1995-01-01',
            gender: 'male',
            nationality: '中国',
            language: 'zh-CN',
          });
        }, 500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // TODO: 实现实际的更新用户资料 API 调用
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      // TODO: 实现实际的更新用户偏好 API 调用
      return preferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      // TODO: 实现实际的头像上传 API 调用
      const avatarUrl = `https://example.com/avatars/${Date.now()}.jpg`;
      return avatarUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStats = createAsyncThunk(
  'user/updateUserStats',
  async (stats, { rejectWithValue }) => {
    try {
      // TODO: 实现实际的更新用户统计 API 调用
      return stats;
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
      if (newLevel > state.level) {
        state.level = newLevel;
      }
    },
    
    // 增加经验值
    addExperience: (state, action) => {
      state.experience += action.payload;
    },
    
    // 更新统计信息
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // 重置用户数据
    resetUser: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户资料
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 更新用户资料
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
      
      // 更新用户偏好
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      
      // 上传头像
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.avatar = action.payload;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 更新用户统计
      .addCase(updateUserStats.fulfilled, (state, action) => {
        state.stats = { ...state.stats, ...action.payload };
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
  updateStats,
  resetUser,
} = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;
