/**
 * 通用设置/信息分组卡片
 * - 抽离自 设置页 & 个人资料详情页
 * - 支持：
 *   - 顶部标题
 *   - 行列表（图标 + 文本 + 右侧内容）
 *   - 可选分割线
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * @param {object} props
 * @param {string} props.title 卡片标题
 * @param {Array}  props.items 行配置
 *   - id: 唯一标识
 *   - icon: Ionicons 名称
 *   - label: 左侧主文案
 *   - value: 右侧文案（可选）
 *   - renderRight: 自定义右侧渲染函数 (item) => ReactNode
 *   - onPress: 行点击回调
 * @param {object} props.colors 颜色配置（可与 Theme 或自定义调色板结合）
 *   - cardBg, title, icon, textPrimary, textSecondary, divider
 */
export default function SettingsSectionCard({ title, items, colors, style }) {
  const palette = {
    cardBg: colors?.cardBg ?? '#FFFFFF',
    title: colors?.title ?? '#7D8499',
    icon: colors?.icon ?? '#5F6578',
    textPrimary: colors?.textPrimary ?? '#07080E',
    textSecondary: colors?.textSecondary ?? '#6F7387',
    divider: colors?.divider ?? '#E6E8EF',
    value: colors?.value ?? '#6F7387',
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.cardBg }, style]}>
      {title ? (
        <Text style={[styles.cardTitle, { color: palette.title }]}>{title}</Text>
      ) : null}
      <View style={styles.cardBody}>
        {items?.map((item, index) => {
          const hasPress = typeof item.onPress === 'function';
          const Wrapper = hasPress ? TouchableOpacity : View;

          return (
            <View key={item.id ?? index}>
              <Wrapper
                style={styles.row}
                activeOpacity={0.85}
                onPress={hasPress ? () => item.onPress(item) : undefined}
              >
                <View style={styles.rowLeft}>
                  {item.icon ? (
                    <Ionicons name={item.icon} size={20} color={palette.icon} />
                  ) : null}
                  <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.rowRight}>
                  {item.renderRight ? (
                    item.renderRight(item, palette)
                  ) : item.value ? (
                    <Text style={[styles.rowValue, { color: palette.value }]}>
                      {item.value}
                    </Text>
                  ) : null}
                </View>
              </Wrapper>
              {index !== items.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: palette.divider }]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 13,
    letterSpacing: 1,
  },
  cardBody: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    fontSize: 15,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});


