/**
 * 步骤1：选择目标国家
 * 支持搜索、网格展示、单选模式
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 国家列表数据
const COUNTRIES = [
  { id: 'US', name: '美国', flag: '🇺🇸', region: 'north_america', popular: true },
  { id: 'UK', name: '英国', flag: '🇬🇧', region: 'europe', popular: true },
  { id: 'CA', name: '加拿大', flag: '🇨🇦', region: 'north_america', popular: true },
  { id: 'AU', name: '澳大利亚', flag: '🇦🇺', region: 'oceania', popular: true },
  { id: 'DE', name: '德国', flag: '🇩🇪', region: 'europe', popular: true },
  { id: 'FR', name: '法国', flag: '🇫🇷', region: 'europe', popular: false },
  { id: 'JP', name: '日本', flag: '🇯🇵', region: 'asia', popular: true },
  { id: 'KR', name: '韩国', flag: '🇰🇷', region: 'asia', popular: false },
  { id: 'SG', name: '新加坡', flag: '🇸🇬', region: 'asia', popular: true },
  { id: 'NZ', name: '新西兰', flag: '🇳🇿', region: 'oceania', popular: false },
  { id: 'NL', name: '荷兰', flag: '🇳🇱', region: 'europe', popular: false },
  { id: 'SE', name: '瑞典', flag: '🇸🇪', region: 'europe', popular: false },
  { id: 'CH', name: '瑞士', flag: '🇨🇭', region: 'europe', popular: false },
  { id: 'IT', name: '意大利', flag: '🇮🇹', region: 'europe', popular: false },
  { id: 'ES', name: '西班牙', flag: '🇪🇸', region: 'europe', popular: false },
  { id: 'IE', name: '爱尔兰', flag: '🇮🇪', region: 'europe', popular: false },
];

export default function Step1SelectCountry({ data, onNext, onBack, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(data?.country || null);

  // 过滤国家列表
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }
    
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 热门国家
  const popularCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.popular);
  }, []);

  // 选择国家
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    // 自动进入下一步
    setTimeout(() => {
      onNext({ country });
    }, 300);
  };

  // 渲染国家卡片
  const renderCountryCard = ({ item }) => {
    const isSelected = selectedCountry?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.countryCard, isSelected && styles.countryCardSelected]}
        onPress={() => handleSelectCountry(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={[styles.countryName, isSelected && styles.countryNameSelected]}>
          {item.name}
        </Text>
        
        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary[600]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>🌍</Text>
          <Text style={styles.title}>选择目标国家</Text>
          <Text style={styles.subtitle}>你计划去哪个国家？</Text>
        </View>

        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={COLORS.gray[400]} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索国家名称..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray[400]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* 热门国家 */}
        {!searchQuery && (
          <>
            <Text style={styles.sectionTitle}>🔥 热门国家</Text>
            <FlatList
              data={popularCountries}
              renderItem={renderCountryCard}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.gridContainer}
            />
          </>
        )}

        {/* 全部国家 */}
        <Text style={styles.sectionTitle}>
          {searchQuery ? '搜索结果' : '全部国家'}
        </Text>
        
        {filteredCountries.length > 0 ? (
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryCard}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={COLORS.gray[300]} />
            <Text style={styles.emptyText}>没有找到相关国家</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray[900],
  },
  clearButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginHorizontal: 20,
    marginBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countryCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 20,
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  countryCardSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  flag: {
    fontSize: 40,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  countryNameSelected: {
    color: COLORS.primary[600],
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
    marginTop: 12,
  },
});

