/**
 * Tabs 首页 - 内容发现中心
 * 统一结构：搜索栏 + 快捷工具 + 我的规划 + 推荐内容 Feed
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  DailyCheckIn,
  EmptyPlanCard,
  GreetingHeader,
  InterestTags,
  PlanCard,
  QuickToolsGrid,
  SearchBar,
  UnifiedFeed,
} from '@/src/components/home';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/store/hooks';

export default function Home() {
  const { userInfo } = useAuth();
  const router = useRouter();
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

  // 处理通知
  const handleNotification = () => {
    console.log('打开通知');
    // router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>GoAbroad</Text>
          <Text style={styles.subtitle}>留学规划助手</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotification}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.gray[700]} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
        {/* 1. 搜索栏（固定） */}
        <SearchBar />

        {/* 2. 快捷工具（固定） */}
        <QuickToolsGrid />

        {/* 3. 问候区 + 倒计时 */}
        <GreetingHeader
          userName={userInfo?.nickname || userInfo?.name || '用户'}
          targetDate={isHasPlan ? userPlan?.targetDate : null}
          targetCountry={isHasPlan ? userPlan?.targetCountry : null}
        />

        {/* 4. 我的规划卡片（有计划显示，无计划显示创建入口） */}
        {isHasPlan ? (
          <PlanCard plan={userPlan} />
        ) : (
          <EmptyPlanCard />
        )}

        {/* 5. 每日签到/任务系统 */}
        <DailyCheckIn />

        {/* 6. 个性化兴趣标签 */}
        <InterestTags />

        {/* 7. 统一推荐内容 Feed（混合：国家、攻略、社区热帖） */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary[600],
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray[500],
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.error[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  bottomPlaceholder: {
    height: 40,
  },
});
