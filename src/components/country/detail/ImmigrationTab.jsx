/**
 * 国家详情 - 移民Tab
 * 展示移民途径、申请条件、时间周期等信息
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';
import InfoCard from './InfoCard';

const ImmigrationTab = ({ country }) => {
  // 移民途径
  const immigrationPaths = [
    {
      name: '技术移民',
      icon: 'code-working',
      difficulty: '中',
      duration: '2-5年',
      requirements: ['工作经验', '语言能力', '学历要求'],
      color: COLORS.primary[600],
    },
    {
      name: '投资移民',
      icon: 'cash',
      difficulty: '低',
      duration: '6个月-2年',
      requirements: ['资金要求', '商业计划', '投资项目'],
      color: COLORS.success[600],
    },
    {
      name: '雇主担保',
      icon: 'briefcase',
      difficulty: '中',
      duration: '1-3年',
      requirements: ['工作offer', '雇主资质', '职业清单'],
      color: COLORS.info[600],
    },
    {
      name: '亲属移民',
      icon: 'people',
      difficulty: '易',
      duration: '1-10年',
      requirements: ['亲属关系', '担保人资质', '财力证明'],
      color: COLORS.warning[600],
    },
  ];

  // 申请流程
  const applicationProcess = [
    { step: 1, title: '评估资格', description: '确定移民类别，评估是否符合条件' },
    { step: 2, title: '准备材料', description: '收集所需文件，翻译认证' },
    { step: 3, title: '递交申请', description: '在线提交或邮寄申请材料' },
    { step: 4, title: '等待审核', description: '移民局审核材料，可能要求补充' },
    { step: 5, title: '面试/体检', description: '部分类别需要面试和体检' },
    { step: 6, title: '获得批准', description: '收到批准通知，办理相关手续' },
  ];

  // 费用预估
  const costs = [
    { item: '申请费', amount: '$500-2,000' },
    { item: '律师费', amount: '$3,000-10,000' },
    { item: '材料翻译认证', amount: '$1,000-3,000' },
    { item: '体检费', amount: '$200-500' },
    { item: '生物识别', amount: '$85' },
  ];

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '易':
        return COLORS.success[600];
      case '中':
        return COLORS.warning[600];
      case '高':
        return COLORS.error[600];
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* 移民途径 */}
      <InfoCard title="🌍 移民途径" icon="globe-outline">
        {immigrationPaths.map((path, index) => (
          <TouchableOpacity key={index} style={styles.pathCard}>
            <View style={[styles.pathIcon, { backgroundColor: path.color + '20' }]}>
              <Ionicons name={path.icon} size={24} color={path.color} />
            </View>
            <View style={styles.pathContent}>
              <View style={styles.pathHeader}>
                <Text style={styles.pathName}>{path.name}</Text>
                <View style={styles.pathMeta}>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(path.difficulty) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(path.difficulty) },
                      ]}
                    >
                      难度{path.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.durationText}>{path.duration}</Text>
                </View>
              </View>
              <View style={styles.requirements}>
                {path.requirements.map((req, reqIndex) => (
                  <View key={reqIndex} style={styles.requirementTag}>
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        ))}
      </InfoCard>

      {/* 申请流程 */}
      <InfoCard title="📋 申请流程" icon="list-outline">
        {applicationProcess.map((item, index) => (
          <View key={index}>
            <View style={styles.processStep}>
              <View style={styles.processNumber}>
                <Text style={styles.processNumberText}>{item.step}</Text>
              </View>
              <View style={styles.processContent}>
                <Text style={styles.processTitle}>{item.title}</Text>
                <Text style={styles.processDescription}>{item.description}</Text>
              </View>
            </View>
            {index < applicationProcess.length - 1 && (
              <View style={styles.processLine} />
            )}
          </View>
        ))}
      </InfoCard>

      {/* 费用预估 */}
      <InfoCard title="💰 费用预估" icon="cash-outline">
        {costs.map((cost, index) => (
          <View key={index} style={styles.costItem}>
            <Text style={styles.costLabel}>{cost.item}</Text>
            <Text style={styles.costAmount}>{cost.amount}</Text>
          </View>
        ))}
        <View style={styles.costTotal}>
          <Text style={styles.costTotalLabel}>预估总计</Text>
          <Text style={styles.costTotalAmount}>$5,000-16,000</Text>
        </View>
        <View style={styles.costNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.text.tertiary}
          />
          <Text style={styles.costNoteText}>
            实际费用因移民类别和个人情况而异，以上仅供参考
          </Text>
        </View>
      </InfoCard>

      {/* 注意事项 */}
      <InfoCard title="⚠️ 注意事项" icon="alert-circle-outline">
        <View style={styles.noteItem}>
          <View style={styles.noteBullet} />
          <Text style={styles.noteText}>
            移民政策可能随时调整，请以官方最新公告为准
          </Text>
        </View>
        <View style={styles.noteItem}>
          <View style={styles.noteBullet} />
          <Text style={styles.noteText}>
            建议咨询专业移民律师，确保申请材料完整准确
          </Text>
        </View>
        <View style={styles.noteItem}>
          <View style={styles.noteBullet} />
          <Text style={styles.noteText}>
            准备充足的资金证明，确保在等待期间的生活保障
          </Text>
        </View>
        <View style={styles.noteItem}>
          <View style={styles.noteBullet} />
          <Text style={styles.noteText}>
            提前了解目的地的生活成本和就业环境
          </Text>
        </View>
      </InfoCard>
    </View>
  );
};

ImmigrationTab.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
    marginBottom: 12,
  },
  pathIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pathContent: {
    flex: 1,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pathName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pathMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  requirementTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.background.paper,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  requirementText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  processNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  processNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  processContent: {
    flex: 1,
    paddingTop: 4,
  },
  processTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  processLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border.default,
    marginLeft: 15,
    marginVertical: 4,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  costLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  costAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  costTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: COLORS.border.default,
  },
  costTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  costTotalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  costNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.background.default,
    borderRadius: 8,
  },
  costNoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.tertiary,
    lineHeight: 18,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning[600],
    marginRight: 12,
    marginTop: 7,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});

export default ImmigrationTab;

