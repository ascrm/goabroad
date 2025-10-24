/**
 * 阶段卡片组件
 * 显示阶段信息和任务列表，支持展开/收起
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';
import TaskItem from './TaskItem';

export default function StageCard({ stage, isLast }) {
  // 进行中的阶段默认展开，完成的阶段默认收起
  const [isExpanded, setIsExpanded] = useState(stage.status !== 'completed');

  // 获取阶段状态样式
  const getStageStyle = () => {
    switch (stage.status) {
      case 'completed':
        return {
          icon: 'checkmark-circle',
          iconColor: COLORS.success[500],
          bgColor: `${COLORS.success[500]}08`,
          textColor: COLORS.success[600],
          label: '已完成',
        };
      case 'in_progress':
        return {
          icon: 'play-circle',
          iconColor: COLORS.primary[600],
          bgColor: `${COLORS.primary[600]}08`,
          textColor: COLORS.primary[600],
          label: '进行中',
        };
      case 'overdue':
        return {
          icon: 'alert-circle',
          iconColor: COLORS.error[500],
          bgColor: `${COLORS.error[500]}08`,
          textColor: COLORS.error[500],
          label: '逾期',
        };
      default:
        return {
          icon: 'ellipse-outline',
          iconColor: COLORS.gray[400],
          bgColor: COLORS.gray[50],
          textColor: COLORS.gray[600],
          label: '未开始',
        };
    }
  };

  const stageStyle = getStageStyle();
  
  // 计算已完成任务数
  const completedCount = stage.tasks.filter(t => t.completed).length;
  const totalCount = stage.tasks.length;

  return (
    <View style={[styles.container, isLast && styles.containerLast]}>
      {/* 阶段头部 */}
      <TouchableOpacity
        style={[styles.header, { backgroundColor: stageStyle.bgColor }]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name={stageStyle.icon} size={24} color={stageStyle.iconColor} />
          
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <Text style={styles.stageTitle}>{stage.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: stageStyle.bgColor }]}>
                <Text style={[styles.statusText, { color: stageStyle.textColor }]}>
                  {stageStyle.label}
                </Text>
              </View>
            </View>
            
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>
                {stage.startDate} - {stage.endDate}
              </Text>
              {stage.status === 'in_progress' && (
                <Text style={styles.progressText}>
                  {completedCount}/{totalCount} 项任务
                </Text>
              )}
            </View>
          </View>
        </View>

        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.gray[600]}
        />
      </TouchableOpacity>

      {/* 任务列表 */}
      {isExpanded && (
        <View style={styles.tasksContainer}>
          {stage.tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isLast={index === stage.tasks.length - 1}
            />
          ))}
        </View>
      )}

      {/* 收起提示 */}
      {!isExpanded && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={styles.expandButtonText}>
            展开 {totalCount} 项任务
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.primary[600]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerLast: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginRight: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  tasksContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginRight: 4,
  },
});

