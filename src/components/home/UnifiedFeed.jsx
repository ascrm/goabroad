/**
 * 统一推荐内容 Feed
 * 混合展示：国家推荐、攻略文章、社区热帖
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

// 模拟混合内容数据
const FEED_DATA = [
  {
    id: '1',
    type: 'country',
    title: '美国',
    subtitle: '世界顶尖教育资源',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400',
    tags: ['热门', '名校多'],
    stats: { views: '12.5万', likes: '3.2万' },
  },
  {
    id: '2',
    type: 'guide',
    title: '2025年美国F1签证完整攻略',
    author: '留学小助手',
    avatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1554224311-beee4ece8db7?w=400',
    tags: ['签证', '攻略'],
    stats: { views: '8.9万', likes: '2.1万' },
  },
  {
    id: '3',
    type: 'post',
    title: '刚拿到offer！分享我的申请经验',
    author: '小明同学',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content: '历时半年，终于收到了梦校的offer！分享一下我的申请经验...',
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
    ],
    tags: ['经验分享', 'offer'],
    stats: { views: '5.6万', likes: '1.8万', comments: 328 },
  },
  {
    id: '4',
    type: 'country',
    title: '英国',
    subtitle: '历史悠久的教育体系',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    tags: ['热门', '学制短'],
    stats: { views: '10.2万', likes: '2.8万' },
  },
  {
    id: '5',
    type: 'guide',
    title: '如何准备托福考试？100+高分经验',
    author: '托福老师',
    avatar: 'https://i.pravatar.cc/150?img=3',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    tags: ['托福', '备考'],
    stats: { views: '15.3万', likes: '4.5万' },
  },
  {
    id: '6',
    type: 'post',
    title: '留学生活vlog | 我在纽约的一天',
    author: '纽约小姐姐',
    avatar: 'https://i.pravatar.cc/150?img=4',
    content: '记录我在纽约留学的日常生活，从早上起床到晚上回宿舍...',
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    ],
    tags: ['vlog', '留学生活'],
    stats: { views: '7.8万', likes: '2.3万', comments: 156 },
    hasVideo: true,
  },
];

const UnifiedFeed = () => {
  const handleItemPress = (item) => {
    console.log('打开内容:', item.title);
    // 根据类型跳转不同页面
    // if (item.type === 'country') router.push(`/countries/${item.id}`);
    // if (item.type === 'guide') router.push(`/guides/${item.id}`);
    // if (item.type === 'post') router.push(`/community/post/${item.id}`);
  };

  const renderCountryCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.countryCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.countryImage} />
      <View style={styles.countryOverlay}>
        <View style={styles.countryInfo}>
          <Text style={styles.countryTitle}>{item.title}</Text>
          <Text style={styles.countrySubtitle}>{item.subtitle}</Text>
          <View style={styles.countryTags}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.countryTag}>
                <Text style={styles.countryTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.countryStats}>
          <Ionicons name="eye-outline" size={14} color={COLORS.white} />
          <Text style={styles.countryStatText}>{item.stats.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGuideCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.guideCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.guideImage} />
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.guideFooter}>
          <View style={styles.guideAuthor}>
            <Image source={{ uri: item.avatar }} style={styles.guideAvatar} />
            <Text style={styles.guideAuthorName}>{item.author}</Text>
          </View>
          <View style={styles.guideStats}>
            <Ionicons name="eye-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.guideStatText}>{item.stats.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPostCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.postCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthor}>{item.author}</Text>
          <Text style={styles.postTime}>2小时前</Text>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      {item.images && item.images.length > 0 && (
        <View style={styles.postImages}>
          {item.images.slice(0, 3).map((img, index) => (
            <View key={index} style={styles.postImageWrapper}>
              <Image source={{ uri: img }} style={styles.postImage} />
              {item.hasVideo && index === 0 && (
                <View style={styles.videoIcon}>
                  <Ionicons name="play-circle" size={32} color={COLORS.white} />
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      <View style={styles.postFooter}>
        <View style={styles.postTags}>
          {item.tags.map((tag, index) => (
            <Text key={index} style={styles.postTag}>
              #{tag}
            </Text>
          ))}
        </View>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <Ionicons name="eye-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.postStatText}>{item.stats.views}</Text>
          </View>
          <View style={styles.postStat}>
            <Ionicons name="heart-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.postStatText}>{item.stats.likes}</Text>
          </View>
          {item.stats.comments && (
            <View style={styles.postStat}>
              <Ionicons name="chatbubble-outline" size={14} color={COLORS.gray[500]} />
              <Text style={styles.postStatText}>{item.stats.comments}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 为你推荐</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={COLORS.gray[600]} />
          <Text style={styles.filterText}>筛选</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedList}>
        {FEED_DATA.map((item) => {
          if (item.type === 'country') return renderCountryCard(item);
          if (item.type === 'guide') return renderGuideCard(item);
          if (item.type === 'post') return renderPostCard(item);
          return null;
        })}
      </View>

      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>查看更多内容</Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.gray[600]} />
      </TouchableOpacity>
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray[100],
    borderRadius: 16,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 4,
    fontWeight: '500',
  },
  feedList: {
    gap: 12,
  },

  // 国家卡片样式
  countryCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: COLORS.gray[900],
  },
  countryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  countryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  countryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  countryTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  countrySubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  countryTags: {
    flexDirection: 'row',
    gap: 8,
  },
  countryTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countryTagText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  countryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryStatText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '500',
  },

  // 攻略卡片样式
  guideCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  guideImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  guideContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 22,
  },
  guideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  guideAuthorName: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  guideStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guideStatText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },

  // 帖子卡片样式
  postCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  postImages: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  postImageWrapper: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTags: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  postTag: {
    fontSize: 13,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },

  // 加载更多按钮
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.gray[100],
    borderRadius: 24,
  },
  loadMoreText: {
    fontSize: 14,
    color: COLORS.gray[600],
    fontWeight: '500',
    marginRight: 4,
  },
});

export default UnifiedFeed;

