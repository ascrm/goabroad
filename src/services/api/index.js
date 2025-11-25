/**
 * GoAbroad API 核心
 * - 配置 axios 客户端
 * - 统一管理 token
 * - 安装请求/响应拦截器
 * - 暴露业务 API（目前仅认证）
 */

import axios from 'axios';

import ENV_CONFIG from '@/src/config/env';
import { clearAuthToken, getAuthToken } from '@/src/utils/token';
import createAuthModule from './modules/auth';

let storeRef;
export const injectStore = (providedStore) => {
  storeRef = providedStore;
};

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

/**
 * Axios 拦截器
 */
let interceptorsInitialized = false;

const attachRequestInterceptor = () => {
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers = {
            ...(config.headers || {}),
            satoken: token,
          };
        }
      } catch (error) {
        console.warn('[API] 读取 token 失败:', error);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

const attachResponseInterceptor = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        console.warn('[API] 认证失效，清除本地状态');
        await clearAuthToken();
        if (storeRef) {
          storeRef.dispatch({ type: 'auth/clearAuth' });
        } else {
          console.warn('[API] store 未注入，无法派发清除认证动作');
        }
      }

      return Promise.reject(error);
    },
  );
};

export const setupApiInterceptors = () => {
  if (interceptorsInitialized) {
    return;
  }

  attachRequestInterceptor();
  attachResponseInterceptor();
  interceptorsInitialized = true;
};

setupApiInterceptors();

/**
 * 模块聚合
 */
const authApi = createAuthModule({ apiClient });

export const auth = authApi;
export { authApi };

export const api = {
  auth: authApi,
};

export default api;
