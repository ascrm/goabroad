/**
 * 搜索历史组件
 * 显示最近搜索记录，支持删除、清空
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const SearchHistory = ({ history = [], onSelectItem, onDeleteItem, onClearAll }) => {
  if (history.length === 0) {
    return null;
  }

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => onSelectItem(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="time-outline" size={18} color={COLORS.gray[400]} />
        <Text style={styles.historyText} numberOfLines={1}>
          {item}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteItem(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={18} color={COLORS.gray[400]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>搜索历史</Text>
        <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
          <Text style={styles.clearText}>清空</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  clearText: {
    fontSize: 14,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 15,
    color: COLORS.gray[700],
    marginLeft: 12,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchHistory;

