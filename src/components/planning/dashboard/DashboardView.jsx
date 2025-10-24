/**
 * 进度看板视图
 * 展示甘特图、里程碑、风险提示、下一步行动
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

import GanttChart from './GanttChart';
import MilestoneList from './MilestoneList';
import NextActions from './NextActions';
import RiskAlerts from './RiskAlerts';

// 模拟里程碑数据
const MOCK_MILESTONES = [
  {
    id: 'milestone-1',
    icon: '🏁',
    title: '托福考试',
    date: '2024-10-15',
    status: 'completed',
  },
  {
    id: 'milestone-2',
    icon: '📝',
    title: 'SAT考试',
    date: '2024-12-01',
    status: 'upcoming',
    daysUntil: 38,
  },
  {
    id: 'milestone-3',
    icon: '🎯',
    title: '申请提交',
    date: '2025-03-01',
    status: 'upcoming',
    daysUntil: 128,
  },
  {
    id: 'milestone-4',
    icon: '✈️',
    title: '入学时间',
    date: '2025-09-01',
    status: 'upcoming',
    daysUntil: 312,
  },
];

// 模拟风险数据
const MOCK_RISKS = [
  {
    id: 'risk-1',
    type: 'overdue',
    title: 'SEVIS费用收据',
    description: '截止日期已过',
    dueDate: '2024-10-20',
    priority: 'high',
  },
  {
    id: 'risk-2',
    type: 'urgent',
    title: '参加SAT考试',
    description: '7天内到期',
    dueDate: '2024-12-01',
    priority: 'medium',
  },
];

// 模拟下一步行动
const MOCK_NEXT_ACTIONS = [
  {
    id: 'action-1',
    title: '完成SEVIS费用支付',
    description: '需尽快完成，已逾期',
    priority: 'high',
    stage: '签证准备',
  },
  {
    id: 'action-2',
    title: '准备SAT考试',
    description: '距离考试还有38天',
    priority: 'high',
    stage: '标准化考试',
  },
  {
    id: 'action-3',
    title: '准备成绩单',
    description: '申请材料准备的第一步',
    priority: 'medium',
    stage: '申请材料准备',
  },
  {
    id: 'action-4',
    title: '撰写个人陈述',
    description: '需要1-2个月时间',
    priority: 'medium',
    stage: '申请材料准备',
  },
];

export default function DashboardView({ stages }) {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 甘特图 */}
      <View style={styles.section}>
        <GanttChart stages={stages} />
      </View>

      {/* 里程碑 */}
      <View style={styles.section}>
        <MilestoneList milestones={MOCK_MILESTONES} />
      </View>

      {/* 风险提示 */}
      {MOCK_RISKS.length > 0 && (
        <View style={styles.section}>
          <RiskAlerts risks={MOCK_RISKS} />
        </View>
      )}

      {/* 下一步行动 */}
      <View style={styles.section}>
        <NextActions actions={MOCK_NEXT_ACTIONS} />
      </View>

      {/* 底部留白 */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  section: {
    marginTop: 16,
  },
});

