/**
 * GoAbroad API 核心
 * - 配置 axios 客户端
 * - 统一管理 token
 * - 安装请求/响应拦截器
 * - 暴露业务 API（目前仅认证）
 */

import axios from 'axios';

import ENV_CONFIG from '@/src/config/env';
import { setupApiInterceptors } from './interceptor';
import createAuthModule from './modules/auth';
import createUserModule from './modules/user';

/**
 * Axios 基础配置
 */
export const API_CONFIG = {
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * Axios 客户端实例
 */
export const apiClient = axios.create(API_CONFIG);

export const setDefaultHeader = (key, value) => {
  apiClient.defaults.headers.common[key] = value;
};

export const removeDefaultHeader = (key) => {
  delete apiClient.defaults.headers.common[key];
};

setupApiInterceptors(apiClient);

/**
 * 模块聚合
 */
const authApi = createAuthModule({ apiClient });
const userApi = createUserModule({ apiClient });

export { injectStore } from './interceptor';
export { authApi, userApi };

export const auth = authApi;
export const user = userApi;

export const api = {
  auth: authApi,
  user: userApi,
};

export default api;
