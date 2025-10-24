/**
 * GoAbroad 入口页面
 * 根据登录状态导航到相应页面
 */

import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useAuth } from '@/src/store/hooks';

export default function Index() {
  const { isLoggedIn, loading } = useAuth();
  const onboardingCompleted = useSelector(state => state.user.preferences?.onboarding?.completed);

  useEffect(() => {
    // 等待 Redux persist 恢复完成
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        // 已登录，检查是否完成引导
        if (onboardingCompleted) {
          // 完成引导，跳转到 Tabs 首页
          router.replace('/(tabs)');
        } else {
          // 未完成引导，跳转到引导页
          router.replace('/(auth)/interests');
        }
      } else {
        // 未登录，跳转到登录页
        router.replace('/(auth)/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, onboardingCompleted]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

