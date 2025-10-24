/**
 * 步骤2：选择目标类型
 * 留学/工作/移民
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 目标类型选项
const GOAL_TYPES = [
  {
    id: 'study',
    icon: 'school',
    title: '📚 留学',
    englishTitle: 'Study Abroad',
    description: '前往国外学习深造，获取学位或提升专业技能',
    color: COLORS.primary[600],
    bgColor: `${COLORS.primary[600]}08`,
  },
  {
    id: 'work',
    icon: 'briefcase',
    title: '💼 工作',
    englishTitle: 'Work',
    description: '在国外寻找工作机会，积累海外工作经验',
    color: COLORS.success[600],
    bgColor: `${COLORS.success[600]}08`,
  },
  {
    id: 'immigration',
    icon: 'home',
    title: '🏠 移民',
    englishTitle: 'Immigration',
    description: '永久定居国外，获取长期居留权或公民身份',
    color: COLORS.warning[600],
    bgColor: `${COLORS.warning[600]}08`,
  },
];

export default function Step2SelectGoal({ data, onNext, onBack }) {
  const [selectedGoal, setSelectedGoal] = useState(data?.goalType || null);
  const countryName = data?.country?.name || '目标国家';

  // 选择目标
  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
  };

  // 确认并进入下一步
  const handleNext = () => {
    if (!selectedGoal) {
      return;
    }
    onNext({ goalType: selectedGoal });
  };

  // 渲染目标卡片
  const renderGoalCard = (goal) => {
    const isSelected = selectedGoal === goal.id;
    
    return (
      <TouchableOpacity
        key={goal.id}
        style={[
          styles.goalCard,
          { backgroundColor: goal.bgColor },
          isSelected && styles.goalCardSelected,
        ]}
        onPress={() => handleSelectGoal(goal.id)}
        activeOpacity={0.7}
      >
        {/* 选中标记 */}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={28} color={goal.color} />
          </View>
        )}

        {/* 图标和标题 */}
        <View style={styles.goalHeader}>
          <Text style={styles.goalEmoji}>{goal.title.split(' ')[0]}</Text>
          <View style={styles.goalTitleContainer}>
            <Text style={[styles.goalTitle, isSelected && { color: goal.color }]}>
              {goal.title.split(' ')[1]}
            </Text>
            <Text style={styles.goalEnglish}>{goal.englishTitle}</Text>
          </View>
        </View>

        {/* 描述 */}
        <Text style={styles.goalDescription}>{goal.description}</Text>

        {/* 选择指示器 */}
        <View style={styles.selectIndicator}>
          <View
            style={[
              styles.radioOuter,
              { borderColor: goal.color },
              isSelected && { backgroundColor: goal.color },
            ]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        
        <Text style={styles.stepText}>步骤 2/5</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.title}>你计划去{countryName}做什么？</Text>
          <Text style={styles.subtitle}>选择你的主要目标</Text>
        </View>

        {/* 目标选项 */}
        <View style={styles.goalsContainer}>
          {GOAL_TYPES.map(goal => renderGoalCard(goal))}
        </View>

        {/* 提示信息 */}
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.tipText}>
            根据你的选择，我们将为你制定专属规划方案
          </Text>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backFooterButton}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.gray[600]} />
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !selectedGoal && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
        >
          <Text style={[styles.nextButtonText, !selectedGoal && styles.nextButtonTextDisabled]}>
            下一步
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={selectedGoal ? '#FFFFFF' : COLORS.gray[400]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  goalsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: COLORS.primary[600],
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  goalEnglish: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  goalDescription: {
    fontSize: 15,
    color: COLORS.gray[600],
    lineHeight: 22,
  },
  selectIndicator: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: `${COLORS.primary[600]}08`,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[700],
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    backgroundColor: '#FFFFFF',
  },
  backFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.gray[100],
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  nextButtonTextDisabled: {
    color: COLORS.gray[400],
  },
});

