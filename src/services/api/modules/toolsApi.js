/**
 * GoAbroad 工具相关 API
 * 处理各种工具的数据接口
 * 
 * TODO: 后续开发时实现具体功能
 */

import apiClient from '../client';

/**
 * 计算留学费用
 * @param {Object} params - 计算参数
 * @returns {Promise<Object>}
 */
export const calculateStudyCost = async (params) => {
  // TODO: 实现费用计算
  return apiClient.post('/tools/calculate/cost', params);
};

/**
 * 获取汇率
 * @param {string} from - 源货币
 * @param {string} to - 目标货币
 * @returns {Promise<Object>}
 */
export const getExchangeRate = async (from, to) => {
  // TODO: 实现获取汇率
  return apiClient.get('/tools/exchange-rate', {
    params: { from, to },
  });
};

/**
 * GPA 转换
 * @param {Object} params - GPA 参数
 * @returns {Promise<Object>}
 */
export const convertGPA = async (params) => {
  // TODO: 实现 GPA 转换
  return apiClient.post('/tools/gpa/convert', params);
};

// 更多 API 方法待实现...

export default {
  calculateStudyCost,
  getExchangeRate,
  convertGPA,
};
