/**
 * Header 页面头部组件
 * 支持返回按钮、标题、操作按钮、搜索模式
 */

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  leftActions,
  rightActions,
  searchMode = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = '搜索...',
  transparent = false,
  style,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (searchMode) {
    return (
      <View style={[styles.header, transparent && styles.header_transparent, style]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChangeText={onSearchChange}
            autoFocus
          />
          {searchValue && (
            <TouchableOpacity onPress={() => onSearchChange && onSearchChange('')}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, transparent && styles.header_transparent, style]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
        )}
        {leftActions && <View style={styles.actions}>{leftActions}</View>}
      </View>

      <View style={styles.center}>
        {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>

      <View style={styles.right}>
        {rightActions && <View style={styles.actions}>{rightActions}</View>}
      </View>
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showBack: PropTypes.bool,
  onBack: PropTypes.func,
  leftActions: PropTypes.element,
  rightActions: PropTypes.element,
  searchMode: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  transparent: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 56,
  },
  header_transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default Header;

