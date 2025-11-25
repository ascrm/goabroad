/**
 * GoAbroad Redux Store 閰嶇疆锛堢簿绠€鐗堬級
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        ignoredPaths: ['register', 'rehydrate'],
      },
      immutableCheck: __DEV__,
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);
