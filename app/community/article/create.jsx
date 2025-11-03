/**
 * 写攻略页面
 * 功能：标题 + 正文编辑器（富文本） + 封面图 + 标签 + 分区
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
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

import CategoryPicker from '@/src/components/community/create/CategoryPicker';
import MediaPicker from '@/src/components/community/create/MediaPicker';
import TagInput from '@/src/components/community/create/TagInput';
import { COLORS } from '@/src/constants';
import { uploadPostImages } from '@/src/services/api/modules/uploadApi';
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';

const DRAFT_KEY = 'community_article_draft';

export default function CreateArticle() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useUserInfo();
  const titleInputRef = useRef(null);

  // 状态管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content, coverImage, category, tags]);

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
              setContent(data.content || '');
              setCoverImage(data.coverImage || null);
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
        content,
        coverImage,
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
      Alert.alert('提示', '请输入标题');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入正文');
      return false;
    }
    if (title.trim().length < 5) {
      Alert.alert('提示', '标题至少需要5个字符');
      return false;
    }
    if (content.trim().length < 20) {
      Alert.alert('提示', '正文至少需要20个字符');
      return false;
    }
    return true;
  };

  // 上传封面图
  const uploadCoverImage = async () => {
    if (!coverImage) return null;

    try {
      if (coverImage.url) return coverImage.url;

      console.log('📤 [上传封面] 开始上传封面图');
      const uploadResults = await uploadPostImages([coverImage]);
      const uploadedFiles = uploadResults?.data?.files || uploadResults?.files || [];
      
      if (uploadedFiles.length > 0) {
        console.log('✅ [上传封面] 上传成功');
        return uploadedFiles[0].url;
      }
      return null;
    } catch (error) {
      console.error('❌ [上传封面] 上传失败:', error);
      throw new Error('封面上传失败，请重试');
    }
  };

  // 发布攻略
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      // 上传封面图
      let coverUrl = null;
      if (coverImage) {
        console.log('📤 [发布流程] 步骤 1/2: 上传封面图');
        coverUrl = await uploadCoverImage();
      }

      // 发布攻略
      console.log('📤 [发布流程] 步骤 2/2: 发布攻略');

      const postData = {
        contentType: 'GUIDE', // 新API: GUIDE(写攻略)
        title: title.trim(),
        content: content.trim(),
        status: 'PUBLISHED',
        coverImage: coverUrl, // 新API: 封面图URL
        mediaUrls: [], // 新API: 使用mediaUrls替代images和videos
        category: category || tags[0] || '攻略', // 新API: 使用category替代tags
        allowComment: true, // 新API: 是否允许评论
      };

      console.log('📤 [发布攻略] 准备发布:', postData);

      const result = await dispatch(publishPost(postData)).unwrap();

      console.log('✅ [发布攻略] 发布成功:', result);

      await clearDraft();

      Alert.alert('发布成功', '你的攻略已成功发布！', [
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
      console.error('❌ [发布攻略] 发布失败:', error);

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
    if (title || content || coverImage) {
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
    return !isPublishing && title.trim().length >= 5 && content.trim().length >= 20;
  };

  // 移除标签
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 移除封面
  const removeCoverImage = () => {
    setCoverImage(null);
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

          <Text style={styles.headerTitle}>写攻略</Text>

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
          {/* 标题输入 */}
          <View style={styles.titleContainer}>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="输入攻略标题..."
              placeholderTextColor={COLORS.gray[400]}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              autoFocus
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* 封面图预览 */}
          {coverImage ? (
            <View style={styles.coverPreview}>
              <Image source={{ uri: coverImage.uri }} style={styles.coverImage} />
              <TouchableOpacity
                style={styles.removeCoverBtn}
                onPress={removeCoverImage}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addCoverBtn}
              onPress={() => setShowCoverPicker(true)}
            >
              <Ionicons name="image-outline" size={32} color={COLORS.gray[400]} />
              <Text style={styles.addCoverText}>添加封面图（可选）</Text>
            </TouchableOpacity>
          )}

          {/* 正文输入 */}
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="分享你的出国攻略和经验...&#10;&#10;可以包括：&#10;• 准备流程和时间线&#10;• 注意事项和避坑指南&#10;• 费用预算和节省技巧&#10;• 个人心得和建议"
              placeholderTextColor={COLORS.gray[400]}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 已选信息标签 */}
          {(category || tags.length > 0) && (
            <View style={styles.selectedInfo}>
              {category && (
                <TouchableOpacity style={styles.chip} onPress={() => setCategory(null)}>
                  <Ionicons name="grid" size={12} color={COLORS.success[600]} />
                  <Text style={styles.chipText}>{category}</Text>
                  <Ionicons name="close" size={14} color={COLORS.success[600]} />
                </TouchableOpacity>
              )}
              {tags.map((tag) => (
                <TouchableOpacity key={tag} style={styles.chip} onPress={() => removeTag(tag)}>
                  <Text style={styles.chipText}>#{tag}</Text>
                  <Ionicons name="close" size={14} color={COLORS.success[600]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            {/* 封面按钮 */}
            <TouchableOpacity
              onPress={() => setShowCoverPicker(true)}
              style={styles.toolBtn}
            >
              <Ionicons name="image-outline" size={22} color={COLORS.success[600]} />
              <Text style={styles.toolBtnText}>封面</Text>
            </TouchableOpacity>

            {/* 标签按钮 */}
            <TouchableOpacity
              onPress={() => setShowTagInput(!showTagInput)}
              style={styles.toolBtn}
            >
              <Ionicons name="pricetag-outline" size={22} color={COLORS.success[600]} />
              <Text style={styles.toolBtnText}>标签</Text>
            </TouchableOpacity>

            {/* 分区按钮 */}
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(true)}
              style={styles.toolBtn}
            >
              <Ionicons name="grid-outline" size={22} color={COLORS.success[600]} />
              <Text style={styles.toolBtnText}>分区</Text>
            </TouchableOpacity>
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

        {/* 封面选择器 Modal */}
        {showCoverPicker && (
          <MediaPicker
            type="image"
            images={coverImage ? [coverImage] : []}
            video={null}
            onImagesChange={(images) => setCoverImage(images[0] || null)}
            onVideoChange={() => {}}
            visible={showCoverPicker}
            onClose={() => setShowCoverPicker(false)}
            maxImages={1}
          />
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
    backgroundColor: COLORS.success[600],
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

  // 标题输入
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.gray[900],
    lineHeight: 28,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.gray[400],
    textAlign: 'right',
  },

  // 封面图
  coverPreview: {
    position: 'relative',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray[100],
  },
  removeCoverBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCoverBtn: {
    marginHorizontal: 16,
    marginVertical: 16,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCoverText: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 8,
  },

  // 正文输入
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.gray[900],
    lineHeight: 24,
    minHeight: 300,
  },

  // 已选信息
  selectedInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.success[600],
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
    gap: 4,
  },
  toolBtnText: {
    fontSize: 13,
    color: COLORS.success[600],
    fontWeight: '500',
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

