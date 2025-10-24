/**
 * 国家详情 - 留学Tab
 * 展示留学相关信息：申请流程、材料清单、费用明细等
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';
import InfoCard from './InfoCard';

const StudyTab = ({ country }) => {
  const [selectedLevel, setSelectedLevel] = useState('master');
  const [expandedStep, setExpandedStep] = useState(null);

  // 学历层次
  const levels = [
    { key: 'bachelor', label: '本科留学', icon: 'school-outline' },
    { key: 'master', label: '硕士留学', icon: 'reader-outline' },
    { key: 'phd', label: '博士留学', icon: 'bulb-outline' },
    { key: 'language', label: '语言学校', icon: 'chatbubbles-outline' },
  ];

  // 申请流程
  const applicationSteps = [
    {
      id: 1,
      title: '前期准备',
      time: '提前12-18月',
      tasks: ['语言考试（托福/雅思）', '标化考试（GRE/GMAT）', '提升背景（实习/科研）'],
    },
    {
      id: 2,
      title: '选校定位',
      time: '提前10-12月',
      tasks: ['确定专业方向', '研究目标学校', '了解申请要求'],
    },
    {
      id: 3,
      title: '材料准备',
      time: '提前8-10月',
      tasks: ['成绩单认证', '撰写文书', '联系推荐人'],
    },
    {
      id: 4,
      title: '网申提交',
      time: '提前6-8月',
      tasks: ['填写网申表格', '上传申请材料', '缴纳申请费'],
    },
    {
      id: 5,
      title: '等待录取',
      time: '3-5个月',
      tasks: ['跟进申请进度', '补充材料', '准备面试'],
    },
    {
      id: 6,
      title: '签证办理',
      time: '收到offer后',
      tasks: ['准备签证材料', '预约签证面试', '办理签证'],
    },
  ];

  // 材料清单
  const materials = {
    required: [
      '中英文成绩单',
      '学位证/在读证明',
      '语言成绩单（托福/雅思）',
      '标化成绩（GRE/GMAT）',
      '个人陈述（PS）',
      '推荐信（2-3封）',
      '简历（CV）',
    ],
    optional: ['作品集', '论文发表', '实习证明', '获奖证书', '资金证明'],
  };

  // 费用明细
  const costs = {
    application: [
      { item: '语言考试', cost: '¥2,000-3,000' },
      { item: '标化考试', cost: '¥1,500-2,000' },
      { item: '成绩认证', cost: '¥200-500/份' },
      { item: '申请费', cost: '$50-150/所' },
      { item: '中介费', cost: '¥20,000-50,000 (DIY可省)' },
    ],
    study: [
      { item: '学费', cost: '$30,000-60,000/年' },
      { item: '生活费', cost: '$15,000-25,000/年' },
      { item: '医疗保险', cost: '$2,000-4,000/年' },
    ],
  };

  // 切换步骤展开状态
  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <View style={styles.container}>
      {/* 学历层次选择 */}
      <InfoCard title="📚 学历层次" icon="school-outline">
        <View style={styles.levelsGrid}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.levelCard,
                selectedLevel === level.key && styles.levelCardActive,
              ]}
              onPress={() => setSelectedLevel(level.key)}
            >
              <Ionicons
                name={level.icon}
                size={24}
                color={
                  selectedLevel === level.key ? COLORS.primary[600] : COLORS.text.secondary
                }
              />
              <Text
                style={[
                  styles.levelText,
                  selectedLevel === level.key && styles.levelTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </InfoCard>

      {/* 申请流程 */}
      <InfoCard title="📋 申请流程" icon="list-outline">
        {applicationSteps.map((step, index) => (
          <View key={step.id}>
            <TouchableOpacity
              style={styles.stepHeader}
              onPress={() => toggleStep(step.id)}
              activeOpacity={0.7}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.id}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepTime}>({step.time})</Text>
              </View>
              <Ionicons
                name={expandedStep === step.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.text.tertiary}
              />
            </TouchableOpacity>

            {expandedStep === step.id && (
              <View style={styles.stepContent}>
                {step.tasks.map((task, taskIndex) => (
                  <View key={taskIndex} style={styles.taskItem}>
                    <View style={styles.taskBullet} />
                    <Text style={styles.taskText}>{task}</Text>
                  </View>
                ))}
              </View>
            )}

            {index < applicationSteps.length - 1 && <View style={styles.stepDivider} />}
          </View>
        ))}
      </InfoCard>

      {/* 材料清单 */}
      <InfoCard title="💼 材料清单" icon="document-text-outline">
        <Text style={styles.materialCategory}>必需材料:</Text>
        {materials.required.map((item, index) => (
          <View key={index} style={styles.materialItem}>
            <Ionicons
              name="checkbox-outline"
              size={20}
              color={COLORS.text.secondary}
            />
            <Text style={styles.materialText}>{item}</Text>
          </View>
        ))}

        <Text style={[styles.materialCategory, { marginTop: 16 }]}>可选材料:</Text>
        {materials.optional.map((item, index) => (
          <View key={index} style={styles.materialItem}>
            <Ionicons
              name="square-outline"
              size={20}
              color={COLORS.text.tertiary}
            />
            <Text style={styles.materialText}>{item}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 费用明细 */}
      <InfoCard title="💰 费用明细" icon="cash-outline">
        <Text style={styles.costCategory}>申请阶段:</Text>
        {costs.application.map((cost, index) => (
          <View key={index} style={styles.costItem}>
            <Text style={styles.costLabel}>• {cost.item}</Text>
            <Text style={styles.costValue}>{cost.cost}</Text>
          </View>
        ))}

        <Text style={[styles.costCategory, { marginTop: 16 }]}>留学阶段:</Text>
        {costs.study.map((cost, index) => (
          <View key={index} style={styles.costItem}>
            <Text style={styles.costLabel}>• {cost.item}</Text>
            <Text style={styles.costValue}>{cost.cost}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 常见问题 */}
      <InfoCard title="❓ 常见问题" icon="help-circle-outline">
        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqQuestion}>▶ GPA要求是多少？</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqQuestion}>▶ 托福/雅思要考多少分？</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqQuestion}>▶ 需要GRE吗？</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqQuestion}>▶ 可以跨专业申请吗？</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={styles.faqQuestion}>▶ 什么时候开始准备最好？</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>查看全部35个问题</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </InfoCard>
    </View>
  );
};

StudyTab.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  levelCard: {
    width: '48%',
    padding: 16,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[600],
  },
  levelText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
    fontWeight: '500',
  },
  levelTextActive: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  stepTime: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
  stepContent: {
    paddingLeft: 44,
    paddingVertical: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary[600],
    marginRight: 12,
    marginTop: 7,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: 8,
  },
  materialCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  materialText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 10,
  },
  costCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  faqQuestion: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  moreText: {
    fontSize: 14,
    color: COLORS.primary[600],
    fontWeight: '500',
    marginRight: 4,
  },
});

export default StudyTab;

