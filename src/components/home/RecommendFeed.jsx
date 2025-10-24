/**
 * 为你推荐组件
 * 显示推荐的社区内容
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

// 模拟推荐数据
const MOCK_POSTS = [
  {
    id: 1,
    title: '美国F1签证面签攻略（2024最新版）',
    author: {
      name: '留学小王',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    coverImage: 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400',
    tags: ['美国留学', 'F1签证'],
    likes: 1240,
    comments: 89,
    publishTime: '2天前',
  },
  {
    id: 2,
    title: '从零DIY英国研究生申请，成功拿到UCL offer',
    author: {
      name: '英伦小姐姐',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    tags: ['英国留学', 'DIY申请'],
    likes: 856,
    comments: 67,
    publishTime: '3天前',
  },
  {
    id: 3,
    title: '日本留学生活费用详解 + 省钱攻略',
    author: {
      name: '东京留学日记',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    tags: ['日本留学', '生活费用'],
    likes: 623,
    comments: 45,
    publishTime: '5天前',
  },
];

const PostCard = ({ post }) => {
  const handlePress = () => {
    // router.push(`/community/post/${post.id}`);
    console.log('查看帖子:', post.title);
  };

  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* 封面图 */}
      <Image
        source={{ uri: post.coverImage }}
        style={styles.coverImage}
        contentFit="cover"
        transition={200}
      />

      {/* 内容区 */}
      <View style={styles.postContent}>
        {/* 标题 */}
        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>

        {/* 标签 */}
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* 作者和互动数据 */}
        <View style={styles.postFooter}>
          <View style={styles.authorSection}>
            <Image
              source={{ uri: post.author.avatar }}
              style={styles.authorAvatar}
              contentFit="cover"
            />
            <Text style={styles.authorName}>{post.author.name}</Text>
            <Text style={styles.publishTime}>· {post.publishTime}</Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color={COLORS.gray[600]} />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.gray[600]} />
              <Text style={styles.statText}>{post.comments}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RecommendFeed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 为你推荐</Text>
        <TouchableOpacity
          onPress={() => router.push('/community')}
          style={styles.moreButton}
        >
          <Text style={styles.moreText}>查看更多</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginRight: 2,
  },
  postsContainer: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.gray[100],
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: COLORS.gray[100],
  },
  authorName: {
    fontSize: 13,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  publishTime: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
});

export default RecommendFeed;

