/**
 * 空状态卡片组件
 * 当用户还没有创建出国计划时展示
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const EmptyPlanCard = () => {
  const router = useRouter();

  const handleStartPlanning = () => {
    console.log('开始规划');
    // TODO: 跳转到规划创建流程
    // router.push('/plan/create');
  };

  return (
    <View style={styles.container}>
      {/* 空状态插画 */}
      <View style={styles.illustrationContainer}>
        <EmptyStateIllustration />
      </View>

      {/* 提示文案 */}
      <Text style={styles.title}>还没有出国计划？</Text>
      <Text style={styles.subtitle}>让我们帮你规划吧！</Text>

      {/* 开始规划按钮 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleStartPlanning}
        activeOpacity={0.8}
      >
        <Ionicons name="rocket" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>开始规划</Text>
      </TouchableOpacity>
    </View>
  );
};

// 空状态插画组件（使用 travelers_blanket.svg 的简化版本）
const EmptyStateIllustration = () => {
  return (
    <View style={styles.illustration}>
      {/* 使用简单的图标组合表示旅行场景 */}
      <View style={styles.iconCircle}>
        <Ionicons name="airplane" size={48} color={COLORS.primary[600]} />
      </View>
      <View style={styles.decorativeElements}>
        <View style={[styles.dotSmall, { top: 10, left: 20 }]} />
        <View style={[styles.dotMedium, { top: 30, right: 15 }]} />
        <View style={[styles.dotSmall, { bottom: 20, left: 30 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    // 阴影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  illustration: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dotSmall: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[200],
  },
  dotMedium: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary[300],
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    // 阴影
    shadowColor: COLORS.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default EmptyPlanCard;

