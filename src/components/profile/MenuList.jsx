/**
 * 功能菜单列表组件
 * 显示个人中心的各种功能入口
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

export default function MenuList({ items, onItemPress }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        // 分隔线
        if (item.type === 'divider') {
          return <View key={`divider-${index}`} style={styles.divider} />;
        }

        // 菜单项
        return (
          <TouchableOpacity
            key={item.id || index}
            style={[
              styles.menuItem,
              item.disabled && styles.menuItemDisabled,
            ]}
            onPress={() => onItemPress?.(item)}
            disabled={item.disabled}
            activeOpacity={0.7}
          >
            {/* 左侧图标和文本 */}
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.iconBg || COLORS.primary[50] },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.iconColor || COLORS.primary[600]}
                />
              </View>
              <Text
                style={[
                  styles.menuItemText,
                  item.disabled && styles.menuItemTextDisabled,
                ]}
              >
                {item.label}
              </Text>
              
              {/* 角标 */}
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              
              {/* 标签 */}
              {item.tag && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              )}
            </View>

            {/* 右侧箭头或其他内容 */}
            <View style={styles.menuItemRight}>
              {item.rightText && (
                <Text style={styles.rightText}>{item.rightText}</Text>
              )}
              {!item.hideArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.gray[400]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  menuItemTextDisabled: {
    color: COLORS.gray[400],
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.error[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.gray[200],
    borderRadius: 10,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.gray[600],
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
    marginLeft: 64,
  },
});

