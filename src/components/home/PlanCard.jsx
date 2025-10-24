/**
 * 我的计划卡片组件
 * 显示当前规划的进度和待办事项
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { COLORS } from '@/src/constants';

const PlanCard = ({ plan }) => {
  // 如果没有计划，显示空状态
  if (!plan) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons name="document-text-outline" size={48} color={COLORS.primary[300]} />
        </View>
        <Text style={styles.emptyTitle}>还没有出国计划？</Text>
        <Text style={styles.emptySubtitle}>让我们帮你规划吧！</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/planning/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="rocket" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.createButtonText}>开始规划</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 计算进度百分比
  const progress = plan.completedTasks && plan.totalTasks
    ? Math.round((plan.completedTasks / plan.totalTasks) * 100)
    : 0;

  // 计算倒计时天数
  const calculateDaysLeft = () => {
    if (!plan.targetDate) return null;
    const target = new Date(plan.targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/planning/${plan.id}`)}
      activeOpacity={0.9}
    >
      {/* 卡片头部 */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.cardTitle}>我的计划</Text>
          <Text style={styles.planName}>{plan.name || '美国留学'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
      </View>

      {/* 进度区域 */}
      <View style={styles.progressSection}>
        {/* 环形进度图 */}
        <View style={styles.progressCircle}>
          <AnimatedCircularProgress
            size={100}
            width={8}
            fill={progress}
            tintColor={COLORS.primary[600]}
            backgroundColor={COLORS.primary[100]}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.progressCenter}>
                <Text style={styles.progressText}>{progress}%</Text>
                <Text style={styles.progressLabel}>完成</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* 统计信息 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success[500]} />
              <Text style={styles.statValue}>
                {plan.completedTasks || 0}/{plan.totalTasks || 0}
              </Text>
            </View>
            <Text style={styles.statLabel}>已完成任务</Text>
          </View>

          {daysLeft !== null && (
            <View style={styles.statItem}>
              <View style={styles.statRow}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary[500]} />
                <Text style={styles.statValue}>{daysLeft}</Text>
              </View>
              <Text style={styles.statLabel}>距离出发</Text>
            </View>
          )}
        </View>
      </View>

      {/* 近期待办 */}
      {plan.upcomingTasks && plan.upcomingTasks.length > 0 && (
        <View style={styles.todoSection}>
          <Text style={styles.todoTitle}>近期待办</Text>
          {plan.upcomingTasks.slice(0, 3).map((task, index) => (
            <View key={index} style={styles.todoItem}>
              <View style={styles.todoCheckbox}>
                <View style={styles.checkbox} />
              </View>
              <Text style={styles.todoText} numberOfLines={1}>
                {task.title || task}
              </Text>
              {task.dueDate && (
                <Text style={styles.todoDue}>
                  {new Date(task.dueDate).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 查看详情按钮 */}
      <TouchableOpacity
        style={styles.viewDetailButton}
        onPress={() => router.push(`/planning/${plan.id}`)}
      >
        <Text style={styles.viewDetailText}>查看详细规划</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.primary[600]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // 有计划状态
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  progressCircle: {
    marginRight: 24,
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  statsSection: {
    flex: 1,
    gap: 16,
  },
  statItem: {
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 28,
  },
  todoSection: {
    marginBottom: 16,
  },
  todoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  todoCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[800],
  },
  todoDue: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 8,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginRight: 4,
  },

  // 空状态
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PlanCard;

