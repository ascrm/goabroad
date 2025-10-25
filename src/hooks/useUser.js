/**
 * useUser Hook
 * 用户相关操作的自定义 Hook
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  checkFollowStatus,
  clearError,
  clearFavorites,
  clearPosts,
  fetchBatchUsers,
  fetchUserFavorites,
  fetchUserFollowers,
  fetchUserFollowing,
  fetchUserPosts,
  fetchUserProfile,
  followUser,
  searchUsers,
  selectUserError,
  selectUserFavorites,
  selectUserFollowers,
  selectUserFollowing,
  selectUserLoading,
  selectUserPosts,
  selectUserPreferences,
  selectUserProfile,
  selectUserStats,
  unfollowUser,
  updateUserPreferences,
  updateUserProfile,
  uploadUserAvatar,
} from '@/src/store/slices/userSlice';

/**
 * 用户相关操作 Hook
 */
export const useUser = () => {
  const dispatch = useDispatch();
  
  // 选择器
  const profile = useSelector(selectUserProfile);
  const stats = useSelector(selectUserStats);
  const preferences = useSelector(selectUserPreferences);
  const posts = useSelector(selectUserPosts);
  const favorites = useSelector(selectUserFavorites);
  const following = useSelector(selectUserFollowing);
  const followers = useSelector(selectUserFollowers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  // 获取用户资料
  const getUserProfile = useCallback(
    (userId) => {
      return dispatch(fetchUserProfile(userId));
    },
    [dispatch]
  );
  
  // 更新用户资料
  const updateProfile = useCallback(
    (profileData) => {
      return dispatch(updateUserProfile(profileData));
    },
    [dispatch]
  );
  
  // 上传头像
  const uploadAvatar = useCallback(
    (file) => {
      return dispatch(uploadUserAvatar(file));
    },
    [dispatch]
  );
  
  // 获取用户帖子
  const getUserPosts = useCallback(
    (userId, page = 1, pageSize = 20, type = 'all') => {
      return dispatch(fetchUserPosts({ userId, page, pageSize, type }));
    },
    [dispatch]
  );
  
  // 获取用户收藏
  const getUserFavorites = useCallback(
    (page = 1, pageSize = 20) => {
      return dispatch(fetchUserFavorites({ page, pageSize }));
    },
    [dispatch]
  );
  
  // 关注用户
  const follow = useCallback(
    (userId) => {
      return dispatch(followUser(userId));
    },
    [dispatch]
  );
  
  // 取消关注
  const unfollow = useCallback(
    (userId) => {
      return dispatch(unfollowUser(userId));
    },
    [dispatch]
  );
  
  // 获取关注列表
  const getUserFollowing = useCallback(
    (userId, page = 1, pageSize = 20) => {
      return dispatch(fetchUserFollowing({ userId, page, pageSize }));
    },
    [dispatch]
  );
  
  // 获取粉丝列表
  const getUserFollowers = useCallback(
    (userId, page = 1, pageSize = 20) => {
      return dispatch(fetchUserFollowers({ userId, page, pageSize }));
    },
    [dispatch]
  );
  
  // 检查关注状态
  const checkFollow = useCallback(
    (userId) => {
      return dispatch(checkFollowStatus(userId));
    },
    [dispatch]
  );
  
  // 搜索用户
  const search = useCallback(
    (keyword, page = 1, pageSize = 20) => {
      return dispatch(searchUsers({ keyword, page, pageSize }));
    },
    [dispatch]
  );
  
  // 批量获取用户
  const getBatchUsers = useCallback(
    (userIds) => {
      return dispatch(fetchBatchUsers(userIds));
    },
    [dispatch]
  );
  
  // 更新偏好设置
  const updatePreferences = useCallback(
    (prefs) => {
      return dispatch(updateUserPreferences(prefs));
    },
    [dispatch]
  );
  
  // 清除错误
  const clearErr = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // 清空帖子
  const clearUserPosts = useCallback(() => {
    dispatch(clearPosts());
  }, [dispatch]);
  
  // 清空收藏
  const clearUserFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);
  
  return {
    // 状态
    profile,
    stats,
    preferences,
    posts,
    favorites,
    following,
    followers,
    loading,
    error,
    
    // 方法
    getUserProfile,
    updateProfile,
    uploadAvatar,
    getUserPosts,
    getUserFavorites,
    follow,
    unfollow,
    getUserFollowing,
    getUserFollowers,
    checkFollow,
    search,
    getBatchUsers,
    updatePreferences,
    clearError: clearErr,
    clearPosts: clearUserPosts,
    clearFavorites: clearUserFavorites,
  };
};

/**
 * 简化版：只获取当前用户资料和统计
 */
export const useCurrentUser = () => {
  const profile = useSelector(selectUserProfile);
  const stats = useSelector(selectUserStats);
  const loading = useSelector(selectUserLoading);
  
  return {
    profile,
    stats,
    loading,
    // 常用的快捷属性
    userId: profile.id,
    username: profile.username,
    nickname: profile.nickname,
    avatar: profile.avatar,
    level: profile.level,
    bio: profile.bio,
  };
};

/**
 * 用户偏好设置 Hook
 */
export const useUserPreferences = () => {
  const dispatch = useDispatch();
  const preferences = useSelector(selectUserPreferences);
  
  const updatePreferences = useCallback(
    (prefs) => {
      return dispatch(updateUserPreferences(prefs));
    },
    [dispatch]
  );
  
  return {
    preferences,
    updatePreferences,
    theme: preferences.theme,
    language: preferences.language,
    notifications: preferences.notifications,
    privacy: preferences.privacy,
    onboarding: preferences.onboarding,
  };
};

export default useUser;

