/**
 * 规划详情页
 * 显示规划的详细信息和时间线
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardView } from '@/src/components/planning/dashboard';
import { MaterialsView } from '@/src/components/planning/materials';
import ProgressCard from '@/src/components/planning/timeline/ProgressCard';
import TimelineView from '@/src/components/planning/timeline/TimelineView';
import { COLORS } from '@/src/constants';

// 模拟规划数据
const MOCK_PLAN = {
  id: '1',
  name: '美国本科留学规划',
  country: { id: 'US', name: '美国', flag: '🇺🇸' },
  goalType: 'study',
  detailType: 'bachelor',
  targetDate: '2025-09',
  progress: 42,
  completedTasks: 15,
  totalTasks: 36,
  daysUntilTarget: 320,
  stages: [
    {
      id: 'stage-1',
      title: '语言考试准备',
      startDate: '2024-06',
      endDate: '2024-10',
      status: 'completed',
      progress: 100,
      tasks: [
        { id: 'task-1-1', title: '了解托福/雅思考试', completed: true, dueDate: '2024-06-15' },
        { id: 'task-1-2', title: '报名培训班', completed: true, dueDate: '2024-07-01' },
        { id: 'task-1-3', title: '备考3个月', completed: true, dueDate: '2024-09-30' },
        { id: 'task-1-4', title: '参加考试', completed: true, dueDate: '2024-10-15' },
        { id: 'task-1-5', title: '达到目标分数', completed: true, dueDate: '2024-10-25' },
      ],
    },
    {
      id: 'stage-2',
      title: '标准化考试（SAT/ACT）',
      startDate: '2024-09',
      endDate: '2024-12',
      status: 'in_progress',
      progress: 60,
      tasks: [
        { id: 'task-2-1', title: '了解SAT/ACT考试', completed: true, dueDate: '2024-09-01' },
        { id: 'task-2-2', title: '制定备考计划', completed: true, dueDate: '2024-09-15' },
        { id: 'task-2-3', title: '备考准备', completed: true, dueDate: '2024-11-01', urgent: true },
        { id: 'task-2-4', title: '参加SAT考试', completed: false, dueDate: '2024-12-01', urgent: true },
        { id: 'task-2-5', title: '查看成绩', completed: false, dueDate: '2024-12-15' },
      ],
    },
    {
      id: 'stage-3',
      title: '申请材料准备',
      startDate: '2024-11',
      endDate: '2025-02',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 'task-3-1', title: '准备成绩单', completed: false, dueDate: '2024-11-15' },
        { id: 'task-3-2', title: '撰写个人陈述', completed: false, dueDate: '2024-12-01' },
        { id: 'task-3-3', title: '联系推荐人', completed: false, dueDate: '2024-12-15' },
        { id: 'task-3-4', title: '准备推荐信', completed: false, dueDate: '2025-01-15' },
        { id: 'task-3-5', title: '准备其他材料', completed: false, dueDate: '2025-02-01' },
      ],
    },
    {
      id: 'stage-4',
      title: '选校和网申',
      startDate: '2025-01',
      endDate: '2025-03',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 'task-4-1', title: '研究目标院校', completed: false, dueDate: '2025-01-15' },
        { id: 'task-4-2', title: '确定申请学校名单', completed: false, dueDate: '2025-01-31' },
        { id: 'task-4-3', title: '填写网申系统', completed: false, dueDate: '2025-02-15' },
        { id: 'task-4-4', title: '提交申请', completed: false, dueDate: '2025-03-01' },
      ],
    },
    {
      id: 'stage-5',
      title: '等待录取结果',
      startDate: '2025-03',
      endDate: '2025-05',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 'task-5-1', title: '跟踪申请状态', completed: false, dueDate: '2025-04-01' },
        { id: 'task-5-2', title: '收到录取通知', completed: false, dueDate: '2025-05-01' },
        { id: 'task-5-3', title: '比较offer', completed: false, dueDate: '2025-05-15' },
        { id: 'task-5-4', title: '确认入学', completed: false, dueDate: '2025-05-30' },
      ],
    },
    {
      id: 'stage-6',
      title: '签证和行前准备',
      startDate: '2025-06',
      endDate: '2025-08',
      status: 'pending',
      progress: 0,
      tasks: [
        { id: 'task-6-1', title: '准备签证材料', completed: false, dueDate: '2025-06-15' },
        { id: 'task-6-2', title: '预约签证面试', completed: false, dueDate: '2025-06-30' },
        { id: 'task-6-3', title: '参加签证面试', completed: false, dueDate: '2025-07-15' },
        { id: 'task-6-4', title: '获得签证', completed: false, dueDate: '2025-07-30' },
        { id: 'task-6-5', title: '预订机票', completed: false, dueDate: '2025-08-01' },
        { id: 'task-6-6', title: '准备行李', completed: false, dueDate: '2025-08-15' },
        { id: 'task-6-7', title: '出发', completed: false, dueDate: '2025-08-25' },
      ],
    },
  ],
};

export default function PlanningDetail() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('timeline'); // timeline | materials | board
  
  // 实际应用中应该从 Redux 或 API 获取数据
  const plan = MOCK_PLAN;

  // 返回
  const handleBack = () => {
    router.back();
  };

  // 菜单操作
  const handleMenu = () => {
    // TODO: 显示编辑/删除等操作
    console.log('显示菜单');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* 顶部栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText} numberOfLines={1}>
            {plan.name}
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
      </View>

      {/* 整体进度卡片 */}
      <ProgressCard
        progress={plan.progress}
        completedTasks={plan.completedTasks}
        totalTasks={plan.totalTasks}
        daysUntilTarget={plan.daysUntilTarget}
      />

      {/* Tab 切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'timeline' && styles.tabActive]}
          onPress={() => setActiveTab('timeline')}
        >
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.tabTextActive]}>
            时间线
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.tabActive]}
          onPress={() => setActiveTab('materials')}
        >
          <Text style={[styles.tabText, activeTab === 'materials' && styles.tabTextActive]}>
            材料清单
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'board' && styles.tabActive]}
          onPress={() => setActiveTab('board')}
        >
          <Text style={[styles.tabText, activeTab === 'board' && styles.tabTextActive]}>
            进度看板
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 内容 */}
      {activeTab === 'timeline' && <TimelineView stages={plan.stages} />}
      
      {activeTab === 'materials' && <MaterialsView planId={id} />}
      
      {activeTab === 'board' && <DashboardView stages={plan.stages} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  menuButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  tabTextActive: {
    color: COLORS.primary[600],
    fontWeight: '700',
  },
});

