/**
 * GoAbroad Redux Store 配置
 * 集成 Redux Toolkit、Redux Persist 和 DevTools
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// 导入各个 slice
import authSlice from './slices/authSlice';
import communitySlice from './slices/communitySlice';
import countriesSlice from './slices/countriesSlice';
import planningSlice from './slices/planningSlice';
import profileSlice from './slices/profileSlice';
import toolsSlice from './slices/toolsSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';

// Redux Persist 配置
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // 只持久化 auth 和 user 状态
  blacklist: ['ui'], // UI 状态不持久化
};

// 各个模块的持久化配置
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'refreshToken', 'userInfo', 'isLoggedIn', 'loginTime', 'tokenExpiry', 'loginMethod'],
};

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['profile', 'preferences'],
};

// 根 reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  user: persistReducer(userPersistConfig, userSlice),
  countries: countriesSlice,
  planning: planningSlice,
  community: communitySlice,
  profile: profileSlice,
  tools: toolsSlice,
  ui: uiSlice,
});

// 持久化根 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store 配置
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的 action 类型
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  // 开发环境启用 DevTools
  devTools: __DEV__,
});

// 创建 persistor
export const persistor = persistStore(store);

// 注意：如需 TypeScript 支持，请将文件重命名为 .ts 并取消注释以下类型定义
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
