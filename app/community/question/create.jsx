/**
 * 提问题页面（富媒体版）
 * 功能：标题 + 问题描述 + 图片/视频上传 + @提及 + 标签
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
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
  View
} from 'react-native';

import { MediaPicker, TagInput, UserPicker } from '@/src/components/community/create';
import EditorToolbar from '@/src/components/tools/EditorToolbar';
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // 新增：富媒体和社交功能状态
  const [images, setImages] = useState([]); // 图片数组
  const [video, setVideo] = useState(null); // 视频URI
  const [tags, setTags] = useState([]); // 标签数组
  const [mentionedUsers, setMentionedUsers] = useState([]); // @的用户列表
  
  // UI控制状态
  const [showMediaPicker, setShowMediaPicker] = useState(false); // 媒体选择器
  const [showTagInput, setShowTagInput] = useState(false); // 标签输入
  const [showUserPicker, setShowUserPicker] = useState(false); // 用户选择器
  const [currentInputFocus, setCurrentInputFocus] = useState('title'); // 当前焦点输入框

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (title || description || images.length > 0 || video || tags.length > 0) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, description, images, video, tags]);

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
              setImages(data.images || []);
              setVideo(data.video || null);
              setTags(data.tags || []);
              setMentionedUsers(data.mentionedUsers || []);
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
        images,
        video,
        tags,
        mentionedUsers,
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

  // ========== 媒体上传功能 ==========
  
  // 请求相机和相册权限
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('权限不足', '需要相机和相册权限才能上传图片或视频');
      return false;
    }
    return true;
  };

  // 拍照
  const handleTakePhoto = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      if (images.length >= 9) {
        Alert.alert('提示', '最多只能上传9张图片');
        return;
      }
      setImages([...images, result.assets[0].uri]);
    }
  };

  // 从相册选择图片
  const handlePickImages = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      const totalImages = [...images, ...newImages];
      
      if (totalImages.length > 9) {
        Alert.alert('提示', `最多只能上传9张图片，已选择${totalImages.length}张`);
        setImages(totalImages.slice(0, 9));
      } else {
        setImages(totalImages);
      }
    }
  };

  // 录制视频
  const handleRecordVideo = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60, // 限制60秒
    });

    if (!result.canceled && result.assets?.[0]) {
      if (video) {
        Alert.alert('提示', '只能上传一个视频，是否替换当前视频？', [
          { text: '取消', style: 'cancel' },
          { text: '替换', onPress: () => setVideo(result.assets[0].uri) },
        ]);
      } else {
        setVideo(result.assets[0].uri);
      }
    }
  };

  // 从相册选择视频
  const handlePickVideo = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      if (video) {
        Alert.alert('提示', '只能上传一个视频，是否替换当前视频？', [
          { text: '取消', style: 'cancel' },
          { text: '替换', onPress: () => setVideo(result.assets[0].uri) },
        ]);
      } else {
        setVideo(result.assets[0].uri);
      }
    }
  };

  // 删除图片
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 删除视频
  const removeVideo = () => {
    setVideo(null);
  };

  // ========== 标签功能 ==========
  
  // 添加标签
  const addTag = (tag) => {
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
  };

  // 删除标签
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // ========== @提及功能 ==========
  
  // 插入@提及
  const insertMention = (user) => {
    const mentionText = `@${user.username || user.nickname} `;
    
    if (currentInputFocus === 'title') {
      setTitle(title + mentionText);
    } else {
      setDescription(description + mentionText);
    }
    
    // 添加到已提及列表
    if (!mentionedUsers.find(u => u.id === user.id)) {
      setMentionedUsers([...mentionedUsers, user]);
    }
    
    setShowUserPicker(false);
  };

  // 验证表单
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入问题标题');
      return false;
    }
    if (title.trim().length < 5) {
      Alert.alert('提示', '问题标题至少需要5个字符');
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
        content: description.trim() || '', // 描述可选
        status: 'PUBLISHED',
        category: '问答', // 默认分类为"问答"
        mediaUrls: [...images, ...(video ? [video] : [])], // 合并图片和视频
        tags: tags, // 标签数组
        mentionedUserIds: mentionedUsers.map(u => u.id), // 被@的用户ID
        allowComment: true, // 新API: 是否允许评论
      };

      const result = await dispatch(publishPost(postData)).unwrap();
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
    if (title || description || images.length > 0 || video || tags.length > 0) {
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
      title.trim().length >= 5
    );
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
            <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>问题</Text>

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
              placeholder="请输入问题并以问号结尾"
              placeholderTextColor={COLORS.gray[400]}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setCurrentInputFocus('title')}
              maxLength={100}
              autoFocus
            />
          </View>

          {/* 问题描述 */}
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="（选填）详细描述你的问题...&#10;&#10;可以包括：&#10;• 你的具体情况和背景&#10;• 遇到的具体问题&#10;• 已经尝试过的方法&#10;• 希望得到什么样的帮助"
              placeholderTextColor={COLORS.gray[400]}
              value={description}
              onChangeText={setDescription}
              onFocus={() => setCurrentInputFocus('description')}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 内容预览区域 */}
          {(images.length > 0 || video) && (
            <View style={styles.previewContainer}>
              {/* 图片预览 */}
              {images.length > 0 && (
                <View style={styles.imagesPreview}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((uri, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.previewImage} />
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                  <Text style={styles.mediaCount}>{images.length}/9 张图片</Text>
                </View>
              )}

              {/* 视频预览 */}
              {video && (
                <View style={styles.videoPreview}>
                  <View style={styles.videoWrapper}>
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={48} color={COLORS.white} />
                      <Text style={styles.videoText}>视频</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={removeVideo}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部固定区域：标签展示 + 工具栏 */}
        <View style={styles.bottomContainer}>
          {/* 标签展示区域 */}
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
                    <TouchableOpacity onPress={() => removeTag(index)}>
                      <Ionicons name="close" size={16} color="#0284C7" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 底部工具栏 */}
          <EditorToolbar
            config={{
              showImage: true,
              showCamera: true,
              showVideo: false,
              showMention: true,
              showTag: true,
              showLocation: false,
              showEmoji: false,
            }}
            onPickImages={handlePickImages}
            onTakePhoto={handleTakePhoto}
            onMention={() => setShowUserPicker(true)}
            onAddTag={() => setShowTagInput(true)}
            isSaving={isSavingDraft}
            rightText={
              (images.length > 0 || video)
                ? `${images.length > 0 ? `${images.length}张图片` : ''}${
                    images.length > 0 && video ? ' ' : ''
                  }${video ? '1个视频' : ''}`
                : ''
            }
          />
        </View>

        {/* 媒体选择器 Modal */}
        <MediaPicker
          visible={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onTakePhoto={handleTakePhoto}
          onPickImages={handlePickImages}
          onRecordVideo={handleRecordVideo}
          onPickVideo={handlePickVideo}
          showImageOptions={true}
          showVideoOptions={true}
        />

        {/* 标签输入 Modal */}
        <TagInput
          visible={showTagInput}
          onClose={() => setShowTagInput(false)}
          onAddTag={addTag}
          currentTags={tags}
        />

        {/* 用户选择器 Modal */}
        <UserPicker
          visible={showUserPicker}
          onClose={() => setShowUserPicker(false)}
          onSelectUser={insertMention}
        />
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

  // 标题输入
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.gray[900],
    lineHeight: 24,
  },

  // 问题描述
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  descriptionInput: {
    fontSize: 15,
    color: COLORS.gray[900],
    lineHeight: 22,
    minHeight: 200,
  },

  // 内容预览区域
  previewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  
  // 图片预览
  imagesPreview: {
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  mediaCount: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 8,
  },
  
  // 视频预览
  videoPreview: {
    marginBottom: 12,
  },
  videoWrapper: {
    position: 'relative',
    width: 200,
    height: 150,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray[800],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 8,
  },

  // 底部固定区域容器
  bottomContainer: {
    backgroundColor: COLORS.white,
  },

  // 标签展示区域（固定在工具栏上方）
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
});

