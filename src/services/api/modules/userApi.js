/**
 * GoAbroad 用户相关 API
 * 处理用户信息、资料更新、关注关系等
 * 
 * 注意：根据 2024-10-29 API文档更新
 * - 所有ID为数字类型
 * - avatar字段改为avatarUrl
 * - 移除targetCountry等字段（这些属于user_preferences表）
 */

import apiClient from '../client';

// ==================== 2.1 获取用户公开资料 ====================
/**
 * 获取指定用户的公开资料
 * @param {number} userId - 用户 ID（数字类型）
 * @returns {Promise<Object>} 用户公开资料
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
 * @param {string} [profileData.gender] - 性别 (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
 * @returns {Promise<Object>} 更新后的用户资料
 * @note targetCountry、targetType等字段已移除，需使用单独的user_preferences接口更新
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
 * @param {number} userId - 用户 ID（数字类型）
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @param {string} [params.type='all'] - 帖子类型（all, POST, QUESTION, TIMELINE）
 * @returns {Promise<Object>} 分页帖子列表
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
 * @param {number} userId - 要关注的用户 ID（数字类型）
 * @returns {Promise<Object>} 关注结果
 */
export const followUser = async (userId) => {
  const response = await apiClient.post(`/users/${userId}/follow`);
  return response;
};

// ==================== 2.7 取消关注用户 ====================
/**
 * 取消关注指定用户
 * @param {number} userId - 要取消关注的用户 ID（数字类型）
 * @returns {Promise<Object>} 取消关注结果
 */
export const unfollowUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}/follow`);
  return response;
};

// ==================== 2.8 获取关注列表 ====================
/**
 * 获取用户的关注列表
 * @param {number} userId - 用户 ID（数字类型）
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 分页关注列表
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
 * @param {number} userId - 用户 ID（数字类型）
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 分页粉丝列表
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
};
