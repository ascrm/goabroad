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
 * @returns {Promise<Object>}
 */
export const createPost = async (postData) => {
  // TODO: 实现创建帖子
  return apiClient.post('/community/posts', postData);
};

/**
 * 点赞帖子
 * @param {string} postId - 帖子 ID
 * @returns {Promise<Object>}
 */
export const likePost = async (postId) => {
  // TODO: 实现点赞帖子
  return apiClient.post(`/community/posts/${postId}/like`);
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
  likePost,
  getComments,
  createComment,
};
