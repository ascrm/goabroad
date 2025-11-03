/**
 * 写回答页面
 * 功能：问题卡片展示 + 回答输入 + 图片上传（可选）
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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

import MediaPicker from '@/src/components/community/create/MediaPicker';
import { COLORS } from '@/src/constants';
import { uploadPostImages } from '@/src/services/api/modules/uploadApi';
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';

const DRAFT_KEY_PREFIX = 'community_answer_draft_';

export default function CreateAnswer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useUserInfo();
  const params = useLocalSearchParams();
  const contentInputRef = useRef(null);

  // 从路由参数获取问题信息
  const questionId = params.questionId;
  const questionTitle = params.questionTitle || '问题加载中...';
  const questionContent = params.questionContent || '';

  // 状态管理
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const DRAFT_KEY = DRAFT_KEY_PREFIX + questionId;

  // 从草稿恢复
  useEffect(() => {
    if (questionId) {
      loadDraft();
    }
  }, [questionId]);

  // 自动保存草稿
  useEffect(() => {
    if (content && questionId) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, images, questionId]);

  // 自动聚焦
  useEffect(() => {
    setTimeout(() => {
      contentInputRef.current?.focus();
    }, 300);
  }, []);

  // 加载草稿
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        const data = JSON.parse(draft);
        Alert.alert('发现草稿', '是否恢复上次未完成的回答？', [
          { text: '删除', onPress: clearDraft, style: 'destructive' },
          {
            text: '恢复',
            onPress: () => {
              setContent(data.content || '');
              setImages(data.images || []);
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
        content,
        images,
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
    if (!questionId) {
      Alert.alert('错误', '缺少问题信息，无法发布回答');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入你的回答');
      return false;
    }
    if (content.trim().length < 10) {
      Alert.alert('提示', '回答内容至少需要10个字符');
      return false;
    }
    return true;
  };

  // 上传图片
  const uploadImages = async () => {
    if (images.length === 0) return [];

    try {
      console.log(`📤 [上传图片] 开始上传 ${images.length} 张图片`);

      const localImages = images.filter((img) => !img.url && img.uri);

      if (localImages.length === 0) {
        return images.map((img) => img.url);
      }

      const uploadResults = await uploadPostImages(localImages);
      console.log('✅ [上传图片] 上传成功:', uploadResults);

      const uploadedFiles = uploadResults?.data?.files || uploadResults?.files || [];
      const uploadedUrls = uploadedFiles.map((result) => result.url);
      const existingUrls = images.filter((img) => img.url).map((img) => img.url);

      return [...existingUrls, ...uploadedUrls];
    } catch (error) {
      console.error('❌ [上传图片] 上传失败:', error);
      throw new Error('图片上传失败，请重试');
    }
  };

  // 发布回答
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      // 上传图片
      let imageUrls = [];
      if (images.length > 0) {
        console.log('📤 [发布流程] 步骤 1/2: 上传图片');
        imageUrls = await uploadImages();
      }

      // 发布回答
      console.log('📤 [发布流程] 步骤 2/2: 发布回答');

      const answerData = {
        contentType: 'ANSWER', // 新API: ANSWER(写答案)
        content: content.trim(),
        status: 'PUBLISHED',
        mediaUrls: imageUrls, // 新API: 使用mediaUrls替代images和videos
        category: '问答', // 新API: 分类
        allowComment: true, // 新API: 是否允许评论
        // TODO: 后续需要关联到问题ID (parentId: questionId)
      };

      console.log('📤 [发布回答] 发布数据:', answerData);

      const result = await dispatch(publishPost(answerData)).unwrap();

      console.log('✅ [发布回答] 发布成功:', result);

      await clearDraft();

      Alert.alert('发布成功', '你的回答已成功发布！', [
        {
          text: '返回',
          onPress: () => router.back(),
        },
        {
          text: '查看',
          onPress: () => {
            // 返回到问题详情页
            router.replace(`/community/post/${questionId}`);
          },
        },
      ]);
    } catch (error) {
      console.error('❌ [发布回答] 发布失败:', error);

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
    if (content || images.length > 0) {
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
    return !isPublishing && content.trim().length >= 10;
  };

  // 移除图片
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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

          <Text style={styles.headerTitle}>写回答</Text>

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
          {/* 问题卡片 */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Ionicons name="help-circle" size={20} color="#7C3AED" />
              <Text style={styles.questionLabel}>回答问题</Text>
            </View>
            <Text style={styles.questionTitle}>{questionTitle}</Text>
            {questionContent && (
              <Text style={styles.questionContent} numberOfLines={3}>
                {questionContent}
              </Text>
            )}
          </View>

          {/* 提示卡片 */}
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={18} color="#7C3AED" />
            <Text style={styles.tipText}>提供详细、有价值的回答，帮助提问者解决问题</Text>
          </View>

          {/* 回答输入 */}
          <View style={styles.answerContainer}>
            <Text style={styles.label}>你的回答</Text>
            <TextInput
              ref={contentInputRef}
              style={styles.answerInput}
              placeholder="分享你的经验和建议...&#10;&#10;可以包括：&#10;• 具体的解决方案和步骤&#10;• 相关的经验和案例&#10;• 实用的建议和注意事项&#10;• 相关资源和参考链接"
              placeholderTextColor={COLORS.gray[400]}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </View>

          {/* 图片预览 */}
          {images.length > 0 && (
            <View style={styles.mediaPreview}>
              <Text style={styles.previewLabel}>图片预览</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreviewItem}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreviewThumb} />
                    <TouchableOpacity
                      style={styles.removeMediaBtn}
                      onPress={() => removeImage(index)}
                      hitSlop={8}
                    >
                      <Ionicons name="close-circle" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            {/* 图片按钮 */}
            <TouchableOpacity onPress={() => setShowImagePicker(true)} style={styles.toolBtn}>
              <Ionicons name="image-outline" size={22} color="#7C3AED" />
              <Text style={styles.toolBtnText}>添加图片</Text>
            </TouchableOpacity>

            {/* 字数统计 */}
            <View style={styles.wordCount}>
              <Text
                style={[
                  styles.wordCountText,
                  content.trim().length >= 10 && styles.wordCountValid,
                ]}
              >
                {content.trim().length} / 最少10字
              </Text>
            </View>
          </View>

          <View style={styles.toolbarRight}>
            {isSavingDraft && <Text style={styles.savingText}>保存中...</Text>}
          </View>
        </View>

        {/* 图片选择器 Modal */}
        {showImagePicker && (
          <MediaPicker
            type="image"
            images={images}
            video={null}
            onImagesChange={setImages}
            onVideoChange={() => {}}
            visible={showImagePicker}
            onClose={() => setShowImagePicker(false)}
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
    backgroundColor: '#7C3AED',
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

  // 问题卡片
  questionCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
    textTransform: 'uppercase',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 22,
    marginBottom: 8,
  },
  questionContent: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
  },

  // 提示卡片
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#7C3AED',
    lineHeight: 18,
  },

  // 回答输入
  answerContainer: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  answerInput: {
    fontSize: 15,
    color: COLORS.gray[900],
    lineHeight: 22,
    minHeight: 300,
  },

  // 图片预览
  mediaPreview: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  imagePreviewItem: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreviewThumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  removeMediaBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 24,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtnText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  wordCount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
  },
  wordCountText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  wordCountValid: {
    color: '#10B981',
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
});

