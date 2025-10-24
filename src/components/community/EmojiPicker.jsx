/**
 * 简单的表情选择器
 * 替代 react-native-emoji-selector，避免兼容性问题
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 常用表情分类
const EMOJI_CATEGORIES = {
  smileys: {
    name: '笑脸',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
    ],
  },
  emotions: {
    name: '情感',
    icon: '❤️',
    emojis: [
      '🥺', '😳', '😔', '😟', '😕', '🙁', '😬', '😮',
      '😯', '😲', '😴', '🤤', '😪', '😵', '🤯', '🤠',
      '🥳', '😎', '🤓', '🧐', '😤', '😠', '😡', '🤬',
      '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺',
    ],
  },
  gestures: {
    name: '手势',
    icon: '👍',
    emojis: [
      '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️',
      '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇',
      '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪',
      '🙏', '✍️', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
    ],
  },
  hearts: {
    name: '爱心',
    icon: '💕',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '💌', '💋', '💍', '💎', '💐',
    ],
  },
  animals: {
    name: '动物',
    icon: '🐶',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
      '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅',
      '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛',
    ],
  },
  food: {
    name: '食物',
    icon: '🍕',
    emojis: [
      '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭',
      '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅',
      '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒',
      '🥬', '🥦', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖',
    ],
  },
  activities: {
    name: '活动',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
      '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
      '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊',
      '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿',
    ],
  },
  travel: {
    name: '旅行',
    icon: '✈️',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
      '🚒', '🚐', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼',
      '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍',
      '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞',
    ],
  },
};

export default function EmojiPicker({ onSelect, showHistory = true }) {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [recentEmojis, setRecentEmojis] = useState([
    '😊', '😂', '👍', '❤️', '🎉', '✨', '🙏', '👏',
  ]);

  // 选择表情
  const handleSelectEmoji = (emoji) => {
    // 更新最近使用
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 24);
    setRecentEmojis(newRecent);
    
    // 回调
    onSelect?.(emoji);
  };

  // 渲染分类标签
  const renderCategoryTabs = () => {
    const categories = ['recent', ...Object.keys(EMOJI_CATEGORIES)];
    
    return (
      <View style={styles.categoryTabs}>
        {categories.map((key) => {
          const isRecent = key === 'recent';
          const category = isRecent 
            ? { name: '最近', icon: '🕒' }
            : EMOJI_CATEGORIES[key];
          const isActive = selectedCategory === key;

          return (
            <TouchableOpacity
              key={key}
              style={[styles.categoryTab, isActive && styles.categoryTabActive]}
              onPress={() => setSelectedCategory(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // 渲染表情项
  const renderEmojiItem = ({ item }) => (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={() => handleSelectEmoji(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{item}</Text>
    </TouchableOpacity>
  );

  // 获取当前表情列表
  const getEmojis = () => {
    if (selectedCategory === 'recent') {
      return recentEmojis;
    }
    return EMOJI_CATEGORIES[selectedCategory]?.emojis || [];
  };

  return (
    <View style={styles.container}>
      {/* 分类标签 */}
      {renderCategoryTabs()}

      {/* 表情网格 */}
      <FlatList
        data={getEmojis()}
        renderItem={renderEmojiItem}
        keyExtractor={(item, index) => `${selectedCategory}-${index}`}
        numColumns={8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.emojiGrid}
      />
    </View>
  );
}

EmojiPicker.propTypes = {
  onSelect: PropTypes.func,
  showHistory: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    backgroundColor: COLORS.gray[50],
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryTabActive: {
    backgroundColor: COLORS.white,
  },
  categoryIcon: {
    fontSize: 20,
  },
  emojiGrid: {
    padding: 8,
  },
  emojiItem: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});

