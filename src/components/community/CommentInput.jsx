/**
 * 评论输入框组件
 * 固定在底部，支持表情选择
 */

import { COLORS } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import EmojiPicker from './EmojiPicker';

export default function CommentInput({ 
  placeholder = '说说你的想法...', 
  replyTo = null,
  onSubmit,
  onCancel,
}) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);

  // 提交评论
  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit?.(text.trim(), replyTo);
      setText('');
      setShowEmoji(false);
      Keyboard.dismiss();
    }
  };

  // 取消回复
  const handleCancel = () => {
    setText('');
    setShowEmoji(false);
    onCancel?.();
    Keyboard.dismiss();
  };

  // 选择表情
  const handleEmojiSelect = (emoji) => {
    setText(text + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  // 切换表情选择器
  const toggleEmoji = () => {
    if (showEmoji) {
      setShowEmoji(false);
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setTimeout(() => setShowEmoji(true), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 表情选择器 */}
      {showEmoji && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          showHistory={true}
        />
      )}

      {/* 输入栏 */}
      <View style={styles.container}>
        {/* 回复提示 */}
        {replyTo && (
          <View style={styles.replyBanner}>
            <Ionicons name="return-down-forward" size={14} color={COLORS.text.tertiary} />
            <Text style={styles.replyText}>回复 @{replyTo.userName}</Text>
            <Pressable onPress={handleCancel} hitSlop={8}>
              <Ionicons name="close" size={16} color={COLORS.text.tertiary} />
            </Pressable>
          </View>
        )}

        {/* 输入框 */}
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={replyTo ? `回复 @${replyTo.userName}` : placeholder}
            placeholderTextColor={COLORS.text.placeholder}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
            onFocus={() => setShowEmoji(false)}
          />

          {/* 表情按钮 */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleEmoji}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showEmoji ? 'close-circle' : 'happy-outline'}
              size={24}
              color={showEmoji ? COLORS.primary[500] : COLORS.text.tertiary}
            />
          </TouchableOpacity>

          {/* 发送按钮 */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              text.trim() && styles.sendButtonActive,
            ]}
            onPress={handleSubmit}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={text.trim() ? COLORS.white : COLORS.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

CommentInput.propTypes = {
  placeholder: PropTypes.string,
  replyTo: PropTypes.shape({
    commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userName: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  replyText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: COLORS.gray[100],
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 15,
    color: COLORS.text.primary,
    marginRight: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
});

