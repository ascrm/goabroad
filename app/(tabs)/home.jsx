/**
 * 资讯首页
 * 顶部提供“为你推荐 / 社区问答”标签切换
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import { useUserInfo } from '@/src/hooks/auth';

const RECOMMENDED_FEED = [
  {
    id: 'rec-1',
    title: '重磅：加拿大 EE 快速通道最新评分指南',
    summary: '评分公式、分值提升技巧以及 2025 年趋势拆解。',
    tag: '政策解读',
    minutes: 6,
    favorite: true,
  },
  {
    id: 'rec-2',
    title: '赴美留学预算清单（含换汇与生活费）',
    summary: '帮你分解学费、生活费、隐形成本三大块，一键规划预算。',
    tag: '财务规划',
    minutes: 8,
    favorite: false,
  },
  {
    id: 'rec-3',
    title: '一张图看懂海外求职签证类型',
    summary: '美国 H-1B、OPT，英国 Graduate Route，流程 & 时长一览。',
    tag: '求职攻略',
    minutes: 5,
    favorite: false,
  },
];

const COMMUNITY_QA = [
  {
    id: 'qa-1',
    question: 'GRE 写作 3.0 如何升到 4.0？',
    upvotes: 128,
    answerSnippet: '保持结构清晰 + 引用真实案例，复习期至少写 10 篇模考作文...',
    tags: ['考试经验', '美国留学'],
  },
  {
    id: 'qa-2',
    question: '加拿大工签过桥期间能否离境？',
    upvotes: 86,
    answerSnippet: '境外提交 BOWP 后，建议等待批复再返加，除非持有有效 TRV...',
    tags: ['签证政策', '加拿大'],
  },
  {
    id: 'qa-3',
    question: '英国租房押金一般是多少？',
    upvotes: 64,
    answerSnippet: '通常为 4-6 周房租，建议通过 Deposit Protection Scheme 托管...',
    tags: ['生活安家', '英国'],
  },
];

const TAB_OPTIONS = [
  { key: 'recommended', label: '为你推荐', icon: 'sparkles-outline' },
  { key: 'community', label: '社区问答', icon: 'chatbubbles-outline' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const userInfo = useUserInfo();
  const displayName = userInfo?.nickname || userInfo?.name || '旅行者';
  const [activeTab, setActiveTab] = useState('recommended');
  const insets = useSafeAreaInsets();

  const renderContent = useMemo(() => {
    if (activeTab === 'recommended') {
      return <RecommendedSection theme={theme} name={displayName} />;
    }
    return <CommunitySection theme={theme} />;
  }, [activeTab, theme, displayName]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.primary,
          paddingTop: insets.top,
        },
      ]}
    >
      <TopTabBar activeTab={activeTab} onChange={setActiveTab} theme={theme} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent}
      </ScrollView>
    </View>
  );
}

const TopTabBar = ({ activeTab, onChange, theme }) => (
  <View style={styles.topBar}>
    <View style={[styles.tabStrip, { borderBottomColor: theme.colors.border.light }]}>
      {TAB_OPTIONS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.stripButton}
            onPress={() => onChange(tab.key)}
          >
            <Text
              style={[
                styles.stripLabel,
                {
                  color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.stripIndicator,
                {
                  backgroundColor: theme.colors.text.primary,
                  opacity: isActive ? 1 : 0,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const RecommendedSection = ({ theme, name }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.heroCard}>
      <View>
        <Text style={styles.heroGreeting}>嗨，{name}</Text>
        <Text style={styles.heroTitle}>以下内容与您的海外计划最相关</Text>
      </View>
      <TouchableOpacity style={styles.heroButton}>
        <Text style={styles.heroButtonText}>刷新推荐</Text>
        <Ionicons name="refresh-outline" size={16} color="#2563EB" />
      </TouchableOpacity>
    </View>

    <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>热门精选</Text>
    <View style={styles.cardList}>
      {RECOMMENDED_FEED.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.feedCard, { backgroundColor: theme.colors.background.secondary }]}
        >
          <View style={styles.feedHeader}>
            <Text style={[styles.feedTag, { color: theme.colors.primary[600] }]}>{item.tag}</Text>
            <View style={styles.feedMeta}>
              <Ionicons name="time-outline" size={14} color={theme.colors.text.tertiary} />
              <Text style={[styles.feedMetaText, { color: theme.colors.text.tertiary }]}>
                {item.minutes} 分钟
              </Text>
            </View>
          </View>
          <Text style={[styles.feedTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
          <Text style={[styles.feedSummary, { color: theme.colors.text.secondary }]}>
            {item.summary}
          </Text>
          <View style={styles.feedFooter}>
            <TouchableOpacity style={styles.feedAction}>
              <Text style={[styles.feedActionText, { color: theme.colors.primary[600] }]}>
                查看全文
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary[600]} />
            </TouchableOpacity>
            <Ionicons
              name={item.favorite ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={theme.colors.primary[600]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const CommunitySection = ({ theme }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.communityHero}>
      <View>
        <Text style={styles.communityTitle}>社区问答实时更新</Text>
        <Text style={styles.communitySubtitle}>看看大家都在讨论什么</Text>
      </View>
      <TouchableOpacity style={styles.askButton}>
        <Ionicons name="create-outline" size={16} color="#FFFFFF" />
        <Text style={styles.askButtonText}>我要提问</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={COMMUNITY_QA}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.qaDivider} />}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.qaItem}>
          <View style={styles.qaHeader}>
            <View style={styles.qaVotes}>
              <Ionicons name="arrow-up" size={16} color="#10B981" />
              <Text style={styles.qaVotesText}>{item.upvotes}</Text>
            </View>
            <Text style={[styles.qaQuestion, { color: theme.colors.text.primary }]}>
              {item.question}
            </Text>
          </View>
          <Text style={[styles.qaAnswer, { color: theme.colors.text.secondary }]}>
            {item.answerSnippet}
          </Text>
          <View style={styles.qaTags}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.qaTag}>
                <Text style={styles.qaTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  tabStrip: {
    flexDirection: 'row',
  },
  stripButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  stripLabel: {
    fontSize: 16,
  },
  stripIndicator: {
    width: '45%',
    height: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionContainer: {
    gap: 20,
  },
  heroCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  heroGreeting: {
    fontSize: 14,
    color: '#4B5563',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  heroButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardList: {
    gap: 16,
  },
  feedCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  feedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedMetaText: {
    fontSize: 12,
  },
  feedTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  feedSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  communityHero: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#065F46',
  },
  communitySubtitle: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  qaDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  qaItem: {
    gap: 10,
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  qaVotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  qaVotesText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
  },
  qaQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  qaAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  qaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qaTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  qaTagText: {
    fontSize: 12,
    color: '#4B5563',
  },
});

