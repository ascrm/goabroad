/**
 * 搜索框组件
 * 支持输入、清除、自动聚焦
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const SearchBar = ({ value, onChangeText, onFocus, onBlur, placeholder, autoFocus = false }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // 延迟聚焦，确保组件已挂载
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.gray[400]} style={styles.searchIcon} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder || '🔍 搜索国家、签证、问题...'}
        placeholderTextColor={COLORS.gray[400]}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray[900],
    padding: 0,
    margin: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default SearchBar;

