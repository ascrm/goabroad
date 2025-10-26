/**
 * 个性化兴趣标签组件
 * 用户可以订阅感兴趣的标签
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const INTEREST_TAGS = [
  { id: '1', name: '美国留学', icon: '🇺🇸', subscribed: true },
  { id: '2', name: '英国留学', icon: '🇬🇧', subscribed: true },
  { id: '3', name: '签证攻略', icon: '📋', subscribed: false },
  { id: '4', name: '语言考试', icon: '📝', subscribed: true },
  { id: '5', name: '奖学金', icon: '💰', subscribed: false },
  { id: '6', name: '留学生活', icon: '🏠', subscribed: false },
  { id: '7', name: '工作移民', icon: '💼', subscribed: false },
  { id: '8', name: '院校推荐', icon: '🎓', subscribed: false },
];

const InterestTags = () => {
  const [tags, setTags] = useState(INTEREST_TAGS);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagPress = (tagId) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === tagId ? { ...tag, subscribed: !tag.subscribed } : tag
      )
    );
  };

  const displayedTags = isExpanded ? tags : tags.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏷️ 我的兴趣</Text>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.expandText}>
            {isExpanded ? '收起' : '展开'}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.gray[600]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {displayedTags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.tag,
              tag.subscribed && styles.tagSubscribed,
            ]}
            onPress={() => handleTagPress(tag.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tagIcon}>{tag.icon}</Text>
            <Text
              style={[
                styles.tagName,
                tag.subscribed && styles.tagNameSubscribed,
              ]}
            >
              {tag.name}
            </Text>
            {tag.subscribed && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.primary[600]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        💡 订阅标签后，将为你推荐更多相关内容
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandText: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    gap: 6,
  },
  tagSubscribed: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[200],
  },
  tagIcon: {
    fontSize: 14,
  },
  tagName: {
    fontSize: 13,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  tagNameSubscribed: {
    color: COLORS.primary[700],
  },
  hint: {
    fontSize: 12,
    color: COLORS.gray[500],
    lineHeight: 18,
  },
});

export default InterestTags;

