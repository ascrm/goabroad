/**
 * GoAbroad 根布局
 * 配置 Redux Provider、字体加载、导航等
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from '@/src/context/ThemeContext';
import { persistor, store } from '@/src/store';
// 导入 API 核心以确保拦截器被初始化
import '@/src/services/api';

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
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <View style={{ flex: 1 }}>
                <RootNavigator />
              </View>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
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

      {/* Tabs 标签页 */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* 独立流程 */}
      <Stack.Screen name="(pages)/planner/goal-setting" options={{ headerShown: false }} />
      <Stack.Screen name="(pages)/planner/loading" options={{ headerShown: false }} />
      <Stack.Screen name="(pages)/planner/preview" options={{ headerShown: false }} />

      {/* 个人中心扩展页面 */}
      <Stack.Screen name="(pages)/profile/profile-detail" options={{ headerShown: false }} />
      <Stack.Screen name="(pages)/profile/account" options={{ headerShown: false }} />
      <Stack.Screen name="(pages)/profile/settings" options={{ headerShown: false }} />
    </Stack>
  );
}

