/**
 * 步骤3：选择细分类型
 * 根据目标类型（留学/工作/移民）显示不同的细分选项
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

import { COLORS } from '@/src/constants';

// 留学细分选项
const STUDY_OPTIONS = [
  {
    id: 'high_school',
    icon: '🎒',
    title: '高中/中学',
    subtitle: 'High School',
    duration: '通常 2-4 年',
    description: '适合初中毕业或高中在读学生',
  },
  {
    id: 'bachelor',
    icon: '🎓',
    title: '本科',
    subtitle: 'Bachelor',
    duration: '通常 3-4 年',
    description: '获取学士学位，全面学习专业知识',
  },
  {
    id: 'master',
    icon: '📚',
    title: '硕士',
    subtitle: 'Master',
    duration: '通常 1-2 年',
    description: '深造专业技能，提升学术水平',
  },
  {
    id: 'phd',
    icon: '🔬',
    title: '博士',
    subtitle: 'PhD',
    duration: '通常 3-5 年',
    description: '从事科学研究，培养独立研究能力',
  },
  {
    id: 'language',
    icon: '💬',
    title: '语言学校',
    subtitle: 'Language School',
    duration: '通常 3-12 个月',
    description: '专注语言学习，提升外语能力',
  },
  {
    id: 'exchange',
    icon: '🔄',
    title: '交换生/访问学者',
    subtitle: 'Exchange Program',
    duration: '通常 6-12 个月',
    description: '短期学习交流，拓展国际视野',
  },
];

// 工作细分选项
const WORK_OPTIONS = [
  {
    id: 'skilled_worker',
    icon: '💼',
    title: '技术工作',
    subtitle: 'Skilled Worker',
    duration: '长期签证',
    description: '专业技能类工作，如IT、工程等',
  },
  {
    id: 'intern',
    icon: '👔',
    title: '实习/培训',
    subtitle: 'Internship',
    duration: '3-12 个月',
    description: '获取工作经验，积累实践能力',
  },
  {
    id: 'working_holiday',
    icon: '✈️',
    title: '打工度假',
    subtitle: 'Working Holiday',
    duration: '通常 1-2 年',
    description: '边旅行边工作，体验当地生活',
  },
  {
    id: 'entrepreneur',
    icon: '🚀',
    title: '创业/投资',
    subtitle: 'Entrepreneur',
    duration: '长期签证',
    description: '在海外创办企业或投资项目',
  },
];

// 移民细分选项
const IMMIGRATION_OPTIONS = [
  {
    id: 'skilled_migration',
    icon: '🎯',
    title: '技术移民',
    subtitle: 'Skilled Migration',
    duration: '永久居留',
    description: '凭借专业技能和工作经验申请',
  },
  {
    id: 'investment',
    icon: '💰',
    title: '投资移民',
    subtitle: 'Investment Migration',
    duration: '永久居留',
    description: '通过投资或经商获得移民资格',
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    title: '亲属移民',
    subtitle: 'Family Sponsored',
    duration: '永久居留',
    description: '通过家庭成员担保申请移民',
  },
  {
    id: 'refugee',
    icon: '🆘',
    title: '人道主义/难民',
    subtitle: 'Humanitarian',
    duration: '永久居留',
    description: '基于人道主义原因的移民申请',
  },
];

export default function Step3SelectDetail({ data, onNext, onBack }) {
  const [selectedDetail, setSelectedDetail] = useState(data?.detailType || null);
  
  const goalType = data?.goalType;
  const countryName = data?.country?.name || '目标国家';

  // 根据目标类型获取选项
  const options = useMemo(() => {
    switch (goalType) {
      case 'study':
        return STUDY_OPTIONS;
      case 'work':
        return WORK_OPTIONS;
      case 'immigration':
        return IMMIGRATION_OPTIONS;
      default:
        return [];
    }
  }, [goalType]);

  // 获取标题
  const getTitle = () => {
    switch (goalType) {
      case 'study':
        return '选择学历层次';
      case 'work':
        return '选择工作类型';
      case 'immigration':
        return '选择移民类别';
      default:
        return '选择详细类型';
    }
  };

  // 选择选项
  const handleSelectDetail = (optionId) => {
    setSelectedDetail(optionId);
  };

  // 确认并进入下一步
  const handleNext = () => {
    if (!selectedDetail) {
      return;
    }
    onNext({ detailType: selectedDetail });
  };

  // 渲染选项卡片
  const renderOptionCard = (option) => {
    const isSelected = selectedDetail === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={() => handleSelectDetail(option.id)}
        activeOpacity={0.7}
      >
        {/* 图标 */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{option.icon}</Text>
        </View>

        {/* 内容 */}
        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
            {option.title}
          </Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          <Text style={styles.optionDuration}>{option.duration}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>

        {/* 选中标记 */}
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
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
        
        <Text style={styles.stepText}>步骤 3/5</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>
            {goalType === 'study' ? '📚' : goalType === 'work' ? '💼' : '🏠'}
          </Text>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>
            前往 {countryName} {goalType === 'study' ? '留学' : goalType === 'work' ? '工作' : '移民'}
          </Text>
        </View>

        {/* 选项列表 */}
        <View style={styles.optionsContainer}>
          {options.map(option => renderOptionCard(option))}
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
          style={[styles.nextButton, !selectedDetail && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedDetail}
        >
          <Text style={[styles.nextButtonText, !selectedDetail && styles.nextButtonTextDisabled]}>
            下一步
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={selectedDetail ? '#FFFFFF' : COLORS.gray[400]}
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
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: COLORS.primary[600],
  },
  optionSubtitle: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  optionDuration: {
    fontSize: 12,
    color: COLORS.primary[600],
    fontWeight: '600',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
  },
  radioContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[600],
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
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

