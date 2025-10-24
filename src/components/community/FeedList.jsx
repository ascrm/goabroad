/**
 * Feed 流列表组件
 * 帖子列表，支持下拉刷新、上拉加载更多
 */

import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import { setLoadingMore, setPagination, setPosts, setRefreshing } from '@/src/store/slices/communitySlice';
import PostCard from './PostCard';

// Mock 数据生成函数
const generateMockPosts = (page = 1, count = 20) => {
  const types = ['normal', 'video', 'question'];
  const countries = ['美国留学', 'F1签证', '英国留学', '加拿大移民', '澳洲打工度假'];
  const titles = [
    '美国F1签证面签攻略（2024最新）',
    '分享我的英国硕士申请经验',
    '求助：如何准备留学推荐信？',
    '加拿大移民EE打分详解',
    '澳洲WHV申请全流程记录',
    '留学生活成本大比较：美英澳加',
    '雅思7.5备考心得分享',
    '收到Dream School的offer啦！',
    '美国租房避坑指南',
    '如何选择适合自己的留学国家？',
  ];

  const summaries = [
    '分享我的美国F1签证面签经历，包括材料准备、常见问题、注意事项等...',
    '从选校到拿offer，分享我的申请经验和心得体会...',
    '即将申请留学，想请教一下推荐信应该找谁写，有什么注意事项吗？',
    '详细解析加拿大EE移民打分系统，教你如何提高分数...',
    '记录我的澳洲打工度假签证申请全过程，希望对大家有帮助...',
  ];

  const authors = [
    { id: 1, name: '留学小王', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: '英伦达人', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: '移民顾问李', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'WHV探险家', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: '留学规划师', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = (page - 1) * count + i;
    const type = types[index % types.length];
    const hasImages = Math.random() > 0.3;
    const imageCount = hasImages ? Math.floor(Math.random() * 4) + 1 : 0;
    
    return {
      id: `post-${index}`,
      type,
      title: titles[index % titles.length],
      summary: Math.random() > 0.5 ? summaries[index % summaries.length] : null,
      author: authors[index % authors.length],
      tags: [countries[index % countries.length], countries[(index + 1) % countries.length]].slice(0, Math.floor(Math.random() * 2) + 1),
      images: hasImages ? Array.from({ length: imageCount }, (_, j) => `https://picsum.photos/400/300?random=${index * 10 + j}`) : [],
      videoDuration: type === 'video' ? '05:32' : null,
      likeCount: Math.floor(Math.random() * 5000),
      commentCount: Math.floor(Math.random() * 500),
      favoriteCount: Math.floor(Math.random() * 1000),
      isLiked: false,
      isFavorited: false,
      isHighlighted: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

export default function FeedList({ tab = 'recommend', onRefresh, onLoadMore }) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.community.posts[tab] || []);
  const pagination = useSelector((state) => state.community.pagination[tab]);
  const refreshing = useSelector((state) => state.community.refreshing);
  const loadingMore = useSelector((state) => state.community.loadingMore);

  // 长按帖子显示菜单
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    dispatch(setRefreshing(true));
    
    try {
      // TODO: 调用真实 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPosts = generateMockPosts(1, 20);
      
      dispatch(setPosts({ tab, posts: newPosts, reset: true }));
      dispatch(setPagination({ tab, page: 1, hasMore: true }));
      
      onRefresh?.();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, tab, onRefresh]);

  // 加载更多
  const handleLoadMore = useCallback(async () => {
    if (!pagination?.hasMore || loadingMore) return;

    dispatch(setLoadingMore(true));
    
    try {
      // TODO: 调用真实 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const nextPage = (pagination?.page || 1) + 1;
      const newPosts = generateMockPosts(nextPage, 20);
      
      dispatch(setPosts({ tab, posts: newPosts, reset: false }));
      dispatch(setPagination({ 
        tab, 
        page: nextPage, 
        hasMore: nextPage < 5, // Mock: 最多5页
      }));
      
      onLoadMore?.();
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      dispatch(setLoadingMore(false));
    }
  }, [dispatch, tab, pagination, loadingMore, onLoadMore]);

  // 初始加载
  React.useEffect(() => {
    if (posts.length === 0) {
      handleRefresh();
    }
  }, []);

  // 长按菜单
  const handleLongPress = useCallback((post) => {
    setSelectedPost(post);
    setMenuVisible(true);
    // TODO: 实现长按菜单（举报、屏蔽等）
    console.log('Long press on post:', post.id);
  }, []);

  // 渲染空状态
  const renderEmpty = () => {
    if (refreshing) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无内容</Text>
        <Text style={styles.emptyHint}>下拉刷新试试吧</Text>
      </View>
    );
  };

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary[500]} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  // 渲染帖子项
  const renderItem = useCallback(({ item }) => (
    <PostCard post={item} onLongPress={handleLongPress} />
  ), [handleLongPress]);

  // 项目键提取器
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary[500]]}
          tintColor={COLORS.primary[500]}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}

FeedList.propTypes = {
  tab: PropTypes.oneOf(['recommend', 'following', 'country', 'stage']),
  onRefresh: PropTypes.func,
  onLoadMore: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.gray[50],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginLeft: 8,
  },
});

