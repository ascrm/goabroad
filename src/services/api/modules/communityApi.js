/**
 * GoAbroad 社区相关 API
 * 处理帖子、评论、点赞、收藏等
 * 
 * 注意：根据 2024-10-29 API文档更新
 * - 所有ID为数字类型
 * - tags从数组改为逗号分隔字符串
 * - 移除videos字段（posts表无此字段）
 * - 添加summary字段（用于列表展示）
 * - 评论移除images字段，添加replyToUserId
 */

import apiClient from '../client';

// ==================== 5.1 获取帖子列表 ====================
/**
 * 获取帖子列表（支持筛选）
 * @param {Object} params - 查询参数
 * @param {string} [params.tab] - Tab类型 (recommend, following, country, stage)
 * @param {string} [params.country] - 国家筛选 (US, UK, CA...)
 * @param {string} [params.stage] - 阶段筛选 (preparation, applying, waiting...)
 * @param {string} [params.type] - 内容类型 (POST, QUESTION, TIMELINE, VLOG)
 * @param {string} [params.sort] - 排序方式 (latest, hot, recommended)
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 帖子列表
 */
export const getPosts = async (params = {}) => {
  const response = await apiClient.get('/community/posts', { params });
  return response;
};

// ==================== 5.2 获取帖子详情 ====================
/**
 * 获取帖子详情
 * @param {number} postId - 帖子 ID（数字类型）
 * @returns {Promise<Object>} 帖子详情
 */
export const getPostDetail = async (postId) => {
  const response = await apiClient.get(`/community/posts/${postId}`);
  return response;
};

// ==================== 5.3 发布帖子 ====================
/**
 * 发布新帖子
 * 
 * @param {Object} postData - 帖子数据
 * @param {string} postData.contentType - 内容类型 (TREND, QUESTION, ANSWER, GUIDE)
 * @param {string} postData.content - 内容（支持Markdown，必填）
 * @param {string} [postData.title] - 标题（QUESTION、GUIDE类型建议填写）
 * @param {string} [postData.summary] - 摘要（用于列表展示，不传则后端自动截取content前100字）
 * @param {string} [postData.category] - 分类标签（如：留学、签证、生活等）
 * @param {string} [postData.coverImage] - 封面图片URL
 * @param {Array<string>} [postData.mediaUrls] - 图片/视频URL数组（最多9张图片或1个视频）
 * @param {string} [postData.status='PUBLISHED'] - 发布状态 (DRAFT, PUBLISHED)
 * @param {boolean} [postData.allowComment=true] - 是否允许评论
 * @returns {Promise<Object>} 创建的帖子
 */
export const createPost = async (postData) => {
  const response = await apiClient.post('/community/posts', postData);
  return response;
};

// ==================== 5.4 编辑帖子 ====================
/**
 * 编辑已发布的帖子
 * @param {number} postId - 帖子 ID（数字类型）
 * @param {Object} postData - 更新的帖子数据
 * @returns {Promise<Object>} 更新后的帖子
 */
export const updatePost = async (postId, postData) => {
  const response = await apiClient.put(`/community/posts/${postId}`, postData);
  return response;
};

// ==================== 5.5 删除帖子 ====================
/**
 * 删除帖子
 * @param {number} postId - 帖子 ID（数字类型）
 * @returns {Promise<Object>} 删除结果
 */
export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/community/posts/${postId}`);
  return response;
};

// ==================== 5.6 点赞帖子 ====================
/**
 * 点赞或取消点赞帖子（toggle）
 * @param {number} postId - 帖子 ID（数字类型）
 * @returns {Promise<Object>} 点赞结果
 */
export const likePost = async (postId) => {
  const response = await apiClient.post(`/community/posts/${postId}/like`);
  return response;
};

// ==================== 5.7 收藏帖子 ====================
/**
 * 收藏或取消收藏帖子（toggle）
 * @param {number} postId - 帖子 ID（数字类型）
 * @returns {Promise<Object>} 收藏结果
 */
export const collectPost = async (postId) => {
  const response = await apiClient.post(`/community/posts/${postId}/collect`);
  return response;
};

// ==================== 5.8 获取评论列表 ====================
/**
 * 获取帖子的评论列表
 * @param {number} postId - 帖子 ID（数字类型）
 * @param {Object} params - 查询参数
 * @param {string} [params.sort='latest'] - 排序方式 (latest, hot)
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 评论列表
 */
export const getComments = async (postId, params = {}) => {
  const { sort = 'latest', page = 1, pageSize = 20 } = params;
  const response = await apiClient.get(`/community/posts/${postId}/comments`, {
    params: { sort, page, pageSize },
  });
  return response;
};

// ==================== 5.9 发表评论 ====================
/**
 * 发表评论或回复
 * @param {number} postId - 帖子 ID（数字类型）
 * @param {Object} commentData - 评论数据
 * @param {string} commentData.content - 评论内容
 * @param {number} [commentData.parentId] - 父评论ID（回复时）
 * @param {number} [commentData.replyToUserId] - 回复的用户ID（回复时）
 * @returns {Promise<Object>} 创建的评论
 */
export const createComment = async (postId, commentData) => {
  const response = await apiClient.post(`/community/posts/${postId}/comments`, commentData);
  return response;
};

// ==================== 5.10 删除评论 ====================
/**
 * 删除评论
 * @param {number} postId - 帖子 ID（数字类型）
 * @param {number} commentId - 评论 ID（数字类型）
 * @returns {Promise<Object>} 删除结果
 */
export const deleteComment = async (postId, commentId) => {
  const response = await apiClient.delete(`/community/posts/${postId}/comments/${commentId}`);
  return response;
};

// ==================== 5.11 点赞评论 ====================
/**
 * 点赞或取消点赞评论（toggle）
 * @param {number} postId - 帖子 ID（数字类型）
 * @param {number} commentId - 评论 ID（数字类型）
 * @returns {Promise<Object>} 点赞结果
 */
export const likeComment = async (postId, commentId) => {
  const response = await apiClient.post(`/community/posts/${postId}/comments/${commentId}/like`);
  return response;
};

// ==================== 5.12 举报帖子/评论 ====================
/**
 * 举报违规内容
 * @param {Object} reportData - 举报数据
 * @param {string} reportData.type - 类型 (post, comment)
 * @param {string} reportData.targetId - 目标ID
 * @param {string} reportData.reason - 举报原因 (spam, inappropriate, false_info, other)
 * @param {string} [reportData.description] - 详细说明
 * @returns {Promise<Object>} 举报结果
 */
export const reportContent = async (reportData) => {
  const response = await apiClient.post('/community/reports', reportData);
  return response;
};

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
  deleteComment,
  likeComment,
  reportContent,
};
