/**
 * 国家卡片组件
 * 用于展示国家基本信息
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const CountryCard = ({ country, onPress, onFavorite, compact = false }) => {
  // 渲染星级
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={14}
          color={i < rating ? '#FFB800' : COLORS.text.disabled}
        />
      );
    }
    return stars;
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '高':
        return COLORS.error[500];
      case '中':
        return COLORS.warning[500];
      case '低':
        return COLORS.success[500];
      default:
        return COLORS.text.secondary;
    }
  };

  // 获取费用颜色
  const getCostColor = (cost) => {
    switch (cost) {
      case '高':
        return COLORS.error[500];
      case '中':
        return COLORS.warning[500];
      case '低':
        return COLORS.success[500];
      default:
        return COLORS.text.secondary;
    }
  };

  if (compact) {
    // 紧凑模式（横向滚动时使用）
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <Text style={styles.flag}>{country.flag}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}
          >
            <Ionicons
              name={country.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={country.isFavorite ? COLORS.error[500] : COLORS.text.tertiary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.compactName}>{country.name}</Text>
        <Text style={styles.compactEnglishName}>{country.englishName}</Text>
        <Text style={styles.compactDescription}>{country.description}</Text>
        <View style={styles.compactInfo}>
          <View style={styles.rating}>{renderStars(country.rating)}</View>
          <Text style={styles.compactCost}>{country.costRange}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 默认模式（列表使用）
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.flag}>{country.flag}</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{country.name}</Text>
            <Text style={styles.englishName}>{country.englishName}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
        >
          <Ionicons
            name={country.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={country.isFavorite ? COLORS.error[500] : COLORS.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{country.description}</Text>

      <View style={styles.infoRow}>
        <View style={styles.rating}>{renderStars(country.rating)}</View>
        <View style={styles.labels}>
          <View style={styles.label}>
            <Text style={[styles.labelText, { color: getDifficultyColor(country.difficulty) }]}>
              难度{country.difficulty}
            </Text>
          </View>
          <View style={styles.labelDot} />
          <View style={styles.label}>
            <Text style={[styles.labelText, { color: getCostColor(country.cost) }]}>
              费用{country.cost}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.costRow}>
        <Ionicons name="cash-outline" size={16} color={COLORS.text.secondary} />
        <Text style={styles.costText}>{country.costRange}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.tags}>
          {country.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.action}>
          <Text style={styles.actionText}>查看详情</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary[600]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

CountryCard.propTypes = {
  country: PropTypes.shape({
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    flag: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    englishName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    difficulty: PropTypes.string.isRequired,
    cost: PropTypes.string.isRequired,
    costRange: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    isFavorite: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func,
  onFavorite: PropTypes.func,
  compact: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  flag: {
    fontSize: 40,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  englishName: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  favoriteButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  labels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.background.default,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  labelDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.text.disabled,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  costText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary[50],
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  // 紧凑模式样式
  compactCard: {
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  compactEnglishName: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  compactDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  compactInfo: {
    gap: 8,
  },
  compactCost: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 4,
  },
});

export default CountryCard;

