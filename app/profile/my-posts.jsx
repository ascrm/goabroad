/**
 * 我的发布页面（X/Twitter 风格）
 * 显示用户发布的帖子和动态
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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from '@/src/components/ui/Avatar';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectAuthUserInfo } from '@/src/store/slices/authSlice';
import {
  clearPosts,
  fetchUserPosts,
  selectUserPosts,
} from '@/src/store/slices/userSlice';

// X/Twitter 风格配色
const TWITTER_COLORS = {
  mainText: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E5E7EB',
  background: '#FFFFFF',
  hover: '#F9FAFB',
  likeRed: '#F91880',
  bookmarkBlue: '#1D9BF0',
};

export default function MyPosts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const userPostsState = useAppSelector(selectUserPosts);
  const posts = userPostsState?.items || [];
  const pagination = userPostsState?.pagination;
  const loading = userPostsState?.loading || false;
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 页面初始化时获取数据
  useEffect(() => {
    if (authUserInfo?.id) {
      loadPosts(1, 'all', true);
    }
    
    // 组件卸载时清空数据
    return () => {
      dispatch(clearPosts());
    };
  }, []);

  // 加载帖子列表
  const loadPosts = async (page = 1, type = 'all', isInitial = false) => {
    if (!authUserInfo?.id) return;
    
    try {
      await dispatch(
        fetchUserPosts({
          userId: authUserInfo.id,
          page,
          pageSize: 20,
          type,
        })
      ).unwrap();
    } catch (error) {
      console.error('加载帖子失败:', error);
    }
  };

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(1, 'all', true);
    setRefreshing(false);
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (loadingMore || loading || !pagination) return;
    
    const { currentPage, totalPages } = pagination;
    if (currentPage >= totalPages) return;
    
    setLoadingMore(true);
    await loadPosts(currentPage + 1, 'all', false);
    setLoadingMore(false);
  };

  // 获取类型文本
  const getTypeText = (type) => {
    const map = {
      POST: '帖子',
      QUESTION: '提问',
      TIMELINE: '视频',
    };
    return map[type?.toUpperCase()] || type;
  };

  // 获取类型图标
  const getTypeIcon = (type) => {
    const map = {
      POST: 'document-text',
      QUESTION: 'help-circle',
      TIMELINE: 'videocam',
    };
    return map[type?.toUpperCase()] || 'document-text';
  };

  // 获取类型颜色
  const getTypeColor = (type) => {
    const map = {
      POST: COLORS.primary[600],
      QUESTION: COLORS.info[600],
      TIMELINE: COLORS.error[600],
    };
    return map[type?.toUpperCase()] || COLORS.primary[600];
  };

  // 格式化数字（添加空值检查）
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
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
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  // 渲染图片网格
  const renderImages = (images) => {
    if (!images || images.length === 0) return null;

    const imageCount = images.length;

    // 单张图片
    if (imageCount === 1) {
      return (
        <Image
          source={{ uri: images[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    // 2张图片
    if (imageCount === 2) {
      return (
        <View style={styles.imageGrid2}>
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.gridImage2}
              resizeMode="cover"
            />
          ))}
        </View>
      );
    }

    // 3张图片
    if (imageCount === 3) {
      return (
        <View style={styles.imageGrid3}>
          <Image
            source={{ uri: images[0] }}
            style={styles.gridImage3Left}
            resizeMode="cover"
          />
          <View style={styles.gridImage3Right}>
            <Image
              source={{ uri: images[1] }}
              style={styles.gridImage3RightTop}
              resizeMode="cover"
            />
            <Image
              source={{ uri: images[2] }}
              style={styles.gridImage3RightBottom}
              resizeMode="cover"
            />
          </View>
        </View>
      );
    }

    // 4张及以上图片
    return (
      <View style={styles.imageGrid4}>
        {images.slice(0, 4).map((uri, index) => (
          <View key={index} style={styles.gridImage4Wrapper}>
            <Image
              source={{ uri }}
              style={styles.gridImage4}
              resizeMode="cover"
            />
            {index === 3 && imageCount > 4 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{imageCount - 4}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // 渲染帖子卡片（X/Twitter 风格）
  const renderPostCard = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => router.push(`/community/post/${item.id}`)}
      activeOpacity={0.95}
    >
      <View style={styles.postContainer}>
        {/* 左侧：用户头像 */}
        <Avatar
          source={authUserInfo?.avatarUrl || authUserInfo?.avatar}
          size={40}
          style={styles.avatar}
        />

        {/* 右侧：内容区 */}
        <View style={styles.postContent}>
          {/* 用户信息行 */}
          <View style={styles.userInfoRow}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {authUserInfo?.nickname || authUserInfo?.username || '用户'}
              </Text>
              <Text style={styles.userHandle}>
                @{authUserInfo?.username || 'user'}
              </Text>
              <Text style={styles.postTime}>· {formatTime(item.createdAt)}</Text>
            </View>
          </View>

          {/* 帖子类型标签 */}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(item.contentType)}15` },
            ]}
          >
            <Ionicons
              name={getTypeIcon(item.contentType)}
              size={12}
              color={getTypeColor(item.contentType)}
            />
            <Text style={[styles.typeText, { color: getTypeColor(item.contentType) }]}>
              {getTypeText(item.contentType)}
            </Text>
          </View>

          {/* 标题和正文 */}
          {item.title && (
            <Text style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Text>
          )}
          <Text style={styles.postText} numberOfLines={4}>
            {item.contentPreview || item.content || '暂无内容'}
          </Text>

          {/* 图片 */}
          {renderImages(item.images)}

          {/* 交互工具栏 */}
          <View style={styles.actionBar}>
            {/* 评论 */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={TWITTER_COLORS.secondaryText}
              />
              <Text style={styles.actionText}>{formatNumber(item.commentCount)}</Text>
            </TouchableOpacity>

            {/* 点赞 */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
              <Ionicons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={item.isLiked ? TWITTER_COLORS.likeRed : TWITTER_COLORS.secondaryText}
              />
              <Text
                style={[
                  styles.actionText,
                  item.isLiked && { color: TWITTER_COLORS.likeRed },
                ]}
              >
                {formatNumber(item.likeCount)}
              </Text>
            </TouchableOpacity>

            {/* 收藏 */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
              <Ionicons
                name={item.isCollected ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={
                  item.isCollected ? TWITTER_COLORS.bookmarkBlue : TWITTER_COLORS.secondaryText
                }
              />
              <Text
                style={[
                  styles.actionText,
                  item.isCollected && { color: TWITTER_COLORS.bookmarkBlue },
                ]}
              >
                {formatNumber(item.collectCount)}
              </Text>
            </TouchableOpacity>

            {/* 浏览数 */}
            <View style={[styles.actionButton, styles.viewCount]}>
              <Ionicons
                name="eye-outline"
                size={18}
                color={TWITTER_COLORS.secondaryText}
              />
              <Text style={styles.actionText}>{formatNumber(item.viewCount)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 空状态
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TWITTER_COLORS.secondaryText} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="chatbubbles-outline"
          size={80}
          color={TWITTER_COLORS.border}
        />
        <Text style={styles.emptyText}>还没有发布任何内容</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/community/create')}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyButtonText}>发布第一条</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 列表项分隔线
  const renderSeparator = () => <View style={styles.separator} />;

  // 列表底部加载更多指示器
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={COLORS.primary[600]} />
        <Text style={styles.footerText}>加载更多...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的发布</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/community/create')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* 帖子列表 */}
      <FlatList
        data={posts || []}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id?.toString()}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[600]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ========== 容器 ==========
  container: {
    flex: 1,
    backgroundColor: TWITTER_COLORS.background,
  },

  // ========== 顶部导航 ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: TWITTER_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: TWITTER_COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
  },
  addButton: {
    padding: 4,
  },

  // ========== 帖子卡片 ==========
  postCard: {
    backgroundColor: TWITTER_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: TWITTER_COLORS.border,
  },
  separator: {
    height: 1,
    backgroundColor: TWITTER_COLORS.border,
  },
  postContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },

  // ========== 用户信息 ==========
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
    marginRight: 4,
  },
  userHandle: {
    fontSize: 14,
    color: TWITTER_COLORS.secondaryText,
    marginRight: 4,
  },
  postTime: {
    fontSize: 14,
    color: TWITTER_COLORS.secondaryText,
  },

  // ========== 类型标签 ==========
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },

  // ========== 内容 ==========
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TWITTER_COLORS.mainText,
    marginBottom: 4,
    lineHeight: 20,
  },
  postText: {
    fontSize: 15,
    color: TWITTER_COLORS.mainText,
    lineHeight: 20,
    marginBottom: 12,
  },

  // ========== 图片样式 ==========
  // 单张图片
  singleImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
    marginBottom: 12,
  },

  // 2张图片
  imageGrid2: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
  },
  gridImage2: {
    flex: 1,
    height: 200,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
  },

  // 3张图片
  imageGrid3: {
    flexDirection: 'row',
    gap: 2,
    height: 200,
    marginBottom: 12,
  },
  gridImage3Left: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
  },
  gridImage3Right: {
    flex: 1,
    gap: 2,
  },
  gridImage3RightTop: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
  },
  gridImage3RightBottom: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
  },

  // 4张图片
  imageGrid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginBottom: 12,
  },
  gridImage4Wrapper: {
    width: '49.5%',
    height: 150,
    position: 'relative',
  },
  gridImage4: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: TWITTER_COLORS.border,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 24,
    fontWeight: '700',
    color: TWITTER_COLORS.background,
  },

  // ========== 交互工具栏 ==========
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: TWITTER_COLORS.secondaryText,
  },
  viewCount: {
    marginLeft: 'auto',
  },

  // ========== 空状态 ==========
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: TWITTER_COLORS.secondaryText,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: TWITTER_COLORS.background,
  },

  // ========== 加载状态 ==========
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 14,
    color: TWITTER_COLORS.secondaryText,
    marginTop: 12,
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: TWITTER_COLORS.border,
  },
  footerText: {
    fontSize: 13,
    color: TWITTER_COLORS.secondaryText,
  },
});

