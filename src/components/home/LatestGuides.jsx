/**
 * 最新攻略列表组件
 * 展示最新的留学攻略文章
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const LatestGuides = () => {
  // 最新攻略数据（模拟数据）
  const guides = [
    {
      id: '1',
      title: '2025年美国留学申请时间规划完整指南',
      source: '留学之家',
      time: '2小时前',
      category: '申请攻略',
      readCount: 1234,
    },
    {
      id: '2',
      title: '英国留学签证材料清单及注意事项',
      source: '签证通',
      time: '5小时前',
      category: '签证指南',
      readCount: 856,
    },
    {
      id: '3',
      title: '加拿大留学生活成本分析：多伦多vs温哥华',
      source: '海外生活',
      time: '1天前',
      category: '生活指南',
      readCount: 2341,
    },
    {
      id: '4',
      title: '如何准备一份出色的个人陈述（PS）',
      source: '申请宝典',
      time: '1天前',
      category: '文书准备',
      readCount: 1678,
    },
    {
      id: '5',
      title: '澳洲八大名校申请要求及录取率分析',
      source: '名校榜',
      time: '2天前',
      category: '院校资讯',
      readCount: 987,
    },
  ];

  const handleGuidePress = (guide) => {
    console.log('查看攻略:', guide.title);
    // TODO: 跳转到攻略详情页
    // router.push(`/guides/${guide.id}`);
  };

  const handleSeeAll = () => {
    console.log('查看全部攻略');
    // TODO: 跳转到攻略列表页
    // router.push('/guides');
  };

  const renderGuideItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.guideItem,
        index === guides.length - 1 && styles.lastGuideItem,
      ]}
      onPress={() => handleGuidePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.guideContent}>
        {/* 标题 */}
        <Text style={styles.guideTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* 元信息 */}
        <View style={styles.guideMeta}>
          {/* 分类标签 */}
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          {/* 来源和时间 */}
          <View style={styles.sourceInfo}>
            <Ionicons name="document-text-outline" size={14} color={COLORS.gray[400]} />
            <Text style={styles.sourceText}>{item.source}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>

        {/* 阅读量 */}
        <View style={styles.readInfo}>
          <Ionicons name="eye-outline" size={14} color={COLORS.gray[400]} />
          <Text style={styles.readText}>{formatReadCount(item.readCount)} 阅读</Text>
        </View>
      </View>

      {/* 右侧箭头 */}
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray[300]} />
    </TouchableOpacity>
  );

  // 格式化阅读量
  const formatReadCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 最新攻略</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.moreText}>查看全部</Text>
        </TouchableOpacity>
      </View>

      {/* 攻略列表 */}
      <View style={styles.listContainer}>
        <FlatList
          data={guides}
          renderItem={renderGuideItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    // 阴影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  lastGuideItem: {
    borderBottomWidth: 0,
  },
  guideContent: {
    flex: 1,
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 22,
    marginBottom: 8,
  },
  guideMeta: {
    marginBottom: 6,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 6,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray[400],
  },
  readInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readText: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginLeft: 4,
  },
});

export default LatestGuides;

