/**
 * 动态用户主页
 * 查看其他用户的公开资料
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectAuthUserInfo } from '@/src/store/slices/authSlice';
import {
    checkFollowStatus,
    fetchUserPosts,
    fetchUserProfile,
    followUser,
    unfollowUser
} from '@/src/store/slices/userSlice';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const isOwnProfile = authUserInfo?.id?.toString() === id?.toString();
  
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'following'

  // 页面初始化
  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  // 加载用户数据
  const loadUserData = async () => {
    setLoading(true);
    try {
      // 1. 获取用户资料
      const profileResult = await dispatch(fetchUserProfile(id)).unwrap();
      setUserProfile(profileResult);
      
      // 2. 获取用户帖子
      const postsResult = await dispatch(
        fetchUserPosts({
          userId: id,
          page: 1,
          pageSize: 20,
          type: 'all',
        })
      ).unwrap();
      setUserPosts(postsResult.items || []);
      
      // 3. 如果不是自己的主页，检查关注状态
      if (!isOwnProfile) {
        const followStatus = await dispatch(checkFollowStatus(id)).unwrap();
        setIsFollowing(followStatus.isFollowing);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // 切换关注状态
  const handleToggleFollow = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(id)).unwrap();
        setIsFollowing(false);
        // 更新本地粉丝数
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            stats: {
              ...userProfile.stats,
              followersCount: Math.max(0, (userProfile.stats?.followersCount || 0) - 1),
            },
          });
        }
      } else {
        await dispatch(followUser(id)).unwrap();
        setIsFollowing(true);
        // 更新本地粉丝数
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            stats: {
              ...userProfile.stats,
              followersCount: (userProfile.stats?.followersCount || 0) + 1,
            },
          });
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // 渲染帖子卡片
  const renderPostCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => router.push(`/community/post/${item.id}`)}
        activeOpacity={0.7}
      >
        <Text style={styles.postTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.postContent} numberOfLines={3}>
          {item.content}
        </Text>
        
        {/* 帖子统计 */}
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.statText}>{item.likesCount || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.statText}>{item.commentsCount || 0}</Text>
          </View>
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={48} color={COLORS.gray[300]} />
      <Text style={styles.emptyText}>还没有发布内容</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.gray[400]} />
        <Text style={styles.errorText}>用户不存在</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {userProfile.nickname || userProfile.username}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // TODO: 分享或更多操作
            console.log('更多操作');
          }}
          hitSlop={12}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'posts' ? userPosts : []}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[600]}
          />
        }
        ListHeaderComponent={
          <>
            {/* 用户信息卡片 */}
            <View style={styles.profileCard}>
              {/* 头像和基本信息 */}
              <View style={styles.userHeader}>
                {userProfile.avatar || userProfile.avatarUrl ? (
                  <Image
                    source={{ uri: userProfile.avatar || userProfile.avatarUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Ionicons name="person" size={40} color={COLORS.gray[400]} />
                  </View>
                )}

                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nickname}>
                      {userProfile.nickname || userProfile.username}
                    </Text>
                    {userProfile.level && (
                      <View style={styles.levelBadge}>
                        <Ionicons name="star" size={12} color={COLORS.primary[600]} />
                        <Text style={styles.levelText}>Lv.{userProfile.level}</Text>
                      </View>
                    )}
                  </View>

                  {userProfile.bio && (
                    <Text style={styles.bio} numberOfLines={3}>
                      {userProfile.bio}
                    </Text>
                  )}

                  {/* 位置和目标国家 */}
                  <View style={styles.infoRow}>
                    {userProfile.location && (
                      <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={14} color={COLORS.gray[500]} />
                        <Text style={styles.infoText}>{userProfile.location}</Text>
                      </View>
                    )}
                    {userProfile.targetCountry && (
                      <View style={styles.infoItem}>
                        <Ionicons name="flag-outline" size={14} color={COLORS.gray[500]} />
                        <Text style={styles.infoText}>目标: {userProfile.targetCountry}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* 统计数据 */}
              <View style={styles.statsRow}>
                <TouchableOpacity style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {userProfile.stats?.postsCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>帖子</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => {
                    // TODO: 跳转到粉丝列表
                    console.log('查看粉丝');
                  }}
                >
                  <Text style={styles.statValue}>
                    {userProfile.stats?.followersCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>粉丝</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => {
                    // TODO: 跳转到关注列表
                    console.log('查看关注');
                  }}
                >
                  <Text style={styles.statValue}>
                    {userProfile.stats?.followingCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>关注</Text>
                </TouchableOpacity>
              </View>

              {/* 操作按钮 */}
              {!isOwnProfile && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      isFollowing && styles.followingButton,
                    ]}
                    onPress={handleToggleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={isFollowing ? COLORS.gray[600] : COLORS.white}
                      />
                    ) : (
                      <>
                        {isFollowing ? (
                          <>
                            <Ionicons name="checkmark" size={16} color={COLORS.gray[600]} />
                            <Text style={styles.followingText}>已关注</Text>
                          </>
                        ) : (
                          <>
                            <Ionicons name="add" size={16} color={COLORS.white} />
                            <Text style={styles.followText}>关注</Text>
                          </>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                      // TODO: 发送私信
                      console.log('发送私信');
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color={COLORS.gray[700]} />
                    <Text style={styles.messageText}>私信</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Tab 切换 */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                onPress={() => setActiveTab('posts')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'posts' && styles.activeTabText,
                  ]}
                >
                  帖子 ({userProfile.stats?.postsCount || 0})
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },

  // 顶部导航
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },

  // 列表内容
  listContent: {
    paddingBottom: 20,
  },

  // 用户信息卡片
  profileCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray[100],
    marginRight: 16,
  },
  avatarEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginRight: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  bio: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray[600],
  },

  // 统计数据
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[100],
  },

  // 操作按钮
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.primary[600],
    borderRadius: 8,
    gap: 6,
  },
  followingButton: {
    backgroundColor: COLORS.gray[100],
  },
  followText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  followingText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  messageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    gap: 6,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[700],
  },

  // Tab 栏
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[500],
  },
  activeTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary[600],
  },

  // 帖子卡片
  postCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  postDate: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginLeft: 'auto',
  },

  // 空状态
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 12,
  },
});

