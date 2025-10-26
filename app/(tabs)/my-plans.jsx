/**
 * 我的规划页面
 * 显示用户的留学规划、时间线、任务等
 * 支持看板、时间线、日历三种视图模式
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CalendarView, KanbanView, TimelineView, ViewSwitcher } from '@/src/components/planning';
import { COLORS } from '@/src/constants';
import { useAppSelector } from '@/src/store/hooks';

export default function MyPlans() {
  const [currentView, setCurrentView] = useState('kanban');

  // 模拟规划数据（增强版，包含任务）
  const mockPlans = [
    {
      id: '1',
      name: '美国研究生留学',
      country: '美国',
      type: 'study',
      targetDate: '2026-09-01',
      progress: 43,
      completedTasks: 12,
      totalTasks: 28,
      status: 'in_progress',
      createdAt: '2025-01-15',
      tasks: [
        {
          id: 't1',
          title: '准备托福考试',
          status: 'in_progress',
          priority: 'high',
          deadline: '2025-11-15',
          completed: false,
          subtasks: [
            { id: 'st1', title: '听力练习', completed: true },
            { id: 'st2', title: '口语练习', completed: false },
          ],
        },
        {
          id: 't2',
          title: '撰写个人陈述',
          status: 'todo',
          priority: 'medium',
          deadline: '2025-12-01',
          completed: false,
        },
        {
          id: 't3',
          title: '准备推荐信',
          status: 'completed',
          priority: 'high',
          deadline: '2025-10-20',
          completed: true,
        },
      ],
    },
    {
      id: '2',
      name: '加拿大技术移民',
      country: '加拿大',
      type: 'immigration',
      targetDate: '2027-03-01',
      progress: 15,
      completedTasks: 3,
      totalTasks: 20,
      status: 'in_progress',
      createdAt: '2025-09-20',
      tasks: [
        {
          id: 't4',
          title: '雅思考试报名',
          status: 'todo',
          priority: 'high',
          deadline: '2025-11-01',
          completed: false,
        },
        {
          id: 't5',
          title: '学历认证',
          status: 'in_progress',
          priority: 'medium',
          deadline: '2025-12-15',
          completed: false,
        },
      ],
    },
  ];
  
  const plans = useAppSelector((state) => state.planning.plans);
  // 使用模拟数据或 Redux 数据
  const displayPlans = plans && plans.length > 0 ? plans : mockPlans;
  const hasPlans = displayPlans && displayPlans.length > 0;

  // 创建新规划
  const handleCreatePlan = () => {
    router.push('/planning/create');
  };

  // 处理规划点击
  const handlePlanPress = (planId) => {
    router.push(`/planning/${planId}`);
  };

  // 处理任务切换
  const handleTaskToggle = (taskId) => {
    console.log('Toggle task:', taskId);
    // TODO: 实现任务状态切换逻辑
  };

  // 处理快速添加任务
  const handleQuickAdd = (status) => {
    console.log('Quick add task with status:', status);
    // TODO: 实现快速添加任务逻辑
  };

  // 处理任务点击
  const handleTaskPress = (task) => {
    console.log('Task pressed:', task);
    // TODO: 实现任务详情查看逻辑
  };

  // 空状态
  if (!hasPlans) {
    return (
      <View style={styles.container}>
      <StatusBar style="dark" />
      
        {/* 空状态内容 */}
        <View style={styles.emptyContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={styles.emptyTitle}>还没有规划</Text>
          <Text style={styles.emptySubtitle}>
            创建你的第一个留学/工作/移民规划
          </Text>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePlan}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>创建规划</Text>
          </TouchableOpacity>
          
          {/* 功能介绍 */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>详细时间线</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>材料清单</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-done-outline" size={24} color={COLORS.primary[600]} />
              <Text style={styles.featureText}>任务跟踪</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 渲染当前视图
  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return (
          <KanbanView
            plans={displayPlans}
            onPlanPress={handlePlanPress}
            onTaskToggle={handleTaskToggle}
            onQuickAdd={handleQuickAdd}
          />
        );
      case 'timeline':
        return (
          <TimelineView
            plans={displayPlans}
            onPlanPress={handlePlanPress}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            plans={displayPlans}
            onPlanPress={handlePlanPress}
            onTaskPress={handleTaskPress}
          />
        );
      default:
        return null;
    }
  };

  // 有规划时显示视图
  return (
    <View style={styles.container}>
      {/* 视图切换器 */}
      <ViewSwitcher
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* 当前视图内容 */}
      {renderCurrentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  // 空状态样式
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
    marginBottom: 48,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginTop: 8,
  },
});
