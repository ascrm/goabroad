/**
 * 创建规划入口（中间凸起按钮Tab）
 * 点击后自动跳转到创建规划页面
 */

import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COLORS } from '@/src/constants';

export default function CreatePlan() {
  // 使用 ref 来跟踪是否已经跳转过
  const hasNavigated = useRef(false);

  // 当页面获得焦点时执行跳转
  useFocusEffect(
    useCallback(() => {
      // 如果已经跳转过，说明用户是从创建页面返回的
      // 这时应该跳转到"我的规划"页面，而不是再次进入创建页面
      if (hasNavigated.current) {
        router.replace('/(tabs)/my-plans');
        hasNavigated.current = false;
        return;
      }

      // 首次进入，跳转到创建规划页面
      const timer = setTimeout(() => {
        hasNavigated.current = true;
        router.push('/planning/create');
      }, 50);

      return () => clearTimeout(timer);
    }, [])
  );

  // 显示一个加载指示器
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color={COLORS.primary[600]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
});
