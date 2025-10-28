/**
 * 视频卡片组件
 * 显示视频内容，支持播放、点赞、评论等互动
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';
import TopicTag from './TopicTag';

export default function VideoCard({ video, onLike, onComment, onShare }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);

  // 处理播放视频
  const handlePlay = () => {
    router.push(`/community/video/${video.id}`);
  };

  // 处理点赞
  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    onLike?.(video.id, newIsLiked);
  };

  // 处理评论
  const handleComment = () => {
    onComment?.(video.id);
  };

  // 处理分享
  const handleShare = () => {
    onShare?.(video.id);
  };

  // 格式化数字
  const formatCount = (count) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* 视频封面 */}
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handlePlay}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: video.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
        
        {/* 播放按钮 */}
        <View style={styles.playButton}>
          <Ionicons name="play" size={32} color={COLORS.white} />
        </View>

        {/* 视频时长 */}
        <View style={styles.duration}>
          <Ionicons name="time-outline" size={12} color={COLORS.white} />
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>

        {/* 播放量 */}
        <View style={styles.viewCount}>
          <Ionicons name="eye-outline" size={14} color={COLORS.white} />
          <Text style={styles.viewCountText}>{formatCount(video.viewCount)}</Text>
        </View>
      </TouchableOpacity>

      {/* 视频信息 */}
      <View style={styles.content}>
        {/* 标题 */}
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        {/* 话题标签 */}
        {video.topics && video.topics.length > 0 && (
          <View style={styles.topics}>
            {video.topics.slice(0, 2).map((topic, index) => (
              <TopicTag key={index} topic={topic} size="small" />
            ))}
          </View>
        )}

        {/* 作者信息 */}
        <TouchableOpacity
          style={styles.author}
          onPress={() => router.push(`/community/user/${video.author.id}`)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: video.author.avatarUrl || video.author.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.authorName}>{video.author.name}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{video.timeAgo}</Text>
        </TouchableOpacity>

        {/* 互动按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? COLORS.error[600] : COLORS.gray[600]}
            />
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {formatCount(likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleComment}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.gray[600]} />
            <Text style={styles.actionText}>{formatCount(video.commentCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.gray[600]} />
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    coverUrl: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    viewCount: PropTypes.number.isRequired,
    likeCount: PropTypes.number,
    commentCount: PropTypes.number,
    isLiked: PropTypes.bool,
    topics: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    timeAgo: PropTypes.string.isRequired,
  }).isRequired,
  onLike: PropTypes.func,
  onComment: PropTypes.func,
  onShare: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.gray[900],
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -28 }, { translateY: -28 }],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  viewCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
  },
  viewCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 22,
    marginBottom: 8,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  dot: {
    fontSize: 13,
    color: COLORS.gray[400],
    marginHorizontal: 4,
  },
  time: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  actionTextActive: {
    color: COLORS.error[600],
  },
});

