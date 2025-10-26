/**
 * 社区页面
 * 显示社区动态、帖子列表、互动等
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import FeedList from '@/src/components/community/FeedList';
import TrendingTopics from '@/src/components/community/TrendingTopics';
import { COLORS } from '@/src/constants';
import { setActiveTab } from '@/src/store/slices/communitySlice';

const TABS = [
  { id: 'recommend', label: '推荐', icon: 'flame-outline' },
  { id: 'following', label: '关注', icon: 'heart-outline' },
  { id: 'video', label: '视频', icon: 'videocam-outline' },
  { id: 'question', label: '问答', icon: 'help-circle-outline' },
  { id: 'article', label: '攻略', icon: 'book-outline' },
];

export default function Community() {
  const router = useRouter();
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.community.activeTab);
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  // 切换 Tab
  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  // 发布按钮菜单
  const handlePublish = (type) => {
    setShowPublishMenu(false);
    // 导航到发布页面
    router.push('/community/create');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 顶部 Tab 栏 */}
      <View style={styles.tabBar}>
        <View style={styles.tabScrollContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.tabButtonActive,
              ]}
              onPress={() => handleTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? COLORS.primary[600] : COLORS.gray[600]}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 热门话题（仅在推荐 Tab 显示） */}
      {activeTab === 'recommend' && (
        <TrendingTopics onTopicPress={(topic) => console.log('Topic pressed:', topic)} />
      )}

      {/* Feed 流列表 */}
      <FeedList tab={activeTab} />

      {/* 右下角悬浮发布按钮 */}
      <View style={styles.fabContainer}>
        {showPublishMenu && (
          <>
            {/* 遮罩 */}
            <Pressable
              style={styles.fabOverlay}
              onPress={() => setShowPublishMenu(false)}
            />
            
            {/* 菜单选项 */}
            <View style={styles.fabMenu}>
              <TouchableOpacity
                style={styles.fabMenuItem}
                onPress={() => handlePublish('post')}
                activeOpacity={0.7}
              >
                <View style={styles.fabMenuIcon}>
                  <Ionicons name="document-text" size={20} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.fabMenuText}>发帖</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fabMenuItem}
                onPress={() => handlePublish('question')}
                activeOpacity={0.7}
              >
                <View style={styles.fabMenuIcon}>
                  <Ionicons name="help-circle" size={20} color={COLORS.info[600]} />
                </View>
                <Text style={styles.fabMenuText}>提问</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fabMenuItem}
                onPress={() => handlePublish('video')}
                activeOpacity={0.7}
              >
                <View style={styles.fabMenuIcon}>
                  <Ionicons name="videocam" size={20} color={COLORS.error[600]} />
                </View>
                <Text style={styles.fabMenuText}>视频</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* 主按钮 */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowPublishMenu(!showPublishMenu)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showPublishMenu ? 'close' : 'add'}
            size={28}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    paddingVertical: 8,
  },
  tabScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray[50],
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary[50],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 1000,
    height: 1000,
    transform: [{ translateX: -1000 + 56 }, { translateY: -1000 + 56 }],
  },
  fabMenu: {
    position: 'absolute',
    bottom: 72,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fabMenuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fabMenuText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

