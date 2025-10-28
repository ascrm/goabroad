/**
 * 用户主页组件
 * 显示用户信息、统计数据、发布的内容等
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function UserProfile({ user, isOwnProfile = false }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [activeTab, setActiveTab] = useState('posts');

  // 处理关注/取消关注
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: 调用 API
  };

  // 处理编辑资料
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  // 处理私信
  const handleMessage = () => {
    // TODO: 实现私信功能
    console.log('Send message to:', user.id);
  };

  // 格式化数字
  const formatCount = (count) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部背景 */}
      <View style={styles.headerBackground}>
        {user.coverImage ? (
          <Image source={{ uri: user.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      {/* 用户信息卡片 */}
      <View style={styles.profileCard}>
        {/* 头像 */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatarUrl || user.avatar }} style={styles.avatar} />
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary[600]} />
            </View>
          )}
        </View>

        {/* 用户名和简介 */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
          
          {/* 标签 */}
          {user.tags && user.tags.length > 0 && (
            <View style={styles.tags}>
              {user.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 统计数据 */}
        <View style={styles.stats}>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user.postsCount || 0)}</Text>
            <Text style={styles.statLabel}>帖子</Text>
          </TouchableOpacity>
          
          <View style={styles.statDivider} />
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user.followersCount || 0)}</Text>
            <Text style={styles.statLabel}>粉丝</Text>
          </TouchableOpacity>
          
          <View style={styles.statDivider} />
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user.followingCount || 0)}</Text>
            <Text style={styles.statLabel}>关注</Text>
          </TouchableOpacity>
          
          <View style={styles.statDivider} />
          
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statValue}>{formatCount(user.likesCount || 0)}</Text>
            <Text style={styles.statLabel}>获赞</Text>
          </TouchableOpacity>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {isOwnProfile ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.gray[700]} />
              <Text style={styles.editButtonText}>编辑资料</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.followButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={handleFollowToggle}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFollowing ? 'checkmark' : 'add'}
                  size={18}
                  color={isFollowing ? COLORS.gray[700] : COLORS.white}
                />
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? '已关注' : '关注'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton]}
                onPress={handleMessage}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={18} color={COLORS.gray[700]} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
            帖子
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
          onPress={() => setActiveTab('liked')}
        >
          <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActive]}>
            赞过
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorited' && styles.tabActive]}
          onPress={() => setActiveTab('favorited')}
        >
          <Text style={[styles.tabText, activeTab === 'favorited' && styles.tabTextActive]}>
            收藏
          </Text>
        </TouchableOpacity>
      </View>

      {/* 内容列表 */}
      <View style={styles.content}>
        <Text style={styles.emptyText}>暂无内容</Text>
      </View>
    </ScrollView>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    bio: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    isVerified: PropTypes.bool,
    isFollowing: PropTypes.bool,
    postsCount: PropTypes.number,
    followersCount: PropTypes.number,
    followingCount: PropTypes.number,
    likesCount: PropTypes.number,
  }).isRequired,
  isOwnProfile: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  headerBackground: {
    height: 150,
    backgroundColor: COLORS.primary[100],
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary[100],
  },
  profileCard: {
    backgroundColor: COLORS.white,
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: -60,
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray[200],
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 6,
  },
  userBio: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary[700],
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray[100],
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.gray[100],
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: COLORS.gray[100],
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  followButton: {
    backgroundColor: COLORS.primary[600],
  },
  followingButton: {
    backgroundColor: COLORS.gray[100],
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  followingButtonText: {
    color: COLORS.gray[700],
  },
  messageButton: {
    flex: 0,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[100],
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
});

