/**
 * GoAbroad 国家信息相关 API
 * 处理国家列表、详情、搜索等
 * 
 * TODO: 后续开发时实现具体功能
 */

import apiClient from '../client';

/**
 * 获取国家列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>}
 */
export const getCountries = async (params) => {
  // TODO: 实现获取国家列表
  return apiClient.get('/countries', { params });
};

/**
 * 获取国家详情
 * @param {string} countryId - 国家 ID
 * @returns {Promise<Object>}
 */
export const getCountryDetail = async (countryId) => {
  // TODO: 实现获取国家详情
  return apiClient.get(`/countries/${countryId}`);
};

/**
 * 搜索国家
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Object>}
 */
export const searchCountries = async (keyword) => {
  // TODO: 实现国家搜索
  return apiClient.get('/countries/search', {
    params: { keyword },
  });
};

// 更多 API 方法待实现...

export default {
  getCountries,
  getCountryDetail,
  searchCountries,
};
