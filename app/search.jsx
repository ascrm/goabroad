/**
 * 搜索页面
 * 支持全局搜索、历史记录、热门搜索、搜索结果展示
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SearchBar,
  SearchHistory,
  SearchResults,
  SearchSuggestions,
} from '@/src/components/search';
import { COLORS } from '@/src/constants';

const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 10;

// 模拟热门搜索数据
const MOCK_HOT_SEARCHES = [
  { keyword: '美国留学', count: 12890 },
  { keyword: '英国签证', count: 8934 },
  { keyword: '加拿大移民', count: 7821 },
  { keyword: '日本工作', count: 6543 },
  { keyword: '澳洲打工度假', count: 5432 },
  { keyword: '新加坡留学', count: 4321 },
];

// 模拟搜索结果数据
const MOCK_RESULTS = {
  countries: [
    {
      id: '1',
      name: '美国',
      flag: '🇺🇸',
      description: '世界上最发达的国家之一，拥有顶尖的教育资源和就业机会',
      tags: ['留学热门', '工作机会多', '移民难度大'],
    },
    {
      id: '2',
      name: '英国',
      flag: '🇬🇧',
      description: '历史悠久的教育强国，拥有牛津、剑桥等世界顶尖大学',
      tags: ['教育质量高', '文化底蕴深', '生活成本高'],
    },
  ],
  posts: [
    {
      id: '1',
      title: '2025年美国留学申请全攻略',
      excerpt: '从选校到签证，手把手教你如何申请美国大学...',
      author: '留学小助手',
      time: '2小时前',
      views: 1234,
      image: null,
    },
    {
      id: '2',
      title: '英国留学生活成本详解',
      excerpt: '在英国留学一年需要多少钱？住宿、饮食、交通费用全解析...',
      author: '海外生活',
      time: '5小时前',
      views: 856,
      image: 'https://picsum.photos/200/200',
    },
  ],
  qa: [
    {
      id: '1',
      title: '美国F1签证面试需要注意什么？',
      category: '签证问题',
      author: '张三',
      time: '1天前',
      answerCount: 5,
      hasAnswer: true,
    },
    {
      id: '2',
      title: '英国留学可以打工吗？每周可以工作多少小时？',
      category: '留学生活',
      author: '李四',
      time: '2天前',
      answerCount: 8,
      hasAnswer: true,
    },
  ],
};

const SearchPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // 加载搜索历史
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  const saveSearchHistory = async (keyword) => {
    try {
      // 移除重复项，将新搜索添加到开头
      const newHistory = [keyword, ...searchHistory.filter((item) => item !== keyword)].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  const deleteHistoryItem = async (keyword) => {
    try {
      const newHistory = searchHistory.filter((item) => item !== keyword);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('删除搜索历史失败:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('清空搜索历史失败:', error);
    }
  };

  // 防抖搜索建议
  const fetchSuggestions = useCallback(
    debounce(async (text) => {
      if (!text || text.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      // TODO: 替换为真实API调用
      // 模拟API请求延迟
      setTimeout(() => {
        const mockSuggestions = [
          { keyword: `${text}申请`, category: '留学' },
          { keyword: `${text}签证`, category: '签证' },
          { keyword: `${text}费用`, category: '生活' },
        ];
        setSuggestions(mockSuggestions);
      }, 300);
    }, 500),
    []
  );

  // 执行搜索
  const performSearch = async (keyword) => {
    if (!keyword || keyword.trim().length === 0) {
      return;
    }

    setIsSearching(true);
    setSearchText(keyword);
    setSuggestions([]);

    // 保存到搜索历史
    await saveSearchHistory(keyword);

    // TODO: 替换为真实API调用
    // 模拟API请求
    setTimeout(() => {
      setSearchResults(MOCK_RESULTS);
      setIsSearching(false);
    }, 500);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (text.trim().length > 0) {
      fetchSuggestions(text);
    } else {
      setSuggestions([]);
      setSearchResults(null);
    }
  };

  const handleSelectSuggestion = (keyword) => {
    performSearch(keyword);
  };

  const handleItemPress = (type, item) => {
    console.log('点击项:', type, item);
    // TODO: 根据类型跳转到对应详情页
    // if (type === 'country') router.push(`/country/${item.id}`);
    // if (type === 'post') router.push(`/community/post/${item.id}`);
    // if (type === 'qa') router.push(`/community/qa/${item.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // 判断是否显示搜索结果
  const showResults = searchResults !== null && !isSearching;
  // 判断是否显示建议/历史
  const showSuggestions = !showResults && searchText.trim().length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* 顶部搜索栏 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
          </TouchableOpacity>
          <SearchBar
            value={searchText}
            onChangeText={handleSearchTextChange}
            placeholder="🔍 搜索国家、签证、问题..."
            autoFocus
          />
          {searchText.trim().length > 0 && (
            <TouchableOpacity
              onPress={() => performSearch(searchText)}
              style={styles.searchButton}
              activeOpacity={0.7}
            >
              <Text style={styles.searchButtonText}>搜索</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 搜索结果 */}
        {showResults && (
          <SearchResults
            keyword={searchText}
            results={searchResults}
            onItemPress={handleItemPress}
            onLoadMore={() => console.log('加载更多')}
          />
        )}

        {/* 搜索建议和历史 */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {/* 搜索历史 */}
            <SearchHistory
              history={searchHistory}
              onSelectItem={handleSelectSuggestion}
              onDeleteItem={deleteHistoryItem}
              onClearAll={clearSearchHistory}
            />

            {/* 热门搜索和建议 */}
            <SearchSuggestions
              hotSearches={MOCK_HOT_SEARCHES}
              suggestions={suggestions}
              onSelectItem={handleSelectSuggestion}
            />
          </View>
        )}

        {/* 加载状态 */}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>搜索中...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary[600],
  },
  suggestionsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.gray[500],
  },
});

export default SearchPage;

