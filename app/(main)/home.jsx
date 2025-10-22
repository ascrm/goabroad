/**
 * 首页
 * 主要功能入口
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Screen } from '@/src/components';
import { useAppDispatch, useAuth } from '@/src/store/hooks';
import { logoutUser } from '@/src/store/slices/authSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { userInfo } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/(auth)/login');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="earth" size={60} color="#0066FF" />
          <Text style={styles.title}>欢迎来到 GoAbroad</Text>
          {userInfo && (
            <Text style={styles.subtitle}>你好，{userInfo.name || userInfo.email}</Text>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            这是首页占位页面。后续将添加：
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>• 国家推荐</Text>
            <Text style={styles.feature}>• 快速入口</Text>
            <Text style={styles.feature}>• 热门攻略</Text>
            <Text style={styles.feature}>• 社区动态</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            variant="outline"
            fullWidth
            onPress={handleLogout}
          >
            退出登录
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  features: {
    paddingLeft: 16,
  },
  feature: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  footer: {
    paddingVertical: 20,
  },
});

