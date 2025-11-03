/**
 * 评论列表组件
 * 显示所有评论，支持排序、分页加载
 */

import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import { setComments, setCommentsPagination, setCommentsSort } from '@/src/store/slices/communitySlice';
import CommentItem from './CommentItem';

// Mock 评论数据
const generateMockComments = (page = 1, count = 20) => {
  const users = [
    { id: 1, name: '热心网友A', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: '留学老鸟', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 3, name: '经验分享者', avatar: 'https://i.pravatar.cc/150?img=13' },
    { id: 4, name: '刚上岸的学长', avatar: 'https://i.pravatar.cc/150?img=14' },
    { id: 5, name: '在读研究生', avatar: 'https://i.pravatar.cc/150?img=15' },
  ];

  const contents = [
    '很有帮助，感谢分享！',
    '请问具体流程是怎样的呢？',
    '我也遇到了同样的问题',
    '楼主的经历很励志',
    '收藏了，非常实用',
    '能详细说说材料准备吗？',
    '感谢分享，解决了我的疑惑',
    '请问时间周期大概多久？',
    '有类似经历，确实是这样',
    '非常棒的攻略！',
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = (page - 1) * count + i;
    const hasReplies = Math.random() > 0.7;
    
    return {
      id: `comment-${index}`,
      user: users[index % users.length],
      content: contents[index % contents.length],
      likeCount: Math.floor(Math.random() * 100),
      isLiked: false,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      replyTo: Math.random() > 0.8 ? { id: 'user-x', name: '某用户' } : null,
      replies: hasReplies ? [
        {
          id: `reply-${index}-1`,
          user: users[(index + 1) % users.length],
          content: '同意你的观点',
          replyTo: { id: users[index % users.length].id, name: users[index % users.length].name },
          createdAt: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
        },
      ] : [],
    };
  });
};

export default function CommentList({ postId, authorId, onReply, ListHeaderComponent }) {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.community.comments);
  const pagination = useSelector((state) => state.community.commentsPagination);
  const sort = useSelector((state) => state.community.commentsSort);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // 初始加载
  useEffect(() => {
    loadComments(true);
  }, [postId, sort]);

  // 加载评论
  const loadComments = async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      if (!pagination.hasMore || loadingMore) return;
      setLoadingMore(true);
    }

    try {
      // TODO: 调用真实 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const page = reset ? 1 : pagination.page + 1;
      const newComments = generateMockComments(page, 20);
      
      dispatch(setComments({ comments: newComments, reset }));
      dispatch(setCommentsPagination({ 
        page, 
        hasMore: page < 3, // Mock: 最多3页
      }));
    } catch (error) {
      console.error('Load comments error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 切换排序
  const handleSortChange = (newSort) => {
    if (newSort !== sort) {
      dispatch(setCommentsSort(newSort));
    }
  };

  // 加载更多
  const handleLoadMore = () => {
    loadComments(false);
  };

  // 渲染头部
  const renderHeader = () => (
    <>
      {/* 自定义头部（帖子内容） */}
      {ListHeaderComponent}
      
      {/* 评论排序头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          全部评论 ({comments.length > 0 ? `${comments.length}+` : 0})
        </Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => handleSortChange('latest')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, sort === 'latest' && styles.sortTextActive]}>
              最新
            </Text>
          </TouchableOpacity>
          <View style={styles.sortDivider} />
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => handleSortChange('hot')}
            activeOpacity={0.7}
          >
            <Text style={[styles.sortText, sort === 'hot' && styles.sortTextActive]}>
              最热
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无评论</Text>
        <Text style={styles.emptyHint}>快来抢沙发吧~</Text>
      </View>
    );
  };

  // 渲染加载更多
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary[500]} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  // 渲染评论项
  const renderItem = useCallback(({ item }) => {
    const isAuthorComment = item.user.id === authorId;
    return (
      <CommentItem
        comment={item}
        onReply={onReply}
        isAuthorComment={isAuthorComment}
      />
    );
  }, [authorId, onReply]);

  // 分隔线
  const renderSeparator = () => <View style={styles.separator} />;

  // 键提取器
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
      scrollEventThrottle={16}
    />
  );
}

CommentList.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReply: PropTypes.func,
  ListHeaderComponent: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 16,
    padding: 4,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  sortTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  sortDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border.light,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginLeft: 64,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginLeft: 8,
  },
});

