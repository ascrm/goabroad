/**
 * GoAbroad 用户相关 API
 * 处理用户信息、资料更新、关注关系等
 */

import apiClient from '../client';

// ==================== 2.1 获取用户公开资料 ====================
/**
 * 获取指定用户的公开资料
 * @param {string|number} userId - 用户 ID
 * @returns {Promise<Object>} 用户公开资料
 * @example
 * const user = await getUserProfile(123);
 * // 返回: { id, username, nickname, avatar, bio, gender, level, status, badges, targetCountry, stats, isFollowing, createdAt }
 */
export const getUserProfile = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response;
};

// ==================== 2.2 更新用户资料 ====================
/**
 * 更新当前用户的资料
 * @param {Object} profileData - 用户资料数据
 * @param {string} [profileData.nickname] - 昵称
 * @param {string} [profileData.bio] - 个人简介
 * @param {string} [profileData.targetCountry] - 目标国家（国家代码，如 'US'）
 * @param {string} [profileData.targetType] - 目标类型（study, work, immigration, travel, undecided）
 * @param {string} [profileData.targetDate] - 目标日期（YYYY-MM-DD）
 * @param {string} [profileData.currentStatus] - 当前状态（如：在读大学生）
 * @returns {Promise<Object>} 更新后的用户资料
 * @example
 * const updatedProfile = await updateUserProfile({
 *   nickname: '新昵称',
 *   targetCountry: 'US',
 *   targetType: 'study',
 *   targetDate: '2026-09-01'
 * });
 */
export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/users/profile', profileData);
  return response;
};

// ==================== 2.3 上传头像 ====================
/**
 * 上传用户头像
 * @param {Object} file - 图片文件对象
 * @param {string} file.uri - 文件URI
 * @param {string} file.name - 文件名
 * @param {string} file.type - 文件类型（如 'image/jpeg'）
 * @returns {Promise<Object>} 头像URL信息
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response;
};

// ==================== 2.4 获取用户发布的帖子 ====================
/**
 * 获取指定用户发布的帖子列表
 * @param {string|number} userId - 用户 ID
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @param {string} [params.type='all'] - 帖子类型（all, POST, QUESTION, TIMELINE）
 * @returns {Promise<Object>} 分页帖子列表
 * @example
 * const posts = await getUserPosts(123, { page: 1, pageSize: 20, type: 'POST' });
 * // 返回: { items: [...], pagination: {...} }
 */
export const getUserPosts = async (userId, params = {}) => {
  const { page = 1, pageSize = 20, type = 'all' } = params;
  
  const response = await apiClient.get(`/users/${userId}/posts`, {
    params: {
      page,
      pageSize,
      type,
    },
  });
  
  return response;
};

// ==================== 2.5 获取用户收藏的帖子 ====================
/**
 * 获取当前用户收藏的帖子
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 分页收藏列表
 * @example
 * const favorites = await getUserFavorites({ page: 1, pageSize: 20 });
 */
export const getUserFavorites = async (params = {}) => {
  const { page = 1, pageSize = 20 } = params;
  
  const response = await apiClient.get('/users/favorites', {
    params: {
      page,
      pageSize,
    },
  });
  
  return response;
};

// ==================== 2.6 关注用户 ====================
/**
 * 关注指定用户
 * @param {string|number} userId - 要关注的用户 ID
 * @returns {Promise<Object>} 关注结果
 * @example
 * const result = await followUser(123);
 * // 返回: { isFollowing: true, followersCount: 121 }
 */
export const followUser = async (userId) => {
  const response = await apiClient.post(`/users/${userId}/follow`);
  return response;
};

// ==================== 2.7 取消关注用户 ====================
/**
 * 取消关注指定用户
 * @param {string|number} userId - 要取消关注的用户 ID
 * @returns {Promise<Object>} 取消关注结果
 * @example
 * const result = await unfollowUser(123);
 * // 返回: { isFollowing: false, followersCount: 120 }
 */
export const unfollowUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}/follow`);
  return response;
};

// ==================== 2.8 获取关注列表 ====================
/**
 * 获取用户的关注列表
 * @param {string|number} userId - 用户 ID
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 分页关注列表
 * @example
 * const following = await getUserFollowing(123, { page: 1, pageSize: 20 });
 * // 返回: { items: [...], pagination: {...} }
 */
export const getUserFollowing = async (userId, params = {}) => {
  const { page = 1, pageSize = 20 } = params;
  
  const response = await apiClient.get(`/users/${userId}/following`, {
    params: {
      page,
      pageSize,
    },
  });
  
  return response;
};

// ==================== 2.9 获取粉丝列表 ====================
/**
 * 获取用户的粉丝列表
 * @param {string|number} userId - 用户 ID
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 分页粉丝列表
 * @example
 * const followers = await getUserFollowers(123, { page: 1, pageSize: 20 });
 * // 返回: { items: [...], pagination: {...} }
 */
export const getUserFollowers = async (userId, params = {}) => {
  const { page = 1, pageSize = 20 } = params;
  
  const response = await apiClient.get(`/users/${userId}/followers`, {
    params: {
      page,
      pageSize,
    },
  });
  
  return response;
};

// ==================== 辅助方法 ====================

/**
 * 批量获取用户信息
 * @param {Array<string|number>} userIds - 用户 ID 数组
 * @returns {Promise<Object>} 用户信息对象（key为userId）
 * @example
 * const users = await getBatchUsers([1, 2, 3]);
 * // 返回: { '1': {...}, '2': {...}, '3': {...} }
 */
export const getBatchUsers = async (userIds) => {
  const response = await apiClient.get('/users/batch', {
    params: {
      ids: userIds.join(','),
    },
  });
  
  return response;
};

/**
 * 搜索用户
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 搜索结果
 * @example
 * const results = await searchUsers({ keyword: '张三', page: 1 });
 */
export const searchUsers = async (params = {}) => {
  const { keyword, page = 1, pageSize = 20 } = params;
  
  const response = await apiClient.get('/users/search', {
    params: {
      keyword,
      page,
      pageSize,
    },
  });
  
  return response;
};

/**
 * 检查是否关注某用户
 * @param {string|number} userId - 用户 ID
 * @returns {Promise<Object>} 关注状态
 * @example
 * const status = await checkFollowStatus(123);
 * // 返回: { isFollowing: true }
 */
export const checkFollowStatus = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/follow/status`);
  return response;
};

// 默认导出所有 API
export default {
  // 基础信息
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  
  // 用户内容
  getUserPosts,
  getUserFavorites,
  
  // 关注关系
  followUser,
  unfollowUser,
  getUserFollowing,
  getUserFollowers,
  checkFollowStatus,
  
  // 辅助方法
  getBatchUsers,
  searchUsers,
};
