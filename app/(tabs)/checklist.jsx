/**
 * 清单页面（计划执行总览）
 * 根据 docs/页面UI提示词.md 设计“总览 → 阶段 → 任务”层次
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import { useUserInfo } from '@/src/hooks/auth';

const PLAN_INFO = {
  id: 'plan-usa-2025',
  title: '美国留学申请',
  target: '南加州大学 · 数据科学',
  departure: '2025 / 08',
  owner: 'Alex',
};

const METRICS = [
  { id: 'metric-1', label: '预计出发', value: '2025.08', icon: 'airplane-outline' },
  { id: 'metric-2', label: '任务完成', value: '18 / 30', icon: 'checkmark-done-outline' },
  { id: 'metric-3', label: '下一节点', value: '提交网申 · 12.15', icon: 'calendar-outline' },
  { id: 'metric-4', label: '风险提醒', value: '2 项待补材料', icon: 'warning-outline' },
];

const STAGES = [
  {
    id: 'prep',
    name: '资料准备',
    summary: '整理成绩单、推荐信、资金证明等核心材料。',
    deadline: '12 月 05 日',
    progress: 0.65,
    timeline: [
      { id: 'prep-1', label: '成绩单翻译', status: 'done', date: '11 / 10' },
      { id: 'prep-2', label: '推荐信初稿', status: 'progress', date: '11 / 22' },
      { id: 'prep-3', label: '资金证明开具', status: 'todo', date: '11 / 30' },
    ],
    tasks: {
      todo: [
        { id: 'task-1', title: '补充银行流水', due: '11 / 29', priority: '高', owner: 'Alex' },
      ],
      inProgress: [
        { id: 'task-2', title: '润色推荐信终稿', due: '12 / 02', priority: '中', owner: '顾问 Sara' },
        { id: 'task-3', title: '上传 GPA 说明文档', due: '12 / 04', priority: '低', owner: 'Alex' },
      ],
      done: [
        { id: 'task-4', title: '成绩单盖章扫描', completedAt: '11 / 15' },
      ],
    },
  },
  {
    id: 'exam',
    name: '考试与语言',
    summary: '确认考试成绩、预定面试档期，准备口语材料。',
    deadline: '12 月 20 日',
    progress: 0.4,
    timeline: [
      { id: 'exam-1', label: '提交 GRE 成绩', status: 'done', date: '11 / 05' },
      { id: 'exam-2', label: '托福备考冲刺', status: 'progress', date: '12 / 01' },
      { id: 'exam-3', label: '口语模拟面试', status: 'todo', date: '12 / 12' },
    ],
    tasks: {
      todo: [
        { id: 'task-5', title: '预约 F1 面签', due: '12 / 18', priority: '高', owner: 'Alex' },
      ],
      inProgress: [
        { id: 'task-6', title: '托福口语模板梳理', due: '12 / 05', priority: '中', owner: 'Alex' },
      ],
      done: [
        { id: 'task-7', title: 'GRE 成绩发送 USC', completedAt: '11 / 06' },
      ],
    },
  },
];

const RISK_ITEMS = [
  { id: 'risk-1', title: '推荐信签名缺失', detail: '请提醒教授签字后重新扫描上传。', type: 'warning' },
  { id: 'risk-2', title: '资金证明有效期 15 天', detail: '12 月前需重新开具，避免过期。', type: 'alert' },
];

export default function ChecklistScreen() {
  const { theme } = useTheme();
  const userInfo = useUserInfo();
  const displayName = userInfo?.nickname || userInfo?.name || '旅行者';
  const [activeStage, setActiveStage] = useState(STAGES[0]?.id ?? null);
  const insets = useSafeAreaInsets();

  const currentStage = useMemo(
    () => STAGES.find((stage) => stage.id === activeStage) ?? STAGES[0],
    [activeStage],
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary, paddingTop: insets.top },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HeaderOverview
        name={displayName}
        plan={PLAN_INFO}
        currentStageName={currentStage?.name}
        theme={theme}
      />
      <ProgressDashboard theme={theme} stages={STAGES} />
      <StageNavigator
        theme={theme}
        stages={STAGES}
        activeStage={activeStage}
        onStageChange={setActiveStage}
        stage={currentStage}
      />
      <RiskPanel items={RISK_ITEMS} theme={theme} />
    </ScrollView>
  );
}

const HeaderOverview = ({ name, plan, currentStageName, theme }) => (
  <View style={styles.section}>
    <View style={styles.overviewTop}>
      <View>
        <Text style={[styles.overviewGreeting, { color: theme.colors.text.secondary }]}>
          Hi, {name}
        </Text>
        <Text style={[styles.overviewTitle, { color: theme.colors.text.primary }]}>
          {plan.title}
        </Text>
      </View>
      <TouchableOpacity style={styles.planSwitcher}>
        <Text style={styles.planSwitcherText}>{plan.target}</Text>
        <Ionicons name="chevron-down" size={16} color="#111827" />
      </TouchableOpacity>
    </View>
    <View style={styles.overviewMeta}>
      <View style={styles.metaItem}>
        <Text style={styles.metaLabel}>负责人</Text>
        <Text style={styles.metaValue}>{plan.owner}</Text>
      </View>
      <View style={styles.metaItem}>
        <Text style={styles.metaLabel}>预计出发</Text>
        <Text style={styles.metaValue}>{plan.departure}</Text>
      </View>
      <View style={styles.metaItem}>
        <Text style={styles.metaLabel}>当前阶段</Text>
        <Text style={styles.metaValue}>{currentStageName || '未开始'}</Text>
      </View>
    </View>
  </View>
);

const ProgressDashboard = ({ theme, stages }) => {
  const totalProgress = Math.round(
    (stages.reduce((acc, stage) => acc + stage.progress, 0) / (stages.length || 1)) * 100,
  );

  return (
    <View style={styles.section}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, { color: theme.colors.text.primary }]}>
          进度总览
        </Text>
        <Text style={[styles.progressHint, { color: theme.colors.text.secondary }]}>
          实时查看整体进度与关键指标
        </Text>
      </View>
      <View style={styles.progressCard}>
        <View style={styles.progressCircle}>
          <View style={styles.progressCircleInner}>
            <Text style={styles.progressPercent}>{totalProgress}%</Text>
            <Text style={styles.progressCaption}>总体完成度</Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          {METRICS.map((metric) => (
            <View key={metric.id} style={styles.metricPill}>
              <Ionicons name={metric.icon} size={14} color={theme.colors.primary[600]} />
              <View style={styles.metricPillText}>
                <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
                  {metric.label}
                </Text>
                <Text style={[styles.metricValueSmall, { color: theme.colors.text.primary }]}>
                  {metric.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const StageNavigator = ({ stages, activeStage, onStageChange, stage, theme }) => {
  if (!stage) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.progressTitle, { marginBottom: 12, color: theme.colors.text.primary }]}>
        阶段导航
      </Text>
      <View style={[styles.stageStrip, { borderBottomColor: theme.colors.border.light }]}>
        {stages.map((item) => {
          const isActive = item.id === activeStage;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.stageTabButton}
              onPress={() => onStageChange(item.id)}
            >
              <Text
                style={[
                  styles.stageTabLabel,
                  {
                    color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {item.name}
              </Text>
              <View
                style={[
                  styles.stageTabIndicator,
                  {
                    backgroundColor: theme.colors.text.primary,
                    opacity: isActive ? 1 : 0,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <StageDetail stage={stage} theme={theme} />
    </View>
  );
};

const StageDetail = ({ stage, theme }) => {
  if (!stage) return null;

  return (
    <View style={styles.stageDetail}>
      <View style={styles.stageHeader}>
        <View>
          <Text style={[styles.stageTitle, { color: theme.colors.text.primary }]}>
            {stage.name}
          </Text>
          <Text style={[styles.stageSubtitle, { color: theme.colors.text.secondary }]}>
            {stage.summary}
          </Text>
        </View>
        <View style={styles.stageDeadline}>
          <Ionicons name="alarm-outline" size={16} color="#DB2777" />
          <Text style={styles.stageDeadlineText}>{stage.deadline}</Text>
        </View>
      </View>

      <View style={styles.stageProgressBar}>
        <View style={[styles.stageProgressFill, { width: `${stage.progress * 100}%` }]} />
      </View>
      <Text style={styles.stageProgressLabel}>
        已完成 {Math.round(stage.progress * 100)}%
      </Text>

      <View style={styles.timelineBlock}>
        <Text style={styles.blockTitle}>关键节点时间线</Text>
        {stage.timeline.map((node, index) => (
          <View key={node.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineDot,
                  node.status === 'done' && styles.timelineDotDone,
                  node.status === 'progress' && styles.timelineDotProgress,
                ]}
              />
              {index !== stage.timeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>{node.label}</Text>
              <Text style={styles.timelineDate}>{node.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <TaskGroups tasks={stage.tasks} theme={theme} />
    </View>
  );
};

const TaskGroups = ({ tasks, theme }) => {
  const groups = [
    { key: 'todo', label: '待开始', accent: '#F97316' },
    { key: 'inProgress', label: '进行中', accent: '#2563EB' },
    { key: 'done', label: '已完成', accent: '#10B981' },
  ];

  return (
    <View style={styles.taskGroups}>
      {groups.map((group) => {
        const list = tasks[group.key] ?? [];
        return (
          <View key={group.key} style={styles.taskSection}>
            <View style={styles.taskSectionHeader}>
              <Text style={styles.blockTitle}>{group.label}</Text>
              <View style={[styles.taskBadge, { backgroundColor: `${group.accent}1A` }]}>
                <Text style={[styles.taskBadgeText, { color: group.accent }]}>{list.length}</Text>
              </View>
            </View>
            {list.length === 0 ? (
              <Text style={[styles.emptyHint, { color: theme.colors.text.secondary }]}>
                暂无任务
              </Text>
            ) : (
              list.map((task) => (
                <TouchableOpacity key={task.id} style={styles.taskCard}>
                  <View style={styles.taskTitleRow}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.priority && (
                      <View style={styles.priorityPill}>
                        <Text style={styles.priorityText}>{task.priority}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.taskMetaRow}>
                    <View style={styles.taskMeta}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.taskMetaText}>{task.due || task.completedAt}</Text>
                    </View>
                    {task.owner && (
                      <View style={styles.taskMeta}>
                        <Ionicons name="person-outline" size={14} color="#6B7280" />
                        <Text style={styles.taskMetaText}>{task.owner}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        );
      })}
    </View>
  );
};

const RiskPanel = ({ items, theme }) => (
  <View style={styles.section}>
    <Text style={[styles.blockTitle, { marginBottom: 12, color: theme.colors.text.primary }]}>
      提醒与风险
    </Text>
    <View style={styles.riskList}>
      {items.map((item) => (
        <View
          key={item.id}
          style={[
            styles.riskCard,
            {
              borderColor: item.type === 'alert' ? '#DC2626' : '#F97316',
              backgroundColor: item.type === 'alert' ? '#FEF2F2' : '#FFF7ED',
            },
          ]}
        >
          <View style={styles.riskHeader}>
            <Ionicons
              name={item.type === 'alert' ? 'alert-circle' : 'warning-outline'}
              size={18}
              color={item.type === 'alert' ? '#DC2626' : '#F97316'}
            />
            <Text style={styles.riskTitle}>{item.title}</Text>
          </View>
          <Text style={styles.riskDetail}>{item.detail}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  overviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewGreeting: {
    fontSize: 14,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  planSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  planSwitcherText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  overviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  progressHeader: {
    marginBottom: 16,
    gap: 4,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#312E81',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressCaption: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressHint: {
    fontSize: 13,
  },
  metricRow: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 12,
  },
  metricPill: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricPillText: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
  },
  metricValueSmall: {
    fontSize: 14,
    fontWeight: '700',
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  stageSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  stageDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  stageDeadlineText: {
    fontSize: 12,
    color: '#DB2777',
    fontWeight: '600',
  },
  stageProgressBar: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
    overflow: 'hidden',
  },
  stageProgressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  stageProgressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  stageStrip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  stageTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  stageTabLabel: {
    fontSize: 15,
  },
  stageTabIndicator: {
    width: '60%',
    height: 3,
    borderRadius: 999,
  },
  stageDetail: {
    gap: 12,
  },
  timelineBlock: {
    marginTop: 20,
    gap: 14,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5F5',
  },
  timelineDotDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timelineDotProgress: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  taskGroups: {
    marginTop: 16,
    gap: 20,
  },
  taskSection: {
    gap: 12,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  taskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
  },
  taskCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FDE68A',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  riskList: {
    gap: 12,
  },
  riskCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
  },
  riskHeader: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  riskDetail: {
    fontSize: 13,
    color: '#4B5563',
  },
});


