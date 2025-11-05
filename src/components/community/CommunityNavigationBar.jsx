/**
 * 社区页面导航栏组件
 * 包含顶部固定栏和Tab栏
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from '@/src/components/ui/Avatar';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/store/hooks';

// Tab分类配置
const TABS = [
  { id: 'recommend', label: '为你推荐' },
  { id: 'following', label: '正在关注' },
];

const CommunityNavigationBar = ({ activeTab = 'recommend', onTabChange, onOpenDrawer }) => {
  const { userInfo } = useAuth();

  // 处理Tab切换
  const handleTabPress = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // 处理头像点击
  const handleAvatarPress = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部固定栏 */}
      <View style={styles.topBar}>
        {/* 左侧：用户头像 */}
        <TouchableOpacity
          onPress={handleAvatarPress}
          activeOpacity={0.7}
          style={styles.avatarButton}
        >
          <Avatar
            size="md"
            source={userInfo?.avatar}
            name={userInfo?.nickname || userInfo?.name || '用户'}
          />
        </TouchableOpacity>

        {/* 中间：社区标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>社区</Text>
        </View>

        {/* 右侧：占位元素，保持视觉平衡 */}
        <View style={styles.placeholder} />
      </View>

      {/* 分类Tab栏 */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive && styles.tabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  // ===== 顶部固定栏样式 =====
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  avatarButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  // ===== Tab栏样式 =====
  tabBar: {
    height: 48,
  },
  tabScrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  tabItem: {
    minWidth: 100,
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  tabLabelActive: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
});

export default CommunityNavigationBar;

