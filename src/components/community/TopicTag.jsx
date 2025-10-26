/**
 * 话题标签组件
 * 显示话题标签，支持点击跳转到话题页
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '@/src/constants';

export default function TopicTag({ topic, size = 'medium', onPress }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(topic);
    } else {
      // 导航到话题页面
      router.push(`/community/topic/${topic.id}`);
    }
  };

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      icon: 12,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      icon: 14,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      icon: 16,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[styles.container, currentSize.container]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="pricetag" size={currentSize.icon} color={COLORS.primary[600]} />
      <Text style={[styles.text, currentSize.text]} numberOfLines={1}>
        {topic.name || topic}
      </Text>
      {topic.postCount && (
        <Text style={[styles.count, currentSize.text]}>
          {topic.postCount > 999 ? `${(topic.postCount / 1000).toFixed(1)}k` : topic.postCount}
        </Text>
      )}
    </TouchableOpacity>
  );
}

TopicTag.propTypes = {
  topic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      postCount: PropTypes.number,
    }),
  ]).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary[100],
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontWeight: '600',
    color: COLORS.primary[700],
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 15,
  },
  count: {
    fontWeight: '500',
    color: COLORS.primary[500],
    marginLeft: 2,
  },
});

