/**
 * 知乎风格帖子卡片组件
 * 参考知乎信息流设计
 */

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// 知乎标准配色
const ZHIHU_COLORS = {
  background: '#F6F6F6',
  cardWhite: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#646464',
  textTertiary: '#8590A6',
  linkBlue: '#0084FF',
  divider: '#EBEBEB',
};

/**
 * 知乎风格帖子卡片
 * @param {Object} post - 帖子数据
 * @param {string} post.id - 帖子ID
 * @param {Object} post.author - 作者信息
 * @param {string} post.author.name - 作者名
 * @param {string} post.author.avatar - 作者头像
 * @param {string} post.author.bio - 作者简介
 * @param {boolean} post.author.isFollowed - 是否已关注
 * @param {string} post.title - 帖子标题
 * @param {string} post.content - 帖子摘要（可选）
 * @param {string} post.cover - 封面图（可选）
 * @param {string} post.coverPosition - 封面位置: 'right' | 'bottom' | 'none'
 * @param {Array} post.tags - 标签数组
 * @param {Object} post.stats - 互动数据
 * @param {number} post.stats.likes - 点赞数
 * @param {number} post.stats.comments - 评论数
 * @param {string} post.time - 发布时间
 */
const ZhihuPostCard = ({ post }) => {
  const router = useRouter();

  const handleCardPress = () => {
    console.log('查看帖子:', post.title);
    // router.push(`/community/post/${post.id}`);
  };

  const handleAuthorPress = () => {
    console.log('查看作者:', post.author.name);
    // router.push(`/user/${post.author.id}`);
  };

  const handleFollowPress = () => {
    console.log('关注/取消关注:', post.author.name);
  };

  const handleTagPress = (tag) => {
    console.log('查看标签:', tag);
    // router.push(`/tag/${tag}`);
  };

  const handleLikePress = () => {
    console.log('点赞');
  };

  const handleCommentPress = () => {
    console.log('评论');
  };

  const handleCollectPress = () => {
    console.log('收藏');
  };

  // 格式化数字（1200 -> 1.2k）
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <Pressable 
      style={styles.card}
      onPress={handleCardPress}
      android_ripple={{ color: '#F0F0F0' }}
    >
      {/* 顶部用户栏 */}
      <View style={styles.header}>
        <Pressable 
          style={styles.authorInfo}
          onPress={handleAuthorPress}
        >
          <Image
            source={{ uri: post.author.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <Text style={styles.authorBio}>{post.author.bio} · {post.time}</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.followButton}
          onPress={handleFollowPress}
        >
          <Text style={[
            styles.followText,
            post.author.isFollowed && styles.followedText
          ]}>
            {post.author.isFollowed ? '已关注' : '关注'}
          </Text>
        </Pressable>
      </View>

      {/* 内容区 */}
      <View style={styles.contentContainer}>
        {/* 左侧内容 */}
        <View style={[
          styles.leftContent,
          post.images && post.images.length > 1 && styles.leftContentWithImage
        ]}>
          {/* 标题 */}
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>

          {/* 摘要（如果有且不是多图右侧小图模式） */}
          {post.content && (!post.images || post.images.length <= 1) && (
            <Text style={styles.content} numberOfLines={3}>
              {post.content}
            </Text>
          )}

          {/* 标签（如果不是多图右侧小图模式则显示在这里） */}
          {(!post.images || post.images.length <= 1) && (
            <View style={styles.tagsContainer}>
              {post.tags.slice(0, 3).map((tag, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleTagPress(tag)}
                >
                  <Text style={styles.tag}>#{tag}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 右侧小图（多图模式） */}
        {post.images && post.images.length > 1 && (
          <View style={styles.rightImageContainer}>
            <Image
              source={{ uri: post.images[0] }}
              style={styles.rightImage}
              contentFit="cover"
            />
            {/* 图集指示图标 */}
            <View style={styles.galleryIndicator}>
              <Ionicons 
                name="images-outline" 
                size={16} 
                color="#FFFFFF"
              />
            </View>
          </View>
        )}
      </View>

      {/* 底部大图（单图模式） */}
      {post.cover && (!post.images || post.images.length === 1) && (
        <Image
          source={{ uri: post.cover }}
          style={styles.bottomImage}
          contentFit="cover"
        />
      )}

      {/* 标签（多图右侧小图模式时显示在底部） */}
      {post.images && post.images.length > 1 && (
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <Pressable
              key={index}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={styles.tag}>#{tag}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* 底部互动栏 */}
      <View style={styles.footer}>
        {/* 评论 */}
        <Pressable 
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <Ionicons 
            name="chatbubble-outline"
            size={16} 
            color={ZHIHU_COLORS.textTertiary}
          />
          <Text style={styles.actionText}>
            {formatNumber(post.stats.comments)}
          </Text>
        </Pressable>

        {/* 点赞 */}
        <Pressable 
          style={styles.actionButton}
          onPress={handleLikePress}
        >
          <Ionicons 
            name={post.liked ? "heart" : "heart-outline"}
            size={16} 
            color={post.liked ? '#EB5757' : ZHIHU_COLORS.textTertiary}
          />
          <Text style={[
            styles.actionText,
            post.liked && { color: '#EB5757' }
          ]}>
            {formatNumber(post.stats.likes)}
          </Text>
        </Pressable>

        {/* 浏览量/数据统计 */}
        <Pressable 
          style={styles.actionButton}
        >
          <Ionicons 
            name="stats-chart-outline"
            size={16} 
            color={ZHIHU_COLORS.textTertiary}
          />
          <Text style={styles.actionText}>
            {formatNumber(post.stats.views)}
          </Text>
        </Pressable>

        {/* 收藏 */}
        <Pressable 
          style={styles.actionButton}
          onPress={handleCollectPress}
        >
          <Ionicons 
            name={post.collected ? "bookmark" : "bookmark-outline"}
            size={16} 
            color={post.collected ? ZHIHU_COLORS.linkBlue : ZHIHU_COLORS.textTertiary}
          />
          <Text style={[
            styles.actionText,
            post.collected && { color: ZHIHU_COLORS.linkBlue }
          ]}>
            {formatNumber(post.stats.collects || 0)}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ZHIHU_COLORS.cardWhite,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 2, // 知乎用极小圆角
  },
  // 顶部用户栏
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
  },
  authorText: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: ZHIHU_COLORS.textPrimary,
    marginBottom: 2,
  },
  authorBio: {
    fontSize: 12,
    color: ZHIHU_COLORS.textTertiary,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  followText: {
    fontSize: 14,
    color: ZHIHU_COLORS.linkBlue,
    fontWeight: '500',
  },
  followedText: {
    color: ZHIHU_COLORS.textTertiary,
  },
  // 内容区
  contentContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  leftContent: {
    flex: 1,
  },
  leftContentWithImage: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: ZHIHU_COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: ZHIHU_COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  // 标签
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    fontSize: 12,
    color: ZHIHU_COLORS.linkBlue,
    marginRight: 12,
    marginBottom: 4,
  },
  // 图片
  rightImageContainer: {
    position: 'relative',
  },
  rightImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  galleryIndicator: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  // 底部互动栏
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ZHIHU_COLORS.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    color: ZHIHU_COLORS.textTertiary,
    marginLeft: 4,
  },
  actionTextActive: {
    color: ZHIHU_COLORS.linkBlue,
  },
});

export default ZhihuPostCard;

