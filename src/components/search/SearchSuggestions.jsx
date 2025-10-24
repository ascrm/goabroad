/**
 * 搜索建议组件
 * 显示热门搜索和搜索建议
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const SearchSuggestions = ({ suggestions = [], hotSearches = [], onSelectItem }) => {
  // 渲染热门搜索
  const renderHotSearch = ({ item, index }) => (
    <TouchableOpacity
      style={styles.hotTag}
      onPress={() => onSelectItem(item.keyword)}
      activeOpacity={0.7}
    >
      {index < 3 && (
        <View style={[styles.hotBadge, index === 0 && styles.hotBadgeTop]}>
          <Text style={[styles.hotBadgeText, index === 0 && styles.hotBadgeTextTop]}>
            {index + 1}
          </Text>
        </View>
      )}
      <Text style={styles.hotTagText}>{item.keyword}</Text>
    </TouchableOpacity>
  );

  // 渲染搜索建议
  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onSelectItem(item.keyword)}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={18} color={COLORS.gray[400]} />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionText} numberOfLines={1}>
          {item.keyword}
        </Text>
        {item.category && <Text style={styles.categoryText}>{item.category}</Text>}
      </View>
      <Ionicons name="arrow-forward" size={16} color={COLORS.gray[300]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 热门搜索 */}
      {hotSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={18} color={COLORS.error[500]} />
            <Text style={styles.sectionTitle}>热门搜索</Text>
          </View>
          <View style={styles.hotTagsContainer}>
            <FlatList
              data={hotSearches}
              renderItem={renderHotSearch}
              keyExtractor={(item, index) => `hot-${index}`}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.hotTagsRow}
            />
          </View>
        </View>
      )}

      {/* 搜索建议 */}
      {suggestions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.warning[500]} />
            <Text style={styles.sectionTitle}>搜索建议</Text>
          </View>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `suggestion-${index}`}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginLeft: 6,
  },
  hotTagsContainer: {
    paddingHorizontal: 16,
  },
  hotTagsRow: {
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  hotTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 100,
  },
  hotBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.gray[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  hotBadgeTop: {
    backgroundColor: COLORS.error[500],
  },
  hotBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hotBadgeTextTop: {
    color: '#FFFFFF',
  },
  hotTagText: {
    fontSize: 13,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  suggestionContent: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
});

export default SearchSuggestions;

