/**
 * Tabs 首页
 * 简洁的首页，只包含推荐内容和最新攻略
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  HomeNavigationBar,
  LifeTab,
  OtherTab,
  RecommendFeed,
  StudyTab,
  VisaTab,
  WorkTab
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

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <HomeNavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={openDrawer}
      />

      {/* 内容区域 - 根据activeTab显示不同内容 */}
      {activeTab === 'recommend' && <RecommendFeed />}
      {activeTab === 'study' && <StudyTab />}
      {activeTab === 'work' && <WorkTab />}
      {activeTab === 'visa' && <VisaTab />}
      {activeTab === 'life' && <LifeTab />}
      {activeTab === 'other' && <OtherTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
});
