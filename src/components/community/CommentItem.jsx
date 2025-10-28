/**
 * 评论项组件
 * 显示单条评论，支持点赞、回复
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import { toggleLikeComment } from '@/src/store/slices/communitySlice';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
      addSuffix: true,
      locale: zhCN,
    });
  } catch {
    return '';
  }
};

export default function CommentItem({ comment, onReply, isAuthorComment = false }) {
  const dispatch = useDispatch();
  const isLiked = useSelector((state) => 
    state.community.likedCommentIds.includes(comment.id)
  );

  // 点赞评论
  const handleLike = () => {
    dispatch(toggleLikeComment(comment.id));
  };

  // 回复评论
  const handleReply = () => {
    onReply?.({
      commentId: comment.id,
      userId: comment.user.id,
      userName: comment.user.name,
    });
  };

  // 点击用户
  const handleUserPress = () => {
    // TODO: 导航到用户主页
    console.log('Navigate to user:', comment.user.id);
  };

  return (
    <View style={styles.container}>
      {/* 头像 */}
      <TouchableOpacity onPress={handleUserPress} activeOpacity={0.7}>
        <Image
          source={{ uri: comment.user.avatarUrl || comment.user.avatar || 'https://via.placeholder.com/36' }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* 内容区 */}
      <View style={styles.content}>
        {/* 用户名 */}
        <TouchableOpacity onPress={handleUserPress} activeOpacity={0.7}>
          <View style={styles.userRow}>
            <Text style={styles.userName}>{comment.user.name}</Text>
            {isAuthorComment && (
              <View style={styles.authorBadge}>
                <Text style={styles.authorText}>作者</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* 评论内容 */}
        <Text style={styles.commentText}>
          {comment.replyTo && (
            <Text style={styles.replyToText}>@{comment.replyTo.name} </Text>
          )}
          {comment.content}
        </Text>

        {/* 底部操作栏 */}
        <View style={styles.footer}>
          <Text style={styles.timeText}>{formatTime(comment.createdAt)}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={isLiked ? COLORS.error[500] : COLORS.text.tertiary}
              />
              {comment.likeCount > 0 && (
                <Text style={[styles.actionText, isLiked && styles.likedText]}>
                  {formatCount(comment.likeCount)}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReply}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.text.tertiary} />
              <Text style={styles.actionText}>回复</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 子回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.replies}>
            {comment.replies.map((reply) => (
              <View key={reply.id} style={styles.replyItem}>
                <Text style={styles.replyUser}>{reply.user.name}</Text>
                {reply.replyTo && (
                  <>
                    <Text style={styles.replyArrow}> → </Text>
                    <Text style={styles.replyUser}>{reply.replyTo.name}</Text>
                  </>
                )}
                <Text style={styles.replyText}>: {reply.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    content: PropTypes.string.isRequired,
    likeCount: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
    replyTo: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onReply: PropTypes.func,
  isAuthorComment: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[200],
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  authorBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLORS.primary[50],
    borderRadius: 4,
  },
  authorText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text.primary,
  },
  replyToText: {
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  likedText: {
    color: COLORS.error[500],
  },
  replies: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border.light,
  },
  replyItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  replyUser: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary[600],
  },
  replyArrow: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  replyText: {
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
  },
});

