/**
 * 个人中心页面
 * 显示用户信息、会员状态、功能列表等
 */

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MembershipCard from '@/src/components/profile/MembershipCard';
import MenuList from '@/src/components/profile/MenuList';
import UserHeader from '@/src/components/profile/UserHeader';
import { COLORS } from '@/src/constants';
import {
    selectMembership,
    selectStats,
    selectUserInfo,
    setMembership,
    setUserInfo,
    updateAvatar,
    updateGeneral,
    updateNotifications,
    updatePrivacy,
    updateSecurity,
    updateStats,
} from '@/src/store/slices/profileSlice';
import { initializeMockProfileData } from '@/src/utils/mockProfileData';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const userInfo = useSelector(selectUserInfo);
  const membership = useSelector(selectMembership);
  const stats = useSelector(selectStats);
  
  const [uploading, setUploading] = useState(false);

  // 初始化 mock 数据（仅在开发环境）
  React.useEffect(() => {
    if (__DEV__ && !userInfo.id) {
      initializeMockProfileData(dispatch, {
        setUserInfo,
        setMembership,
        updateStats,
        updateSecurity,
        updatePrivacy,
        updateNotifications,
        updateGeneral,
      });
    }
  }, []);

  // 编辑头像
  const handleAvatarPress = async () => {
    Alert.alert('更换头像', '', [
      {
        text: '从相册选择',
        onPress: pickImage,
      },
      {
        text: '拍照',
        onPress: takePhoto,
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  // 从相册选择
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  // 拍照
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  // 上传头像
  const uploadAvatar = async (uri) => {
    setUploading(true);
    try {
      // TODO: 调用 API 上传头像
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(updateAvatar(uri));
      Alert.alert('成功', '头像更新成功');
    } catch (error) {
      console.error('上传头像失败:', error);
      Alert.alert('失败', '上传头像失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 编辑资料
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  // 开通会员
  const handleUpgradeMembership = () => {
    Alert.alert('开通会员', '会员功能开发中，敬请期待');
  };

  // 菜单项配置
  const menuItems = [
    {
      id: 'my-plans',
      icon: 'flag-outline',
      label: '我的计划',
      iconBg: COLORS.primary[50],
      iconColor: COLORS.primary[600],
      route: '/profile/my-plans',
    },
    {
      id: 'my-posts',
      icon: 'document-text-outline',
      label: '我的发布',
      iconBg: COLORS.info[50],
      iconColor: COLORS.info[600],
      route: '/profile/my-posts',
    },
    {
      id: 'my-favorites',
      icon: 'star-outline',
      label: '我的收藏',
      iconBg: COLORS.warning[50],
      iconColor: COLORS.warning[600],
      route: '/profile/my-favorites',
    },
    {
      id: 'my-comments',
      icon: 'chatbubble-outline',
      label: '我的评论',
      iconBg: COLORS.success[50],
      iconColor: COLORS.success[600],
      route: '/profile/my-comments',
    },
    {
      id: 'my-files',
      icon: 'folder-outline',
      label: '我的文件',
      iconBg: COLORS.error[50],
      iconColor: COLORS.error[600],
      route: '/profile/my-files',
    },
  ];

  const toolsItems = [
    { type: 'divider' },
    {
      id: 'tools',
      icon: 'construct-outline',
      label: '工具箱',
      iconBg: COLORS.primary[50],
      iconColor: COLORS.primary[600],
      route: '/tools',
    },
    {
      id: 'services',
      icon: 'briefcase-outline',
      label: '服务',
      iconBg: COLORS.gray[100],
      iconColor: COLORS.gray[400],
      disabled: true,
      tag: 'v2.0',
    },
  ];

  const settingsItems = [
    { type: 'divider' },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: '通知设置',
      iconBg: COLORS.warning[50],
      iconColor: COLORS.warning[600],
      route: '/profile/notifications',
    },
    {
      id: 'language',
      icon: 'language-outline',
      label: '语言切换',
      iconBg: COLORS.info[50],
      iconColor: COLORS.info[600],
      rightText: '简体中文',
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: '设置',
      iconBg: COLORS.gray[100],
      iconColor: COLORS.gray[600],
      route: '/profile/settings',
    },
    {
      id: 'feedback',
      icon: 'chatbox-ellipses-outline',
      label: '反馈建议',
      iconBg: COLORS.success[50],
      iconColor: COLORS.success[600],
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: '帮助中心',
      iconBg: COLORS.primary[50],
      iconColor: COLORS.primary[600],
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      label: '关于我们',
      iconBg: COLORS.gray[100],
      iconColor: COLORS.gray[600],
      rightText: 'v1.0.0',
    },
  ];

  // 处理菜单点击
  const handleMenuPress = (item) => {
    if (item.disabled) return;

    if (item.route) {
      router.push(item.route);
    } else {
      switch (item.id) {
        case 'language':
          Alert.alert('语言切换', '语言切换功能开发中');
          break;
        case 'feedback':
          Alert.alert('反馈建议', '反馈功能开发中');
          break;
        case 'help':
          Alert.alert('帮助中心', '帮助中心开发中');
          break;
        case 'about':
          Alert.alert('关于我们', 'GoAbroad v1.0.0\n一站式留学规划平台');
          break;
        default:
          break;
      }
    }
  };

  // 退出登录
  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: () => {
          // TODO: 清除登录状态，跳转到登录页
          Alert.alert('提示', '退出登录功能开发中');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 用户信息头部 */}
        <UserHeader
          avatar={userInfo.avatar}
          nickname={userInfo.nickname || '点击设置昵称'}
          signature={userInfo.signature}
          level={userInfo.level}
          experience={userInfo.experience}
          experienceMax={userInfo.experienceMax}
          onEditPress={handleEditProfile}
          onAvatarPress={handleAvatarPress}
        />

        {/* 会员卡片 */}
        <MembershipCard
          isPro={membership.isPro}
          expireDate={membership.expireDate}
          onUpgrade={handleUpgradeMembership}
        />

        {/* 统计数据（会员显示） */}
        {membership.isPro && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.planProgress}%</Text>
              <Text style={styles.statLabel}>规划进度</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.postsCount}</Text>
              <Text style={styles.statLabel}>发帖数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.favoritesCount}</Text>
              <Text style={styles.statLabel}>收藏数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.likesCount}</Text>
              <Text style={styles.statLabel}>获赞数</Text>
            </View>
          </View>
        )}

        {/* 功能列表 */}
        <MenuList items={menuItems} onItemPress={handleMenuPress} />

        {/* 工具和服务 */}
        <MenuList items={toolsItems} onItemPress={handleMenuPress} />

        {/* 设置和其他 */}
        <MenuList items={settingsItems} onItemPress={handleMenuPress} />

        {/* 退出登录 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>退出登录</Text>
        </TouchableOpacity>

        {/* 底部间距 */}
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
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.error[600],
  },
});
