/**
 * 规划生成成功页面
 * 显示成功动画和统计信息
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/src/constants';
import { useAppDispatch } from '@/src/store/hooks';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const planningData = params.data ? JSON.parse(params.data) : null;
  
  const [scale] = useState(new Animated.Value(0));
  const [fadeIn] = useState(new Animated.Value(0));

  // 模拟生成的规划数据
  const planStats = {
    stages: 6,      // 阶段数
    tasks: 24,      // 任务数
    months: 12,     // 预计月数
  };

  useEffect(() => {
    // 成功动画
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 查看规划
  const handleViewPlan = () => {
    // TODO: 将生成的规划保存到 Redux
    // dispatch(setActivePlan(generatedPlan));
    
    // 跳转到规划详情页
    router.replace('/planning/1'); // 临时使用固定ID，实际应该使用生成的规划ID
  };

  // 稍后再看
  const handleLater = () => {
    // 返回到首页或规划列表
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* 成功动画 */}
        <Animated.View
          style={[
            styles.successIconContainer,
            { transform: [{ scale }] },
          ]}
        >
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.infoContainer, { opacity: fadeIn }]}>
          {/* 标题 */}
          <Text style={styles.title}>🎉 规划生成成功！</Text>
          <Text style={styles.subtitle}>
            你的{planningData?.country?.name || ''}
            {planningData?.goalType === 'study' ? '留学' : planningData?.goalType === 'work' ? '工作' : '移民'}
            规划已经准备好了
          </Text>

          {/* 统计信息 */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{planStats.stages}</Text>
              <Text style={styles.statLabel}>个阶段</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{planStats.tasks}</Text>
              <Text style={styles.statLabel}>项任务</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{planStats.months}</Text>
              <Text style={styles.statLabel}>个月</Text>
            </View>
          </View>

          {/* 特性列表 */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>详细的时间线规划</Text>
            </View>
            
            <View style={styles.featureRow}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>完整的材料清单</Text>
            </View>
            
            <View style={styles.featureRow}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>智能提醒和跟踪</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.laterButton}
          onPress={handleLater}
        >
          <Text style={styles.laterButtonText}>稍后再看</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={handleViewPlan}
        >
          <Text style={styles.viewButtonText}>查看我的规划</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 40,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 24,
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.primary[600]}08`,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.gray[700],
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  laterButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  viewButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

