/**
 * 热门目的地推荐组件
 * 展示3个热门国家卡片
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const HotCountries = () => {
  const router = useRouter();

  // 热门国家数据
  const hotCountries = [
    {
      id: '1',
      name: '美国',
      flag: '🇺🇸',
      tag: '最受欢迎',
      tagColor: COLORS.error[500],
      description: '教育资源丰富，名校云集',
    },
    {
      id: '2',
      name: '英国',
      flag: '🇬🇧',
      tag: '教育质量',
      tagColor: COLORS.primary[600],
      description: '历史悠久，学制灵活',
    },
    {
      id: '3',
      name: '加拿大',
      flag: '🇨🇦',
      tag: '移民友好',
      tagColor: COLORS.success[500],
      description: '生活质量高，移民政策好',
    },
  ];

  const handleCountryPress = (country) => {
    console.log('查看国家详情:', country.name);
    // 跳转到国家详情页
    router.push(`/country/${country.id}`);
  };

  const renderCountryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.countryCard}
      onPress={() => handleCountryPress(item)}
      activeOpacity={0.7}
    >
      {/* 国旗 */}
      <Text style={styles.flag}>{item.flag}</Text>

      {/* 国家名称 */}
      <Text style={styles.countryName}>{item.name}</Text>

      {/* 标签 */}
      <View style={[styles.tag, { backgroundColor: `${item.tagColor}15` }]}>
        <Text style={[styles.tagText, { color: item.tagColor }]}>
          {item.tag}
        </Text>
      </View>

      {/* 描述 */}
      <Text style={styles.description}>{item.description}</Text>

      {/* 查看更多箭头 */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={16} color={COLORS.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>🌍 热门目的地</Text>
        <TouchableOpacity onPress={() => console.log('查看更多国家')}>
          <Text style={styles.moreText}>更多</Text>
        </TouchableOpacity>
      </View>

      {/* 国家卡片列表 */}
      <FlatList
        data={hotCountries}
        renderItem={renderCountryCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={180}
        decelerationRate="fast"
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
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  moreText: {
    fontSize: 14,
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  countryCard: {
    width: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    // 阴影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flag: {
    fontSize: 40,
    marginBottom: 12,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: COLORS.gray[600],
    lineHeight: 18,
    marginBottom: 8,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
  },
});

export default HotCountries;

