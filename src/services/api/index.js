/**
 * GoAbroad API 统一导出
 * 提供所有 API 模块的统一入口
 */

// 导出 API 客户端和工具函数
export {
  API_CONFIG, default as apiClient, clearAuthToken, getAuthToken, removeDefaultHeader, setAuthToken, setDefaultHeader
} from './client';

// 导出认证 API 模块
export { default as authApi } from './modules/authApi';
export * as auth from './modules/authApi';

/**
 * 统一的 API 对象
 * 使用示例：
 * import { api } from '@/services/api';
 * api.auth.login({ email, password });
 */
export const api = {
  auth: require('./modules/authApi').default,
};

// 默认导出 API 对象
export default api;
