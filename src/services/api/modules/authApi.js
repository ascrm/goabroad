/**
 * GoAbroad 认证相关 API
 * 处理用户登录、注册、登出、密码重置等
 * 
 * 注意：根据 2024-10-29 API文档更新
 * - 使用 Sa-Token 认证框架
 * - Token默认存储在请求头的 `satoken` 字段中
 * - Token有效期默认为30天（2592000秒）
 * - 用户ID为数字类型
 * - avatar字段改为avatarUrl
 */

import apiClient, { clearAuthToken, setAuthToken } from '../client';

/**
 * 用户登录（手机号/邮箱 + 密码）
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.account - 手机号或邮箱
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录响应数据
 */
export const login = async ({ account, password }) => {
  const response = await apiClient.post('/auth/login', {
    account,
    password,
  });
  
  // 登录成功后保存 token（响应结构：response.data.token）
  if (response?.data?.token) {
    await setAuthToken(response.data.token);
  }
  
  return response;
};

/**
 * 用户注册
 * @param {Object} userData - 用户注册信息
 * @param {string} userData.phone - 手机号（必填，格式：1[3-9]开头的11位数字）
 * @param {string} userData.code - 短信验证码（必填，6位数字）
 * @param {string} userData.password - 密码（必填，长度6-20位）
 * @returns {Promise<Object>} 注册响应数据
 * @note 注册成功后会自动登录
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', {
    phone: userData.phone,
    code: userData.code,
    password: userData.password,
  });
  
  if (response?.data?.token) {
    await setAuthToken(response.data.token);
  }
  
  return response;
};

/**
 * 用户登出
 * @returns {Promise<Object>} 登出响应数据
 */
export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  // 清除本地 token
  await clearAuthToken();
  
  return response;
};

/**
 * 刷新访问令牌
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<Object>} 新的 token 数据
 */
export const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post('/auth/refresh', {
    refreshToken,
  });
  
  // 更新本地存储的 token
  if (response.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 发送短信验证码（用于注册）
 * @param {Object} params - 参数
 * @param {string} params.phone - 手机号（格式：1[3-9]开头的11位数字）
 * @returns {Promise<Object>} 响应数据
 * @note 验证码为6位数字，有效期为5分钟，保存在Redis中
 * @note 开发环境下验证码会打印在控制台日志中
 */
export const sendVerificationCode = async ({ phone }) =>
  await apiClient.get('/auth/send-sms-code', { params: { phone } });
  
/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response;
};

// 默认导出所有 API
export default {
  login,
  register,
  logout,
  refreshAccessToken,
  sendVerificationCode,
  getCurrentUser,
};
