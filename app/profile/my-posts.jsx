/**
 * 我的发布页面
 * 显示用户发布的帖子和动态
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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

// 模拟数据
const MOCK_POSTS = [
  {
    id: '1',
    type: 'post',
    title: '分享我的美国留学申请经验',
    content: '经过一年的准备，终于收到了心仪学校的offer...',
    images: [],
    likes: 128,
    comments: 45,
    favorites: 67,
    views: 1234,
    createdAt: '2024-10-20',
    status: 'published',
  },
  {
    id: '2',
    type: 'question',
    title: '关于GRE考试的一些疑问',
    content: '请问大家GRE verbal部分如何提高...',
    images: [],
    likes: 56,
    comments: 23,
    favorites: 34,
    views: 567,
    createdAt: '2024-10-15',
    status: 'published',
  },
  {
    id: '3',
    type: 'post',
    title: '英国签证办理攻略',
    content: '整理了一份详细的英国学生签证办理流程...',
    images: ['https://picsum.photos/200/300'],
    likes: 234,
    comments: 89,
    favorites: 156,
    views: 2345,
    createdAt: '2024-10-10',
    status: 'published',
  },
];

export default function MyPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'post', 'question', 'video'

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: 调用 API 刷新数据
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // 筛选帖子
  const getFilteredPosts = () => {
    if (filter === 'all') return posts;
    return posts.filter((post) => post.type === filter);
  };

  // 获取类型文本
  const getTypeText = (type) => {
    const map = {
      post: '帖子',
      question: '提问',
      video: '视频',
    };
    return map[type] || type;
  };

  // 获取类型图标
  const getTypeIcon = (type) => {
    const map = {
      post: 'document-text',
      question: 'help-circle',
      video: 'videocam',
    };
    return map[type] || 'document-text';
  };

  // 获取类型颜色
  const getTypeColor = (type) => {
    const map = {
      post: COLORS.primary[600],
      question: COLORS.info[600],
      video: COLORS.error[600],
    };
    return map[type] || COLORS.primary[600];
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
      onPress={() => setFilter(value)}
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
  const renderEmptyState = () => (
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

  const filteredPosts = getFilteredPosts();

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
        <FilterButton value="post" label="帖子" />
        <FilterButton value="question" label="提问" />
        <FilterButton value="video" label="视频" />
      </View>

      {/* 帖子列表 */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
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
});

