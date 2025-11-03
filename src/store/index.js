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

// 根 reducer
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  countries: countriesSlice,
  planning: planningSlice,
  community: communitySlice,
  profile: profileSlice,
  tools: toolsSlice,
  ui: uiSlice,
});

// Redux Persist 配置 - 只在根 reducer 层面持久化
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // 只持久化 auth 和 user 状态
  blacklist: ['ui', 'countries', 'planning', 'community', 'profile', 'tools'], // 其他状态不持久化
};

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
          'persist/FLUSH',
        ],
        // 忽略这些路径的序列化检查
        ignoredPaths: ['register', 'rehydrate'],
      },
      // 关闭不可变性检查以提升性能（生产环境）
      immutableCheck: __DEV__,
    }),
  // 开发环境启用 DevTools
  devTools: __DEV__,
});

// 创建 persistor
export const persistor = persistStore(store);

// 注意：如需 TypeScript 支持，请将文件重命名为 .ts 并取消注释以下类型定义
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
