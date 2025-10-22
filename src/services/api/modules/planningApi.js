/**
 * GoAbroad 规划相关 API
 * 处理留学规划创建、更新、进度、材料管理等
 * 
 * TODO: 后续开发时实现具体功能
 */

import apiClient from '../client';

/**
 * 创建规划
 * @param {Object} planData - 规划数据
 * @returns {Promise<Object>}
 */
export const createPlan = async (planData) => {
  // TODO: 实现创建规划
  return apiClient.post('/plans', planData);
};

/**
 * 获取规划列表
 * @returns {Promise<Object>}
 */
export const getPlans = async () => {
  // TODO: 实现获取规划列表
  return apiClient.get('/plans');
};

/**
 * 获取规划详情
 * @param {string} planId - 规划 ID
 * @returns {Promise<Object>}
 */
export const getPlanDetail = async (planId) => {
  // TODO: 实现获取规划详情
  return apiClient.get(`/plans/${planId}`);
};

/**
 * 更新规划进度
 * @param {string} planId - 规划 ID
 * @param {Object} progressData - 进度数据
 * @returns {Promise<Object>}
 */
export const updatePlanProgress = async (planId, progressData) => {
  // TODO: 实现更新规划进度
  return apiClient.put(`/plans/${planId}/progress`, progressData);
};

/**
 * 获取材料清单
 * @param {string} planId - 规划 ID
 * @returns {Promise<Object>}
 */
export const getMaterials = async (planId) => {
  // TODO: 实现获取材料清单
  return apiClient.get(`/plans/${planId}/materials`);
};

// 更多 API 方法待实现...

export default {
  createPlan,
  getPlans,
  getPlanDetail,
  updatePlanProgress,
  getMaterials,
};
