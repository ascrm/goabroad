/**
 * 用户头部组件
 * 显示头像、昵称、个性签名、等级和经验值
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { COLORS } from '@/src/constants';

// 等级配置
const LEVEL_CONFIG = {
  1: { title: '新手', color: COLORS.gray[500], icon: 'leaf-outline' },
  2: { title: '探索者', color: COLORS.info[500], icon: 'compass-outline' },
  3: { title: '旅行者', color: COLORS.success[500], icon: 'airplane-outline' },
  4: { title: '冒险家', color: COLORS.warning[500], icon: 'rocket-outline' },
  5: { title: '大师', color: COLORS.error[500], icon: 'trophy-outline' },
};

export default function UserHeader({
  avatar,
  nickname,
  signature,
  level = 1,
  experience = 0,
  experienceMax = 100,
  onEditPress,
  onAvatarPress,
}) {
  // 获取等级配置
  const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const experienceProgress = experienceMax > 0 ? experience / experienceMax : 0;

  return (
    <LinearGradient
      colors={[COLORS.primary[50], COLORS.white]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* 头像 */}
        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.8}
          style={styles.avatarContainer}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color={COLORS.gray[400]} />
            </View>
          )}
          
          {/* 编辑图标 */}
          <View style={styles.avatarEdit}>
            <Ionicons name="camera" size={16} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* 用户信息 */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname}>{nickname || '未设置昵称'}</Text>
            
            {/* 等级徽章 */}
            <View style={[styles.levelBadge, { backgroundColor: levelConfig.color }]}>
              <Ionicons name={levelConfig.icon} size={12} color={COLORS.white} />
              <Text style={styles.levelText}>Lv.{level}</Text>
            </View>
          </View>

          {/* 个性签名 */}
          <Text style={styles.signature} numberOfLines={2}>
            {signature || '还没有个性签名，点击编辑资料添加吧~'}
          </Text>

          {/* 经验值进度条 */}
          <View style={styles.experienceContainer}>
            <Progress.Bar
              progress={experienceProgress}
              width={null}
              height={6}
              color={levelConfig.color}
              unfilledColor={COLORS.gray[200]}
              borderWidth={0}
              borderRadius={3}
              style={styles.progressBar}
            />
            <Text style={styles.experienceText}>
              {experience}/{experienceMax} 经验值
            </Text>
          </View>
        </View>

        {/* 编辑按钮 */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.editButtonText}>编辑资料</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray[100],
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEdit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginRight: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  signature: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  experienceContainer: {
    width: '100%',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
  },
  experienceText: {
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 6,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginLeft: 6,
  },
});

