/**
 * 搜索结果组件
 * 支持分类展示（全部、国家、帖子、问答）
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'country', label: '国家' },
  { id: 'post', label: '帖子' },
  { id: 'qa', label: '问答' },
];

const SearchResults = ({ keyword, results = {}, onLoadMore, onItemPress }) => {
  const [activeTab, setActiveTab] = useState('all');

  // 高亮关键词
  const highlightKeyword = (text, keyword) => {
    if (!keyword || !text) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  // 渲染国家卡片
  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryCard}
      onPress={() => onItemPress?.('country', item)}
      activeOpacity={0.8}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{highlightKeyword(item.name, keyword)}</Text>
        <Text style={styles.countryDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.countryTags}>
          {item.tags?.map((tag, index) => (
            <View key={index} style={styles.countryTag}>
              <Text style={styles.countryTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
    </TouchableOpacity>
  );

  // 渲染帖子列表项
  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => onItemPress?.('post', item)}
      activeOpacity={0.8}
    >
      <View style={styles.postContent}>
        <Text style={styles.postTitle} numberOfLines={2}>
          {highlightKeyword(item.title, keyword)}
        </Text>
        <Text style={styles.postExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <View style={styles.postMeta}>
          <Text style={styles.postAuthor}>{item.author}</Text>
          <Text style={styles.postDot}>·</Text>
          <Text style={styles.postTime}>{item.time}</Text>
          <Text style={styles.postDot}>·</Text>
          <Ionicons name="eye-outline" size={12} color={COLORS.gray[400]} />
          <Text style={styles.postViews}>{item.views}</Text>
        </View>
      </View>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
      )}
    </TouchableOpacity>
  );

  // 渲染问答列表项
  const renderQAItem = ({ item }) => (
    <TouchableOpacity
      style={styles.qaItem}
      onPress={() => onItemPress?.('qa', item)}
      activeOpacity={0.8}
    >
      <View style={styles.qaHeader}>
        <View style={styles.qaTag}>
          <Text style={styles.qaTagText}>{item.category}</Text>
        </View>
        {item.hasAnswer && (
          <View style={styles.answerBadge}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success[500]} />
            <Text style={styles.answerBadgeText}>已解答</Text>
          </View>
        )}
      </View>
      <Text style={styles.qaTitle} numberOfLines={2}>
        {highlightKeyword(item.title, keyword)}
      </Text>
      <View style={styles.qaMeta}>
        <Text style={styles.qaAuthor}>{item.author}</Text>
        <Text style={styles.qaDot}>·</Text>
        <Text style={styles.qaTime}>{item.time}</Text>
        {item.answerCount > 0 && (
          <>
            <Text style={styles.qaDot}>·</Text>
            <Ionicons name="chatbubble-outline" size={12} color={COLORS.gray[400]} />
            <Text style={styles.qaAnswers}>{item.answerCount} 个回答</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={COLORS.gray[300]} />
      <Text style={styles.emptyTitle}>未找到相关结果</Text>
      <Text style={styles.emptyDesc}>试试其他关键词吧</Text>
    </View>
  );

  // 获取当前标签的数据
  const getCurrentData = () => {
    switch (activeTab) {
      case 'all':
        return [
          ...(results.countries || []).map((item) => ({ ...item, type: 'country' })),
          ...(results.posts || []).map((item) => ({ ...item, type: 'post' })),
          ...(results.qa || []).map((item) => ({ ...item, type: 'qa' })),
        ];
      case 'country':
        return results.countries || [];
      case 'post':
        return results.posts || [];
      case 'qa':
        return results.qa || [];
      default:
        return [];
    }
  };

  const data = getCurrentData();

  // 渲染混合列表项（全部标签）
  const renderMixedItem = ({ item }) => {
    if (activeTab === 'all') {
      switch (item.type) {
        case 'country':
          return renderCountryItem({ item });
        case 'post':
          return renderPostItem({ item });
        case 'qa':
          return renderQAItem({ item });
        default:
          return null;
      }
    }
    switch (activeTab) {
      case 'country':
        return renderCountryItem({ item });
      case 'post':
        return renderPostItem({ item });
      case 'qa':
        return renderQAItem({ item });
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab 切换 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 结果列表 */}
      <FlatList
        data={data}
        renderItem={renderMixedItem}
        keyExtractor={(item, index) => `${activeTab}-${index}`}
        ListEmptyComponent={renderEmpty}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={data.length === 0 ? styles.emptyList : styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.gray[50],
  },
  tabActive: {
    backgroundColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  highlight: {
    color: COLORS.primary[600],
    fontWeight: '700',
  },
  // 国家卡片样式
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryFlag: {
    fontSize: 40,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  countryDesc: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 8,
    lineHeight: 18,
  },
  countryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  countryTag: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  countryTagText: {
    fontSize: 11,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  // 帖子列表样式
  postItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postContent: {
    flex: 1,
    marginRight: 12,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 6,
    lineHeight: 21,
  },
  postExcerpt: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 8,
    lineHeight: 18,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  postDot: {
    fontSize: 12,
    color: COLORS.gray[300],
    marginHorizontal: 6,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  postViews: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  // 问答列表样式
  qaItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qaTag: {
    backgroundColor: COLORS.info[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  qaTagText: {
    fontSize: 11,
    color: COLORS.info[600],
    fontWeight: '500',
  },
  answerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerBadgeText: {
    fontSize: 11,
    color: COLORS.success[500],
    fontWeight: '500',
    marginLeft: 4,
  },
  qaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
    lineHeight: 21,
  },
  qaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qaAuthor: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  qaDot: {
    fontSize: 12,
    color: COLORS.gray[300],
    marginHorizontal: 6,
  },
  qaTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  qaAnswers: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  // 空状态样式
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[600],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.gray[400],
  },
});

export default SearchResults;

