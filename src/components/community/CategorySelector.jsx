/**
 * 分类选择器组件
 * 用于国家和阶段 Tab，显示分区选项
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import { setFilters } from '@/src/store/slices/communitySlice';

// 国家分区
const COUNTRY_CATEGORIES = [
  { id: 'all', label: '全部', value: null },
  { id: 'us', label: '🇺🇸 美国圈', value: '美国' },
  { id: 'uk', label: '🇬🇧 英国圈', value: '英国' },
  { id: 'ca', label: '🇨🇦 加拿大圈', value: '加拿大' },
  { id: 'au', label: '🇦🇺 澳洲圈', value: '澳洲' },
  { id: 'nz', label: '🇳🇿 新西兰圈', value: '新西兰' },
  { id: 'jp', label: '🇯🇵 日本圈', value: '日本' },
  { id: 'sg', label: '🇸🇬 新加坡圈', value: '新加坡' },
  { id: 'hk', label: '🇭🇰 香港圈', value: '香港' },
];

// 阶段分区
const STAGE_CATEGORIES = [
  { id: 'all', label: '全部', value: null },
  { id: 'preparing', label: '📝 准备阶段', value: '准备阶段' },
  { id: 'applying', label: '📮 申请中', value: '申请中' },
  { id: 'waiting', label: '⏳ 等offer', value: '等offer' },
  { id: 'accepted', label: '🎉 已录取', value: '已录取' },
  { id: 'visa', label: '🛂 办签证', value: '办签证' },
  { id: 'departing', label: '✈️ 准备出发', value: '准备出发' },
  { id: 'abroad', label: '🌍 在外留学', value: '在外留学' },
  { id: 'returned', label: '🏠 已归国', value: '已归国' },
];

// 类型分区
const TYPE_CATEGORIES = [
  { id: 'all', label: '全部类型', value: null },
  { id: 'study', label: '📚 留学', value: '留学' },
  { id: 'work', label: '💼 工作', value: '工作' },
  { id: 'immigration', label: '🏡 移民', value: '移民' },
];

export default function CategorySelector({ type = 'country' }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.community.filters);

  // 根据类型获取分类列表
  const categories = type === 'country' ? COUNTRY_CATEGORIES : STAGE_CATEGORIES;
  const currentValue = type === 'country' ? filters.country : filters.stage;
  const currentType = filters.type;

  // 选择分类
  const handleSelect = (value) => {
    if (type === 'country') {
      dispatch(setFilters({ country: value }));
    } else {
      dispatch(setFilters({ stage: value }));
    }
  };

  // 选择类型
  const handleTypeSelect = (value) => {
    dispatch(setFilters({ type: value }));
  };

  return (
    <View style={styles.container}>
      {/* 主分类 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              currentValue === category.value && styles.categoryButtonActive,
            ]}
            onPress={() => handleSelect(category.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                currentValue === category.value && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 类型筛选（第二行） */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.typeRow}
      >
        {TYPE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.typeButton,
              currentType === category.value && styles.typeButtonActive,
            ]}
            onPress={() => handleTypeSelect(category.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeText,
                currentType === category.value && styles.typeTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

CategorySelector.propTypes = {
  type: PropTypes.oneOf(['country', 'stage']),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  typeRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.gray[50],
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary[50],
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  },
  typeText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.tertiary,
  },
  typeTextActive: {
    color: COLORS.primary[600],
  },
});

