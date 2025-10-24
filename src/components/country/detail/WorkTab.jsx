/**
 * 国家详情 - 工作Tab
 * 展示工作签证、热门行业、薪资水平等信息
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';
import InfoCard from './InfoCard';

const WorkTab = ({ country }) => {
  // 工作签证类型
  const visaTypes = [
    {
      name: 'H-1B 工作签证',
      description: '最常见，需雇主担保',
      duration: '有效期3年，可续签3年',
    },
    {
      name: 'L-1 跨国公司调派',
      description: '适合跨国公司内部调动',
      duration: '有效期1-3年',
    },
    {
      name: 'O-1 杰出人才签证',
      description: '适合行业顶尖人才',
      duration: '有效期3年',
    },
  ];

  // H-1B申请流程
  const h1bSteps = [
    '找到美国雇主offer',
    '雇主提交LCA申请',
    '参加H-1B抽签',
    '中签后提交签证申请',
    '等待批准',
  ];

  // 热门行业
  const industries = [
    { name: 'IT/软件开发', icon: 'code-slash', color: COLORS.primary[600] },
    { name: '数据分析', icon: 'analytics', color: COLORS.info[600] },
    { name: '金融', icon: 'trending-up', color: COLORS.success[600] },
    { name: '医疗', icon: 'medical', color: COLORS.error[600] },
    { name: '工程', icon: 'construct', color: COLORS.warning[600] },
    { name: '教育', icon: 'school', color: '#8B5CF6' },
  ];

  // 薪资水平
  const salaries = [
    { role: '软件工程师', range: '$80k-150k' },
    { role: '数据科学家', range: '$90k-160k' },
    { role: '产品经理', range: '$100k-180k' },
    { role: '金融分析师', range: '$70k-130k' },
    { role: '设计师', range: '$60k-110k' },
  ];

  return (
    <View style={styles.container}>
      {/* 工作签证类型 */}
      <InfoCard title="💼 工作签证类型" icon="briefcase-outline">
        {visaTypes.map((visa, index) => (
          <TouchableOpacity key={index} style={styles.visaCard}>
            <View style={styles.visaHeader}>
              <Text style={styles.visaName}>{visa.name}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.text.tertiary}
              />
            </View>
            <Text style={styles.visaDescription}>{visa.description}</Text>
            <Text style={styles.visaDuration}>{visa.duration}</Text>
          </TouchableOpacity>
        ))}
      </InfoCard>

      {/* H-1B申请流程 */}
      <InfoCard title="📋 H-1B申请流程 (最常见)" icon="list-outline">
        {h1bSteps.map((step, index) => (
          <View key={index} style={styles.flowStep}>
            <View style={styles.flowNumber}>
              <Text style={styles.flowNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.flowText}>{step}</Text>
          </View>
        ))}

        <View style={styles.tipsBox}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={18} color={COLORS.warning[600]} />
            <Text style={styles.tipsTitle}>Tips:</Text>
          </View>
          <Text style={styles.tipsText}>• 中签率约25-30%（竞争激烈）</Text>
          <Text style={styles.tipsText}>• 硕士及以上学位有额外抽签机会</Text>
          <Text style={styles.tipsText}>• 每年4月1日开放申请</Text>
        </View>
      </InfoCard>

      {/* 热门行业 */}
      <InfoCard title="🎯 热门行业" icon="business-outline">
        <View style={styles.industriesGrid}>
          {industries.map((industry, index) => (
            <TouchableOpacity key={index} style={styles.industryCard}>
              <View
                style={[styles.industryIcon, { backgroundColor: industry.color + '20' }]}
              >
                <Ionicons name={industry.icon} size={24} color={industry.color} />
              </View>
              <Text style={styles.industryName}>{industry.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </InfoCard>

      {/* 薪资水平 */}
      <InfoCard title="💰 薪资水平" icon="cash-outline">
        {salaries.map((salary, index) => (
          <View key={index} style={styles.salaryItem}>
            <Text style={styles.salaryRole}>{salary.role}</Text>
            <Text style={styles.salaryRange}>{salary.range}</Text>
          </View>
        ))}
        <View style={styles.salaryNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.text.tertiary}
          />
          <Text style={styles.salaryNoteText}>
            以上为年薪范围，实际薪资因城市、公司、经验而异
          </Text>
        </View>
      </InfoCard>

      {/* 工作环境 */}
      <InfoCard title="🏢 工作环境" icon="desktop-outline">
        <View style={styles.listItem}>
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={16} color={COLORS.success[600]} />
          </View>
          <Text style={styles.listText}>工作节奏相对适中</Text>
        </View>
        <View style={styles.listItem}>
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={16} color={COLORS.success[600]} />
          </View>
          <Text style={styles.listText}>注重工作生活平衡</Text>
        </View>
        <View style={styles.listItem}>
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={16} color={COLORS.success[600]} />
          </View>
          <Text style={styles.listText}>多元文化职场环境</Text>
        </View>
        <View style={styles.listItem}>
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark" size={16} color={COLORS.success[600]} />
          </View>
          <Text style={styles.listText}>完善的福利体系</Text>
        </View>
      </InfoCard>
    </View>
  );
};

WorkTab.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  visaCard: {
    padding: 16,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
    marginBottom: 12,
  },
  visaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visaName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  visaDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  visaDuration: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flowNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flowNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  flowText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
  },
  tipsBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.warning[50],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning[600],
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  industriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  industryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
  },
  industryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  industryName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  salaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  salaryRole: {
    fontSize: 15,
    color: COLORS.text.primary,
  },
  salaryRange: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  salaryNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.background.default,
    borderRadius: 8,
  },
  salaryNoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.tertiary,
    lineHeight: 18,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
});

export default WorkTab;

