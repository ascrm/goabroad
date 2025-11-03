/**
 * 我的收藏页面
 * 显示用户收藏的帖子和内容
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
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
    clearFavorites,
    fetchUserFavorites,
    selectUserFavorites,
} from '@/src/store/slices/userSlice';

export default function MyFavorites() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const userFavoritesState = useAppSelector(selectUserFavorites);
  const favorites = userFavoritesState?.items || [];
  const pagination = userFavoritesState?.pagination;
  const loading = userFavoritesState?.loading || false;
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [loadingMore, setLoadingMore] = useState(false);

  // 页面初始化时获取数据
  useEffect(() => {
    loadFavorites(1);
    
    // 组件卸载时清空数据
    return () => {
      dispatch(clearFavorites());
    };
  }, []);

  // 获取收藏夹列表（从收藏数据中提取）
  const folders = ['all', ...new Set(favorites.map((item) => item.folder).filter(Boolean))];

  // 加载收藏列表
  const loadFavorites = async (page = 1) => {
    try {
      await dispatch(
        fetchUserFavorites({
          page,
          pageSize: 20,
        })
      ).unwrap();
    } catch (error) {
      console.error('加载收藏失败:', error);
    }
  };

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites(1);
    setRefreshing(false);
  };

  // 筛选收藏
  const getFilteredFavorites = () => {
    if (selectedFolder === 'all') return favorites;
    return favorites.filter((item) => item.folder === selectedFolder);
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (loadingMore || loading || !pagination) return;
    
    const { currentPage, totalPages } = pagination;
    if (currentPage >= totalPages) return;
    
    setLoadingMore(true);
    await loadFavorites(currentPage + 1);
    setLoadingMore(false);
  };

  // 取消收藏（乐观更新）
  const handleUnfavorite = async (itemId) => {
    // TODO: 调用取消收藏 API（需要社区模块的 API）
    // 暂时只做本地移除
    console.log('取消收藏:', itemId);
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

  // 渲染收藏卡片
  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => router.push(`/community/post/${item.post.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* 左侧内容 */}
        <View style={styles.cardLeft}>
          {/* 类型标签 */}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(item.post.type)}15` },
            ]}
          >
            <Ionicons
              name={getTypeIcon(item.post.type)}
              size={12}
              color={getTypeColor(item.post.type)}
            />
            <Text
              style={[styles.typeText, { color: getTypeColor(item.post.type) }]}
            >
              {getTypeText(item.post.type)}
            </Text>
          </View>

          {/* 标题和内容 */}
          <Text style={styles.postTitle} numberOfLines={2}>
            {item.post.title}
          </Text>
          <Text style={styles.postContent} numberOfLines={2}>
            {item.post.content}
          </Text>

          {/* 作者和统计 */}
          <View style={styles.postMeta}>
            <Text style={styles.author}>{item.post.author.nickname}</Text>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={14} color={COLORS.gray[400]} />
                <Text style={styles.statText}>
                  {formatNumber(item.post.likes)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={14} color={COLORS.gray[400]} />
                <Text style={styles.statText}>
                  {formatNumber(item.post.comments)}
                </Text>
              </View>
            </View>
          </View>

          {/* 收藏夹 */}
          <View style={styles.folderTag}>
            <Ionicons name="folder" size={12} color={COLORS.warning[600]} />
            <Text style={styles.folderText}>{item.folder}</Text>
          </View>
        </View>

        {/* 右侧缩略图 */}
        {item.post.images && item.post.images.length > 0 && (
          <Image
            source={{ uri: item.post.images[0] }}
            style={styles.thumbnail}
          />
        )}
      </View>

      {/* 取消收藏按钮 */}
      <TouchableOpacity
        style={styles.unfavoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          handleUnfavorite(item.id);
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="star" size={20} color={COLORS.warning[500]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // 渲染文件夹标签
  const renderFolderTab = (folder) => {
    const isActive = selectedFolder === folder;
    return (
      <TouchableOpacity
        key={folder}
        style={[styles.folderTab, isActive && styles.folderTabActive]}
        onPress={() => setSelectedFolder(folder)}
        activeOpacity={0.7}
      >
        <Text style={[styles.folderTabText, isActive && styles.folderTabTextActive]}>
          {folder === 'all' ? '全部' : folder}
        </Text>
      </TouchableOpacity>
    );
  };

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
        <Ionicons name="star-outline" size={64} color={COLORS.gray[300]} />
        <Text style={styles.emptyText}>还没有收藏内容</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/community')}
          activeOpacity={0.7}
        >
          <Text style={styles.exploreButtonText}>去社区逛逛</Text>
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

  const filteredFavorites = getFilteredFavorites();

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
        <Text style={styles.headerTitle}>我的收藏</Text>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Ionicons name="folder-outline" size={22} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* 收藏夹筛选 */}
      {folders.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.folderContainer}
          contentContainerStyle={styles.folderContent}
        >
          {folders.map(renderFolderTab)}
        </ScrollView>
      )}

      {/* 收藏列表 */}
      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteCard}
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
  manageButton: {
    padding: 4,
  },
  folderContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  folderContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  folderTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
  },
  folderTabActive: {
    backgroundColor: COLORS.primary[500],
  },
  folderTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  folderTabTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  cardLeft: {
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 6,
    lineHeight: 20,
  },
  postContent: {
    fontSize: 13,
    color: COLORS.gray[600],
    lineHeight: 18,
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  folderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.warning[50],
    borderRadius: 10,
  },
  folderText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.warning[700],
    marginLeft: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.gray[200],
  },
  unfavoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
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
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
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

