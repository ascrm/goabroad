/**
 * 帖子卡片组件
 * 显示帖子预览信息：作者、标签、内容、图片/视频、互动数据
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { COLORS } from '@/src/constants';
import { toggleFavoritePost, toggleFollowUser, toggleLikePost } from '@/src/store/slices/communitySlice';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import TopicTag from './TopicTag';

/**
 * 格式化数字显示（1.2k, 1.5w）
 */
const formatCount = (count) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

/**
 * 格式化时间
 */
const formatTime = (dateString) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: zhCN,
    });
  } catch {
    return '';
  }
};

export default function PostCard({ post, onLongPress }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // 点击卡片 -> 进入详情
  const handlePress = useCallback(() => {
    router.push(`/community/post/${post.id}`);
  }, [post.id, router]);

  // 点击用户 -> 进入用户主页
  const handleUserPress = useCallback((e) => {
    e.stopPropagation();
    // TODO: 实现用户主页导航
    console.log('Navigate to user:', post.author.id);
  }, [post.author.id]);

  // 点击关注按钮
  const handleFollowPress = useCallback((e) => {
    e.stopPropagation();
    dispatch(toggleFollowUser(post.author.id));
  }, [dispatch, post.author.id]);

  // 点赞
  const handleLikePress = useCallback((e) => {
    e.stopPropagation();
    dispatch(toggleLikePost(post.id));
  }, [dispatch, post.id]);

  // 收藏
  const handleFavoritePress = useCallback((e) => {
    e.stopPropagation();
    dispatch(toggleFavoritePost(post.id));
  }, [dispatch, post.id]);

  // 评论（跳转到详情页）
  const handleCommentPress = useCallback((e) => {
    e.stopPropagation();
    router.push(`/community/post/${post.id}?focus=comment`);
  }, [post.id, router]);

  // 分享
  const handleSharePress = useCallback((e) => {
    e.stopPropagation();
    // TODO: 实现分享功能
    console.log('Share post:', post.id);
  }, [post.id]);

  // 渲染封面/多图
  const renderMedia = () => {
    if (!post.images || post.images.length === 0) return null;

    if (post.type === 'video') {
      // 视频帖子：显示封面 + 播放按钮
      return (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.images[0] }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <Ionicons name="play-circle" size={48} color={COLORS.white} />
          </View>
          {post.videoDuration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{post.videoDuration}</Text>
            </View>
          )}
        </View>
      );
    }

    // 图片帖子
    if (post.images.length === 1) {
      return (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    // 多图（最多显示3张）
    return (
      <View style={styles.multiImageContainer}>
        {post.images.slice(0, 3).map((img, index) => (
          <View key={index} style={styles.multiImageWrapper}>
            <Image
              source={{ uri: img }}
              style={styles.multiImage}
              resizeMode="cover"
            />
            {index === 2 && post.images.length > 3 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{post.images.length - 3}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // 渲染标签（作者信息下方）
  const renderTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {post.tags.slice(0, 3).map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
    );
  };

  // 渲染话题标签（内容区域）
  const renderTopics = () => {
    if (!post.topics || post.topics.length === 0) return null;

    return (
      <View style={styles.topicsContainer}>
        {post.topics.slice(0, 2).map((topic, index) => (
          <TopicTag key={index} topic={topic} size="small" />
        ))}
      </View>
    );
  };

  // 渲染特殊标签（问答、精华）
  const renderBadges = () => {
    const badges = [];

    if (post.type === 'question') {
      badges.push(
        <View key="question" style={[styles.badge, styles.questionBadge]}>
          <Text style={styles.badgeText}>问答</Text>
        </View>
      );
    }

    if (post.isHighlighted) {
      badges.push(
        <View key="highlight" style={[styles.badge, styles.highlightBadge]}>
          <Ionicons name="diamond" size={12} color={COLORS.warning[600]} />
          <Text style={[styles.badgeText, styles.highlightText]}>精华</Text>
        </View>
      );
    }

    return badges.length > 0 ? <View style={styles.badgesContainer}>{badges}</View> : null;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
      onLongPress={() => onLongPress?.(post)}
    >
      {/* 作者信息栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorInfo}
          onPress={handleUserPress}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: post.author.avatarUrl || post.author.avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {renderTags()}
          </View>
        </TouchableOpacity>

        {!post.author.isFollowing && (
          <TouchableOpacity
            style={styles.followButton}
            onPress={handleFollowPress}
            activeOpacity={0.7}
          >
            <Text style={styles.followButtonText}>关注</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 内容区 */}
      <View style={styles.content}>
        {renderBadges()}
        
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>

        {post.summary && (
          <Text style={styles.summary} numberOfLines={3}>
            {post.summary}
          </Text>
        )}

        {renderMedia()}
        
        {renderTopics()}
      </View>

      {/* 互动栏 */}
      <View style={styles.footer}>
        <View style={styles.stats}>
          <TouchableOpacity
            style={styles.statButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={post.isLiked ? COLORS.error[500] : COLORS.text.tertiary}
            />
            <Text style={[styles.statText, post.isLiked && styles.likedText]}>
              {formatCount(post.likeCount || 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={handleCommentPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.text.tertiary} />
            <Text style={styles.statText}>{formatCount(post.commentCount || 0)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={post.isFavorited ? 'star' : 'star-outline'}
              size={20}
              color={post.isFavorited ? COLORS.warning[500] : COLORS.text.tertiary}
            />
            {post.favoriteCount > 0 && (
              <Text style={[styles.statText, post.isFavorited && styles.favoritedText]}>
                {formatCount(post.favoriteCount)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={handleSharePress}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.timeText}>{formatTime(post.createdAt)}</Text>
      </View>
    </Pressable>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    type: PropTypes.oneOf(['normal', 'video', 'question']),
    author: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      isFollowing: PropTypes.bool,
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    topics: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    videoDuration: PropTypes.string,
    likeCount: PropTypes.number,
    commentCount: PropTypes.number,
    favoriteCount: PropTypes.number,
    isLiked: PropTypes.bool,
    isFavorited: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onLongPress: PropTypes.func,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: 8,
    paddingVertical: 16,
  },
  cardPressed: {
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[200],
  },
  authorDetails: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  tag: {
    fontSize: 13,
    color: COLORS.primary[600],
    marginRight: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primary[500],
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    paddingHorizontal: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  questionBadge: {
    backgroundColor: COLORS.info[50],
  },
  highlightBadge: {
    backgroundColor: COLORS.warning[50],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.info[600],
  },
  highlightText: {
    color: COLORS.warning[600],
    marginLeft: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 22,
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[100],
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
  },
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.gray[100],
  },
  multiImageContainer: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },
  multiImageWrapper: {
    flex: 1,
    marginHorizontal: 3,
    position: 'relative',
  },
  multiImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  likedText: {
    color: COLORS.error[500],
  },
  favoritedText: {
    color: COLORS.warning[500],
  },
  timeText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
});

