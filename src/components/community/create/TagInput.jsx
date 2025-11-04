/**
 * 标签输入组件（Modal形式）
 * 用于添加和管理帖子标签
 * 基于 create.jsx 中的 TagInputModal 实现
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { COLORS } from '@/src/constants';

// 热门标签推荐
const POPULAR_TAGS = [
  '留学', '签证', '托福', '雅思', 'GRE', 'GMAT',
  '美国', '英国', '加拿大', '澳洲', '新西兰',
  '申请', '文书', '推荐信', '面试', '选校'
];

export default function TagInput({ 
  visible = false, 
  onClose = () => {}, 
  onAddTag = () => {}, 
  currentTags = [],
  maxTags = 5
}) {
  const [tagInput, setTagInput] = useState('');

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  // 选择热门标签
  const handleSelectPopularTag = (tag) => {
    onAddTag(tag);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalKeyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.tagInputSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>添加标签</Text>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={24} color={COLORS.gray[700]} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.tagInputContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.tagInputRow}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="输入自定义标签"
                  placeholderTextColor={COLORS.gray[400]}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddTag}>
                  <Text style={styles.addBtnText}>添加</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>热门标签</Text>
              <View style={styles.popularTags}>
                {POPULAR_TAGS.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.popularTag,
                      currentTags.includes(tag) && styles.popularTagSelected
                    ]}
                    onPress={() => handleSelectPopularTag(tag)}
                    disabled={currentTags.includes(tag)}
                  >
                    <Text style={[
                      styles.popularTagText,
                      currentTags.includes(tag) && styles.popularTagTextSelected
                    ]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.tagHint}>
                已选择 {currentTags.length}/{maxTags} 个标签
              </Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalKeyboardView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  tagInputSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  tagInputContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  tagInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
    fontSize: 15,
    color: COLORS.gray[900],
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0284C7',
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  popularTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray[100],
    borderRadius: 16,
  },
  popularTagSelected: {
    backgroundColor: COLORS.gray[200],
    opacity: 0.5,
  },
  popularTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  popularTagTextSelected: {
    color: COLORS.gray[400],
  },
  tagHint: {
    fontSize: 12,
    color: COLORS.gray[500],
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
