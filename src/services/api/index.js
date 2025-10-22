/**
 * GoAbroad API 统一导出
 * 提供所有 API 模块的统一入口
 */

// 导出 API 客户端和工具函数
export {
  API_CONFIG, default as apiClient, clearAuthToken, getAuthToken, removeDefaultHeader, setAuthToken, setDefaultHeader
} from './client';

// 导出各个 API 模块
export { default as authApi } from './modules/authApi';
export { default as communityApi } from './modules/communityApi';
export { default as countryApi } from './modules/countryApi';
export { default as planningApi } from './modules/planningApi';
export { default as toolsApi } from './modules/toolsApi';
export { default as userApi } from './modules/userApi';

// 导出具名函数（方便按需导入）
export * as auth from './modules/authApi';
export * as community from './modules/communityApi';
export * as country from './modules/countryApi';
export * as planning from './modules/planningApi';
export * as tools from './modules/toolsApi';
export * as user from './modules/userApi';

/**
 * 统一的 API 对象
 * 使用示例：
 * import { api } from '@/services/api';
 * api.auth.login({ email, password });
 */
export const api = {
  auth: require('./modules/authApi').default,
  user: require('./modules/userApi').default,
  country: require('./modules/countryApi').default,
  planning: require('./modules/planningApi').default,
  community: require('./modules/communityApi').default,
  tools: require('./modules/toolsApi').default,
};

// 默认导出 API 对象
export default api;
