/**
 * GoAbroad API 拦截器
 * 处理请求和响应的拦截、错误处理等
 */

import { store } from '@/src/store';
import { logoutUser, refreshToken as refreshAuthToken } from '@/src/store/slices/authSlice';
import { showToast } from '@/src/store/slices/uiSlice';
import apiClient, { clearAuthToken, getAuthToken } from './client';

// 正在刷新 token 的标志
let isRefreshing = false;
// 待重试的请求队列
let refreshSubscribers = [];

/**
 * 添加请求到队列
 * @param {Function} callback
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * 执行队列中的所有请求
 * @param {string} token - 新的 token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * 请求拦截器
 */
apiClient.interceptors.request.use(
  async (config) => {
    // 添加请求元数据（用于计算耗时）
    config.metadata = { startTime: Date.now() };
    
    // 添加 token 到请求头
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
apiClient.interceptors.response.use(
  (response) => {
    // 计算请求耗时
    const duration = Date.now() - response.config.metadata.startTime;
    
    // 返回响应数据
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 处理网络错误
    if (!error.response) {
      console.error('[API Network Error]', error.message);
      store.dispatch(showToast({
        type: 'error',
        message: '网络连接失败，请检查网络设置',
      }));
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: '网络连接失败',
        originalError: error,
      });
    }
    
    const { status, data } = error.response;
    
    // 处理 401 未授权错误（token 过期）
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新 token，将请求加入队列
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // 尝试刷新 token
        const result = await store.dispatch(refreshAuthToken()).unwrap();
        const newToken = result.token;
        
        // 更新请求头中的 token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // 执行队列中的请求
        onTokenRefreshed(newToken);
        isRefreshing = false;
        
        // 重试原始请求
        return apiClient(originalRequest);
      } catch (refreshError) {
        // token 刷新失败，退出登录
        isRefreshing = false;
        refreshSubscribers = [];
        
        await clearAuthToken();
        store.dispatch(logoutUser());
        store.dispatch(showToast({
          type: 'error',
          message: '登录已过期，请重新登录',
        }));
        
        return Promise.reject({
          code: 'AUTH_EXPIRED',
          message: '登录已过期',
          originalError: refreshError,
        });
      }
    }
    
    // 处理 403 禁止访问
    if (status === 403) {
      store.dispatch(showToast({
        type: 'error',
        message: '没有权限访问该资源',
      }));
      return Promise.reject({
        code: 'FORBIDDEN',
        message: '没有权限访问',
        originalError: error,
      });
    }
    
    // 处理 404 未找到
    if (status === 404) {
      return Promise.reject({
        code: 'NOT_FOUND',
        message: '请求的资源不存在',
        originalError: error,
      });
    }
    
    // 处理服务器错误
    if (status >= 500) {
      store.dispatch(showToast({
        type: 'error',
        message: '服务器错误，请稍后重试',
      }));
      return Promise.reject({
        code: 'SERVER_ERROR',
        message: '服务器错误',
        originalError: error,
      });
    }
    
    // 返回业务错误
    const errorMessage = data?.message || error.message || '请求失败';
    return Promise.reject({
      code: data?.code || 'UNKNOWN_ERROR',
      message: errorMessage,
      data: data,
      originalError: error,
    });
  }
);

export default apiClient;
