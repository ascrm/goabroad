/**
 * 里程碑列表组件
 * 展示关键节点和时间
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function MilestoneList({ milestones }) {
  // 格式化日期
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: zhCN });
    } catch (error) {
      return dateString;
    }
  };

  // 获取状态文本和颜色
  const getStatusInfo = (milestone) => {
    if (milestone.status === 'completed') {
      return {
        text: '已完成',
        color: COLORS.success[600],
        icon: 'checkmark-circle',
      };
    }
    
    if (milestone.daysUntil !== undefined) {
      return {
        text: `还有${milestone.daysUntil}天`,
        color: milestone.daysUntil <= 7 ? COLORS.error[600] : COLORS.primary[600],
        icon: 'time',
      };
    }

    return {
      text: '待定',
      color: COLORS.gray[500],
      icon: 'ellipse-outline',
    };
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Ionicons name="flag-outline" size={20} color={COLORS.gray[900]} />
        <Text style={styles.title}>关键里程碑</Text>
      </View>

      {/* 里程碑列表 */}
      <View style={styles.milestonesList}>
        {milestones.map((milestone, index) => {
          const statusInfo = getStatusInfo(milestone);
          const isLast = index === milestones.length - 1;

          return (
            <View key={milestone.id} style={styles.milestoneItem}>
              {/* 左侧时间线 */}
              <View style={styles.timelineColumn}>
                <View
                  style={[
                    styles.milestoneIcon,
                    {
                      backgroundColor:
                        milestone.status === 'completed'
                          ? COLORS.success[100]
                          : COLORS.primary[100],
                    },
                  ]}
                >
                  <Text style={styles.iconEmoji}>{milestone.icon}</Text>
                </View>
                {!isLast && <View style={styles.timelineLine} />}
              </View>

              {/* 右侧内容 */}
              <View style={[styles.contentColumn, isLast && styles.contentColumnLast]}>
                <View style={styles.milestoneContent}>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestoneDate}>
                      {formatDate(milestone.date)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${statusInfo.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={statusInfo.icon}
                      size={14}
                      color={statusInfo.color}
                    />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
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
  milestonesList: {
    padding: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
  },
  timelineColumn: {
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 8,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 20,
  },
  contentColumnLast: {
    paddingBottom: 0,
  },
  milestoneContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 6,
  },
  milestoneDate: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
});

