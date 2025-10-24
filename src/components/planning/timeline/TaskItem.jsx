/**
 * 任务项组件
 * 显示单个任务的信息和操作
 */

import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

export default function TaskItem({ task, isLast }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);

  // 切换完成状态
  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: 更新 Redux 状态或调用 API
    console.log('切换任务状态:', task.title, !isCompleted);
  };

  // 查看详情
  const handleViewDetail = () => {
    console.log('查看任务详情:', task.title);
    // TODO: 跳转到任务详情页
  };

  return (
    <View style={[styles.container, isLast && styles.containerLast]}>
      <TouchableOpacity
        style={styles.taskRow}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        {/* 完成勾选 */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleToggleComplete}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              isCompleted && styles.checkboxCompleted,
            ]}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>

        {/* 任务信息 */}
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              isCompleted && styles.taskTitleCompleted,
            ]}
          >
            {task.title}
          </Text>
          
          <View style={styles.taskMeta}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.gray[500]} />
            <Text style={styles.taskDate}>
              {format(parseISO(task.dueDate), 'MM-dd')}
            </Text>
            
            {task.urgent && !isCompleted && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>紧急</Text>
              </View>
            )}
          </View>
        </View>

        {/* 展开按钮 */}
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.gray[400]}
        />
      </TouchableOpacity>

      {/* 展开的详情 */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={COLORS.gray[600]} />
            <Text style={styles.detailLabel}>截止日期：</Text>
            <Text style={styles.detailValue}>
              {format(parseISO(task.dueDate), 'yyyy-MM-dd')}
            </Text>
          </View>

          {task.description && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text" size={16} color={COLORS.gray[600]} />
              <Text style={styles.detailLabel}>说明：</Text>
              <Text style={styles.detailValue}>{task.description}</Text>
            </View>
          )}

          {/* 操作按钮 */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleViewDetail}
            >
              <Ionicons name="eye-outline" size={16} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>查看详情</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log('设置提醒')}
            >
              <Ionicons name="notifications-outline" size={16} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>设置提醒</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success[500],
    borderColor: COLORS.success[500],
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: COLORS.gray[500],
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  urgentBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: `${COLORS.error[500]}15`,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.error[500],
  },
  expandedContent: {
    paddingHorizontal: 52,
    paddingBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray[900],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${COLORS.primary[600]}08`,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginLeft: 6,
  },
});

