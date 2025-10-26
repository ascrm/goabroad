/**
 * Tabs 首页 - 简洁版内容发现中心
 * 优化后的结构：头像 + 通知 + 我的规划 + 推荐内容 Feed
 */

import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { EmptyPlanCard, PlanCard, UnifiedFeed } from '@/src/components/home';
import { COLORS } from '@/src/constants';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  // 模拟用户计划数据
  const [userPlan] = useState({
    id: '1',
    name: '美国研究生留学',
    targetCountry: '美国',
    targetDate: '2026-09-01',
    completedTasks: 12,
    totalTasks: 28,
    upcomingTasks: [
      {
        title: '准备托福考试报名',
        dueDate: '2025-11-15',
      },
      {
        title: '联系推荐信老师',
        dueDate: '2025-11-20',
      },
      {
        title: '完成个人陈述初稿',
        dueDate: '2025-12-01',
      },
    ],
  });

  // 判断是否有计划
  const isHasPlan = userPlan !== null && userPlan !== undefined;

  // 下拉刷新
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* 主内容区域 */}
      <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary[600]]}
              tintColor={COLORS.primary[600]}
            />
          }
        >
          {/* 我的规划卡片（有计划显示，无计划显示创建入口） */}
          {isHasPlan ? (
            <PlanCard plan={userPlan} />
          ) : (
            <EmptyPlanCard />
          )}

          {/* 统一推荐内容 Feed（混合：国家、攻略、社区热帖） */}
          <UnifiedFeed />

        {/* 底部占位 */}
        <View style={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  bottomPlaceholder: {
    height: 40,
  },
});
