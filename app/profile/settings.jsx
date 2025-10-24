/**
 * 设置页面
 * 账号安全、隐私设置、通用设置等
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import {
    clearCache,
    selectSettings,
    updateGeneral,
    updatePrivacy,
} from '@/src/store/slices/profileSlice';

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  const [autoPlayVideo, setAutoPlayVideo] = useState(settings.general.autoPlayVideo);
  const [dataUsageMode, setDataUsageMode] = useState(settings.general.dataUsageMode);

  // 账号安全
  const handleAccountSecurity = () => {
    Alert.alert('账号安全', '账号安全设置功能开发中');
  };

  // 修改密码
  const handleChangePassword = () => {
    Alert.alert('修改密码', '修改密码功能开发中');
  };

  // 绑定手机/邮箱
  const handleBindContact = (type) => {
    Alert.alert(
      type === 'phone' ? '绑定手机' : '绑定邮箱',
      `${type === 'phone' ? '绑定手机' : '绑定邮箱'}功能开发中`
    );
  };

  // 第三方账号管理
  const handleThirdPartyAccounts = () => {
    Alert.alert('第三方账号', '第三方账号管理功能开发中');
  };

  // 隐私设置
  const handlePrivacySettings = (setting, value) => {
    dispatch(updatePrivacy({ [setting]: value }));
  };

  // 谁可以看我的帖子
  const handlePostVisibility = () => {
    const options = [
      { label: '所有人', value: 'everyone' },
      { label: '仅关注者', value: 'followers' },
      { label: '仅自己', value: 'private' },
    ];

    Alert.alert(
      '谁可以看我的帖子',
      '',
      options.map((option) => ({
        text: option.label,
        onPress: () => handlePrivacySettings('whoCanSeeMyPosts', option.value),
      }))
    );
  };

  // 谁可以评论
  const handleCommentPermission = () => {
    const options = [
      { label: '所有人', value: 'everyone' },
      { label: '仅关注者', value: 'followers' },
      { label: '关闭评论', value: 'none' },
    ];

    Alert.alert(
      '谁可以评论',
      '',
      options.map((option) => ({
        text: option.label,
        onPress: () => handlePrivacySettings('whoCanComment', option.value),
      }))
    );
  };

  // 黑名单
  const handleBlacklist = () => {
    Alert.alert('黑名单', '黑名单管理功能开发中');
  };

  // 清除缓存
  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除缓存吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '清除',
        style: 'destructive',
        onPress: () => {
          dispatch(clearCache());
          Alert.alert('成功', '缓存已清除');
        },
      },
    ]);
  };

  // 检查更新
  const handleCheckUpdate = () => {
    Alert.alert('检查更新', '当前已是最新版本 v1.0.0');
  };

  // 自动播放视频
  const handleAutoPlayVideo = (value) => {
    setAutoPlayVideo(value);
    dispatch(updateGeneral({ autoPlayVideo: value }));
  };

  // 省流量模式
  const handleDataUsageMode = (value) => {
    setDataUsageMode(value);
    dispatch(updateGeneral({ dataUsageMode: value }));
  };

  // 获取可读的隐私设置文本
  const getPrivacyText = (value) => {
    const map = {
      everyone: '所有人',
      followers: '仅关注者',
      private: '仅自己',
      none: '关闭',
    };
    return map[value] || value;
  };

  // 格式化缓存大小
  const formatCacheSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    if (bytes < 1024 * 1024) return '< 1 MB';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 账号安全 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>账号安全</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="key-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>修改密码</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleBindContact('phone')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="call-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>绑定手机</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {settings.security.hasPhone ? settings.security.phoneNumber : '未绑定'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleBindContact('email')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>绑定邮箱</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {settings.security.hasEmail ? settings.security.email : '未绑定'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleThirdPartyAccounts}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>第三方账号管理</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* 隐私设置 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>隐私设置</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handlePostVisibility}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="eye-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>谁可以看我的帖子</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {getPrivacyText(settings.privacy.whoCanSeeMyPosts)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleCommentPermission}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>谁可以评论</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {getPrivacyText(settings.privacy.whoCanComment)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleBlacklist}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="ban-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>黑名单</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {settings.privacy.blacklist.length}人
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 通用设置 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>通用设置</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="play-circle-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>自动播放视频</Text>
            </View>
            <Switch
              value={autoPlayVideo}
              onValueChange={handleAutoPlayVideo}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
              thumbColor={autoPlayVideo ? COLORS.primary[600] : COLORS.gray[100]}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="wifi-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>省流量模式</Text>
            </View>
            <Switch
              value={dataUsageMode}
              onValueChange={handleDataUsageMode}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
              thumbColor={dataUsageMode ? COLORS.primary[600] : COLORS.gray[100]}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>清除缓存</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>
                {formatCacheSize(settings.general.cacheSize)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleCheckUpdate}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="download-outline" size={20} color={COLORS.gray[700]} />
              <Text style={styles.menuItemText}>检查更新</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.rightText}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>
        </View>

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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginLeft: 48,
  },
});

