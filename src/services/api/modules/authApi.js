/**
 * GoAbroad 认证相关 API
 * 处理用户登录、注册、登出、密码重置等
 */

import apiClient, { clearAuthToken, setAuthToken } from '../client';

/**
 * 用户登录（邮箱密码）
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.email - 邮箱
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录响应数据
 */
export const login = async ({ account, password }) => {
  const response = await apiClient.post('/auth/login', {
    account,
    password,
  });
  
  // 登录成功后保存 token
  if (response.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 用户登录（手机号验证码）
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.phone - 手机号
 * @param {string} credentials.code - 验证码
 * @returns {Promise<Object>} 登录响应数据
 */
export const loginByPhone = async ({ phone, code }) => {
  const response = await apiClient.post('/auth/login/phone', {
    phone,
    code,
  });
  
  if (response.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 用户注册
 * @param {Object} userData - 用户注册信息
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @param {string} userData.name - 姓名
 * @param {string} [userData.phone] - 手机号（可选）
 * @param {string} [userData.verificationCode] - 验证码（可选）
 * @returns {Promise<Object>} 注册响应数据
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  
  if (response?.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 用户登出
 * @returns {Promise<Object>} 登出响应数据
 */
export const logout = async () => {
  // 先调用后端登出接口
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
 * 发送验证码
 * @param {Object} params - 参数
 * @param {string} params.phone - 手机号
 * @returns {Promise<Object>} 响应数据
 */
export const sendVerificationCode = async ({ phone }) =>
  await apiClient.get('/auth/send-sms-code', { params: { phone } });
  
/**
 * 验证邮箱
 * @param {Object} params - 参数
 * @param {string} params.email - 邮箱
 * @param {string} params.code - 验证码
 * @returns {Promise<Object>} 验证响应数据
 */
export const verifyEmail = async ({ email, code }) => {
  const response = await apiClient.post('/auth/verify-email', {
    email,
    code,
  });
  
  return response;
};

/**
 * 请求重置密码（发送重置链接或验证码）
 * @param {Object} params - 参数
 * @param {string} params.email - 邮箱
 * @returns {Promise<Object>} 响应数据
 */
export const requestPasswordReset = async ({ email }) => {
  const response = await apiClient.post('/auth/password/reset-request', {
    email,
  });
  
  return response;
};

/**
 * 重置密码
 * @param {Object} params - 参数
 * @param {string} params.email - 邮箱
 * @param {string} params.code - 验证码或 token
 * @param {string} params.newPassword - 新密码
 * @returns {Promise<Object>} 响应数据
 */
export const resetPassword = async ({ email, code, newPassword }) => {
  const response = await apiClient.post('/auth/password/reset', {
    email,
    code,
    newPassword,
  });
  
  return response;
};

/**
 * 修改密码（已登录状态）
 * @param {Object} params - 参数
 * @param {string} params.oldPassword - 旧密码
 * @param {string} params.newPassword - 新密码
 * @returns {Promise<Object>} 响应数据
 */
export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await apiClient.post('/auth/password/change', {
    oldPassword,
    newPassword,
  });
  
  return response;
};

/**
 * 第三方登录（微信）
 * @param {Object} params - 参数
 * @param {string} params.code - 微信授权码
 * @returns {Promise<Object>} 登录响应数据
 */
export const loginWithWechat = async ({ code }) => {
  const response = await apiClient.post('/auth/login/wechat', {
    code,
  });
  
  if (response.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 第三方登录（Apple）
 * @param {Object} params - 参数
 * @param {string} params.identityToken - Apple 身份令牌
 * @param {string} params.authorizationCode - Apple 授权码
 * @returns {Promise<Object>} 登录响应数据
 */
export const loginWithApple = async ({ identityToken, authorizationCode }) => {
  const response = await apiClient.post('/auth/login/apple', {
    identityToken,
    authorizationCode,
  });
  
  if (response.token) {
    await setAuthToken(response.token);
  }
  
  return response;
};

/**
 * 检查邮箱是否已注册
 * @param {string} email - 邮箱
 * @returns {Promise<Object>} 检查结果
 */
export const checkEmailExists = async (email) => {
  const response = await apiClient.get('/auth/check-email', {
    params: { email },
  });
  
  return response;
};

/**
 * 检查手机号是否已注册
 * @param {string} phone - 手机号
 * @returns {Promise<Object>} 检查结果
 */
export const checkPhoneExists = async (phone) => {
  const response = await apiClient.get('/auth/check-phone', {
    params: { phone },
  });
  
  return response;
};

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
  loginByPhone,
  register,
  logout,
  refreshAccessToken,
  sendVerificationCode,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  loginWithWechat,
  loginWithApple,
  checkEmailExists,
  checkPhoneExists,
  getCurrentUser,
};
