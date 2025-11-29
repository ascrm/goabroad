/**
 * GoAbroad 认证状态管理
 * 管理用户登录状态、token、用户信息等
 */

import { authApi } from '@/src/services/api';
import { clearAuthToken, setAuthToken } from '@/src/utils/token';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  // 认证状态
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  
  // 用户信息
  userInfo: null,
  
  // 加载状态
  loading: false,
  error: null,
  
  // 登录方式
  loginMethod: null, // 'email', 'phone', 'wechat', 'apple'
  
  // 认证时间
  loginTime: null,
  tokenExpiry: null,
};

// 异步 thunks

/**
 * 用户登录（邮箱或手机号）
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ account, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ account, password });
      
      return {
        token: response?.data?.token,
        refreshToken: response?.data?.refreshToken || null,
        userInfo: response?.data?.user || response?.data?.userInfo,
        expiresIn: response?.data?.tokenTimeout || 2592000, // 默认30天
      };
    } catch (error) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

/**
 * 用户注册
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      
      return {
        token: response?.data?.token,
        refreshToken: response?.data?.refreshToken || null,
        userInfo: response?.data?.user || null, // 注册接口可能不返回用户信息
        expiresIn: response?.data?.tokenTimeout || 2592000, // 默认30天
      };
    } catch (error) {
      return rejectWithValue(error.message || '注册失败');
    }
  }
);

/**
 * 用户登出
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (error) {
      // 即使后端登出失败，前端也要清除状态
      return rejectWithValue(error.message || '登出失败');
    }
  }
);

/**
 * 刷新访问令牌
 * @note Sa-Token 默认有效期30天，后端暂未实现此接口
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshAccessToken(auth.refreshToken);
      
      return {
        token: response?.data?.token,
        refreshToken: response?.data?.refreshToken,
        expiresIn: response?.data?.tokenTimeout || 2592000,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Token 刷新失败');
    }
  }
);

/**
 * 更新用户信息
 */
export const updateUserInfo = createAsyncThunk(
  'auth/updateUserInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

// 创建 slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置登录方式
    setLoginMethod: (state, action) => {
      state.loginMethod = action.payload;
    },
    
    // 手动设置认证状态（用于调试或特殊场景）
    setAuthState: (state, action) => {
      const { isLoggedIn, token, userInfo } = action.payload;
      state.isLoggedIn = isLoggedIn;
      state.token = token;
      state.userInfo = userInfo;
      if (isLoggedIn) {
        state.loginTime = new Date().toISOString();
      }
    },
    
    // 清除认证状态
    clearAuth: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null;
      state.userInfo = null;
      state.loginTime = null;
      state.tokenExpiry = null;
      state.loginMethod = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.userInfo = action.payload.userInfo;
        state.loginTime = new Date().toISOString();
        state.tokenExpiry = new Date(Date.now() + action.payload.expiresIn * 1000).toISOString();
        state.error = null;
        
        // 保存 token 到 AsyncStorage
        setAuthToken(action.payload.token);
        
        console.log('✅ 登录成功，用户信息:', action.payload.userInfo);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 注册
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.userInfo = action.payload.userInfo;
        state.loginTime = new Date().toISOString();
        state.tokenExpiry = new Date(Date.now() + action.payload.expiresIn * 1000).toISOString();
        state.error = null;
        
        // 保存 token 到 AsyncStorage
        setAuthToken(action.payload.token);
        
        console.log('✅ 注册成功，用户信息:', action.payload.userInfo);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 登出
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.refreshToken = null;
        state.userInfo = null;
        state.loginTime = null;
        state.tokenExpiry = null;
        state.loginMethod = null;
        state.error = null;
        
        // 清除 token 存储
        clearAuthToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // 即使后端登出失败，前端也要清除状态
        state.loading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.refreshToken = null;
        state.userInfo = null;
        state.loginTime = null;
        state.tokenExpiry = null;
        state.loginMethod = null;
        state.error = action.payload;
        
        // 清除 token 存储
        clearAuthToken();
      })
      
      // 刷新 token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = new Date(Date.now() + action.payload.expiresIn * 1000).toISOString();
        
        // 保存新 token 到 AsyncStorage
        setAuthToken(action.payload.token);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        // token 刷新失败，清除认证状态
        state.isLoggedIn = false;
        state.token = null;
        state.refreshToken = null;
        state.userInfo = null;
        state.error = action.payload;
      })
      
      // 更新用户信息
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload };
      });
  },
});

// 导出 actions
export const { clearError, setLoginMethod, setAuthState, clearAuth } = authSlice.actions;

// Selectors
export const selectAuthUserInfo = (state) => state.auth.userInfo;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// 导出 reducer
export default authSlice.reducer;
