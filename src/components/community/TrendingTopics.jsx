/**
 * 热门话题列表组件
 * 显示热门话题，支持横向滚动
 */

import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';
import TopicTag from './TopicTag';

// Mock 热门话题数据
const MOCK_TOPICS = [
  { id: '1', name: '美国留学', postCount: 12580, isHot: true },
  { id: '2', name: 'F1签证', postCount: 8920, isHot: true },
  { id: '3', name: '英国硕士', postCount: 7650 },
  { id: '4', name: '加拿大移民', postCount: 6430 },
  { id: '5', name: '雅思备考', postCount: 5890 },
  { id: '6', name: '澳洲WHV', postCount: 4320 },
  { id: '7', name: '留学生活', postCount: 3890 },
  { id: '8', name: '签证攻略', postCount: 3210 },
];

export default function TrendingTopics({ topics = MOCK_TOPICS, onTopicPress }) {
  if (!topics || topics.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame" size={18} color={COLORS.error[600]} />
        <Text style={styles.title}>热门话题</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topics.map((topic) => (
          <View key={topic.id} style={styles.topicItem}>
            <TopicTag topic={topic} size="medium" onPress={onTopicPress} />
            {topic.isHot && (
              <View style={styles.hotBadge}>
                <Ionicons name="flame" size={10} color={COLORS.white} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

TrendingTopics.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      postCount: PropTypes.number,
      isHot: PropTypes.bool,
    })
  ),
  onTopicPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  topicItem: {
    position: 'relative',
  },
  hotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

