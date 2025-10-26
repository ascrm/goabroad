/**
 * 搜索栏组件
 * 首页顶部搜索入口
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const SearchBar = () => {
  const handleSearchPress = () => {
    router.push('/search');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handleSearchPress}
    >
      <Ionicons name="search" size={20} color={COLORS.gray[500]} />
      <Text style={styles.placeholder}>搜索国家、攻略、问题...</Text>
      <View style={styles.divider} />
      <Ionicons name="mic" size={20} color={COLORS.gray[500]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray[500],
    marginLeft: 10,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 12,
  },
});

export default SearchBar;

