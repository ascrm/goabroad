/**
 * GoAbroad 根布局
 * 配置 Redux Provider、字体加载、导航等
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/src/store';
// 导入 API 拦截器以确保其被初始化
import '@/src/services/api/interceptors';

// 防止自动隐藏启动屏
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 可以在这里加载字体、资源等
        // await Font.loadAsync(Ionicons.font);
        
        // 模拟加载时间
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0066FF" />
          </View>
        }
        persistor={persistor}
      >
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}

function RootNavigator() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Auth 相关页面 */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      {/* Main 主应用 */}
      <Stack.Screen
        name="(main)"
        options={{
          headerShown: false,
        }}
      />

      {/* Tabs 标签页 */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* 其他模块 */}
      <Stack.Screen name="country" options={{ headerShown: false }} />
      <Stack.Screen name="planning" options={{ headerShown: false }} />
      <Stack.Screen name="community" options={{ headerShown: false }} />
      <Stack.Screen name="tools" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}

