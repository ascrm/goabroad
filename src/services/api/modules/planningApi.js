/**
 * GoAbroad 规划相关 API
 * 处理留学规划创建、更新、进度、材料管理等
 * 
 * 注意：根据 2024-10-29 API文档更新
 * - 所有ID为数字类型
 * - country改为countryId（数字类型）
 * - 移除subType字段（可存在preferences JSONB中）
 * - currentStatus和preferences是JSONB字段
 */

import apiClient from '../client';

// ==================== 4.1 创建规划 ====================
/**
 * 创建新的出国规划
 * @param {Object} planData - 规划数据
 * @param {string} planData.country - 目标国家代码（如 "US"）
 * @param {string} planData.planType - 规划类型 (STUDY, WORK, IMMIGRATION)
 * @param {string} [planData.subType] - 子类型（bachelor, master, phd, work_visa等，存于preferences）
 * @param {string} planData.targetDate - 目标日期 (YYYY-MM-DD)
 * @param {Object} [planData.currentStatus] - 当前状态（JSONB）
 * @param {Object} [planData.preferences] - 偏好设置（JSONB）
 * @returns {Promise<Object>} 创建的规划
 */
export const createPlan = async (planData) => {
  const response = await apiClient.post('/plans', planData);
  return response;
};

// ==================== 4.2 获取规划列表 ====================
/**
 * 获取当前用户的所有规划
 * @param {Object} params - 查询参数
 * @param {string} [params.status] - 规划状态 (ACTIVE, COMPLETED, PAUSED, ARCHIVED)
 * @returns {Promise<Object>} 规划列表
 */
export const getPlans = async (params = {}) => {
  const response = await apiClient.get('/plans', { params });
  return response;
};

// ==================== 4.3 获取规划详情 ====================
/**
 * 获取指定规划的详细信息
 * @param {number} planId - 规划 ID（数字类型）
 * @returns {Promise<Object>} 规划详情（包含timeline、currentStatus、preferences）
 */
export const getPlanDetail = async (planId) => {
  const response = await apiClient.get(`/plans/${planId}`);
  return response;
};

// ==================== 4.4 更新规划 ====================
/**
 * 更新规划基本信息
 * @param {number} planId - 规划 ID（数字类型）
 * @param {Object} planData - 更新的规划数据
 * @param {string} [planData.targetDate] - 目标日期
 * @param {Object} [planData.currentStatus] - 更新的状态
 * @param {Object} [planData.preferences] - 更新的偏好
 * @returns {Promise<Object>} 更新后的规划
 */
export const updatePlan = async (planId, planData) => {
  const response = await apiClient.put(`/plans/${planId}`, planData);
  return response;
};

// ==================== 4.5 删除规划 ====================
/**
 * 删除规划（软删除，状态改为 archived）
 * @param {number} planId - 规划 ID（数字类型）
 * @returns {Promise<Object>} 删除结果
 */
export const deletePlan = async (planId) => {
  const response = await apiClient.delete(`/plans/${planId}`);
  return response;
};

// ==================== 4.6 更新任务状态 ====================
/**
 * 更新任务的完成状态
 * @param {number} planId - 规划 ID（数字类型）
 * @param {string} taskId - 任务 ID
 * @param {Object} taskData - 任务数据
 * @param {string} taskData.status - 任务状态 (NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED)
 * @param {string} [taskData.notes] - 备注
 * @returns {Promise<Object>} 更新结果
 */
export const updateTaskStatus = async (planId, taskId, taskData) => {
  const response = await apiClient.put(`/plans/${planId}/tasks/${taskId}`, taskData);
  return response;
};

// ==================== 4.7 获取材料清单 ====================
/**
 * 获取规划的材料清单
 * @param {number} planId - 规划 ID（数字类型）
 * @returns {Promise<Object>} 材料清单（分类：required, supporting, optional）
 */
export const getMaterials = async (planId) => {
  const response = await apiClient.get(`/plans/${planId}/materials`);
  return response;
};

// ==================== 4.8 更新材料状态 ====================
/**
 * 更新材料的状态
 * @param {number} planId - 规划 ID（数字类型）
 * @param {number} materialId - 材料 ID（数字类型）
 * @param {Object} materialData - 材料数据
 * @param {string} materialData.status - 材料状态 (NOT_STARTED, IN_PROGRESS, COMPLETED)
 * @param {string} [materialData.notes] - 备注
 * @returns {Promise<Object>} 更新结果
 */
export const updateMaterialStatus = async (planId, materialId, materialData) => {
  const response = await apiClient.put(`/plans/${planId}/materials/${materialId}`, materialData);
  return response;
};

// ==================== 4.9 上传材料文件 ====================
/**
 * 上传材料文件
 * @param {number} planId - 规划 ID（数字类型）
 * @param {number} materialId - 材料 ID（数字类型）
 * @param {File|Object} file - 文件对象
 * @returns {Promise<Object>} 上传结果
 */
export const uploadMaterialFile = async (planId, materialId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post(
    `/plans/${planId}/materials/${materialId}/files`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response;
};

// ==================== 4.10 删除材料文件 ====================
/**
 * 删除材料文件
 * @param {number} planId - 规划 ID（数字类型）
 * @param {number} materialId - 材料 ID（数字类型）
 * @param {number} fileId - 文件 ID（数字类型）
 * @returns {Promise<Object>} 删除结果
 */
export const deleteMaterialFile = async (planId, materialId, fileId) => {
  const response = await apiClient.delete(`/plans/${planId}/materials/${materialId}/files/${fileId}`);
  return response;
};

// ==================== 4.11 设置提醒 ====================
/**
 * 为任务或材料设置提醒
 * @param {number} planId - 规划 ID（数字类型）
 * @param {Object} reminderData - 提醒数据
 * @param {string} reminderData.type - 类型 (task, material, milestone)
 * @param {string} reminderData.targetId - 目标ID
 * @param {string} reminderData.title - 提醒标题
 * @param {string} reminderData.message - 提醒消息
 * @param {string} reminderData.remindTime - 提醒时间 (ISO 8601)
 * @returns {Promise<Object>} 创建的提醒
 */
export const createReminder = async (planId, reminderData) => {
  const response = await apiClient.post(`/plans/${planId}/reminders`, reminderData);
  return response;
};

// ==================== 4.12 获取提醒列表 ====================
/**
 * 获取规划的所有提醒
 * @param {number} planId - 规划 ID（数字类型）
 * @returns {Promise<Object>} 提醒列表
 */
export const getReminders = async (planId) => {
  const response = await apiClient.get(`/plans/${planId}/reminders`);
  return response;
};

// ==================== 4.13 导出材料清单 ====================
/**
 * 导出材料清单为 PDF 或 Excel
 * @param {number} planId - 规划 ID（数字类型）
 * @param {string} format - 导出格式 (pdf, excel)
 * @returns {Promise<Object>} 导出文件
 */
export const exportMaterials = async (planId, format = 'pdf') => {
  const response = await apiClient.get(`/plans/${planId}/materials/export`, {
    params: { format },
    responseType: 'blob', // 接收二进制文件
  });
  return response;
};

export default {
  createPlan,
  getPlans,
  getPlanDetail,
  updatePlan,
  deletePlan,
  updateTaskStatus,
  getMaterials,
  updateMaterialStatus,
  uploadMaterialFile,
  deleteMaterialFile,
  createReminder,
  getReminders,
  exportMaterials,
};
