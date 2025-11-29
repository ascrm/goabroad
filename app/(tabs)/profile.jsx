/**
 * 个人主页（精简版）
 * - HeroCard 仅保留头像 + 姓名 + 通知入口
 * - 选项列表集中展示常用入口
 */

import { useTheme } from '@/src/context/ThemeContext';
import { useUserInfo } from '@/src/hooks/auth';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROFILE_OPTIONS = [
  { id: 'profile', icon: 'person-outline', label: '个人资料', subtitle: '编辑昵称与联系方式' },
  { id: 'plans', icon: 'compass-outline', label: '我的计划', subtitle: '查看或切换出国规划' },
  { id: 'favorites', icon: 'bookmark-outline', label: '我的收藏', subtitle: '文章、攻略与资源' },
  { id: 'questions', icon: 'chatbubbles-outline', label: '我的提问', subtitle: '社区互动与回复' },
  { id: 'account', icon: 'key-outline', label: '账户', subtitle: '登录方式与安全设置' },
  { id: 'settings', icon: 'settings-outline', label: '设置', subtitle: '隐私、安全与账号管理' },
];

export default function ProfileScreen() {
  const { theme, isDarkMode } = useTheme();
  const userInfo = useUserInfo();
  const displayName = userInfo?.nickname || userInfo?.name || '旅行者';
  const insets = useSafeAreaInsets();
  const [avatarUri, setAvatarUri] = useState(userInfo?.avatarUrl || null);
  const [backgroundUri, setBackgroundUri] = useState(null);

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  const pickImage = useCallback(async (setter, pickerOptions = {}) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
      ...pickerOptions,
    });
    if (!result.canceled && result.assets?.length) {
      setter(result.assets[0].uri);
    }
  }, []);

  const handleChangeAvatar = () => pickImage(setAvatarUri, { aspect: [1, 1] });
  const handleChangeBackground = () => pickImage(setBackgroundUri, { aspect: [4, 3] });

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.heroHeader, { marginTop: -insets.top, paddingTop: insets.top }]}
        onPress={handleChangeBackground}
      >
        {backgroundUri ? (
          <ImageBackground
            source={{ uri: backgroundUri }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroContentContainer}>
              <HeroSection
                name={displayName}
                theme={theme}
                isDarkMode={isDarkMode}
                avatarUri={avatarUri}
                onChangeAvatar={handleChangeAvatar}
              />
            </View>
          </ImageBackground>
        ) : (
          <View
            style={[
              styles.heroBackground,
              styles.heroBackgroundFallback,
              { backgroundColor: isDarkMode ? '#0F1420' : '#1D4EB9' },
            ]}
          >
            <View style={styles.heroContentContainer}>
              <HeroSection
                name={displayName}
                theme={theme}
                isDarkMode={isDarkMode}
                avatarUri={avatarUri}
                onChangeAvatar={handleChangeAvatar}
              />
            </View>
          </View>
        )}
      </Pressable>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <OptionList theme={theme} />
      </ScrollView>
    </View>
  );
}

const HeroSection = ({ name, theme, isDarkMode, avatarUri, onChangeAvatar }) => (
  <View style={styles.heroContent}>
    <View style={styles.heroInfo}>
      <TouchableOpacity
        style={styles.avatarWrapper}
        activeOpacity={0.85}
        onPress={(event) => {
          event.stopPropagation();
          onChangeAvatar();
        }}
      >
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.18)' : '#E2E6F5' },
          ]}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarText, { color: isDarkMode ? '#FFFFFF' : '#0B0D13' }]}>
              {name.slice(0, 1)}
            </Text>
          )}
        </View>
        <View style={styles.avatarCamera}>
          <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={(event) => event.stopPropagation()}
      >
        <Text style={styles.heroName}>{name}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OptionList = ({ theme }) => {
  const handleOptionPress = (optionId) => {
    switch (optionId) {
      case 'profile':
        router.push('/(pages)/profile/profile-detail');
        break;
      case 'account':
        router.push('/(pages)/profile/account');
        break;
      case 'plans':
        // TODO: 导航到我的计划页面
        console.log('我的计划');
        break;
      case 'favorites':
        // TODO: 导航到我的收藏页面
        console.log('我的收藏');
        break;
      case 'questions':
        // TODO: 导航到我的提问页面
        console.log('我的提问');
        break;
      case 'notifications':
        // TODO: 导航到消息中心页面
        console.log('消息中心');
        break;
      case 'settings':
        router.push('/(pages)/profile/settings');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.optionList}>
      {PROFILE_OPTIONS.map((option, index) => (
        <View key={option.id}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleOptionPress(option.id)}
          >
            <View style={[styles.optionLeft]}>
              <Ionicons name={option.icon} size={18} color={theme.colors.primary[600]} />
              <Text style={[styles.optionLabel, { color: theme.colors.text.primary }]}>
                {option.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
          {index !== PROFILE_OPTIONS.length - 1 && (
            <View
              style={[styles.optionDivider, { backgroundColor: theme.colors.border.light }]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F9',
  },
  scroll: {
    flex: 1,
  },
  heroHeader: {
    width: '100%',
    overflow: 'hidden',
  },
  heroBackground: {
    width: '100%',
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  heroBackgroundImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  heroBackgroundFallback: {
    justifyContent: 'flex-end',
  },
  heroContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCamera: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  optionList: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#0B0D13',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDivider: {
    height: 1,
    marginLeft: 50,
    marginRight: 12,
  },
});


