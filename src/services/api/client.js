/**
 * GoAbroad API 客户端配置
 * 基于 axios 封装的统一 HTTP 请求客户端
 */

import ENV_CONFIG from '@/src/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API 基础配置
export const API_CONFIG = {
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// 创建 axios 实例
const apiClient = axios.create(API_CONFIG);

/**
 * 获取存储的 token
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('获取 token 失败:', error);
    return null;
  }
};

/**
 * 设置存储的 token
 * @param {string} token
 */
export const setAuthToken = async (token) => {
  console.log('设置 token', token);
  try {
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  } catch (error) {
    console.error('设置 token 失败:', error);
  }
};

/**
 * 清除存储的 token
 */
export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('清除 token 失败:', error);
  }
};

/**
 * 设置默认请求头
 * @param {string} key - Header 键名
 * @param {string} value - Header 值
 */
export const setDefaultHeader = (key, value) => {
  apiClient.defaults.headers.common[key] = value;
};

/**
 * 移除默认请求头
 * @param {string} key - Header 键名
 */
export const removeDefaultHeader = (key) => {
  delete apiClient.defaults.headers.common[key];
};

// 导出 axios 实例
export default apiClient;
