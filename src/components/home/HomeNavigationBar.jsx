/**
 * 首页导航栏组件
 * 包含顶部固定栏和内容分类Tab栏
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  { id: 'recommend', label: '推荐' },
  { id: 'study', label: '留学' },
  { id: 'work', label: '工作'},
  { id: 'visa', label: '签证'},
  { id: 'life', label: '生活' },
  { id: 'guide', label: '其他' },
];

const HomeNavigationBar = ({ activeTab = 'recommend', onTabChange, onOpenDrawer }) => {
  const router = useRouter();
  const { userInfo } = useAuth();

  // 处理搜索
  const handleSearch = () => {
    router.push('/search');
  };

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
      {/* 顶部固定栏（第一层） */}
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

        {/* 中间：品牌Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            <Text style={styles.logoPrimary}>Go</Text>
            <Text style={styles.logoSecondary}>Abroad</Text>
          </Text>
        </View>

        {/* 右侧：搜索按钮 */}
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Ionicons name="search" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>
      </View>

      {/* 内容分类Tab栏（第二层） */}
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
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
  },
  logoPrimary: {
    color: COLORS.primary[600],
  },
  logoSecondary: {
    color: COLORS.primary[400],
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ===== Tab栏样式 =====
  tabBar: {
    height: 48,
  },
  tabScrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabItem: {
    minWidth: 64,
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  tabLabelActive: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
});

export default HomeNavigationBar;

