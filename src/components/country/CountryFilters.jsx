/**
 * 国家筛选组件
 * Tab 切换筛选
 */

import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const CountryFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: '全部' },
    { key: 'hot', label: '热门推荐' },
    { key: 'study', label: '留学热门' },
    { key: 'work', label: '工作友好' },
    { key: 'immigration', label: '移民推荐' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterItem, isActive && styles.filterItemActive]}
              onPress={() => onFilterChange(filter.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

CountryFilters.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background.default,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterItemActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[600],
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
});

export default CountryFilters;

