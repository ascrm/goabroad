/**
 * 个人主页
 * 显示用户完整信息、统计数据和功能入口
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectAuthUserInfo } from '@/src/store/slices/authSlice';
import {
    selectStats,
    selectUserInfo,
} from '@/src/store/slices/profileSlice';

export default function ProfileIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const userInfo = useAppSelector(selectUserInfo);
  const authUserInfo = useAppSelector(selectAuthUserInfo);
  const stats = useAppSelector(selectStats);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 使用 auth 或 profile 中的用户信息
  const displayUser = userInfo.id ? userInfo : authUserInfo || {};

  // 页面初始化
  useEffect(() => {
    // 如果需要，这里可以调用 API 获取最新的用户信息
    // fetchUserProfile();
  }, []);

  // 刷新用户信息
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: 调用 API 刷新用户信息
      // await dispatch(fetchUserProfile(displayUser.id)).unwrap();
      console.log('刷新用户信息');
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 渲染统计项
  const renderStatItem = (label, value, onPress) => (
    <TouchableOpacity style={styles.statItem} onPress={onPress}>
      <Text style={styles.statValue}>{value || 0}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  // 渲染功能入口
  const renderMenuItem = (icon, label, onPress, showBadge = false) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={22} color={COLORS.primary[600]} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile/settings')}>
          <Ionicons name="settings-outline" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>个人中心</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[600]}
          />
        }
      >
        {/* 用户信息卡片 */}
        <View style={styles.profileCard}>
          {/* 头像和基本信息 */}
          <View style={styles.userHeader}>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              {displayUser.avatarUrl || displayUser.avatar ? (
                <Image
                  source={{ uri: displayUser.avatarUrl || displayUser.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarEmpty]}>
                  <Ionicons name="person" size={40} color={COLORS.gray[400]} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.nickname}>
                  {displayUser.nickname || displayUser.username || '未设置昵称'}
                </Text>
                {displayUser.level && (
                  <View style={styles.levelBadge}>
                    <Ionicons name="star" size={12} color={COLORS.primary[600]} />
                    <Text style={styles.levelText}>Lv.{displayUser.level}</Text>
                  </View>
                )}
              </View>

              {displayUser.signature || displayUser.bio ? (
                <Text style={styles.signature} numberOfLines={2}>
                  {displayUser.signature || displayUser.bio}
                </Text>
              ) : (
                <Text style={styles.signaturePlaceholder}>还没有个性签名</Text>
              )}

              {/* 编辑资料按钮 */}
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push('/profile/edit')}
              >
                <Ionicons name="create-outline" size={16} color={COLORS.primary[600]} />
                <Text style={styles.editBtnText}>编辑资料</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 统计数据 */}
          <View style={styles.statsRow}>
            {renderStatItem('帖子', stats.postsCount, () =>
              router.push('/profile/my-posts')
            )}
            <View style={styles.statDivider} />
            {renderStatItem('收藏', stats.favoritesCount, () =>
              router.push('/profile/my-favorites')
            )}
            <View style={styles.statDivider} />
            {renderStatItem('点赞', stats.likesCount, null)}
          </View>
        </View>

        {/* 我的内容 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的内容</Text>
          <View style={styles.menuGroup}>
            {renderMenuItem('document-text-outline', '我的发布', () =>
              router.push('/profile/my-posts')
            )}
            {renderMenuItem('bookmark-outline', '我的收藏', () =>
              router.push('/profile/my-favorites')
            )}
            {renderMenuItem('map-outline', '我的行程', () =>
              router.push('/profile/my-plans')
            )}
          </View>
        </View>

        {/* 社交关系 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>社交关系</Text>
          <View style={styles.menuGroup}>
            {renderMenuItem('people-outline', '我的关注', () =>
              router.push('/profile/following')
            )}
            {renderMenuItem('heart-outline', '关注我的', () =>
              router.push('/profile/followers')
            )}
          </View>
        </View>

        {/* 其他功能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          <View style={styles.menuGroup}>
            {renderMenuItem('notifications-outline', '通知中心', () =>
              router.push('/profile/notifications')
            , true)}
            {renderMenuItem('settings-outline', '设置', () =>
              router.push('/profile/settings')
            )}
          </View>
        </View>

        {/* 底部空白 */}
        <View style={{ height: 40 }} />
      </ScrollView>
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

  // 顶部导航栏
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },

  // 滚动区域
  scroll: {
    flex: 1,
  },

  // 用户信息卡片
  profileCard: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // 用户头部
  userHeader: {
    flexDirection: 'row',
    marginBottom: 20,
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
    justifyContent: 'center',
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
  signature: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  signaturePlaceholder: {
    fontSize: 14,
    color: COLORS.gray[400],
    fontStyle: 'italic',
    marginBottom: 12,
  },

  // 编辑按钮
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary[600],
  },

  // 统计数据
  statsRow: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
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

  // 功能分区
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // 菜单项
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[50],
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // 徽章
  badge: {
    backgroundColor: COLORS.error[500],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
});

