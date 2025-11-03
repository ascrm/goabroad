/**
 * GoAbroad 工具相关 API
 * 处理各种工具的数据接口
 * 
 * 包括：费用计算器、汇率查询、GPA转换、选校定位、签证预约查询、
 *       语言考试日期查询、时差查询、院校对比等
 */

import apiClient from '../client';

// ==================== 6.1 费用计算器 ====================
/**
 * 计算留学费用
 * @param {Object} params - 计算参数
 * @param {string} params.country - 目标国家代码（如 "US"）
 * @param {string} params.schoolType - 学校类型 (public, private)
 * @param {string} params.region - 地区 (east_coast, west_coast, midwest, south)
 * @param {number} params.duration - 年数
 * @param {number} [params.tuition] - 自定义学费
 * @param {string} params.accommodation - 住宿类型 (on_campus, off_campus)
 * @param {string} params.lifestyle - 生活方式 (low, medium, high)
 * @returns {Promise<Object>} 费用明细和总计
 */
export const calculateStudyCost = async (params) => {
  const response = await apiClient.post('/tools/calculate/cost', params);
  return response;
};

// ==================== 6.2 获取实时汇率 ====================
/**
 * 获取实时汇率
 * @param {string} from - 源货币代码（如 "USD"）
 * @param {string} to - 目标货币代码（如 "CNY"）
 * @param {number} [amount] - 金额（可选，返回转换后金额）
 * @returns {Promise<Object>} 汇率信息
 */
export const getExchangeRate = async (from, to, amount) => {
  const response = await apiClient.get('/tools/exchange-rate', {
    params: { from, to, amount },
  });
  return response;
};

// ==================== 6.3 GPA转换 ====================
/**
 * GPA换算（支持多种算法）
 * @param {Object} params - GPA参数
 * @param {string} params.fromSystem - 源系统 (chinese_100, us_4.0, uk_class, etc.)
 * @param {string} params.toSystem - 目标系统 (us_4.0, uk_class, etc.)
 * @param {number} params.score - 分数
 * @param {string} [params.algorithm='wes'] - 算法 (wes, standard, custom)
 * @returns {Promise<Object>} 转换结果
 */
export const convertGPA = async (params) => {
  const response = await apiClient.post('/tools/gpa/convert', params);
  return response;
};

// ==================== 6.4 选校定位工具 ====================
/**
 * 根据用户条件推荐匹配的学校
 * @param {Object} params - 选校参数
 * @param {string} params.country - 目标国家代码
 * @param {string} params.degree - 学位类型 (bachelor, master, phd)
 * @param {string} params.major - 专业名称
 * @param {number} params.gpa - GPA成绩
 * @param {Object} [params.languageTest] - 语言考试成绩
 * @param {string} params.languageTest.type - 考试类型 (toefl, ielts)
 * @param {number} params.languageTest.score - 分数
 * @param {Object} [params.standardizedTest] - 标准化考试成绩
 * @param {string} params.standardizedTest.type - 考试类型 (gre, gmat)
 * @param {number} params.standardizedTest.score - 分数
 * @param {number} [params.budget] - 年度预算（USD）
 * @param {Object} [params.preferences] - 偏好设置
 * @returns {Promise<Object>} 推荐学校列表
 */
export const matchSchools = async (params) => {
  const response = await apiClient.post('/tools/school-match', params);
  return response;
};

// ==================== 6.5 签证预约查询 ====================
/**
 * 查询签证预约可用时间
 * @param {string} country - 目标国家代码（如 "US"）
 * @param {string} visaType - 签证类型（如 "F1"）
 * @param {string} city - 城市（beijing, shanghai, guangzhou, chengdu, shenyang）
 * @returns {Promise<Object>} 可用预约时间
 */
export const getVisaAppointments = async (country, visaType, city) => {
  const response = await apiClient.get('/tools/visa-appointments', {
    params: { country, visaType, city },
  });
  return response;
};

// ==================== 6.6 语言考试日期查询 ====================
/**
 * 查询托福、雅思等考试日期
 * @param {string} testType - 考试类型（toefl, ielts, gre, gmat）
 * @param {string} city - 城市
 * @param {string} startDate - 开始日期（YYYY-MM-DD）
 * @param {string} endDate - 结束日期（YYYY-MM-DD）
 * @returns {Promise<Object>} 考试日期列表
 */
export const getTestDates = async (testType, city, startDate, endDate) => {
  const response = await apiClient.get('/tools/test-dates', {
    params: { testType, city, startDate, endDate },
  });
  return response;
};

// ==================== 6.7 时差查询 ====================
/**
 * 查询时差
 * @param {string} from - 源时区（如 "Asia/Shanghai"）
 * @param {string} to - 目标时区（如 "America/New_York"）
 * @returns {Promise<Object>} 时差信息
 */
export const getTimezone = async (from, to) => {
  const response = await apiClient.get('/tools/timezone', {
    params: { from, to },
  });
  return response;
};

// ==================== 6.8 院校对比 ====================
export default {
  calculateStudyCost,
  getExchangeRate,
  convertGPA,
  matchSchools,
  getVisaAppointments,
  getTestDates,
  getTimezone,
};
