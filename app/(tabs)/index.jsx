/**
 * Tabs 首页
 * 展示个性化推荐、我的计划、快捷工具等核心功能
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

import { EmptyPlanCard, GreetingHeader, HotCountries, LatestGuides, PlanCard, QuickTools, RecommendFeed } from '@/src/components/home';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/store/hooks';

export default function Home() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // 模拟用户计划数据（设置为 null 来测试无计划状态）
  const [userPlan] = useState(null); // 改为 null 显示无计划状态

  // 判断是否有计划
  const isHasPlan = userPlan !== null && userPlan !== undefined;

  // 下拉刷新
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    console.log('打开搜索');
    router.push('/search');
  };

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
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotification}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.gray[700]} />
            {/* 通知角标 */}
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
        {/* 问候区（仅在有计划时显示倒计时） */}
        <GreetingHeader
          userName={userInfo?.nickname || userInfo?.name || '用户'}
          targetDate={isHasPlan ? userPlan?.targetDate : null}
          targetCountry={isHasPlan ? userPlan?.targetCountry : null}
        />

        {/* 根据是否有计划显示不同内容 */}
        {isHasPlan ? (
          <>
            {/* 我的计划卡片 */}
            <PlanCard plan={userPlan} />

            {/* 快捷工具 */}
            <QuickTools />

            {/* 为你推荐 */}
            <RecommendFeed />
          </>
        ) : (
          <>
            {/* 空状态卡片 */}
            <EmptyPlanCard />

            {/* 热门目的地推荐 */}
            <HotCountries />

            {/* 最新攻略列表 */}
            <LatestGuides />
          </>
        )}

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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary[600],
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
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  bottomPlaceholder: {
    height: 40,
  },
});
