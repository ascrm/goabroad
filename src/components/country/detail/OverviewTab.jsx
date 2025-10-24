/**
 * 国家详情 - 概览Tab
 * 展示国家的基本信息、费用预估、优劣势等
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';
import InfoCard from './InfoCard';

const OverviewTab = ({ country }) => {
  // 模拟数据
  const overviewData = {
    ratings: {
      education: 9.5,
      cost: 7.8,
      visa: 6.2,
    },
    costEstimate: {
      tuition: '$30,000 - $60,000/年',
      living: '$15,000 - $25,000/年',
      total: '约 ¥50-80万/年',
    },
    advantages: [
      '世界顶尖教育资源',
      '名校众多，专业选择丰富',
      '毕业后OPT/CPT工作机会',
      '创新创业氛围浓厚',
      '多元文化环境',
    ],
    disadvantages: [
      '费用较高，经济压力大',
      '签证政策波动',
      '部分地区治安问题',
      '医疗费用昂贵',
    ],
    suitableFor: [
      '追求顶尖教育质量',
      '家庭经济条件较好',
      '希望留美工作/移民',
      '具备较强英语能力',
    ],
    basicInfo: {
      language: '英语',
      currency: '美元 (USD)',
      timezone: 'UTC-5 ~ UTC-8',
      duration: '本科4年，硕士1-2年',
    },
  };

  // 渲染评分
  const renderRating = (score) => {
    const stars = Math.floor(score / 2);
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <Ionicons
          key={i}
          name="star"
          size={16}
          color={i < stars ? '#FFB800' : COLORS.text.disabled}
        />
      );
    }
    return items;
  };

  return (
    <View style={styles.container}>
      {/* 数据概览 */}
      <InfoCard title="📊 数据概览" icon="bar-chart-outline">
        <View style={styles.ratingsGrid}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>教育质量</Text>
            <Text style={styles.ratingScore}>{overviewData.ratings.education}</Text>
            <View style={styles.stars}>{renderRating(overviewData.ratings.education)}</View>
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>生活成本</Text>
            <Text style={styles.ratingScore}>{overviewData.ratings.cost}</Text>
            <View style={styles.stars}>{renderRating(overviewData.ratings.cost)}</View>
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>签证难度</Text>
            <Text style={styles.ratingScore}>{overviewData.ratings.visa}</Text>
            <View style={styles.stars}>{renderRating(overviewData.ratings.visa)}</View>
          </View>
        </View>
      </InfoCard>

      {/* 费用预估 */}
      <InfoCard title="💰 费用预估" icon="cash-outline">
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>学费</Text>
          <Text style={styles.costValue}>{overviewData.costEstimate.tuition}</Text>
        </View>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>生活费</Text>
          <Text style={styles.costValue}>{overviewData.costEstimate.living}</Text>
        </View>
        <View style={[styles.costItem, styles.costTotal]}>
          <Text style={styles.costTotalLabel}>总计</Text>
          <Text style={styles.costTotalValue}>{overviewData.costEstimate.total}</Text>
        </View>
      </InfoCard>

      {/* 优势 */}
      <InfoCard title="✨ 优势" icon="checkmark-circle-outline">
        {overviewData.advantages.map((advantage, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.bullet}>
              <Ionicons name="checkmark" size={16} color={COLORS.success[600]} />
            </View>
            <Text style={styles.listText}>{advantage}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 劣势 */}
      <InfoCard title="⚠️ 劣势" icon="alert-circle-outline">
        {overviewData.disadvantages.map((disadvantage, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.bullet}>
              <Ionicons name="close" size={16} color={COLORS.error[600]} />
            </View>
            <Text style={styles.listText}>{disadvantage}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 适合人群 */}
      <InfoCard title="🎯 适合人群" icon="people-outline">
        {overviewData.suitableFor.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </InfoCard>

      {/* 基本信息 */}
      <InfoCard title="📝 基本信息" icon="information-circle-outline">
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>官方语言</Text>
            <Text style={styles.infoValue}>{overviewData.basicInfo.language}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>货币</Text>
            <Text style={styles.infoValue}>{overviewData.basicInfo.currency}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>时差</Text>
            <Text style={styles.infoValue}>{overviewData.basicInfo.timezone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>学制</Text>
            <Text style={styles.infoValue}>{overviewData.basicInfo.duration}</Text>
          </View>
        </View>
      </InfoCard>
    </View>
  );
};

OverviewTab.propTypes = {
  country: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    flag: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  ratingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratingItem: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  costLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  costValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  costTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: COLORS.border.default,
  },
  costTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  costTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary[600],
    marginRight: 12,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

export default OverviewTab;

