/**
 * 个人主页（X/Twitter 风格）
 * 显示用户完整信息、统计数据和 Tab 内容切换
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectAuthUserInfo } from '@/src/store/slices/authSlice';
import {
  selectStats,
  selectUserInfo,
} from '@/src/store/slices/profileSlice';
import {
  fetchUserPosts,
  selectUserPosts,
} from '@/src/store/slices/userSlice';

// X/Twitter 风格配色
const TWITTER_COLORS = {
    mainBg: '#FFFFFF',
    secondaryBg: '#F7F9F9',
    mainText: '#0F1419',
    secondaryText: '#536471',
    border: '#EFF3F4',
    link: '#1D9BF0',
};

export default function ProfileIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const userInfo = useAppSelector(selectUserInfo);
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const stats = useAppSelector(selectStats);
  const userPostsState = useAppSelector(selectUserPosts);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // posts, plans, favorites, replies

  // 使用 auth 或 profile 中的用户信息
  const displayUser = userInfo.id ? userInfo : authUserInfo || {};

  // 页面初始化
  useEffect(() => {
    if (displayUser.id && activeTab === 'posts') {
      loadPosts();
    }
  }, [displayUser.id, activeTab]);

  // 加载帖子
  const loadPosts = async () => {
    if (!displayUser.id) return;
    try {
      await dispatch(
        fetchUserPosts({
          userId: displayUser.id,
          page: 1,
          pageSize: 20,
        })
      ).unwrap();
    } catch (error) {
      console.error('加载帖子失败:', error);
    }
  };

  // 刷新用户信息
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (activeTab === 'posts') {
        await loadPosts();
      }
      // TODO: 刷新其他 Tab 的数据
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 渲染 Tab 按钮
  const renderTab = (key, label) => {
    const isActive = activeTab === key;
    return (
      <TouchableOpacity
        key={key}
        style={styles.tabButton}
        onPress={() => setActiveTab(key)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
        {isActive && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    );
  };

  // 格式化时间（相对时间）
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    }
    if (days > 0) return `${days}天`;
    if (hours > 0) return `${hours}小时`;
    if (minutes > 0) return `${minutes}分钟`;
    return '刚刚';
  };

  // 格式化数字
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // 渲染帖子列表项（X/Twitter 风格）
  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => router.push(`/community/post/${item.id}`)}
      activeOpacity={0.95}
    >
      <View style={styles.postContainer}>
        {/* 左侧头像 */}
        {displayUser.avatarUrl || displayUser.avatar ? (
          <Image
            source={{ uri: displayUser.avatarUrl || displayUser.avatar }}
            style={styles.postAvatar}
          />
        ) : (
          <View style={[styles.postAvatar, styles.postAvatarEmpty]}>
            <Ionicons name="person" size={20} color={TWITTER_COLORS.secondaryText} />
          </View>
        )}

        {/* 右侧内容 */}
        <View style={styles.postContent}>
          {/* 用户信息行 */}
          <View style={styles.postHeader}>
            <Text style={styles.postUserName}>
              {displayUser.nickname || displayUser.username || '用户'}
            </Text>
            <Text style={styles.postUserHandle}>
              {' '}@{displayUser.username || 'user'}
            </Text>
            <Text style={styles.postTime}> · {formatTime(item.createdAt)}</Text>
          </View>

          {/* 帖子内容 */}
          {item.title && (
            <Text style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Text>
          )}
          <Text style={styles.postText} numberOfLines={4}>
            {item.contentPreview || item.content || '暂无内容'}
          </Text>

          {/* 图片 */}
          {item.coverImage && (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

          {/* 交互工具栏 */}
          <View style={styles.postActions}>
            <View style={styles.actionItem}>
              <Ionicons name="chatbubble-outline" size={16} color={TWITTER_COLORS.secondaryText} />
              <Text style={styles.actionText}>{formatNumber(item.commentCount)}</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={item.isLiked ? '#F91880' : TWITTER_COLORS.secondaryText}
              />
              <Text style={[styles.actionText, item.isLiked && { color: '#F91880' }]}>
                {formatNumber(item.likeCount)}
              </Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="eye-outline" size={16} color={TWITTER_COLORS.secondaryText} />
              <Text style={styles.actionText}>{formatNumber(item.viewCount)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染 Tab 内容
  const renderTabContent = () => {
    if (activeTab === 'posts') {
      const posts = userPostsState?.items || [];
      const loading = userPostsState?.loading || false;

      if (loading) {
        return (
          <View style={styles.tabContentLoading}>
            <ActivityIndicator size="large" color={TWITTER_COLORS.link} />
          </View>
        );
      }

      if (posts.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={TWITTER_COLORS.border} />
            <Text style={styles.emptyText}>还没有发布任何内容</Text>
          </View>
        );
      }

      return (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.tabContentList}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    // 其他 Tab 的占位内容
    return (
      <View style={styles.emptyState}>
        <Ionicons name="folder-open-outline" size={64} color={TWITTER_COLORS.border} />
        <Text style={styles.emptyText}>
          {activeTab === 'plans' && '还没有创建行程'}
          {activeTab === 'favorites' && '还没有收藏内容'}
          {activeTab === 'replies' && '还没有回复'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.white}
          />
        }
      >
        {/* Banner 背景 */}
        <View style={styles.banner}>
          {/* 设置按钮 */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/profile/settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* 用户信息区域 */}
        <View style={styles.profileSection}>
          {/* 头像和编辑按钮行 */}
          <View style={styles.avatarRow}>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              {displayUser.avatarUrl || displayUser.avatar ? (
                <Image
                  source={{ uri: displayUser.avatarUrl || displayUser.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarEmpty]}>
                  <Ionicons name="person" size={36} color={TWITTER_COLORS.secondaryText} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/profile/edit')}
              activeOpacity={0.7}
            >
              <Text style={styles.editButtonText}>编辑资料</Text>
            </TouchableOpacity>
          </View>

          {/* 用户名和信息 */}
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>
              {displayUser.nickname || displayUser.username || '未设置昵称'}
            </Text>

            <Text style={styles.username}>
              @{displayUser.username || 'user'}
            </Text>

            {displayUser.signature || displayUser.bio ? (
              <Text style={styles.bio}>
                {displayUser.signature || displayUser.bio}
              </Text>
            ) : null}
          </View>

          {/* 统计数据 */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => router.push('/profile/following')}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>{stats.followingCount || 0}</Text>
              <Text style={styles.statLabel}> 正在关注</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statItem}
              onPress={() => router.push('/profile/followers')}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>{stats.followerCount || stats.followersCount || 0}</Text>
              <Text style={styles.statLabel}> 关注者</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab 导航 */}
        <View style={styles.tabBar}>
          {renderTab('posts', '帖子')}
          {renderTab('plans', '行程')}
          {renderTab('favorites', '收藏')}
          {renderTab('replies', '回复')}
        </View>

        {/* Tab 内容 */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ========== 容器 ==========
  container: {
    flex: 1,
    backgroundColor: TWITTER_COLORS.mainBg,
  },
  scroll: {
    flex: 1,
  },

  // ========== Banner 背景 ==========
  banner: {
    height: 150,
    backgroundColor: COLORS.primary[500],
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== 用户信息区域 ==========
  profileSection: {
    backgroundColor: TWITTER_COLORS.mainBg,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -40,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TWITTER_COLORS.secondaryBg,
    borderWidth: 4,
    borderColor: TWITTER_COLORS.mainBg,
  },
  avatarEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TWITTER_COLORS.border,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: TWITTER_COLORS.mainText,
  },

  // ========== 用户信息 ==========
  userInfo: {
    marginBottom: 12,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    color: TWITTER_COLORS.secondaryText,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: TWITTER_COLORS.mainText,
    lineHeight: 20,
    marginBottom: 12,
  },

  // ========== 统计数据 ==========
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
  },
  statLabel: {
    fontSize: 15,
    color: TWITTER_COLORS.secondaryText,
  },

  // ========== Tab 导航 ==========
  tabBar: {
    flexDirection: 'row',
    backgroundColor: TWITTER_COLORS.mainBg,
    borderBottomWidth: 1,
    borderBottomColor: TWITTER_COLORS.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: TWITTER_COLORS.secondaryText,
  },
  tabTextActive: {
    color: TWITTER_COLORS.mainText,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primary[500],
    borderRadius: 2,
  },

  // ========== Tab 内容 ==========
  tabContentList: {
    backgroundColor: TWITTER_COLORS.mainBg,
  },
  tabContentLoading: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TWITTER_COLORS.mainBg,
  },

  // ========== 帖子列表项 ==========
  postItem: {
    backgroundColor: TWITTER_COLORS.mainBg,
    borderBottomWidth: 1,
    borderBottomColor: TWITTER_COLORS.border,
  },
  postContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TWITTER_COLORS.secondaryBg,
  },
  postAvatarEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
  },
  postUserHandle: {
    fontSize: 15,
    color: TWITTER_COLORS.secondaryText,
  },
  postTime: {
    fontSize: 15,
    color: TWITTER_COLORS.secondaryText,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TWITTER_COLORS.mainText,
    lineHeight: 20,
    marginBottom: 4,
  },
  postText: {
    fontSize: 15,
    color: TWITTER_COLORS.mainText,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 48,
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: TWITTER_COLORS.secondaryText,
  },

  // ========== 空状态 ==========
  emptyState: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TWITTER_COLORS.mainBg,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: TWITTER_COLORS.secondaryText,
    marginTop: 16,
    textAlign: 'center',
  },
});

