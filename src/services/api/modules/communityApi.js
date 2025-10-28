/**
 * GoAbroad 社区相关 API
 * 处理帖子、评论、点赞、收藏等
 * 
 * TODO: 后续开发时实现具体功能
 */

import apiClient from '../client';

/**
 * 获取帖子列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>}
 */
export const getPosts = async (params) => {
  // TODO: 实现获取帖子列表
  return apiClient.get('/community/posts', { params });
};

/**
 * 获取帖子详情
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const getPostDetail = async (postId) => {
  // TODO: 实现获取帖子详情
  return apiClient.get(`/community/posts/${postId}`);
};

/**
 * 创建帖子
 * @param {Object} postData - 帖子数据
 * @param {string} postData.contentType - 内容类型 (POST, QUESTION, TIMELINE, VLOG)
 * @param {string} [postData.title] - 标题（可选）
 * @param {string} postData.content - 内容
 * @param {string} [postData.status] - 状态 (DRAFT, PUBLISHED)，默认 PUBLISHED
 * @param {string} [postData.coverImage] - 封面图片URL
 * @param {Array<string>} [postData.images] - 图片URL数组
 * @param {Array<string>} [postData.videos] - 视频URL数组
 * @param {Array<string>} [postData.tags] - 标签数组
 * @param {string} [postData.country] - 国家代码
 * @param {string} [postData.stage] - 阶段
 * @returns {Promise<Object>}
 */
export const createPost = async (postData) => {
  const response = await apiClient.post('/community/posts', postData);
  return response.data;
};

/**
 * 编辑帖子
 * @param {string} postId - 帖子 ID
 * @param {Object} postData - 更新的帖子数据
 * @returns {Promise<Object>}
 */
export const updatePost = async (postId, postData) => {
  const response = await apiClient.put(`/community/posts/${postId}`, postData);
  return response.data;
};

/**
 * 删除帖子
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/community/posts/${postId}`);
  return response.data;
};

/**
 * 点赞帖子（toggle）
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const likePost = async (postId) => {
  const response = await apiClient.post(`/community/posts/${postId}/like`);
  return response.data;
};

/**
 * 收藏帖子（toggle）
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const collectPost = async (postId) => {
  const response = await apiClient.post(`/community/posts/${postId}/collect`);
  return response.data;
};

/**
 * 获取评论列表
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const getComments = async (postId) => {
  // TODO: 实现获取评论列表
  return apiClient.get(`/community/posts/${postId}/comments`);
};

/**
 * 发表评论
 * @param {string} postId - 帖子 ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise<Object>}
 */
export const createComment = async (postId, commentData) => {
  // TODO: 实现发表评论
  return apiClient.post(`/community/posts/${postId}/comments`, commentData);
};

// 更多 API 方法待实现...

export default {
  getPosts,
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  likePost,
  collectPost,
  getComments,
  createComment,
};
