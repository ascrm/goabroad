/**
 * Profile Redux Slice
 * 管理用户个人信息、设置等状态
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 用户信息
  userInfo: {
    id: null,
    avatar: null,
    nickname: '',
    username: '',
    signature: '',
    level: 1,
    experience: 0,
    experienceMax: 100,
    gender: null, // 'male', 'female', 'other'
    birthday: null,
    location: '',
    education: [],
  },
  
  // 会员信息
  membership: {
    isPro: false,
    expireDate: null,
    benefits: [],
  },
  
  // 统计数据
  stats: {
    planProgress: 0,
    postsCount: 0,
    favoritesCount: 0,
    likesCount: 0,
  },
  
    // 设置
    settings: {
      // 账号安全
      security: {
        hasPassword: true,
        hasPhone: false,
        hasEmail: false,
        phoneNumber: '',
        email: '',
        linkedAccounts: [],
      },
    
    // 隐私设置
    privacy: {
      whoCanSeeMyPosts: 'everyone', // 'everyone', 'followers', 'private'
      whoCanComment: 'everyone', // 'everyone', 'followers', 'none'
      blacklist: [],
    },
    
    // 通知设置
    notifications: {
      pushEnabled: true,
      systemNotifications: true,
      interactionNotifications: true,
      planReminders: true,
      communityUpdates: true,
    },
    
    // 通用设置
    general: {
      language: 'zh-CN',
      cacheSize: 0,
      autoPlayVideo: true,
      dataUsageMode: false,
    },
  },
  
  // 状态标识
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    
    // 更新头像
    updateAvatar: (state, action) => {
      state.userInfo.avatar = action.payload;
    },
    
    // 更新昵称
    updateNickname: (state, action) => {
      state.userInfo.nickname = action.payload;
    },
    
    // 更新个性签名
    updateSignature: (state, action) => {
      state.userInfo.signature = action.payload;
    },
    
    // 更新等级和经验
    updateLevel: (state, action) => {
      const { level, experience, experienceMax } = action.payload;
      state.userInfo.level = level;
      state.userInfo.experience = experience;
      state.userInfo.experienceMax = experienceMax;
    },
    
    // 设置会员信息
    setMembership: (state, action) => {
      state.membership = { ...state.membership, ...action.payload };
    },
    
    // 更新统计数据
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // 增加发帖数
    incrementPostsCount: (state) => {
      state.stats.postsCount += 1;
    },
    
    // 增加收藏数
    incrementFavoritesCount: (state) => {
      state.stats.favoritesCount += 1;
    },
    
    // 减少收藏数
    decrementFavoritesCount: (state) => {
      if (state.stats.favoritesCount > 0) {
        state.stats.favoritesCount -= 1;
      }
    },
    
    // 更新安全设置
    updateSecurity: (state, action) => {
      state.settings.security = { ...state.settings.security, ...action.payload };
    },
    
    // 更新隐私设置
    updatePrivacy: (state, action) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload };
    },
    
    // 添加到黑名单
    addToBlacklist: (state, action) => {
      if (!state.settings.privacy.blacklist.includes(action.payload)) {
        state.settings.privacy.blacklist.push(action.payload);
      }
    },
    
    // 从黑名单移除
    removeFromBlacklist: (state, action) => {
      state.settings.privacy.blacklist = state.settings.privacy.blacklist.filter(
        id => id !== action.payload
      );
    },
    
    // 更新通知设置
    updateNotifications: (state, action) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload };
    },
    
    // 更新通用设置
    updateGeneral: (state, action) => {
      state.settings.general = { ...state.settings.general, ...action.payload };
    },
    
    // 清除缓存
    clearCache: (state) => {
      state.settings.general.cacheSize = 0;
    },
    
    // 设置加载状态
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // 设置错误
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 重置状态
    resetProfile: () => initialState,
  },
});

// 导出 actions
export const {
  setUserInfo,
  updateAvatar,
  updateNickname,
  updateSignature,
  updateLevel,
  setMembership,
  updateStats,
  incrementPostsCount,
  incrementFavoritesCount,
  decrementFavoritesCount,
  updateSecurity,
  updatePrivacy,
  addToBlacklist,
  removeFromBlacklist,
  updateNotifications,
  updateGeneral,
  clearCache,
  setLoading,
  setError,
  clearError,
  resetProfile,
} = profileSlice.actions;

// Selectors
export const selectUserInfo = (state) => state.profile.userInfo;
export const selectMembership = (state) => state.profile.membership;
export const selectStats = (state) => state.profile.stats;
export const selectSettings = (state) => state.profile.settings;
export const selectNotificationSettings = (state) => state.profile.settings.notifications;
export const selectPrivacySettings = (state) => state.profile.settings.privacy;
export const selectSecuritySettings = (state) => state.profile.settings.security;

export default profileSlice.reducer;

