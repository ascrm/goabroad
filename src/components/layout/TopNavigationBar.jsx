/**
 * 全局顶部导航栏组件
 * 在所有Tab页面中显示，提供统一的导航体验
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/src/components/ui';
import { COLORS } from '@/src/constants';

/**
 * TopNavigationBar 组件
 * @param {Object} props
 * @param {Object} props.userInfo - 用户信息对象
 * @param {Function} props.onAvatarPress - 点击头像的回调（打开抽屉）
 * @param {React.ReactNode} props.centerContent - 中间内容（标题、搜索框等）
 * @param {React.ReactNode} props.rightContent - 右侧内容（按钮、图标等）
 * @param {Object} props.style - 额外样式
 */
export default function TopNavigationBar({
  userInfo,
  onAvatarPress,
  centerContent,
  rightContent,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* 左侧：用户头像 */}
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={onAvatarPress}
        activeOpacity={0.8}
        accessibilityLabel="打开菜单"
        accessibilityHint="打开侧边抽屉菜单"
      >
        <Avatar
          source={userInfo?.avatarUrl}
          name={userInfo?.nickname || userInfo?.name}
          size="md"
        />
      </TouchableOpacity>

      {/* 中间：动态内容区域 */}
      <View style={styles.centerContainer}>
        {centerContent}
      </View>

      {/* 右侧：功能按钮区域 */}
      <View style={styles.rightContainer}>
        {rightContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  avatarButton: {
    marginRight: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});

