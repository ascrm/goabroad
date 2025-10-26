/**
 * 国家列表页
 * 展示国家列表，支持筛选和收藏功能
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  CountryCard,
  CountryFilters,
} from '@/src/components/country';
import { COLORS } from '@/src/constants';

export default function CountriesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // 模拟数据 - 实际应该从 Redux 或 API 获取
  const [countries] = useState([
    {
      id: '1',
      code: 'US',
      flag: '🇺🇸',
      name: '美国',
      englishName: 'United States',
      description: '教育资源丰富 · 热门首选',
      rating: 5,
      difficulty: '高',
      cost: '高',
      costRange: '$50-80万/年',
      isHot: true,
      tags: ['留学热门', '工作友好'],
      isFavorite: false,
    },
    {
      id: '2',
      code: 'GB',
      flag: '🇬🇧',
      name: '英国',
      englishName: 'United Kingdom',
      description: '学制短 · 名校多',
      rating: 4,
      difficulty: '中',
      cost: '高',
      costRange: '£30-50万/年',
      isHot: true,
      tags: ['留学热门'],
      isFavorite: false,
    },
    {
      id: '3',
      code: 'CA',
      flag: '🇨🇦',
      name: '加拿大',
      englishName: 'Canada',
      description: '移民友好 · 费用适中',
      rating: 4,
      difficulty: '中',
      cost: '中',
      costRange: 'C$25-40万/年',
      isHot: true,
      tags: ['移民推荐', '工作友好'],
      isFavorite: false,
    },
    {
      id: '4',
      code: 'AU',
      flag: '🇦🇺',
      name: '澳大利亚',
      englishName: 'Australia',
      description: '环境优美 · 移民便利',
      rating: 4,
      difficulty: '中',
      cost: '高',
      costRange: 'A$30-45万/年',
      isHot: true,
      tags: ['移民推荐', '留学热门'],
      isFavorite: false,
    },
    {
      id: '5',
      code: 'DE',
      flag: '🇩🇪',
      name: '德国',
      englishName: 'Germany',
      description: '免学费 · 工科强',
      rating: 4,
      difficulty: '中',
      cost: '低',
      costRange: '€10-15万/年',
      isHot: false,
      tags: ['留学热门'],
      isFavorite: false,
    },
    {
      id: '6',
      code: 'JP',
      flag: '🇯🇵',
      name: '日本',
      englishName: 'Japan',
      description: '距离近 · 文化相似',
      rating: 3,
      difficulty: '中',
      cost: '中',
      costRange: '¥15-20万/年',
      isHot: false,
      tags: ['留学热门', '工作友好'],
      isFavorite: false,
    },
    {
      id: '7',
      code: 'SG',
      flag: '🇸🇬',
      name: '新加坡',
      englishName: 'Singapore',
      description: '华人多 · 安全稳定',
      rating: 4,
      difficulty: '高',
      cost: '高',
      costRange: 'S$25-35万/年',
      isHot: false,
      tags: ['留学热门', '工作友好'],
      isFavorite: false,
    },
    {
      id: '8',
      code: 'NZ',
      flag: '🇳🇿',
      name: '新西兰',
      englishName: 'New Zealand',
      description: '环境优美 · 生活舒适',
      rating: 3,
      difficulty: '中',
      cost: '中',
      costRange: 'NZ$20-30万/年',
      isHot: false,
      tags: ['移民推荐'],
      isFavorite: false,
    },
  ]);

  // 筛选数据
  const filteredCountries = countries.filter((country) => {
    // Tab 筛选
    if (activeFilter === 'hot') {
      return country.isHot;
    } else if (activeFilter === 'study') {
      return country.tags.includes('留学热门');
    } else if (activeFilter === 'work') {
      return country.tags.includes('工作友好');
    } else if (activeFilter === 'immigration') {
      return country.tags.includes('移民推荐');
    }

    return true;
  });

  // 热门推荐（前4个热门国家）
  const hotCountries = countries.filter((c) => c.isHot).slice(0, 4);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // 处理国家卡片点击
  const handleCountryPress = (country) => {
    console.log('打开国家详情:', country.name);
    router.push(`/country/${country.code}`);
  };

  // 处理收藏
  const handleFavorite = (countryId) => {
    console.log('收藏/取消收藏:', countryId);
    // TODO: 实现收藏功能
  };

  // 渲染国家卡片
  const renderCountryCard = ({ item }) => (
    <CountryCard
      country={item}
      onPress={() => handleCountryPress(item)}
      onFavorite={() => handleFavorite(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* 筛选 Tab */}
      <CountryFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* 国家列表 */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary[600]]}
            tintColor={COLORS.primary[600]}
          />
        }
        ListHeaderComponent={
          activeFilter === 'all' ? (
            <View style={styles.hotSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flame" size={20} color={COLORS.error[500]} />
                <Text style={styles.sectionTitle}>热门推荐</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hotList}
              >
                {hotCountries.map((country) => (
                  <View key={country.id} style={styles.hotCardWrapper}>
                    <CountryCard
                      country={country}
                      onPress={() => handleCountryPress(country)}
                      onFavorite={() => handleFavorite(country.id)}
                      compact
                    />
                  </View>
                ))}
              </ScrollView>
              <View style={styles.allCountriesHeader}>
                <Ionicons name="globe-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.allCountriesTitle}>全部国家</Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="earth-outline" size={64} color={COLORS.text.disabled} />
            <Text style={styles.emptyText}>未找到相关国家</Text>
            <Text style={styles.emptyHint}>试试其他筛选条件</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  listContent: {
    padding: 16,
  },
  hotSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  hotList: {
    gap: 12,
    paddingRight: 16,
  },
  hotCardWrapper: {
    width: 280,
  },
  allCountriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 12,
  },
  allCountriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginTop: 8,
  },
});

