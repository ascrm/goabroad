/**
 * 国家详情 - 生活Tab
 * 展示生活成本、气候环境、文化习俗等信息
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';
import InfoCard from './InfoCard';

const LifeTab = ({ country }) => {
  // 生活成本
  const livingCosts = [
    { category: '住宿', cost: '$800-1,500/月', icon: 'home' },
    { category: '餐饮', cost: '$400-800/月', icon: 'restaurant' },
    { category: '交通', cost: '$100-200/月', icon: 'car' },
    { category: '通讯', cost: '$50-100/月', icon: 'phone-portrait' },
    { category: '娱乐', cost: '$200-500/月', icon: 'game-controller' },
    { category: '其他', cost: '$200-400/月', icon: 'ellipsis-horizontal' },
  ];

  // 气候特点
  const climate = {
    type: '温带大陆性气候',
    features: ['四季分明', '夏季温暖', '冬季较冷', '降水适中'],
    temperature: {
      summer: '20-30°C',
      winter: '-5-10°C',
    },
  };

  // 文化特色
  const culture = [
    { title: '语言环境', content: '英语为主，多元文化氛围' },
    { title: '饮食习惯', content: '西餐为主，各国料理丰富' },
    { title: '生活节奏', content: '相对快节奏，工作效率高' },
    { title: '社交文化', content: '注重隐私，尊重个人空间' },
  ];

  // 安全指数
  const safety = {
    overall: 8.5,
    aspects: [
      { name: '治安', score: 8.0 },
      { name: '交通', score: 9.0 },
      { name: '医疗', score: 9.5 },
      { name: '环境', score: 8.0 },
    ],
  };

  // 实用信息
  const usefulInfo = [
    {
      title: '紧急电话',
      items: ['报警: 911', '急救: 911', '火警: 911'],
    },
    {
      title: '医疗保险',
      items: ['建议购买医疗保险', '看病需提前预约', '急诊费用较高'],
    },
    {
      title: '交通出行',
      items: ['公共交通发达', '可办理学生卡优惠', '部分城市需要驾照'],
    },
  ];

  // 渲染评分条
  const renderScoreBar = (score) => {
    const percentage = (score / 10) * 100;
    return (
      <View style={styles.scoreBarContainer}>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 生活成本 */}
      <InfoCard title="💰 生活成本" icon="cash-outline">
        <View style={styles.costsGrid}>
          {livingCosts.map((item, index) => (
            <View key={index} style={styles.costCard}>
              <View style={styles.costIcon}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.costCategory}>{item.category}</Text>
              <Text style={styles.costAmount}>{item.cost}</Text>
            </View>
          ))}
        </View>
        <View style={styles.costTotal}>
          <Text style={styles.costTotalLabel}>每月总计</Text>
          <Text style={styles.costTotalAmount}>$1,750-3,500</Text>
        </View>
      </InfoCard>

      {/* 气候环境 */}
      <InfoCard title="🌤️ 气候环境" icon="partly-sunny-outline">
        <View style={styles.climateType}>
          <Text style={styles.climateTypeLabel}>气候类型</Text>
          <Text style={styles.climateTypeValue}>{climate.type}</Text>
        </View>
        <View style={styles.climateFeaturesContainer}>
          <Text style={styles.featuresLabel}>气候特点:</Text>
          <View style={styles.climateFeatures}>
            {climate.features.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.temperatureContainer}>
          <View style={styles.temperatureItem}>
            <Ionicons name="sunny" size={20} color={COLORS.warning[600]} />
            <Text style={styles.temperatureLabel}>夏季</Text>
            <Text style={styles.temperatureValue}>{climate.temperature.summer}</Text>
          </View>
          <View style={styles.temperatureItem}>
            <Ionicons name="snow" size={20} color={COLORS.info[600]} />
            <Text style={styles.temperatureLabel}>冬季</Text>
            <Text style={styles.temperatureValue}>{climate.temperature.winter}</Text>
          </View>
        </View>
      </InfoCard>

      {/* 文化特色 */}
      <InfoCard title="🎭 文化特色" icon="color-palette-outline">
        {culture.map((item, index) => (
          <View key={index} style={styles.cultureItem}>
            <Text style={styles.cultureTitle}>{item.title}</Text>
            <Text style={styles.cultureContent}>{item.content}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 安全指数 */}
      <InfoCard title="🛡️ 安全指数" icon="shield-checkmark-outline">
        <View style={styles.safetyOverall}>
          <Text style={styles.safetyLabel}>综合评分</Text>
          <Text style={styles.safetyScore}>{safety.overall}</Text>
          <View style={styles.safetyStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(safety.overall / 2) ? 'star' : 'star-outline'}
                size={18}
                color="#FFB800"
              />
            ))}
          </View>
        </View>
        <View style={styles.safetyAspects}>
          {safety.aspects.map((aspect, index) => (
            <View key={index} style={styles.safetyAspect}>
              <Text style={styles.aspectName}>{aspect.name}</Text>
              {renderScoreBar(aspect.score)}
            </View>
          ))}
        </View>
      </InfoCard>

      {/* 实用信息 */}
      <InfoCard title="📱 实用信息" icon="information-circle-outline">
        {usefulInfo.map((section, index) => (
          <View key={index} style={styles.infoSection}>
            <Text style={styles.infoTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.infoItem}>
                <View style={styles.infoBullet} />
                <Text style={styles.infoText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </InfoCard>
    </View>
  );
};

LifeTab.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  costsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  costCard: {
    width: '48%',
    padding: 12,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
    alignItems: 'center',
  },
  costIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  costCategory: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  costAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  costTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
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
  climateType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  climateTypeLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  climateTypeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  climateFeaturesContainer: {
    marginBottom: 16,
  },
  featuresLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  climateFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  temperatureContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  temperatureItem: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.background.default,
    borderRadius: 12,
    alignItems: 'center',
  },
  temperatureLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 6,
    marginBottom: 4,
  },
  temperatureValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  cultureItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  cultureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  cultureContent: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  safetyOverall: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  safetyLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  safetyScore: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary[600],
    marginBottom: 8,
  },
  safetyStars: {
    flexDirection: 'row',
    gap: 4,
  },
  safetyAspects: {
    gap: 12,
  },
  safetyAspect: {
    gap: 8,
  },
  aspectName: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background.default,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    width: 32,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  infoBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary[600],
    marginRight: 12,
    marginTop: 7,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});

export default LifeTab;

