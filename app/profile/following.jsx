/**
 * 关注列表页
 * 显示当前用户关注的所有用户
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
    fetchUserFollowing,
    selectUserFollowing,
    unfollowUser,
} from '@/src/store/slices/userSlice';

export default function Following() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const userFollowingState = useAppSelector(selectUserFollowing);
  const following = userFollowingState?.items || [];
  const pagination = userFollowingState?.pagination;
  const loading = userFollowingState?.loading || false;
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unfollowing, setUnfollowing] = useState({});

  // 页面初始化
  useEffect(() => {
    if (authUserInfo?.id) {
      loadFollowing(1);
    }
  }, [authUserInfo?.id]);

  // 加载关注列表
  const loadFollowing = async (page = 1) => {
    if (!authUserInfo?.id) return;
    
    try {
      await dispatch(
        fetchUserFollowing({
          userId: authUserInfo.id,
          page,
          pageSize: 20,
        })
      ).unwrap();
    } catch (error) {
      console.error('加载关注列表失败:', error);
    }
  };

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFollowing(1);
    setRefreshing(false);
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (loadingMore || loading || !pagination) return;
    
    const { currentPage, totalPages } = pagination;
    if (currentPage >= totalPages) return;
    
    setLoadingMore(true);
    await loadFollowing(currentPage + 1);
    setLoadingMore(false);
  };

  // 取消关注
  const handleUnfollow = async (userId, nickname) => {
    Alert.alert(
      '取消关注',
      `确定不再关注 ${nickname} 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            setUnfollowing({ ...unfollowing, [userId]: true });
            try {
              await dispatch(unfollowUser(userId)).unwrap();
              // 取消关注成功后，重新加载列表
              await loadFollowing(1);
            } catch (error) {
              console.error('取消关注失败:', error);
              Alert.alert('失败', '取消关注失败，请重试');
            } finally {
              setUnfollowing({ ...unfollowing, [userId]: false });
            }
          },
        },
      ]
    );
  };

  // 渲染用户卡片
  const renderUserCard = ({ item }) => {
    const user = item; // 根据 API 返回的数据结构可能需要调整
    const isUnfollowing = unfollowing[user.id];

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => router.push(`/profile/user/${user.id}`)}
        activeOpacity={0.7}
      >
        {/* 头像 */}
        {user.avatar || user.avatarUrl ? (
          <Image
            source={{ uri: user.avatar || user.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <Ionicons name="person" size={32} color={COLORS.gray[400]} />
          </View>
        )}

        {/* 用户信息 */}
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname} numberOfLines={1}>
              {user.nickname || user.username}
            </Text>
            {user.level && (
              <View style={styles.levelBadge}>
                <Ionicons name="star" size={10} color={COLORS.primary[600]} />
                <Text style={styles.levelText}>Lv.{user.level}</Text>
              </View>
            )}
          </View>

          {user.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {user.bio}
            </Text>
          )}

          {/* 统计信息 */}
          <View style={styles.stats}>
            <Text style={styles.statText}>
              {user.stats?.postsCount || 0} 帖子
            </Text>
            <View style={styles.statDivider} />
            <Text style={styles.statText}>
              {user.stats?.followersCount || 0} 粉丝
            </Text>
          </View>
        </View>

        {/* 取消关注按钮 */}
        <TouchableOpacity
          style={styles.unfollowBtn}
          onPress={(e) => {
            e.stopPropagation();
            handleUnfollow(user.id, user.nickname || user.username);
          }}
          disabled={isUnfollowing}
          activeOpacity={0.7}
        >
          {isUnfollowing ? (
            <ActivityIndicator size="small" color={COLORS.gray[600]} />
          ) : (
            <>
              <Ionicons name="checkmark" size={14} color={COLORS.gray[600]} />
              <Text style={styles.unfollowText}>已关注</Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // 空状态
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={64} color={COLORS.gray[300]} />
        <Text style={styles.emptyText}>还没有关注任何人</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/community')}
          activeOpacity={0.7}
        >
          <Text style={styles.exploreButtonText}>去发现</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 列表底部
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={COLORS.primary[600]} />
        <Text style={styles.footerText}>加载更多...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的关注</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 关注列表 */}
      <FlatList
        data={following || []}
        renderItem={renderUserCard}
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
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  listContent: {
    padding: 16,
  },

  // 用户卡片
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray[100],
    marginRight: 12,
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
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginRight: 6,
    flex: 1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  bio: {
    fontSize: 13,
    color: COLORS.gray[600],
    lineHeight: 18,
    marginBottom: 6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.gray[300],
  },

  // 取消关注按钮
  unfollowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.gray[100],
    borderRadius: 16,
    gap: 4,
    minWidth: 70,
    justifyContent: 'center',
  },
  unfollowText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[600],
  },

  // 空状态
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray[500],
    marginTop: 16,
    marginBottom: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 12,
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
});

