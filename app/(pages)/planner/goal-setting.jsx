import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components';
import { useTheme } from '@/src/context/ThemeContext';

const PURPOSE_OPTIONS = [
  {
    id: 'work',
    title: '出国工作',
    description: '求职、职业发展',
    accent: '#2563EB',
    icon: 'briefcase-outline',
  },
  {
    id: 'study',
    title: '出国留学',
    description: '学术深造、语言学习',
    accent: '#22C55E',
    icon: 'school-outline',
  },
  {
    id: 'travel',
    title: '出国旅游',
    description: '休闲度假、短期探索',
    accent: '#F97316',
    icon: 'airplane-outline',
  },
  {
    id: 'settlement',
    title: '长期定居',
    description: '移民、家庭团聚',
    accent: '#A855F7',
    icon: 'home-outline',
  },
];

const FLOW_CONFIG = {
  work: [
    {
      id: 'work-target',
      title: 'Step 2A · 目标定位',
      subtitle: '国家与行业',
      prompts: [
        { id: 'work-country', label: '目标国家', placeholder: '如：加拿大' },
        { id: 'work-city', label: '目标城市', placeholder: '如：多伦多' },
        { id: 'work-industry', label: '目标行业', placeholder: '如：AI / 金融科技' },
        { id: 'work-role', label: '目标职位', placeholder: '如：产品经理' },
      ],
      deliverables: ['目标国家', '目标职位'],
    },
    {
      id: 'work-background',
      title: 'Step 3A · 专业背景',
      subtitle: '学历与经验',
      prompts: [
        { id: 'work-education-level', label: '最高学历', placeholder: '如：硕士' },
        { id: 'work-major', label: '所学专业', placeholder: '如：计算机科学' },
        { id: 'work-experience-years', label: '工作年限', placeholder: '如：5 年' },
        { id: 'work-skills', label: '核心技能', placeholder: '如：敏捷开发、A/B 测试' },
      ],
      deliverables: ['教育经历', '核心技能'],
    },
    {
      id: 'work-language',
      title: 'Step 4A · 语言与认证',
      subtitle: '硬性指标',
      prompts: [
        { id: 'work-language-score', label: '语言水平', placeholder: '如：雅思 7.5 / 双语办公' },
        { id: 'work-certificates', label: '专业证书', placeholder: '如：PMP、CPA、CFA 等' },
      ],
      deliverables: ['语言水平', '证书资质'],
    },
    {
      id: 'work-expectation',
      title: 'Step 5A · 薪资与时间',
      subtitle: '期望与限制',
      prompts: [
        { id: 'work-salary', label: '最低期望年薪', placeholder: '如：30 万人民币 / 年' },
        { id: 'work-timeline', label: '计划落地时间', placeholder: '如：6 个月内完成签约与签证' },
      ],
      deliverables: ['薪资期望', '时间节点'],
    },
  ],
  study: [
    {
      id: 'study-direction',
      title: 'Step 2B · 学术方向',
      subtitle: '国家与专业',
      prompts: [
        { id: 'study-country', label: '目标国家', placeholder: '如：英国' },
        { id: 'study-city', label: '目标城市或地区', placeholder: '如：伦敦 / 东南部' },
        { id: 'study-major', label: '目标专业', placeholder: '如：数据科学' },
        { id: 'study-degree', label: '申请学位', placeholder: '如：硕士 / 博士' },
      ],
      deliverables: ['目标国家', '目标专业'],
    },
    {
      id: 'study-qualification',
      title: 'Step 3B · 学术条件',
      subtitle: '录取资格',
      prompts: [
        { id: 'study-gpa', label: 'GPA / 平均分', placeholder: '如：3.6/4.0 或 88/100' },
        { id: 'study-ranking', label: '本科院校层级', placeholder: '如：985 / Top 50' },
        { id: 'study-research', label: '科研经历', placeholder: '如：AI 实验室研究 1 年' },
        { id: 'study-internship', label: '实习经历', placeholder: '如：互联网大厂产品实习' },
        { id: 'study-projects', label: '项目经验', placeholder: '如：科研项目 / 创新竞赛' },
      ],
      deliverables: ['GPA / 分数', '科研经历'],
    },
    {
      id: 'study-tests',
      title: 'Step 4B · 标化考试',
      subtitle: '语言与学术',
      prompts: [
        { id: 'study-language', label: '语言考试情况', placeholder: '如：雅思 7.0 / 待考' },
        { id: 'study-standardized', label: '学术考试情况', placeholder: 'GRE / GMAT / SAT 等' },
      ],
      deliverables: ['语言成绩', '学术考试状态'],
    },
    {
      id: 'study-budget',
      title: 'Step 5B · 预算与偏好',
      subtitle: '选校依据',
      prompts: [
        { id: 'study-budget-range', label: '留学总预算', placeholder: '如：60-80 万人民币' },
        { id: 'study-ranking-preference', label: '学校排名偏好', placeholder: '如：Top 50' },
        { id: 'study-city-preference', label: '城市偏好', placeholder: '如：沿海城市' },
        { id: 'study-climate-preference', label: '气候偏好', placeholder: '如：温和气候' },
      ],
      deliverables: ['预算范围', '选校偏好'],
    },
  ],
  travel: [
    {
      id: 'travel-destination',
      title: 'Step 2C · 目的地与时间',
      subtitle: '框架确定',
      prompts: [
        { id: 'travel-country', label: '旅行国家', placeholder: '如：日本' },
        { id: 'travel-cities', label: '主要城市', placeholder: '如：东京、京都' },
        { id: 'travel-days', label: '行程天数', placeholder: '如：8 天' },
        { id: 'travel-month', label: '出行月份', placeholder: '如：10 月' },
      ],
      deliverables: ['目的地', '旅行天数'],
    },
    {
      id: 'travel-group',
      title: 'Step 3C · 同行者与预算',
      subtitle: '规模与限制',
      prompts: [
        { id: 'travel-adults', label: '成年人数', placeholder: '如：2 位' },
        { id: 'travel-children', label: '儿童人数', placeholder: '如：1 位儿童' },
        { id: 'travel-seniors', label: '老人数量', placeholder: '如：1 位老人' },
        { id: 'travel-budget', label: '旅行总预算', placeholder: '如：2 万人民币' },
      ],
      deliverables: ['同行人数', '预算'],
    },
    {
      id: 'travel-style',
      title: 'Step 4C · 旅行风格',
      subtitle: '偏好设定',
      prompts: [
        { id: 'travel-pace', label: '旅行节奏', placeholder: '紧凑 / 放松 / 混合' },
        { id: 'travel-interests', label: '兴趣重心', placeholder: '自然 / 历史 / 美食 / 购物' },
      ],
      deliverables: ['旅行节奏', '风格偏好'],
    },
    {
      id: 'travel-logistics',
      title: 'Step 5C · 交通与住宿',
      subtitle: '后勤偏好',
      prompts: [
        { id: 'travel-transport', label: '交通方式', placeholder: '公共交通 / 自驾 / 包车' },
        { id: 'travel-stay', label: '住宿类型', placeholder: '酒店 / 民宿 / 青旅' },
      ],
      deliverables: ['交通偏好', '住宿偏好'],
    },
  ],
  settlement: [
    {
      id: 'settle-path',
      title: 'Step 2D · 目标与路径',
      subtitle: '国家与移民方式',
      prompts: [
        { id: 'settle-country', label: '目标定居国家', placeholder: '如：澳大利亚' },
        { id: 'settle-city', label: '计划定居城市', placeholder: '如：墨尔本' },
        { id: 'settle-method', label: '倾向的移民方式', placeholder: '技术 / 投资 / 创业 / 团聚' },
      ],
      deliverables: ['目标国家', '移民路径'],
    },
    {
      id: 'settle-family',
      title: 'Step 3D · 家庭与核心信息',
      subtitle: '资格评估',
      prompts: [
        { id: 'settle-age', label: '申请人年龄', placeholder: '如：35 岁' },
        { id: 'settle-family-structure', label: '家庭成员', placeholder: '配偶 / 子女情况' },
        { id: 'settle-language', label: '语言能力', placeholder: '如：雅思 G 类 7 分' },
      ],
      deliverables: ['家庭情况', '语言能力'],
    },
    {
      id: 'settle-finance',
      title: 'Step 4D · 财务与资产',
      subtitle: '关键指标',
      prompts: [
        { id: 'settle-fund', label: '可用流动资金', placeholder: '如：300 万人民币' },
        { id: 'settle-assets', label: '资产与投资计划', placeholder: '房产 / 投资组合 / 其他资产' },
      ],
      deliverables: ['资金储备', '资产结构'],
    },
    {
      id: 'settle-planning',
      title: 'Step 5D · 税务与安家',
      subtitle: '长期规划',
      prompts: [
        { id: 'settle-tax', label: '税务诉求', placeholder: '如：避免全球征税 / 了解 CRS' },
        { id: 'settle-lifestyle', label: '安家偏好', placeholder: '教育资源 / 医疗服务 / 城市偏好' },
      ],
      deliverables: ['税务需求', '安家要求'],
    },
  ],
};

const FINAL_SUMMARY = {
  work: 'AI 正在根据您的职业背景，匹配目标国家的签证路径、简历优化建议与招聘渠道。',
  study: 'AI 正在结合您的 GPA、预算与偏好，生成冲 / 稳 / 保 选校清单与申请时间轴。',
  travel: 'AI 正在依据预算、天数与兴趣，输出每日计划、预算分配与签证提示。',
  settlement:
    'AI 正在对比各移民项目，并提供预算清单、税务注意事项与安家建议。',
};

const GoalSettingScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const flowSteps = useMemo(() => {
    if (!selectedPurpose) return [];
    return FLOW_CONFIG[selectedPurpose] || [];
  }, [selectedPurpose]);

  const totalSteps = selectedPurpose ? flowSteps.length + 1 : 1;
  const progress = Math.min((currentStep + (selectedPurpose ? 1 : 0)) / (totalSteps + 1), 1);

  const handlePurposeSelect = (purposeId) => {
    setSelectedPurpose(purposeId);
    setCurrentStep(1);
    setAnswers({});
  };

  const handleInputChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (!selectedPurpose) return;
    if (currentStep <= flowSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setSelectedPurpose(null);
      setCurrentStep(0);
      setAnswers({});
      return;
    }
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const renderPurposeStep = () => (
    <View style={styles.card}>
      <Text style={styles.stepTitle}>Step 1 · 选择出国目的</Text>
      <Text style={styles.stepSubtitle}>为你定制专属的规划路径</Text>
      <View style={styles.purposeGrid}>
        {PURPOSE_OPTIONS.map((item) => {
          const isActive = selectedPurpose === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.purposeCard,
                {
                  borderColor: isActive ? item.accent : '#E5E7EB',
                  backgroundColor: isActive ? '#F8FAFF' : '#FFFFFF',
                },
              ]}
              onPress={() => handlePurposeSelect(item.id)}
            >
              <View style={styles.purposeHeader}>
                <View style={styles.purposeIconWrapper}>
                  <Ionicons name={item.icon} size={20} color={item.accent} />
                </View>
                <View style={styles.purposeInfo}>
                  <Text style={styles.purposeTitle}>{item.title}</Text>
                  <Text style={styles.purposeDescription}>{item.description}</Text>
                </View>
              </View>
              <View style={styles.purposeAction}>
                <Text style={[styles.purposeActionText, { color: item.accent }]}>
                  {isActive ? '已选择' : '点击选择'}
                </Text>
                <Ionicons
                  name={isActive ? 'checkmark-circle' : 'chevron-forward'}
                  size={18}
                  color={item.accent}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const currentFlowStep =
    selectedPurpose && currentStep > 0 && currentStep <= flowSteps.length
      ? flowSteps[currentStep - 1]
      : null;

  const renderFlowStep = () => {
    if (!currentFlowStep) {
      return null;
    }
    return (
      <View style={styles.card}>
        <Text style={styles.stepTitle}>{currentFlowStep.title}</Text>
        <Text style={styles.stepSubtitle}>{currentFlowStep.subtitle}</Text>
        <View style={styles.prompts}>
          {currentFlowStep.prompts.map((prompt) => (
            <View key={prompt.id} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{prompt.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={prompt.placeholder}
                placeholderTextColor="#9CA3AF"
                multiline
                value={answers[prompt.id] || ''}
                onChangeText={(value) => handleInputChange(prompt.id, value)}
              />
            </View>
          ))}
        </View>
        <View style={styles.deliverableBox}>
          <Text style={styles.deliverableTitle}>关键产出</Text>
          <View style={styles.deliverableList}>
            {currentFlowStep.deliverables.map((item) => (
              <View key={item} style={styles.deliverableChip}>
                <Ionicons name="sparkles" size={14} color="#2563EB" />
                <Text style={styles.deliverableText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderSummary = () => {
    if (!selectedPurpose) return null;
    const orderedEntries = flowSteps.flatMap((step) =>
      step.prompts.map((prompt) => ({
        id: prompt.id,
        label: prompt.label,
        value: answers[prompt.id],
      })),
    );
    return (
      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 6 · AI 方案生成中</Text>
        <Text style={styles.stepSubtitle}>{FINAL_SUMMARY[selectedPurpose]}</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>已收集信息要点</Text>
          {orderedEntries.map((entry) => (
            <View key={entry.id} style={styles.summaryItem}>
              <Text style={styles.summaryKey}>{entry.label}</Text>
              <Text style={styles.summaryValue}>{entry.value || '未填写'}</Text>
            </View>
          ))}
        </View>
        <Button
          fullWidth
          style={styles.completeButton}
          onPress={() => router.push('/(pages)/planner/loading')}
        >
          生成我的出国计划
        </Button>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background?.secondary || '#F3F4F6',
          paddingTop: insets.top || 0,
        },
      ]}
    >
      <View style={styles.progressWrapper}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {selectedPurpose ? `步骤 ${Math.min(currentStep + 1, totalSteps + 1)}/${totalSteps + 1}` : '步骤 1/5'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 0 && renderPurposeStep()}
        {currentFlowStep && renderFlowStep()}
        {!currentFlowStep && selectedPurpose && currentStep > flowSteps.length && renderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        {selectedPurpose && (
          <Button style={styles.footerButton} onPress={handleBack}>
            上一步
          </Button>
        )}
        {selectedPurpose && currentStep <= flowSteps.length && (
          <Button style={styles.footerButton} onPress={handleNext}>
            下一步
          </Button>
        )}
        {selectedPurpose && currentStep > flowSteps.length && (
          <Text style={styles.footerHint}>请确认信息后点击“生成我的出国计划”</Text>
        )}
      </View>
    </View>
  );
};

export default GoalSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  purposeGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  purposeCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  purposeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  purposeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purposeInfo: {
    flex: 1,
  },
  purposeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  purposeDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  purposeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  purposeActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  prompts: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  input: {
    minHeight: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
  },
  deliverableBox: {
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    padding: 16,
    gap: 10,
  },
  deliverableTitle: {
    fontSize: 13,
    color: '#475467',
    fontWeight: '600',
  },
  deliverableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deliverableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  deliverableText: {
    fontSize: 12,
    color: '#1D4ED8',
  },
  summaryBox: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    padding: 16,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  summaryItem: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 4,
  },
  summaryKey: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0F172A',
  },
  completeButton: {
    marginTop: 8,
  },
  progressWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  progressText: {
    fontSize: 12,
    color: '#475467',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerButton: {
    flex: 1,
  },
  footerHint: {
    fontSize: 13,
    color: '#475467',
    textAlign: 'center',
    flex: 1,
  },
});


