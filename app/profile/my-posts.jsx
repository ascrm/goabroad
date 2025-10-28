/**
 * 我的发布页面
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

import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectAuthUserInfo } from '@/src/store/slices/authSlice';
import {
  clearPosts,
  fetchUserPosts,
  selectUserPosts,
} from '@/src/store/slices/userSlice';

export default function MyPosts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const userPostsState = useAppSelector(selectUserPosts);
  const posts = userPostsState?.items || [];
  const pagination = userPostsState?.pagination;
  const loading = userPostsState?.loading || false;
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'POST', 'QUESTION', 'TIMELINE'
  const [loadingMore, setLoadingMore] = useState(false);

  // 页面初始化时获取数据
  useEffect(() => {
    if (authUserInfo?.id) {
      loadPosts(1, filter, true);
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
    await loadPosts(1, filter, true);
    setRefreshing(false);
  };

  // 切换筛选类型
  const handleFilterChange = async (newFilter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
    await loadPosts(1, newFilter, true);
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (loadingMore || loading || !pagination) return;
    
    const { currentPage, totalPages } = pagination;
    if (currentPage >= totalPages) return;
    
    setLoadingMore(true);
    await loadPosts(currentPage + 1, filter, false);
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

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // 渲染帖子卡片
  const renderPostCard = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => router.push(`/community/post/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* 顶部类型标签 */}
      <View style={styles.postHeader}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: `${getTypeColor(item.type)}15` },
          ]}
        >
          <Ionicons
            name={getTypeIcon(item.type)}
            size={14}
            color={getTypeColor(item.type)}
          />
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {getTypeText(item.type)}
          </Text>
        </View>
        <Text style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString('zh-CN')}
        </Text>
      </View>

      {/* 标题和内容 */}
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.content}
      </Text>

      {/* 图片预览 */}
      {item.images && item.images.length > 0 && (
        <View style={styles.imagesPreview}>
          {item.images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.imageThumb}
            />
          ))}
          {item.images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{item.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* 统计数据 */}
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={16} color={COLORS.gray[500]} />
          <Text style={styles.statText}>{formatNumber(item.views)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart-outline" size={16} color={COLORS.gray[500]} />
          <Text style={styles.statText}>{formatNumber(item.likes)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={COLORS.gray[500]}
          />
          <Text style={styles.statText}>{formatNumber(item.comments)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star-outline" size={16} color={COLORS.gray[500]} />
          <Text style={styles.statText}>{formatNumber(item.favorites)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染筛选按钮
  const FilterButton = ({ value, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => handleFilterChange(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // 空状态
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="document-text-outline"
          size={64}
          color={COLORS.gray[300]}
        />
        <Text style={styles.emptyText}>还没有发布内容</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/community/create')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.createButtonText}>发布内容</Text>
        </TouchableOpacity>
      </View>
    );
  };

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

      {/* 筛选栏 */}
      <View style={styles.filterContainer}>
        <FilterButton value="all" label="全部" />
        <FilterButton value="POST" label="帖子" />
        <FilterButton value="QUESTION" label="提问" />
        <FilterButton value="TIMELINE" label="视频" />
      </View>

      {/* 帖子列表 */}
      <FlatList
        data={posts || []}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  addButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  postDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesPreview: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.gray[200],
  },
  moreImages: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.gray[900],
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray[500],
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 12,
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
});

