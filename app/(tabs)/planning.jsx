/**
 * 规划页面
 * 显示用户的留学规划、时间线、任务等
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';

export default function Planning() {
  const plans = useSelector((state) => state.planning.plans);
  const hasPlans = plans && plans.length > 0;

  // 创建新规划
  const handleCreatePlan = () => {
    router.push('/planning/create');
  };

  // 空状态
  if (!hasPlans) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        {/* 空状态内容 */}
        <View style={styles.emptyContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={styles.emptyTitle}>还没有规划</Text>
          <Text style={styles.emptySubtitle}>
            创建你的第一个留学/工作/移民规划
          </Text>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePlan}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>创建规划</Text>
          </TouchableOpacity>
          
          {/* 功能介绍 */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>详细时间线</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>材料清单</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-done-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>任务跟踪</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 有规划时显示列表
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* TODO: 规划列表 */}
      <View style={styles.content}>
        <Text style={styles.title}>我的规划</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
    marginBottom: 48,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 16,
  },
});

