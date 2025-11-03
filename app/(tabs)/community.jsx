/**
 * 社区页面
 * 显示社区动态、帖子列表、互动等
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import FeedList from '@/src/components/community/FeedList';
import TrendingTopics from '@/src/components/community/TrendingTopics';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
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
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.community.activeTab);

  // 切换 Tab
  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  return (
    <View style={styles.container}>
      
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
    </View>
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
});

