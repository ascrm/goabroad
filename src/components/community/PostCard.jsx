/**
 * 社区帖子卡片组件
 * 参考Twitter/X的帖子卡片设计
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from '@/src/components/ui/Avatar';
import { COLORS } from '@/src/constants';

const PostCard = ({ post, onPress }) => {
  const [expanded, setExpanded] = useState(false);
  
  // 格式化时间
  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now - postDate) / 1000); // 秒
    
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
    
    return postDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // 判断文本是否需要展开
  const needExpand = post.content.length > 200;
  const displayContent = needExpand && !expanded 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  // 渲染图片（横向滚动）
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;

    // 单张图片：全宽显示
    if (imageCount === 1) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.images[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    // 多张图片：横向滚动
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollContainer}
        contentContainerStyle={styles.imageScrollContent}
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={280} // 图片宽度 + gap
        nestedScrollEnabled={true}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
      >
        {post.images.map((img, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={(e) => {
              e.stopPropagation();
              // TODO: 打开图片查看器
            }}
          >
            <View 
              style={[
                styles.scrollImageWrapper,
                index === post.images.length - 1 && styles.lastImage,
              ]}
            >
              <Image
                source={{ uri: img }}
                style={styles.scrollImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* 头部区域 */}
      <View style={styles.header}>
        {/* 左侧：用户头像 */}
        <Avatar
          size="md"
          source={post.author.avatar}
          name={post.author.name}
        />

        {/* 中间：用户信息和时间 */}
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{post.author.name}</Text>
            {post.author.verified && (
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={COLORS.primary[600]} 
                style={styles.verifiedIcon}
              />
            )}
            <Text style={styles.postTime}>· {formatTime(post.createdAt)}</Text>
          </View>
          {post.author.description && (
            <Text style={styles.userDesc} numberOfLines={1}>
              {post.author.description}
            </Text>
          )}
        </View>

        {/* 右侧：更多操作按钮 */}
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: 显示操作菜单
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.gray[500]} />
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {displayContent}
        </Text>
        {needExpand && (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <Text style={styles.expandButton}>
              {expanded ? '收起' : '展开'}
            </Text>
          </TouchableOpacity>
        )}

        {/* 图片内容 */}
        {renderImages()}
      </View>

      {/* 底部交互栏 */}
      <View style={styles.actions}>
        {/* 评论 */}
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: 处理评论
          }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.gray[500]} />
          {post.commentCount > 0 && (
            <Text style={styles.actionText}>{formatNumber(post.commentCount)}</Text>
          )}
        </TouchableOpacity>

        {/* 转发 */}
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: 处理转发
          }}
        >
          <Ionicons name="repeat-outline" size={20} color={COLORS.gray[500]} />
          {post.shareCount > 0 && (
            <Text style={styles.actionText}>{formatNumber(post.shareCount)}</Text>
          )}
        </TouchableOpacity>

        {/* 点赞 */}
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: 处理点赞
          }}
        >
          <Ionicons 
            name={post.liked ? "heart" : "heart-outline"} 
            size={18} 
            color={post.liked ? COLORS.error[500] : COLORS.gray[500]} 
          />
          {post.likeCount > 0 && (
            <Text style={[
              styles.actionText,
              post.liked && styles.actionTextLiked
            ]}>
              {formatNumber(post.likeCount)}
            </Text>
          )}
        </TouchableOpacity>

        {/* 浏览量 */}
        <View style={styles.actionItem}>
          <Ionicons name="eye-outline" size={18} color={COLORS.gray[500]} />
          {post.viewCount > 0 && (
            <Text style={styles.actionText}>{formatNumber(post.viewCount)}</Text>
          )}
        </View>

        {/* 书签 */}
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: 处理书签
          }}
        >
          <Ionicons 
            name={post.bookmarked ? "bookmark" : "bookmark-outline"} 
            size={18} 
            color={post.bookmarked ? COLORS.primary[600] : COLORS.gray[500]} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // ===== 头部样式 =====
  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  postTime: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  userDesc: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  // ===== 内容样式 =====
  content: {
    marginLeft: 52,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  expandButton: {
    fontSize: 14,
    color: COLORS.primary[600],
    marginTop: 4,
    marginBottom: 8,
  },
  // ===== 图片样式 =====
  imageContainer: {
    marginTop: 12,
  },
  singleImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  // 横向滚动图片样式
  imageScrollContainer: {
    marginTop: 12,
  },
  imageScrollContent: {
    paddingRight: 16, // 右侧留白
  },
  scrollImageWrapper: {
    marginRight: 8,
  },
  lastImage: {
    marginRight: 16, // 最后一张图片右侧留白
  },
  scrollImage: {
    width: 272, // 约为屏幕宽度的75%
    height: 200,
    borderRadius: 16,
  },
  // ===== 交互栏样式 =====
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 52,
    gap: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
  actionTextLiked: {
    color: COLORS.error[500],
  },
});

export default PostCard;
