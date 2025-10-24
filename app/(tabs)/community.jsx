/**
 * 社区页面
 * 显示社区动态、帖子列表、互动等
 */

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';

export default function Community() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 占位内容 */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubbles" size={80} color={COLORS.primary[600]} />
        </View>
        <Text style={styles.title}>💬 社区</Text>
        <Text style={styles.subtitle}>功能开发中...</Text>
        <Text style={styles.description}>
          这里将展示社区动态、帖子列表、问答互动等内容
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

