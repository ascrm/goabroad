/**
 * 看板视图组件
 * 卡片形式展示任务，支持快速操作
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const KanbanView = ({ plans, onPlanPress, onTaskToggle, onQuickAdd }) => {
  // 任务状态列
  const columns = [
    { id: 'todo', title: '待办', icon: 'list-outline', color: COLORS.gray[600] },
    { id: 'in_progress', title: '进行中', icon: 'time-outline', color: COLORS.primary[600] },
    { id: 'completed', title: '已完成', icon: 'checkmark-circle', color: COLORS.success[600] },
  ];

  // 模拟任务数据（按状态分组）
  const getTasksByStatus = (status) => {
    // 这里应该从实际数据中获取
    const allTasks = plans.flatMap((plan) => 
      (plan.tasks || []).map((task) => ({ ...task, planId: plan.id, planName: plan.name }))
    );
    return allTasks.filter((task) => task.status === status);
  };

  // 获取优先级配置
  const getPriorityConfig = (priority) => {
    const configs = {
      high: { color: COLORS.error[600], label: '高', icon: 'arrow-up' },
      medium: { color: COLORS.warning[600], label: '中', icon: 'remove' },
      low: { color: COLORS.gray[600], label: '低', icon: 'arrow-down' },
    };
    return configs[priority] || configs.medium;
  };

  // 计算截止日期状态
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: '已逾期', color: COLORS.error[600] };
    if (diffDays === 0) return { text: '今天到期', color: COLORS.error[600] };
    if (diffDays <= 3) return { text: `${diffDays}天后`, color: COLORS.warning[600] };
    return { text: `${diffDays}天后`, color: COLORS.gray[600] };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.id);
          const urgentTasks = tasks.filter((task) => {
            const deadline = getDeadlineStatus(task.deadline);
            return deadline && (deadline.text === '今天到期' || deadline.text === '已逾期');
          });

          return (
            <View key={column.id} style={styles.column}>
              {/* 列头 */}
              <View style={styles.columnHeader}>
                <View style={styles.columnTitleRow}>
                  <Ionicons name={column.icon} size={20} color={column.color} />
                  <Text style={[styles.columnTitle, { color: column.color }]}>
                    {column.title}
                  </Text>
                  <View style={[styles.countBadge, { backgroundColor: column.color }]}>
                    <Text style={styles.countText}>{tasks.length}</Text>
                  </View>
                </View>
                {urgentTasks.length > 0 && (
                  <View style={styles.urgentBadge}>
                    <Ionicons name="warning" size={12} color={COLORS.error[600]} />
                    <Text style={styles.urgentText}>{urgentTasks.length} 个紧急</Text>
                  </View>
                )}
              </View>

              {/* 任务卡片列表 */}
              <ScrollView
                style={styles.taskList}
                showsVerticalScrollIndicator={false}
              >
                {tasks.map((task) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const deadlineStatus = getDeadlineStatus(task.deadline);
                  const isUrgent = deadlineStatus && 
                    (deadlineStatus.text === '今天到期' || deadlineStatus.text === '已逾期');

                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[
                        styles.taskCard,
                        isUrgent && styles.taskCardUrgent,
                      ]}
                      onPress={() => onPlanPress(task.planId)}
                      activeOpacity={0.7}
                    >
                      {/* 优先级指示条 */}
                      <View
                        style={[
                          styles.priorityBar,
                          { backgroundColor: priorityConfig.color },
                        ]}
                      />

                      {/* 任务内容 */}
                      <View style={styles.taskContent}>
                        {/* 任务标题 */}
                        <View style={styles.taskHeader}>
                          <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => onTaskToggle(task.id)}
                          >
                            {task.completed ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color={COLORS.success[600]}
                              />
                            ) : (
                              <Ionicons
                                name="ellipse-outline"
                                size={24}
                                color={COLORS.gray[400]}
                              />
                            )}
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.taskTitle,
                              task.completed && styles.taskTitleCompleted,
                            ]}
                            numberOfLines={2}
                          >
                            {task.title}
                          </Text>
                        </View>

                        {/* 所属规划 */}
                        <View style={styles.planBadge}>
                          <Ionicons name="folder-outline" size={12} color={COLORS.gray[600]} />
                          <Text style={styles.planBadgeText}>{task.planName}</Text>
                        </View>

                        {/* 任务元信息 */}
                        <View style={styles.taskMeta}>
                          {/* 优先级 */}
                          <View style={styles.metaItem}>
                            <Ionicons
                              name={priorityConfig.icon}
                              size={14}
                              color={priorityConfig.color}
                            />
                            <Text style={[styles.metaText, { color: priorityConfig.color }]}>
                              {priorityConfig.label}
                            </Text>
                          </View>

                          {/* 截止日期 */}
                          {deadlineStatus && (
                            <View style={styles.metaItem}>
                              <Ionicons
                                name="time-outline"
                                size={14}
                                color={deadlineStatus.color}
                              />
                              <Text style={[styles.metaText, { color: deadlineStatus.color }]}>
                                {deadlineStatus.text}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* 子任务进度 */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <View style={styles.subtaskProgress}>
                            <Ionicons name="list" size={12} color={COLORS.gray[600]} />
                            <Text style={styles.subtaskText}>
                              {task.subtasks.filter((st) => st.completed).length}/
                              {task.subtasks.length}
                            </Text>
                            <View style={styles.subtaskBar}>
                              <View
                                style={[
                                  styles.subtaskFill,
                                  {
                                    width: `${
                                      (task.subtasks.filter((st) => st.completed).length /
                                        task.subtasks.length) *
                                      100
                                    }%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {/* 快速添加按钮 */}
                <TouchableOpacity
                  style={styles.addTaskButton}
                  onPress={() => onQuickAdd(column.id)}
                >
                  <Ionicons name="add" size={20} color={COLORS.gray[600]} />
                  <Text style={styles.addTaskText}>添加任务</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  column: {
    width: 300,
    marginRight: 16,
  },
  columnHeader: {
    marginBottom: 12,
  },
  columnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.error[50],
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.error[600],
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardUrgent: {
    borderWidth: 2,
    borderColor: COLORS.error[200],
  },
  priorityBar: {
    height: 4,
  },
  taskContent: {
    padding: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    paddingTop: 2,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 20,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.gray[500],
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.gray[100],
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  planBadgeText: {
    fontSize: 11,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  subtaskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtaskText: {
    fontSize: 11,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  subtaskBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  subtaskFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
  },
  addTaskText: {
    fontSize: 14,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
});

export default KanbanView;

