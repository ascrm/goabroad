/**
 * 分类Feed组件 - 通用的分类内容列表
 * 支持按category查询后端数据
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';
import { getPosts } from '@/src/services/api/modules/communityApi';
import { transformPostsForZhihuCard } from '@/src/utils/postDataTransform';
import ZhihuPostCard from './ZhihuPostCard';

/**
 * CategoryFeed 组件
 * @param {Object} props
 * @param {string} props.contentType - 内容类型 (TREND, QUESTION, ANSWER, GUIDE)
 * @param {string} [props.category] - 分类标签（如：留学、签证、生活等）
 * @param {string} [props.sortBy='createdAt'] - 排序字段
 * @param {string} [props.direction='DESC'] - 排序方向
 * @param {number} [props.pageSize=20] - 每页数量
 */
const CategoryFeed = ({ 
  contentType = 'GUIDE',
  category = null,
  sortBy = 'createdAt',
  direction = 'DESC',
  pageSize = 20,
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // 加载帖子数据
  const loadPosts = async (pageNum = 0, isRefresh = false) => {
    try {
      if (pageNum === 0) {
        isRefresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const params = {
        contentType,
        page: pageNum,
        size: pageSize,
        sortBy,
        direction,
      };

      // 如果有分类，添加分类参数
      // 注意：需要后端支持category参数，如果不支持则在前端过滤
      if (category) {
        // TODO: 确认后端是否支持category参数
        // 暂时先获取所有数据，在前端过滤
      }

      const response = await getPosts(params);

      if (response.code === 200 && response.data) {
        const { content, last } = response.data;
        
        // 转换数据格式
        let transformedPosts = transformPostsForZhihuCard(content);

        // 如果有分类要求，在前端过滤
        if (category) {
          transformedPosts = transformedPosts.filter(post => {
            const postTags = post.tags || [];
            const postCategory = post._originalData?.category;
            return postTags.includes(category) || postCategory === category;
          });
        }

        if (pageNum === 0) {
          setPosts(transformedPosts);
        } else {
          setPosts(prev => [...prev, ...transformedPosts]);
        }

        setHasMore(!last);
        setPage(pageNum);
      } else {
        throw new Error(response.message || '加载失败');
      }
    } catch (err) {
      console.error('加载帖子失败:', err);
      setError(err.message || '加载失败，请重试');
      
      if (pageNum === 0) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadPosts(0);
  }, [contentType, category, sortBy, direction]);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    loadPosts(0, true);
  }, [contentType, category, sortBy, direction]);

  // 加载更多
  const onLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && posts.length > 0) {
      loadPosts(page + 1);
    }
  }, [loadingMore, hasMore, page, contentType, category, sortBy, direction]);

  // 渲染单个帖子
  const renderItem = ({ item }) => (
    <ZhihuPostCard post={item} />
  );

  // 渲染底部加载指示器
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary[600]} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>😔 {error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>暂无内容</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        posts.length === 0 && styles.listContentEmpty,
      ]}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary[600]}
          colors={[COLORS.primary[600]]}
        />
      }
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8590A6',
  },
  emptyText: {
    fontSize: 14,
    color: '#8590A6',
  },
  errorText: {
    fontSize: 14,
    color: '#8590A6',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8590A6',
  },
});

export default CategoryFeed;

