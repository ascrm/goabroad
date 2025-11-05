/**
 * Tabs 首页
 * 简洁的首页，只包含推荐内容和最新攻略
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  HomeNavigationBar,
  LatestGuides,
  RecommendFeed
} from '@/src/components/home';
import { COLORS } from '@/src/constants';
import { useUserInfo } from '@/src/store/hooks';
import { useDrawer } from './_layout';

export default function Home() {
  const router = useRouter();
  const userInfo = useUserInfo();
  const { openDrawer } = useDrawer();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState('recommend');
  const [refreshing, setRefreshing] = useState(false);

  // 下拉刷新
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <HomeNavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={openDrawer}
      />

      {/* 内容区域 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[600]}
            colors={[COLORS.primary[600]]}
          />
        }
      >
        {/* 推荐内容信息流 */}
        <RecommendFeed activeTab={activeTab} />

        {/* 最新攻略 */}
        <LatestGuides />

        {/* 底部占位符 */}
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
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPlaceholder: {
    height: 40,
  },
});
