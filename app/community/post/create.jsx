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
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

    return true;
  };

  // 上传图片
  const uploadImages = async () => {
    if (images.length === 0) return [];

    try {
      console.log(`📤 [上传图片] 开始上传 ${images.length} 张图片`);

      // 过滤出需要上传的本地图片（没有 url 字段的）
      const localImages = images.filter((img) => !img.url && img.uri);

      if (localImages.length === 0) {
        // 所有图片都已上传
        return images.map((img) => img.url);
      }

      // 上传本地图片（移除进度回调）
      const uploadResults = await uploadPostImages(localImages);

      console.log('✅ [上传图片] 上传成功:', uploadResults);

      // 处理上传结果：API返回的是 { data: { files: [...] } }
      const uploadedFiles = uploadResults?.data?.files || uploadResults?.files || [];
      
      // 合并已上传的图片 URL 和新上传的图片 URL
      const uploadedUrls = uploadedFiles.map((result) => result.url);
      const existingUrls = images.filter((img) => img.url).map((img) => img.url);

      return [...existingUrls, ...uploadedUrls];
    } catch (error) {
      console.error('❌ [上传图片] 上传失败:', error);
      throw new Error('图片上传失败，请重试');
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

      // 合并图片和视频到 mediaUrls
      const mediaUrls = [
        ...imageUrls,
        ...(video ? [video.url || video.uri || video] : [])
      ];

      const postData = {
        contentType: 'TREND', // 新API：TREND(日常动态), QUESTION(提问题), ANSWER(写答案), GUIDE(写攻略)
        content: content.trim(),
        status: 'PUBLISHED',
        mediaUrls: mediaUrls, // 新API：使用 mediaUrls 替代 images 和 videos
        category: category || tags[0], // 新API：使用 category 替代 tags，取第一个tag作为分类
        coverImage: imageUrls.length > 0 ? imageUrls[0] : null, // 使用第一张图片作为封面
        allowComment: true, // 新API：是否允许评论
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
    return !isPublishing && content.trim().length > 0;
  };

  // 移除标签
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 移除图片
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 移除视频
  const removeVideo = () => {
    setVideo(null);
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
            <Text style={styles.cancelText}>取消</Text>
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

        {/* 主输入区 */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 用户信息和文本输入区 */}
          <View style={styles.mainContent}>
            {/* 左侧头像 */}
            <Avatar
              size="md"
              source={userInfo?.avatar}
              name={userInfo?.nickname || userInfo?.username || '用户'}
              style={styles.avatar}
            />

            {/* 右侧内容区 */}
            <View style={styles.rightContent}>
              {/* 文本输入 */}
              <TextInput
                ref={contentInputRef}
                style={styles.contentInput}
                placeholder="有什么新鲜事？分享你的出国经验..."
                placeholderTextColor={COLORS.gray[400]}
                value={content}
                onChangeText={setContent}
                multiline
                autoFocus
                textAlignVertical="top"
              />

              {/* 媒体预览区域 */}
              {images.length > 0 && (
                <View style={styles.mediaPreviewContainer}>
                  {images.length === 1 ? (
                    // 单张图片 - 固定尺寸，居中裁剪
                    <View style={styles.singleImageContainer}>
                      <Image 
                        source={{ uri: images[0].uri }} 
                        style={styles.singleImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeMediaBtn}
                        onPress={() => removeImage(0)}
                        hitSlop={8}
                      >
                        <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // 多张图片 - 横向滚动
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.multiImageScroll}
                    >
                      {images.map((image, index) => (
                        <View key={index} style={styles.multiImageItem}>
                          <Image 
                            source={{ uri: image.uri }} 
                            style={styles.multiImage}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={styles.removeMediaBtn}
                            onPress={() => removeImage(index)}
                            hitSlop={8}
                          >
                            <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}

              {/* 视频预览 */}
              {video && (
                <View style={styles.mediaPreviewContainer}>
                  <View style={styles.videoContainer}>
                    <View style={styles.videoPreview}>
                      <Ionicons name="play-circle" size={48} color={COLORS.white} />
                      <Text style={styles.videoText}>视频</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeMediaBtn}
                      onPress={removeVideo}
                      hitSlop={8}
                    >
                      <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* 底部功能按钮区（圈人、添加位置等） */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add-outline" size={20} color="#00A6F0" />
              <Text style={styles.actionText}>圈人</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="location-outline" size={20} color="#00A6F0" />
              <Text style={styles.actionText}>添加位置</Text>
            </TouchableOpacity>
          </View>

          {/* 已选信息标签 */}
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

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* 评论权限设置 */}
        <View style={styles.permissionBar}>
          <Ionicons name="earth" size={18} color="#00A6F0" />
          <Text style={styles.permissionText}>所有人可以回复</Text>
        </View>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            {/* 图片按钮 */}
            <TouchableOpacity
              onPress={() => setShowImagePicker(true)}
              style={styles.toolBtn}
              disabled={!!video}
            >
              <Ionicons
                name="image-outline"
                size={24}
                color={video ? COLORS.gray[300] : '#00A6F0'}
              />
            </TouchableOpacity>

            {/* 相机按钮 */}
            <TouchableOpacity
              onPress={() => setShowImagePicker(true)}
              style={styles.toolBtn}
              disabled={!!video}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={video ? COLORS.gray[300] : '#00A6F0'}
              />
            </TouchableOpacity>

            {/* 视频按钮 */}
            <TouchableOpacity
              onPress={() => setShowVideoPicker(true)}
              style={styles.toolBtn}
              disabled={images.length > 0}
            >
              <Ionicons
                name="videocam-outline"
                size={24}
                color={images.length > 0 ? COLORS.gray[300] : '#00A6F0'}
              />
            </TouchableOpacity>

            {/* 直播按钮 */}
            <TouchableOpacity
              style={styles.toolBtn}
            >
              <Ionicons
                name="tv-outline"
                size={24}
                color="#00A6F0"
              />
            </TouchableOpacity>

            {/* GIF 按钮 */}
            <TouchableOpacity
              style={styles.toolBtn}
            >
              <Text style={styles.gifText}>GIF</Text>
            </TouchableOpacity>

            {/* 标签按钮 */}
            <TouchableOpacity
              onPress={() => setShowTagInput(!showTagInput)}
              style={styles.toolBtn}
            >
              <Ionicons
                name="pricetag-outline"
                size={24}
                color="#00A6F0"
              />
            </TouchableOpacity>

            {/* 分区按钮 */}
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(true)}
              style={styles.toolBtn}
            >
              <Ionicons name="grid-outline" size={24} color="#00A6F0" />
            </TouchableOpacity>

            {/* 更多选项 */}
            <TouchableOpacity style={styles.toolBtn}>
              <Ionicons name="add-circle-outline" size={24} color="#00A6F0" />
            </TouchableOpacity>
          </View>

          <View style={styles.toolbarRight}>
            {isSavingDraft && (
              <Text style={styles.savingText}>保存中...</Text>
            )}
            {/* 循环图标 */}
            <TouchableOpacity style={styles.toolBtn}>
              <Ionicons name="sync-outline" size={22} color="#00A6F0" />
            </TouchableOpacity>
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

        {/* 图片选择器 Modal */}
        {showImagePicker && (
          <MediaPicker
            type="image"
            images={images}
            video={video}
            onImagesChange={setImages}
            onVideoChange={setVideo}
            visible={showImagePicker}
            onClose={() => setShowImagePicker(false)}
          />
        )}

        {/* 视频选择器 Modal */}
        {showVideoPicker && (
          <MediaPicker
            type="video"
            images={images}
            video={video}
            onImagesChange={setImages}
            onVideoChange={setVideo}
            visible={showVideoPicker}
            onClose={() => setShowVideoPicker(false)}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray[200],
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  publishBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#00A6F0',
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  publishBtnDisabled: {
    backgroundColor: COLORS.gray[300],
    opacity: 0.5,
  },
  publishText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  
  // 主内容区（头像 + 输入）
  mainContent: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    marginRight: 12,
  },
  rightContent: {
    flex: 1,
  },
  contentInput: {
    fontSize: 18,
    color: COLORS.gray[900],
    lineHeight: 22,
  },

  // 媒体预览容器
  mediaPreviewContainer: {
  },
  
  // 单张图片
  singleImageContainer: {
    position: 'relative',
    width: '100%',
    height: 400,             // 固定高度
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[100],
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  
  // 多张图片横向滚动
  multiImageScroll: {
    marginVertical: 8,
  },
  multiImageItem: {
    position: 'relative',
    marginRight: 12,
    width: 200,              // 固定宽度
    height: 280,             // 固定高度（5:7 竖图比例）
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[100],
  },
  multiImage: {
    width: '100%',
    height: '100%',
  },
  
  // 视频预览
  videoContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    fontSize: 13,
    color: COLORS.white,
    marginTop: 8,
  },
  
  // 删除按钮
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 底部操作按钮
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 15,
    color: '#00A6F0',
  },

  // 已选信息
  selectedInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
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

  // 权限设置栏
  permissionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray[200],
    gap: 8,
  },
  permissionText: {
    fontSize: 15,
    color: '#00A6F0',
  },

  // 底部工具栏
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolBtn: {
    padding: 8,
  },
  gifText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00A6F0',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingText: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginRight: 8,
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

