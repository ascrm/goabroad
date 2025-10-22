/**
 * GoAbroad 用户相关 API
 * 处理用户信息、资料更新等
 * 
 * TODO: 后续开发时实现具体功能
 */

import apiClient from '../client';

/**
 * 获取用户信息
 * @param {string} userId - 用户 ID
 * @returns {Promise<Object>}
 */
export const getUserProfile = async (userId) => {
  // TODO: 实现获取用户信息
  return apiClient.get(`/users/${userId}`);
};

/**
 * 更新用户资料
 * @param {Object} profileData - 用户资料数据
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
  // TODO: 实现更新用户资料
  return apiClient.put('/users/profile', profileData);
};

/**
 * 上传用户头像
 * @param {File} file - 头像文件
 * @returns {Promise<Object>}
 */
export const uploadAvatar = async (file) => {
  // TODO: 实现头像上传
  const formData = new FormData();
  formData.append('avatar', file);
  return apiClient.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 更多 API 方法待实现...

export default {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
};
