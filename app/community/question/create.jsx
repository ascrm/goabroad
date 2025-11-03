/**
 * 提问题页面
 * 功能：标题 + 问题描述 + 标签选择 + 分区选择
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import CategoryPicker from '@/src/components/community/create/CategoryPicker';
import TagInput from '@/src/components/community/create/TagInput';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';

const DRAFT_KEY = 'community_question_draft';

export default function CreateQuestion() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useUserInfo();
  const titleInputRef = useRef(null);

  // 状态管理
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (title || description) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, description, category, tags]);

  // 自动聚焦
  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
  }, []);

  // 加载草稿
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        const data = JSON.parse(draft);
        Alert.alert('发现草稿', '是否恢复上次未完成的内容？', [
          { text: '删除', onPress: clearDraft, style: 'destructive' },
          {
            text: '恢复',
            onPress: () => {
              setTitle(data.title || '');
              setDescription(data.description || '');
              setCategory(data.category || null);
              setTags(data.tags || []);
            },
          },
        ]);
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    try {
      setIsSavingDraft(true);
      const draft = {
        title,
        description,
        category,
        tags,
        savedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('保存草稿失败:', error);
    } finally {
      setTimeout(() => setIsSavingDraft(false), 500);
    }
  };

  // 清除草稿
  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('清除草稿失败:', error);
    }
  };

  // 验证表单
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入问题标题');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('提示', '请详细描述你的问题');
      return false;
    }
    if (title.trim().length < 5) {
      Alert.alert('提示', '问题标题至少需要5个字符');
      return false;
    }
    if (description.trim().length < 10) {
      Alert.alert('提示', '问题描述至少需要10个字符');
      return false;
    }
    if (tags.length === 0) {
      Alert.alert('提示', '请至少添加一个标签，帮助他人更好地找到你的问题');
      return false;
    }
    return true;
  };

  // 发布问题
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      console.log('📤 [发布问题] 准备发布问题');

      const postData = {
        contentType: 'QUESTION', // 新API: QUESTION(提问题)
        title: title.trim(),
        content: description.trim(),
        status: 'PUBLISHED',
        category: category || tags[0] || '问答', // 新API: 使用category替代tags，取第一个tag作为分类
        mediaUrls: [], // 新API: 使用mediaUrls替代images和videos
        allowComment: true, // 新API: 是否允许评论
      };

      console.log('📤 [发布问题] 发布数据:', postData);

      const result = await dispatch(publishPost(postData)).unwrap();

      console.log('✅ [发布问题] 发布成功:', result);

      await clearDraft();

      Alert.alert('发布成功', '你的问题已成功发布，等待社区回答！', [
        {
          text: '返回',
          onPress: () => router.back(),
        },
        {
          text: '查看',
          onPress: () => {
            if (result?.id) {
              router.replace(`/community/post/${result.id}`);
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      console.error('❌ [发布问题] 发布失败:', error);

      let errorMessage = '发布失败，请重试';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      Alert.alert('发布失败', errorMessage, [{ text: '确定', style: 'cancel' }]);
    } finally {
      setIsPublishing(false);
    }
  };

  // 取消发布
  const handleCancel = () => {
    if (title || description) {
      Alert.alert('提示', '是否放弃当前编辑的内容？', [
        { text: '继续编辑', style: 'cancel' },
        {
          text: '放弃',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  };

  // 发布按钮可用性
  const canPublish = () => {
    return (
      !isPublishing &&
      title.trim().length >= 5 &&
      description.trim().length >= 10 &&
      tags.length > 0
    );
  };

  // 移除标签
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} hitSlop={12}>
            <Ionicons name="close" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>提问题</Text>

          <TouchableOpacity
            style={[styles.publishBtn, !canPublish() && styles.publishBtnDisabled]}
            onPress={handlePublish}
            disabled={!canPublish()}
          >
            {isPublishing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.publishText}>发布</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 主输入区 */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 提示卡片 */}
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#0284C7" />
            <Text style={styles.tipText}>提出清晰具体的问题，更容易获得有价值的回答</Text>
          </View>

          {/* 标题输入 */}
          <View style={styles.titleContainer}>
            <Text style={styles.label}>
              问题标题 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="例如：如何准备托福考试？需要多长时间？"
              placeholderTextColor={COLORS.gray[400]}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              autoFocus
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* 问题描述 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>
              问题描述 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="详细描述你的问题...&#10;&#10;可以包括：&#10;• 你的具体情况和背景&#10;• 遇到的具体问题&#10;• 已经尝试过的方法&#10;• 希望得到什么样的帮助"
              placeholderTextColor={COLORS.gray[400]}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 标签选择 - 必填提示 */}
          <View style={styles.tagsSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                添加标签 <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity onPress={() => setShowTagInput(!showTagInput)}>
                <Text style={styles.addTagBtn}>
                  {showTagInput ? '收起' : '添加'}
                </Text>
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={styles.selectedTags}>
                {tags.map((tag) => (
                  <TouchableOpacity key={tag} style={styles.tag} onPress={() => removeTag(tag)}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <Ionicons name="close" size={14} color="#0284C7" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {tags.length === 0 && (
              <Text style={styles.tagHint}>添加相关标签，让更多人看到你的问题</Text>
            )}
          </View>

          {/* 分区选择 */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>选择分区（可选）</Text>
            <TouchableOpacity
              style={styles.categoryBtn}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Ionicons name="grid-outline" size={20} color="#0284C7" />
              <Text style={styles.categoryBtnText}>
                {category || '选择一个分区'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            <View style={styles.progressInfo}>
              <Ionicons
                name={title.trim().length >= 5 ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={title.trim().length >= 5 ? '#10B981' : COLORS.gray[400]}
              />
              <Text style={styles.progressText}>标题</Text>
            </View>
            <View style={styles.progressInfo}>
              <Ionicons
                name={description.trim().length >= 10 ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={description.trim().length >= 10 ? '#10B981' : COLORS.gray[400]}
              />
              <Text style={styles.progressText}>描述</Text>
            </View>
            <View style={styles.progressInfo}>
              <Ionicons
                name={tags.length > 0 ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={tags.length > 0 ? '#10B981' : COLORS.gray[400]}
              />
              <Text style={styles.progressText}>标签</Text>
            </View>
          </View>

          <View style={styles.toolbarRight}>
            {isSavingDraft && <Text style={styles.savingText}>保存中...</Text>}
          </View>
        </View>

        {/* 标签输入 */}
        {showTagInput && (
          <View style={styles.tagInputContainer}>
            <View style={styles.tagInputHeader}>
              <Text style={styles.tagInputTitle}>添加标签</Text>
              <TouchableOpacity onPress={() => setShowTagInput(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray[600]} />
              </TouchableOpacity>
            </View>
            <TagInput tags={tags} onTagsChange={setTags} maxTags={5} />
          </View>
        )}

        {/* 分区选择器 Modal */}
        {showCategoryPicker && (
          <CategoryPicker
            visible={showCategoryPicker}
            selectedCategory={category}
            onSelect={(cat) => {
              setCategory(cat);
              setShowCategoryPicker(false);
            }}
            onClose={() => setShowCategoryPicker(false)}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  publishBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#0284C7',
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  publishBtnDisabled: {
    backgroundColor: COLORS.gray[300],
    opacity: 0.6,
  },
  publishText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },

  // 提示卡片
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#0284C7',
    lineHeight: 18,
  },

  // 标题输入
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.gray[900],
    lineHeight: 24,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.gray[400],
    textAlign: 'right',
  },

  // 问题描述
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  descriptionInput: {
    fontSize: 15,
    color: COLORS.gray[900],
    lineHeight: 22,
    minHeight: 200,
  },

  // 标签选择
  tagsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addTagBtn: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0284C7',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0284C7',
  },
  tagHint: {
    fontSize: 13,
    color: COLORS.gray[500],
    fontStyle: 'italic',
  },

  // 分区选择
  categorySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    gap: 8,
  },
  categoryBtnText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray[700],
  },

  // 底部工具栏
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingText: {
    fontSize: 11,
    color: COLORS.gray[500],
  },

  // 标签输入
  tagInputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
    padding: 16,
  },
  tagInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tagInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
});

