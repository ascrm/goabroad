/**
 * 写攻略页面 - 重构版
 * 功能：标题 + 富文本编辑器（支持图文混排） + 标签 + 富文本工具栏
 * 特性：
 *  - 图文混排：图片直接插入编辑器中
 *  - 富文本格式：标题、加粗、列表、引用等
 *  - 自动草稿保存
 *  - 图片即时上传
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import RichTextEditor from '@/src/components/community/create/RichTextEditor';
import RichTextToolbar from '@/src/components/community/create/RichTextToolbar';
import TagInput from '@/src/components/community/create/TagInput';
import EditorToolbar from '@/src/components/tools/EditorToolbar';
import { UploadProgress } from '@/src/components/ui';
import { COLORS } from '@/src/constants';
import { uploadPostImage } from '@/src/services/api/modules/uploadApi';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';
import { hideUploadProgress, showUploadProgress } from '@/src/store/slices/uiSlice';

const DRAFT_KEY = 'community_article_draft';

export default function CreateArticle() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Refs
  const titleInputRef = useRef(null);
  const editorRef = useRef(null);
  const scrollViewRef = useRef(null);
  const bottomMarginAnim = useRef(new Animated.Value(0)).current;

  // Redux state
  const uploadState = useAppSelector((state) => state.ui.upload);
  const isUploading = uploadState.isVisible && uploadState.status === 'uploading';

  // Local state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showRichToolbar, setShowRichToolbar] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [richToolbarHeight, setRichToolbarHeight] = useState(0);

  // ==================== 生命周期 ====================

  // 初始化：加载草稿、自动聚焦
  useEffect(() => {
    loadDraft();
    setTimeout(() => titleInputRef.current?.focus(), 300);
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(saveDraft, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content, tags]);

  // 富文本工具栏显示动画
  useEffect(() => {
    Animated.timing(bottomMarginAnim, {
      toValue: showRichToolbar ? richToolbarHeight : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [showRichToolbar, richToolbarHeight]);

  // 键盘监听（仅 iOS）
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const showListener = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height - 40);
    });
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // ==================== 草稿管理 ====================

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
              setTags(data.tags || []);
            },
          },
        ]);
      }
    } catch (error) {
      console.error('❌ 加载草稿失败:', error);
    }
  };

  const saveDraft = async () => {
    try {
      setIsSavingDraft(true);
      const draft = { title, content, tags, savedAt: new Date().toISOString() };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('❌ 保存草稿失败:', error);
    } finally {
      setTimeout(() => setIsSavingDraft(false), 500);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('❌ 清除草稿失败:', error);
    }
  };

  // ==================== 图片上传 ====================

  const requestPermissions = async () => {
    const [cameraPermission, mediaPermission] = await Promise.all([
      ImagePicker.requestCameraPermissionsAsync(),
      ImagePicker.requestMediaLibraryPermissionsAsync(),
    ]);

    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('权限不足', '需要相机和相册权限才能上传图片');
      return false;
    }
    return true;
  };

  const uploadAndInsertImage = useCallback(async (imageAsset) => {
    try {
      editorRef.current?.blur();
      Keyboard.dismiss();
      dispatch(showUploadProgress({
        status: 'uploading',
        message: '图片上传中...',
        progress: 0,
      }));

      const file = {
        uri: imageAsset.uri,
        name: imageAsset.fileName || imageAsset.uri.split('/').pop(),
        type: imageAsset.mimeType || 'image/jpeg',
      };

      const result = await uploadPostImage(file);
      const imageUrl = result.data;

      dispatch(showUploadProgress({
        status: 'success',
        message: '上传成功',
        progress: 100,
      }));

      // 插入到富文本编辑器
      editorRef.current?.insertImage(imageUrl);
        editorRef.current?.insertHTML('<p><br></p>');
        editorRef.current?.focus();
      setTimeout(() => {

        dispatch(hideUploadProgress())
      }, 1000);
      return true;
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      dispatch(showUploadProgress({
        status: 'error',
        message: '上传失败',
        progress: 0,
      }));
      setTimeout(() => dispatch(hideUploadProgress()), 2000);
      return false;
    }
  }, [dispatch]);

  const handleTakePhoto = async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      await uploadAndInsertImage(result.assets[0]);
    }
  };

  const handlePickImages = async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      for (const asset of result.assets) {
        const success = await uploadAndInsertImage(asset);
        if (!success && result.assets.indexOf(asset) < result.assets.length - 1) {
          const shouldContinue = await new Promise((resolve) => {
            Alert.alert('上传失败', '是否继续上传剩余图片？', [
              { text: '取消', onPress: () => resolve(false), style: 'cancel' },
              { text: '继续', onPress: () => resolve(true) },
            ]);
          });
          if (!shouldContinue) break;
        }
      }
    }
  };

  // ==================== 发布逻辑 ====================

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

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      const postData = {
        contentType: 'GUIDE',
        title: title.trim(),
        content: content.trim(),
        status: 'PUBLISHED',
        category: tags[0] || '攻略',
        tags: tags,
        allowComment: true,
      };

      const result = await dispatch(publishPost(postData)).unwrap();
      await clearDraft();

      Alert.alert('发布成功', '你的攻略已成功发布！', [
        { text: '返回', onPress: () => router.back() },
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
      console.error('❌ 发布失败:', error);
      const errorMessage = error?.message || error?.data?.message || '发布失败，请重试';
      Alert.alert('发布失败', errorMessage, [{ text: '确定', style: 'cancel' }]);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    if (title || content || tags.length > 0) {
      Alert.alert('提示', '是否放弃当前编辑的内容？', [
        { text: '继续编辑', style: 'cancel' },
        { text: '放弃', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  // ==================== 辅助方法 ====================

  const canPublish = () => {
    return !isPublishing && title.trim().length >= 5 && content.trim().length >= 20;
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTitleFocus = () => {
    if (showRichToolbar) setShowRichToolbar(false);
  };

  const handleEditorFocus = () => {
    if (showRichToolbar) setShowRichToolbar(false);
  };

  const handleToggleRichToolbar = () => {
    editorRef.current?.blur();
    Keyboard.dismiss();
    setShowRichToolbar(!showRichToolbar);
  };

  // ==================== 渲染 ====================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.keyboardView, { paddingBottom: keyboardHeight }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>攻略</Text>
          </View>

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

        {/* 主内容区 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          nestedScrollEnabled={true}
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
              onFocus={handleTitleFocus}
              autoFocus
            />
          </View>

          {/* 富文本编辑器 */}
          <View style={styles.editorContainer}>
            <RichTextEditor
              ref={editorRef}
              initialContent={content}
              onContentChange={setContent}
              placeholder="分享你的出国攻略和经验..."
              minHeight={400}
              onFocus={handleEditorFocus}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部区域：标签 + 工具栏 */}
        <Animated.View
          style={[styles.bottomContainer, { marginBottom: bottomMarginAnim }]}
        >
          {/* 标签展示 */}
          {tags.length > 0 && (
            <View style={styles.tagsDisplayArea}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsScrollContent}
              >
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Ionicons name="close" size={16} color="#0284C7" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 工具栏 */}
          <EditorToolbar
            config={{
              showImage: true,
              showCamera: true,
              showVideo: false,
              showMention: false,
              showTag: true,
              showLocation: false,
              showEmoji: false,
              showRichText: true,
            }}
            onPickImages={handlePickImages}
            onTakePhoto={handleTakePhoto}
            onAddTag={() => setShowTagInput(true)}
            onToggleRichToolbar={handleToggleRichToolbar}
            isSaving={isSavingDraft}
            disabled={isUploading}
          />
        </Animated.View>
      </View>

      {/* 富文本工具栏 */}
      {showRichToolbar && (
        <View
          style={styles.richToolbarOverlay}
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            if (height !== richToolbarHeight) {
              setRichToolbarHeight(height);
            }
          }}
        >
          <RichTextToolbar editorRef={editorRef} />
        </View>
      )}

      {/* 标签输入 Modal */}
      <TagInput
        visible={showTagInput}
        onClose={() => setShowTagInput(false)}
        onAddTag={(tag) => {
          if (!tag.trim()) return;
          if (tags.length >= 5) {
            Alert.alert('提示', '最多只能添加5个标签');
            return;
          }
          if (tags.includes(tag.trim())) {
            Alert.alert('提示', '该标签已存在');
            return;
          }
          setTags([...tags, tag.trim()]);
        }}
        currentTags={tags}
      />

      {/* 上传进度 */}
      <UploadProgress
        visible={uploadState.isVisible}
        status={uploadState.status}
        message={uploadState.message}
        progress={uploadState.progress}
      />
    </SafeAreaView>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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

  // Content
  content: {
    flex: 1,
  },
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
  },
  editorContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Bottom
  bottomContainer: {
    backgroundColor: COLORS.white,
  },
  tagsDisplayArea: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    backgroundColor: COLORS.white,
  },
  tagsScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  tagItem: {
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

  // Rich Text Toolbar Overlay
  richToolbarOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
});
