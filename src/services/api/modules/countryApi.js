/**
 * GoAbroad 国家信息相关 API
 * 处理国家列表、详情、搜索等
 * 
 * 注意：根据 2024-10-29 API文档更新
 * - 所有ID为数字类型
 * - 移除flagUrl（数据库无此字段）
 * - region、language、currency、summary、tags在overview JSONB中
 * - difficulty改为difficultyRating（数字1-10）
 */

import apiClient from '../client';

// ==================== 3.1 获取国家列表 ====================
/**
 * 获取国家列表（支持筛选）
 * @param {Object} params - 查询参数
 * @param {string} [params.type] - 筛选类型 (all, hot, STUDY, WORK, IMMIGRATION)
 * @param {string} [params.region] - 地区筛选 (asia, europe, north_america, oceania, etc.)
 * @param {string} [params.language] - 语言筛选 (english, japanese, french, etc.)
 * @param {string} [params.cost] - 费用等级 (low, medium, high)
 * @param {string} [params.difficulty] - 难度等级 (easy, medium, hard)
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise<Object>} 国家列表
 */
export const getCountries = async (params = {}) => {
  const response = await apiClient.get('/countries', { params });
  return response;
};

// ==================== 3.2 获取国家详情 ====================
/**
 * 获取指定国家的详细信息
 * @param {number|string} countryId - 国家 ID 或国家代码 (如 "US", "UK")
 * @returns {Promise<Object>} 国家详情
 */
export const getCountryDetail = async (countryId) => {
  const response = await apiClient.get(`/countries/${countryId}`);
  return response;
};

// ==================== 3.3 搜索国家 ====================
// ==================== 3.4 收藏/取消收藏国家 ====================
/**
 * 收藏或取消收藏国家（toggle）
 * @param {number} countryId - 国家 ID（数字类型）
 * @returns {Promise<Object>} 收藏结果
 */
export const toggleCountryFavorite = async (countryId) => {
  const response = await apiClient.post(`/countries/${countryId}/favorite`);
  return response;
};

// ==================== 3.5 获取热门国家 ====================
/**
 * 获取热门国家列表
 * @param {number} [limit=10] - 数量限制
 * @returns {Promise<Object>} 热门国家列表
 */
export const getHotCountries = async (limit = 10) => {
  const response = await apiClient.get('/countries/hot', {
    params: { limit },
  });
  return response;
};

export default {
  getCountries,
  getCountryDetail,
  toggleCountryFavorite,
  getHotCountries,
};
