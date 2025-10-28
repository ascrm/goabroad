/**
 * 发布帖子页面 - Twitter/X 风格
 * 简化发布流程，即点即用
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
import MediaPicker from '@/src/components/community/create/MediaPicker';
import TagInput from '@/src/components/community/create/TagInput';
import { Avatar } from '@/src/components/ui';
import { COLORS } from '@/src/constants';
import { uploadPostImages } from '@/src/services/api/modules/uploadApi';
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';

const DRAFT_KEY = 'community_post_draft';

export default function CreatePost() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useUserInfo();
  const contentInputRef = useRef(null);

  // 状态管理 - 简化
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState(null); // 可选
  const [tags, setTags] = useState([]); // 可选
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (content || images.length > 0 || video) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, images, video, category, tags]);

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
        Alert.alert('发现草稿', '是否恢复上次未完成的内容？', [
          { text: '删除', onPress: clearDraft, style: 'destructive' },
          {
            text: '恢复',
            onPress: () => {
              setContent(data.content || '');
              setImages(data.images || []);
              setVideo(data.video || null);
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
        content,
        images,
        video,
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

  // 验证表单 - 简化
  const validateForm = () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return false;
    }

    if (content.trim().length < 10) {
      Alert.alert('提示', '内容至少需要10个字符');
      return false;
    }

    return true;
  };

  // 上传图片
  const uploadImages = async () => {
    if (images.length === 0) return [];

    try {
      setIsUploading(true);
      setUploadProgress(0);

      console.log(`📤 [上传图片] 开始上传 ${images.length} 张图片`);

      // 过滤出需要上传的本地图片（没有 url 字段的）
      const localImages = images.filter((img) => !img.url && img.uri);

      if (localImages.length === 0) {
        // 所有图片都已上传
        return images.map((img) => img.url);
      }

      // 上传本地图片
      const uploadResults = await uploadPostImages(localImages, (progress) => {
        setUploadProgress(progress);
      });

      console.log('✅ [上传图片] 上传成功:', uploadResults);

      // 合并已上传的图片 URL 和新上传的图片 URL
      const uploadedUrls = uploadResults.map((result) => result.url);
      const existingUrls = images.filter((img) => img.url).map((img) => img.url);

      return [...existingUrls, ...uploadedUrls];
    } catch (error) {
      console.error('❌ [上传图片] 上传失败:', error);
      throw new Error('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 发布帖子
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      // 1. 先上传图片
      let imageUrls = [];
      if (images.length > 0) {
        console.log('📤 [发布流程] 步骤 1/2: 上传图片');
        imageUrls = await uploadImages();
      }

      // 2. 发布帖子
      console.log('📤 [发布流程] 步骤 2/2: 发布帖子');

      const postData = {
        contentType: 'POST', // API 使用 contentType
        content: content.trim(),
        status: 'PUBLISHED',
        images: imageUrls,
        videos: video ? [video.url || video.uri || video] : [],
        tags: tags,
        country: null, // 可选：根据需求添加
        stage: category || '综合讨论',
      };

      console.log('📤 [发布帖子] 准备发布:', postData);

      // 调用 Redux thunk 发布帖子
      const result = await dispatch(publishPost(postData)).unwrap();

      console.log('✅ [发布帖子] 发布成功:', result);

      // 清除草稿
      await clearDraft();

      // 显示成功提示
      Alert.alert('发布成功', '你的帖子已成功发布！', [
        {
          text: '返回',
          onPress: () => router.back(),
        },
        {
          text: '查看',
          onPress: () => {
            // 导航到帖子详情页
            if (result?.id) {
              router.replace(`/community/post/${result.id}`);
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch (error) {
      console.error('❌ [发布帖子] 发布失败:', error);

      // 解析错误信息
      let errorMessage = '发布失败，请重试';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      Alert.alert('发布失败', errorMessage, [
        { text: '确定', style: 'cancel' },
      ]);
    } finally {
      setIsPublishing(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 取消发布
  const handleCancel = () => {
    if (content || images.length > 0 || video) {
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

  // 智能发布按钮
  const canPublish = () => {
    return !isPublishing && content.trim().length >= 10;
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

        {/* 上传进度提示 */}
        {isUploading && (
          <View style={styles.uploadingBanner}>
            <ActivityIndicator size="small" color={COLORS.primary[600]} />
            <Text style={styles.uploadingText}>
              正在上传图片... {uploadProgress}%
            </Text>
          </View>
        )}

        {/* 主输入区 */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputContainer}>
            {/* 用户头像 */}
            <Avatar
              size={40}
              source={userInfo?.avatarUrl || userInfo?.avatar}
              name={userInfo?.nickname || userInfo?.username}
            />

            {/* 文本输入 */}
            <View style={styles.inputWrapper}>
              <TextInput
                ref={contentInputRef}
                style={styles.contentInput}
                placeholder="有什么新鲜事？分享你的出国经验..."
                placeholderTextColor={COLORS.gray[400]}
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={3000}
                autoFocus
                textAlignVertical="top"
              />
              {content.length > 0 && content.length < 10 && (
                <Text style={styles.minLengthHint}>
                  还需要 {10 - content.length} 个字符才能发布
                </Text>
              )}
            </View>
          </View>

          {/* 媒体选择器 - 图片 */}
          {!video && (
            <MediaPicker
              type="image"
              images={images}
              video={video}
              onImagesChange={setImages}
              onVideoChange={setVideo}
            />
          )}

          {/* 媒体选择器 - 视频 */}
          {!images.length && (
            <MediaPicker
              type="video"
              images={images}
              video={video}
              onImagesChange={setImages}
              onVideoChange={setVideo}
            />
          )}

          {/* 已选信息标签（折叠显示） */}
          {(category || tags.length > 0) && (
            <View style={styles.selectedInfo}>
              {category && (
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => setCategory(null)}
                >
                  <Ionicons name="grid" size={12} color={COLORS.primary[600]} />
                  <Text style={styles.chipText}>{category}</Text>
                  <Ionicons name="close" size={14} color={COLORS.primary[600]} />
                </TouchableOpacity>
              )}
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.chip}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.chipText}>#{tag}</Text>
                  <Ionicons name="close" size={14} color={COLORS.primary[600]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              onPress={() => setShowTagInput(!showTagInput)}
              style={styles.toolBtn}
            >
              <Ionicons
                name="pricetag-outline"
                size={22}
                color={COLORS.primary[600]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCategoryPicker(true)}
              style={styles.toolBtn}
            >
              <Ionicons name="grid-outline" size={22} color={COLORS.primary[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.toolbarRight}>
            {isSavingDraft && (
              <Text style={styles.savingText}>保存中...</Text>
            )}
            <View style={styles.charCount}>
              <Text
                style={[
                  styles.charCountText,
                  content.length > 2700 && styles.charCountWarning,
                  content.length >= 3000 && styles.charCountDanger,
                ]}
              >
                {content.length}/3000
              </Text>
            </View>
          </View>
        </View>

        {/* 标签输入（展开式） */}
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
  publishBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.primary[600],
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
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.gray[900],
    lineHeight: 22,
    minHeight: 100,
  },
  minLengthHint: {
    fontSize: 12,
    color: COLORS.warning[600],
    marginTop: 4,
    fontStyle: 'italic',
  },

  // 已选信息
  selectedInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary[600],
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
    gap: 20,
  },
  toolBtn: {
    padding: 4,
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
  charCount: {
    paddingHorizontal: 8,
  },
  charCountText: {
    fontSize: 13,
    color: COLORS.gray[500],
    fontVariant: ['tabular-nums'],
  },
  charCountWarning: {
    color: COLORS.warning[600],
  },
  charCountDanger: {
    color: COLORS.error[600],
    fontWeight: '600',
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

  // 上传进度
  uploadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary[200],
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
    color: COLORS.primary[700],
    fontWeight: '500',
  },
});
