/**
 * 步骤5：设置目标时间
 * 选择入学时间，输入规划名称
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 生成年份和学期选项
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear + i);
  }
  return years;
};

const SEMESTERS = [
  { id: 'spring', label: '春季', months: '2-3月', value: 'spring' },
  { id: 'fall', label: '秋季', months: '9-10月', value: 'fall' },
];

export default function Step5TargetTime({ data, onNext, onBack }) {
  const goalType = data?.goalType || 'study';
  const detailType = data?.detailType || '';
  const countryName = data?.country?.name || '目标国家';
  
  const years = useMemo(() => generateYearOptions(), []);
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [planName, setPlanName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成默认规划名称
  const getDefaultPlanName = () => {
    const goalText = goalType === 'study' ? '留学' : goalType === 'work' ? '工作' : '移民';
    return `${countryName}${goalText}规划`;
  };

  // 计算建议信息
  const getSuggestion = () => {
    if (!selectedYear || !selectedSemester) {
      return null;
    }

    const targetMonth = selectedSemester === 'spring' ? 2 : 9;
    const now = new Date();
    const target = new Date(parseInt(selectedYear), targetMonth - 1, 1);
    const monthsUntil = Math.max(0, Math.floor((target - now) / (1000 * 60 * 60 * 24 * 30)));

    if (monthsUntil < 6) {
      return {
        type: 'warning',
        icon: '⚠️',
        text: `距离目标时间还有 ${monthsUntil} 个月，时间较紧张，建议尽快开始准备`,
      };
    } else if (monthsUntil < 12) {
      return {
        type: 'info',
        icon: '💡',
        text: `距离目标时间还有 ${monthsUntil} 个月，时间适中，建议按规划稳步推进`,
      };
    } else {
      return {
        type: 'success',
        icon: '✅',
        text: `距离目标时间还有 ${monthsUntil} 个月，时间充裕，可以充分准备`,
      };
    }
  };

  const suggestion = getSuggestion();

  // 生成规划
  const handleGenerate = async () => {
    if (!selectedYear || !selectedSemester) {
      return;
    }

    setIsGenerating(true);

    // 准备完整的规划数据
    const planningData = {
      ...data,
      targetTime: {
        year: selectedYear,
        semester: selectedSemester,
      },
      planName: planName.trim() || getDefaultPlanName(),
    };

    // 模拟生成过程
    setTimeout(() => {
      setIsGenerating(false);
      // 跳转到生成中页面
      router.push({
        pathname: '/planning/generating',
        params: { data: JSON.stringify(planningData) },
      });
    }, 500);
  };

  // 渲染生成中界面
  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>正在跳转...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        
        <Text style={styles.stepText}>步骤 5/5</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>
            {goalType === 'study' ? '计划什么时候入学？' : '计划什么时候出发？'}
          </Text>
          <Text style={styles.subtitle}>选择你的目标时间</Text>
        </View>

        {/* 年份选择 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>选择年份</Text>
          <View style={styles.yearGrid}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearCard,
                  selectedYear === year.toString() && styles.yearCardSelected,
                ]}
                onPress={() => setSelectedYear(year.toString())}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.yearText,
                    selectedYear === year.toString() && styles.yearTextSelected,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 学期选择 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>选择学期</Text>
          <View style={styles.semesterContainer}>
            {SEMESTERS.map(semester => (
              <TouchableOpacity
                key={semester.id}
                style={[
                  styles.semesterCard,
                  selectedSemester === semester.value && styles.semesterCardSelected,
                ]}
                onPress={() => setSelectedSemester(semester.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.semesterLabel,
                    selectedSemester === semester.value && styles.semesterLabelSelected,
                  ]}
                >
                  {semester.label}
                </Text>
                <Text
                  style={[
                    styles.semesterMonths,
                    selectedSemester === semester.value && styles.semesterMonthsSelected,
                  ]}
                >
                  {semester.months}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 建议提示 */}
        {suggestion && (
          <View style={[styles.suggestionCard, styles[`suggestion${suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}`]]}>
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </View>
        )}

        {/* 规划名称 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>规划名称（可选）</Text>
          <TextInput
            style={styles.nameInput}
            placeholder={getDefaultPlanName()}
            value={planName}
            onChangeText={setPlanName}
            placeholderTextColor={COLORS.gray[400]}
            maxLength={30}
          />
          <Text style={styles.nameHint}>
            留空将使用默认名称
          </Text>
        </View>

        {/* 规划信息预览 */}
        {selectedYear && selectedSemester && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>📋 规划概览</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>目标国家：</Text>
              <Text style={styles.previewValue}>{countryName}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>规划类型：</Text>
              <Text style={styles.previewValue}>
                {goalType === 'study' ? '留学' : goalType === 'work' ? '工作' : '移民'}
              </Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>目标时间：</Text>
              <Text style={styles.previewValue}>
                {selectedYear}年{selectedSemester === 'spring' ? '春季' : '秋季'}
              </Text>
            </View>
          </View>
        )}
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
          style={[
            styles.generateButton,
            (!selectedYear || !selectedSemester) && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={!selectedYear || !selectedSemester}
        >
          <Text
            style={[
              styles.generateButtonText,
              (!selectedYear || !selectedSemester) && styles.generateButtonTextDisabled,
            ]}
          >
            🚀 生成我的规划
          </Text>
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  yearCard: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yearCardSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  yearText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  yearTextSelected: {
    color: COLORS.primary[600],
  },
  semesterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  semesterCard: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  semesterCardSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  semesterLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 6,
  },
  semesterLabelSelected: {
    color: COLORS.primary[600],
  },
  semesterMonths: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  semesterMonthsSelected: {
    color: COLORS.primary[600],
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  suggestionWarning: {
    backgroundColor: `${COLORS.warning[500]}08`,
  },
  suggestionInfo: {
    backgroundColor: `${COLORS.primary[600]}08`,
  },
  suggestionSuccess: {
    backgroundColor: `${COLORS.success[500]}08`,
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
  nameInput: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    fontSize: 16,
    color: COLORS.gray[900],
  },
  nameHint: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 6,
  },
  previewCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 15,
    color: COLORS.gray[600],
    minWidth: 90,
  },
  previewValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.gray[100],
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  generateButtonTextDisabled: {
    color: COLORS.gray[400],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 16,
  },
});

