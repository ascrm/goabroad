/**
 * Emoji 选择器组件
 * 用于在发布内容时选择和插入 emoji
 */

import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// Emoji 分类数据
const EMOJI_CATEGORIES = [
  {
    name: '表情',
    key: 'smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
      '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
    ],
  },
  {
    name: '手势',
    key: 'gestures',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️',
      '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕',
      '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜',
      '👏', '🙌', '👐', '🤲', '🤝', '🙏',
    ],
  },
  {
    name: '活动',
    key: 'activities',
    emojis: [
      '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🎄', '🎃',
      '🎆', '🎇', '✨', '🎋', '🎍', '🎎', '🎏', '🎐',
      '🎑', '🧧', '🎗️', '🎟️', '🎫','❤️', '💔',
    ],
  },
  {
    name: '符号',
    key: 'symbols',
    emojis: [
      '⭐', '🌟', '✨', '💫', '💥', '💢', '💦', '💧',
      '💤', '💨', '👁️', '🗨️', '💬', '💭', '🗯️', '💡',
      '💰', '💵', '💴', '💶', '💷', '💸', '💳', '🔥',
    ],
  },
  {
    name: '自然',
    key: 'nature',
    emojis: [
      '🌍', '🌎', '🌏', '🌐', '🗺️', '🧭', '🏔️', '⛰️',
      '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🌅',
      '🌄', '🌠', '🌌', '🌉', '🌃', '🌆', '🌇', '🌁',
    ],
  },
  {
    name: '食物',
    key: 'food',
    emojis: [
      '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙',
      '🥗', '🍿', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚',
      '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥',
    ],
  },
  {
    name: '旅行',
    key: 'travel',
    emojis: [
      '✈️', '🛫', '🛬', '🚀', '🛸', '🚁', '🛶', '⛵',
      '🚤', '🛥️', '🛳️', '⛴️', '🚢', '🚂', '🚃', '🚄',
      '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞',
    ],
  },
];

export default function EmojiPicker({ visible, onSelectEmoji }) {
  // 键盘高度状态（默认值用于兜底）
  const [keyboardHeight, setKeyboardHeight] = useState(Platform.OS === 'ios' ? 270 : 280);

  // 监听键盘高度变化
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // 键盘隐藏时保持上次的高度
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // 选择 emoji - 不自动关闭面板，允许连续选择
  const handleSelectEmoji = (emoji) => {
    onSelectEmoji(emoji);
    // 不关闭面板，允许连续选择
  };

  // 如果不可见，不渲染组件
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { height: keyboardHeight }]}>
      {/* 所有分类和表情 */}
      <ScrollView 
        style={styles.emojiGrid} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {EMOJI_CATEGORIES.map((category) => (
          <View key={category.key}>
            {/* 分类标题 */}
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>

            {/* 该分类的表情网格 */}
            <View style={styles.emojiGridContent}>
              {category.emojis.map((emoji, index) => (
                <TouchableOpacity
                  key={`${emoji}-${index}`}
                  style={styles.emojiButton}
                  onPress={() => handleSelectEmoji(emoji)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    width: '100%',
  },
  emojiGrid: {
    flex: 1,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  categoryTitle: {
    fontSize: 12,
    color: COLORS.gray[400],
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emojiGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  emojiButton: {
    width: '12.5%', // 8 列
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
});

