import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components';

export default function GoalPreviewScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>我的出国规划</Text>
        <Text style={styles.description}>
          这里将展示 AI 生成的详细规划内容，包括时间轴、关键任务和建议。后续可接入真实数据。
        </Text>
        <Button fullWidth style={styles.primaryButton} onPress={() => router.replace('/(tabs)/home')}>
          返回首页
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 8,
  },
});


