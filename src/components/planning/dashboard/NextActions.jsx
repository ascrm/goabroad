/**
 * 下一步行动建议组件
 * 根据当前进度智能推荐优先任务
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function NextActions({ actions }) {
  if (!actions || actions.length === 0) return null;

  // 获取优先级信息
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return {
          label: '高优先级',
          color: COLORS.error[600],
          bgColor: COLORS.error[50],
          icon: 'arrow-up-circle',
        };
      case 'medium':
        return {
          label: '中优先级',
          color: COLORS.warning[600],
          bgColor: COLORS.warning[50],
          icon: 'remove-circle',
        };
      case 'low':
        return {
          label: '低优先级',
          color: COLORS.gray[600],
          bgColor: COLORS.gray[50],
          icon: 'arrow-down-circle',
        };
      default:
        return {
          label: '普通',
          color: COLORS.primary[600],
          bgColor: COLORS.primary[50],
          icon: 'ellipse',
        };
    }
  };

  // 处理行动点击
  const handleActionPress = (action) => {
    console.log('开始行动:', action);
    // TODO: 跳转到对应的任务详情
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={20} color={COLORS.gray[900]} />
        <Text style={styles.title}>下一步行动建议</Text>
      </View>

      {/* 行动列表 */}
      <View style={styles.actionsList}>
        {actions.map((action, index) => {
          const priorityInfo = getPriorityInfo(action.priority);

          return (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => handleActionPress(action)}
              activeOpacity={0.7}
            >
              {/* 序号 */}
              <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>

              {/* 内容 */}
              <View style={styles.actionContent}>
                <View style={styles.actionHeader}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: priorityInfo.bgColor },
                    ]}
                  >
                    <Ionicons
                      name={priorityInfo.icon}
                      size={12}
                      color={priorityInfo.color}
                    />
                    <Text
                      style={[styles.priorityText, { color: priorityInfo.color }]}
                    >
                      {priorityInfo.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.actionDescription}>{action.description}</Text>

                <View style={styles.actionMeta}>
                  <View style={styles.stageTag}>
                    <Ionicons
                      name="folder-outline"
                      size={12}
                      color={COLORS.primary[600]}
                    />
                    <Text style={styles.stageText}>{action.stage}</Text>
                  </View>
                </View>
              </View>

              {/* 右箭头 */}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gray[400]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 底部提示 */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.gray[500]} />
        <Text style={styles.footerText}>
          建议优先完成高优先级任务，避免影响后续流程
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  actionsList: {
    padding: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  numberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  actionContent: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  actionDescription: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stageText: {
    fontSize: 12,
    color: COLORS.primary[700],
    marginLeft: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.gray[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  footerText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 6,
    flex: 1,
  },
});

