/**
 * 会员卡片组件
 * 显示会员状态、特权和开通/续费按钮
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

// 会员特权列表
const PRO_BENEFITS = [
  { icon: 'flash', text: '无限制AI对话次数' },
  { icon: 'document-text', text: '专属留学规划方案' },
  { icon: 'trending-up', text: '深度数据分析报告' },
  { icon: 'chatbubbles', text: '优先客服支持' },
];

export default function MembershipCard({ isPro = false, expireDate, onUpgrade }) {
  // 未开通会员
  if (!isPro) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* 顶部标题 */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="diamond" size={24} color={COLORS.white} />
              <Text style={styles.title}>GoAbroad Pro</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>未开通</Text>
            </View>
          </View>

          {/* 会员特权预览 */}
          <View style={styles.benefitsContainer}>
            {PRO_BENEFITS.slice(0, 4).map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name={benefit.icon} size={16} color={COLORS.white} />
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>

          {/* 开通按钮 */}
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>开通会员</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.primary[600]} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  // 已开通会员
  const formattedExpireDate = expireDate
    ? new Date(expireDate).toLocaleDateString('zh-CN')
    : '永久';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* 顶部标题 */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="diamond" size={24} color={COLORS.white} />
            <Text style={styles.title}>GoAbroad Pro</Text>
          </View>
          <View style={[styles.badge, styles.activeBadge]}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success[600]} />
            <Text style={[styles.badgeText, styles.activeBadgeText]}>已开通</Text>
          </View>
        </View>

        {/* 到期时间 */}
        <Text style={styles.expireText}>
          {expireDate ? `到期时间: ${formattedExpireDate}` : '永久会员'}
        </Text>

        {/* 续费按钮 */}
        {expireDate && (
          <TouchableOpacity
            style={styles.renewButton}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <Text style={styles.renewButtonText}>续费</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeBadgeText: {
    color: COLORS.success[600],
    marginLeft: 4,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 10,
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginRight: 6,
  },
  expireText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  renewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  renewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

