import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components';
import { useTheme } from '@/src/context/ThemeContext';

export default function GoalSettingLoading() {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.secondary || '#F3F4F6' },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="sparkles" size={28} color="#2563EB" />
        </View>
        <Text style={styles.title}>AI 正在生成您的出国计划</Text>
        <Text style={styles.subtitle}>
          根据您提供的信息，我们正在匹配最合适的路线与建议，请稍候片刻。
        </Text>

        {!ready ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>智能分析中...</Text>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Ionicons name="checkmark-circle" size={36} color="#22C55E" />
            <Text style={styles.resultText}>规划已生成，接下来你想做什么？</Text>
            <View style={styles.actions}>
              <Button
                fullWidth
                style={styles.previewButton}
                onPress={() => router.push('/(pages)/planner/preview')}
              >
                预览规划
              </Button>
              <Button
                fullWidth
                style={styles.confirmButton}
                onPress={() => router.replace('/(tabs)/home')}
              >
                确定并退出
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 4,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#475467',
  },
  resultBox: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  previewButton: {
    backgroundColor: '#1F2937',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
});


