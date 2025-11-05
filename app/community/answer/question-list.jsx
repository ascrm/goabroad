/**
 * 问题列表页面
 * 功能：展示社区待回答的问题列表，用户选择问题后跳转到回答创建页面
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
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
import { getPosts } from '@/src/services/api/modules/communityApi';

export default function QuestionList() {
  const router = useRouter();

  // 状态管理
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 页码从0开始
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 加载问题列表
  const fetchQuestions = async (pageNum = 0, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      // 根据API文档调用接口
      const response = await getPosts({
        contentType: 'QUESTION', // 必填：内容类型
        page: pageNum, // 页码从0开始
        size: 20, // 每页数量
        sortBy: 'createdAt', // 按创建时间排序
        direction: 'DESC', // 降序（最新的在前）
      });

      // 处理Spring Data分页响应
      const pageData = response.data || {};
      const rawQuestions = pageData.content || [];
      const isLastPage = pageData.last || false;

      // 映射API响应数据到UI数据结构
      const newQuestions = rawQuestions.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.contentPreview || '', // API返回的是contentPreview
        coverImage: item.coverImage,
        contentType: item.contentType,
        tags: item.tags || [],
        likeCount: item.likeCount || 0,
        commentCount: item.commentCount || 0,
        collectCount: item.collectCount || 0,
        viewCount: item.viewCount || 0,
        isLiked: item.isLiked || false,
        isCollected: item.isCollected || false,
        createdAt: item.createdAt,
        // 将author映射为user字段
        user: item.author
          ? {
              id: item.author.id,
              username: item.author.username,
              nickname: item.author.nickname,
              avatar: item.author.avatarUrl, // avatarUrl映射为avatar
              bio: item.author.bio,
              isFollowing: item.author.isFollowing || false,
            }
          : null,
      }));

      if (isRefresh || pageNum === 0) {
        setQuestions(newQuestions);
        setPage(0);
      } else {
        setQuestions((prev) => [...prev, ...newQuestions]);
      }

      // 判断是否还有更多数据
      setHasMore(!isLastPage && newQuestions.length > 0);
    } catch (err) {
      console.error('❌ [问题列表] 加载失败:', err);
      setError(err.message || '加载失败，请重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchQuestions(0);
  }, []);

  // 下拉刷新
  const handleRefresh = useCallback(() => {
    fetchQuestions(0, true);
  }, []);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQuestions(nextPage);
    }
  }, [loadingMore, hasMore, loading, page]);

  // 跳转到回答创建页面
  const handleWriteAnswer = (question) => {
    router.push({
      pathname: '/community/answer/create',
      params: {
        questionId: question.id,
        questionTitle: question.title,
        questionContent: question.content || '',
      },
    });
  };

  // 渲染问题卡片
  const renderQuestionItem = ({ item }) => (
    <View style={styles.questionCard}>
      {/* 用户信息区 */}
      <View style={styles.userInfo}>
        {item.user?.avatar ? (
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={COLORS.gray[400]} />
          </View>
        )}
        <Text style={styles.username}>{item.user?.nickname || '匿名用户'}</Text>
      </View>

      {/* 问题标题 */}
      <Text style={styles.questionTitle}>{item.title}</Text>

      {/* 操作按钮 */}
      <TouchableOpacity
        style={styles.answerBtn}
        onPress={() => handleWriteAnswer(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.answerBtnText}>写回答</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染列表底部
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={COLORS.primary[600]} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="help-circle-outline" size={80} color={COLORS.gray[300]} />
        <Text style={styles.emptyText}>暂无待回答的问题</Text>
        <Text style={styles.emptySubtext}>等待社区用户提出新问题</Text>
      </View>
    );
  };

  // 渲染错误状态
  if (error && !refreshing && questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>问题列表</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color={COLORS.error[400]} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchQuestions(0)}>
            <Text style={styles.retryBtnText}>重试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>问题列表</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 问题列表 */}
      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary[600]]}
            tintColor={COLORS.primary[600]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      {/* 初始加载状态 */}
      {loading && questions.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },

  // Header
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },

  // 列表
  listContent: {
    flexGrow: 1,
    padding: 16,
  },

  // 问题卡片
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },

  // 用户信息
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[900],
  },

  // 问题标题
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 24,
    marginBottom: 12,
  },

  // 回答按钮
  answerBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  answerBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

  // 加载状态
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray[500],
  },

  // 底部加载更多
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.gray[500],
  },

  // 空状态
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.gray[400],
  },

  // 错误状态
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

