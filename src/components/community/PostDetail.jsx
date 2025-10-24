/**
 * 帖子详情组件
 * 显示完整的帖子内容，包括标题、正文、图片、视频等
 */

import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useDispatch } from 'react-redux';

import { COLORS } from '@/src/constants';
import { toggleFavoritePost, toggleFollowUser, toggleLikePost } from '@/src/store/slices/communitySlice';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ImageViewer from './ImageViewer';

/**
 * 格式化数字显示
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
      addSuffix: false,
      locale: zhCN,
    });
  } catch {
    return '';
  }
};

export default function PostDetail({ post, onShare }) {
  const dispatch = useDispatch();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  // 点击用户
  const handleUserPress = () => {
    // TODO: 导航到用户主页
    console.log('Navigate to user:', post.author.id);
  };

  // 关注用户
  const handleFollowPress = () => {
    dispatch(toggleFollowUser(post.author.id));
  };

  // 点赞
  const handleLikePress = () => {
    dispatch(toggleLikePost(post.id));
  };

  // 收藏
  const handleFavoritePress = () => {
    dispatch(toggleFavoritePost(post.id));
  };

  // 分享
  const handleShare = () => {
    onShare?.(post);
  };

  // 打开图片查看器
  const handleImagePress = (index) => {
    setImageViewerIndex(index);
    setImageViewerVisible(true);
  };

  // 渲染标签
  const renderTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {post.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染图片网格
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    if (post.images.length === 1) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
        >
          <Image
            source={{ uri: post.images[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.imageGrid}>
        {post.images.slice(0, 9).map((img, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.gridImage,
              { width: post.images.length === 2 ? '49%' : '32%' },
            ]}
            activeOpacity={0.9}
            onPress={() => handleImagePress(index)}
          >
            <Image
              source={{ uri: img }}
              style={styles.gridImageContent}
              resizeMode="cover"
            />
            {index === 8 && post.images.length > 9 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{post.images.length - 9}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染视频
  const renderVideo = () => {
    if (post.type !== 'video' || !post.videoUrl) return null;

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: post.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 作者信息栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorInfo}
          onPress={handleUserPress}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: post.author.avatar || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <View style={styles.metaRow}>
              {renderTags()}
            </View>
            <Text style={styles.timeText}>
              {formatTime(post.createdAt)}前
            </Text>
          </View>
        </TouchableOpacity>

        {!post.author.isFollowing && (
          <TouchableOpacity
            style={styles.followButton}
            onPress={handleFollowPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={COLORS.white} />
            <Text style={styles.followButtonText}>关注</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 内容区 */}
      <View style={styles.content}>
        {/* 标题 */}
        <Text style={styles.title}>{post.title}</Text>

        {/* 正文（Markdown 渲染） */}
        {post.content && (
          <Markdown style={markdownStyles}>
            {post.content}
          </Markdown>
        )}

        {/* 图片 */}
        {renderImages()}

        {/* 视频 */}
        {renderVideo()}
      </View>

      {/* 互动栏（固定在底部，这里先显示在内容下方） */}
      <View style={styles.footer}>
        <View style={styles.stats}>
          <TouchableOpacity
            style={styles.statButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={post.isLiked ? COLORS.error[500] : COLORS.text.tertiary}
            />
            <Text style={[styles.statText, post.isLiked && styles.likedText]}>
              {formatCount(post.likeCount || 0)}
            </Text>
          </TouchableOpacity>

          <View style={styles.statButton}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.text.tertiary} />
            <Text style={styles.statText}>{formatCount(post.commentCount || 0)}</Text>
          </View>

          <TouchableOpacity
            style={styles.statButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={post.isFavorited ? 'star' : 'star-outline'}
              size={24}
              color={post.isFavorited ? COLORS.warning[500] : COLORS.text.tertiary}
            />
            <Text style={[styles.statText, post.isFavorited && styles.favoritedText]}>
              收藏{post.favoriteCount > 0 ? ` ${formatCount(post.favoriteCount)}` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-redo-outline" size={24} color={COLORS.text.tertiary} />
            <Text style={styles.statText}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 图片查看器 */}
      {post.images && post.images.length > 0 && (
        <ImageViewer
          images={post.images}
          visible={imageViewerVisible}
          initialIndex={imageViewerIndex}
          onClose={() => setImageViewerVisible(false)}
        />
      )}
    </View>
  );
}

PostDetail.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    type: PropTypes.oneOf(['normal', 'video', 'question']),
    author: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      isFollowing: PropTypes.bool,
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    videoUrl: PropTypes.string,
    likeCount: PropTypes.number,
    commentCount: PropTypes.number,
    favoriteCount: PropTypes.number,
    isLiked: PropTypes.bool,
    isFavorited: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onShare: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  authorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray[200],
  },
  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.primary[600],
  },
  timeText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary[500],
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    lineHeight: 28,
    marginBottom: 16,
  },
  singleImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: COLORS.gray[100],
    marginTop: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
    marginTop: 16,
  },
  gridImage: {
    aspectRatio: 1,
    padding: 3,
    position: 'relative',
  },
  gridImageContent: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
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
  videoContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[900],
    marginTop: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginLeft: 6,
  },
  likedText: {
    color: COLORS.error[500],
  },
  favoritedText: {
    color: COLORS.warning[500],
  },
});

// Markdown 样式
const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.primary,
  },
  heading1: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
    color: COLORS.text.primary,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
    color: COLORS.text.primary,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: COLORS.text.primary,
  },
  paragraph: {
    marginBottom: 12,
  },
  strong: {
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: COLORS.primary[600],
    textDecorationLine: 'underline',
  },
  list_item: {
    marginBottom: 6,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  code_inline: {
    backgroundColor: COLORS.gray[100],
    color: COLORS.error[600],
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: COLORS.gray[900],
    color: COLORS.gray[50],
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: COLORS.gray[900],
    color: COLORS.gray[50],
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    fontFamily: 'monospace',
  },
  blockquote: {
    backgroundColor: COLORS.gray[50],
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  hr: {
    backgroundColor: COLORS.border.light,
    height: 1,
    marginVertical: 16,
  },
};

