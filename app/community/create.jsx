/**
 * 发布帖子页面
 * 支持发帖、提问、发视频三种类型
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
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import CategoryPicker from '@/src/components/community/create/CategoryPicker';
import MediaPicker from '@/src/components/community/create/MediaPicker';
import TagInput from '@/src/components/community/create/TagInput';
import { COLORS } from '@/src/constants';

const POST_TYPES = [
  { id: 'post', label: '📝 发帖', description: '分享经验、心得和故事' },
  { id: 'question', label: '❓ 提问', description: '寻求建议和帮助' },
  { id: 'video', label: '📹 发布视频', description: '分享视频内容' },
];

const DRAFT_KEY = 'community_post_draft';

export default function CreatePost() {
  const router = useRouter();
  const [postType, setPostType] = useState(null); // 'post', 'question', 'video'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // 高级选项
  const [allowComments, setAllowComments] = useState(true);
  const [onlyFollowers, setOnlyFollowers] = useState(false);
  
  // 状态
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  const contentInputRef = useRef(null);

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (postType || title || content || images.length > 0 || video) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [postType, title, content, images, video, category, tags]);

  // 加载草稿
  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        const data = JSON.parse(draft);
        Alert.alert(
          '发现草稿',
          '是否恢复上次未完成的内容？',
          [
            { text: '删除', onPress: clearDraft, style: 'destructive' },
            {
              text: '恢复',
              onPress: () => {
                setPostType(data.postType);
                setTitle(data.title || '');
                setContent(data.content || '');
                setImages(data.images || []);
                setVideo(data.video || null);
                setCategory(data.category || null);
                setTags(data.tags || []);
              },
            },
          ]
        );
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
        postType,
        title,
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
      setIsSavingDraft(false);
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

  // 选择内容类型
  const handleSelectType = (type) => {
    setPostType(type);
    // 如果选择视频类型，清空图片
    if (type === 'video') {
      setImages([]);
    } else if (type !== 'video' && video) {
      setVideo(null);
    }
  };

  // 验证表单
  const validateForm = () => {
    if (!postType) {
      Alert.alert('提示', '请选择内容类型');
      return false;
    }
    
    if (postType === 'question' && !title.trim()) {
      Alert.alert('提示', '问答类型必须填写标题');
      return false;
    }
    
    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return false;
    }
    
    if (content.trim().length < 10) {
      Alert.alert('提示', '内容至少需要10个字符');
      return false;
    }
    
    if (!category) {
      Alert.alert('提示', '请选择分区');
      return false;
    }
    
    return true;
  };

  // 发布帖子
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      // TODO: 调用 API 发布帖子
      const postData = {
        type: postType,
        title: title.trim(),
        content: content.trim(),
        images,
        video,
        category,
        tags,
        allowComments,
        onlyFollowers,
      };

      console.log('发布帖子:', postData);

      // 模拟 API 请求
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 清除草稿
      await clearDraft();

      // 显示成功提示
      Alert.alert('成功', '帖子发布成功', [
        {
          text: '查看',
          onPress: () => {
            // TODO: 导航到帖子详情页
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('发布失败:', error);
      Alert.alert('失败', '发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // 取消发布
  const handleCancel = () => {
    if (postType || title || content || images.length > 0 || video) {
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

  // 检查发布按钮是否可用
  const canPublish = () => {
    if (isPublishing) return false;
    if (!postType) return false;
    if (postType === 'question' && !title.trim()) return false;
    if (!content.trim() || content.trim().length < 10) return false;
    if (!category) return false;
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {postType === 'question' ? '提问' : postType === 'video' ? '发布视频' : '发布帖子'}
            </Text>
            {isSavingDraft && (
              <Text style={styles.savingText}>保存中...</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.publishButton,
              !canPublish() && styles.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={!canPublish()}
            activeOpacity={0.7}
          >
            {isPublishing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text
                style={[
                  styles.publishButtonText,
                  !canPublish() && styles.publishButtonTextDisabled,
                ]}
              >
                发布
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 内容类型选择 */}
          {!postType && (
            <View style={styles.typeSelector}>
              <Text style={styles.typeSelectorTitle}>选择内容类型</Text>
              {POST_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.typeOption}
                  onPress={() => handleSelectType(type.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.typeLabel}>{type.label}</Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.gray[400]}
                    style={styles.typeArrow}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 编辑区 */}
          {postType && (
            <>
              {/* 类型标签 */}
              <View style={styles.typeTag}>
                <Text style={styles.typeTagText}>
                  {POST_TYPES.find((t) => t.id === postType)?.label}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('提示', '确定要更改内容类型吗？', [
                      { text: '取消', style: 'cancel' },
                      {
                        text: '确定',
                        onPress: () => {
                          setPostType(null);
                          setTitle('');
                          setContent('');
                          setImages([]);
                          setVideo(null);
                        },
                      },
                    ]);
                  }}
                >
                  <Ionicons name="close-circle" size={18} color={COLORS.gray[500]} />
                </TouchableOpacity>
              </View>

              {/* 标题输入框 */}
              <View style={styles.section}>
                <TextInput
                  style={styles.titleInput}
                  placeholder={
                    postType === 'question'
                      ? '输入你的问题（必填）'
                      : '给你的帖子起个标题（可选）'
                  }
                  placeholderTextColor={COLORS.gray[400]}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={50}
                  returnKeyType="next"
                  onSubmitEditing={() => contentInputRef.current?.focus()}
                />
                <Text style={styles.charCount}>{title.length}/50</Text>
              </View>

              {/* 正文输入框 */}
              <View style={styles.section}>
                <TextInput
                  ref={contentInputRef}
                  style={styles.contentInput}
                  placeholder="分享你的经验或提出问题..."
                  placeholderTextColor={COLORS.gray[400]}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  maxLength={5000}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{content.length}/5000</Text>
              </View>

              {/* 媒体选择器 */}
              <MediaPicker
                type={postType === 'video' ? 'video' : 'image'}
                images={images}
                video={video}
                onImagesChange={setImages}
                onVideoChange={setVideo}
              />

              {/* 分区选择 */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setShowCategoryPicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name="grid-outline" size={20} color={COLORS.primary[600]} />
                  <Text style={styles.optionLabel}>选择分区</Text>
                  {category && (
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{category}</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>

              {/* 标签输入 */}
              <TagInput tags={tags} onTagsChange={setTags} maxTags={5} />

              {/* 高级选项 */}
              <TouchableOpacity
                style={styles.advancedToggle}
                onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
                activeOpacity={0.7}
              >
                <Text style={styles.advancedToggleText}>高级选项</Text>
                <Ionicons
                  name={showAdvancedOptions ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.gray[600]}
                />
              </TouchableOpacity>

              {showAdvancedOptions && (
                <View style={styles.advancedOptions}>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>允许评论</Text>
                    <Switch
                      value={allowComments}
                      onValueChange={setAllowComments}
                      trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
                      thumbColor={allowComments ? COLORS.primary[600] : COLORS.gray[100]}
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>仅关注者可见</Text>
                    <Switch
                      value={onlyFollowers}
                      onValueChange={setOnlyFollowers}
                      trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
                      thumbColor={onlyFollowers ? COLORS.primary[600] : COLORS.gray[100]}
                    />
                  </View>
                </View>
              )}

              {/* 底部间距 */}
              <View style={{ height: 40 }} />
            </>
          )}
        </ScrollView>

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
  headerButton: {
    padding: 4,
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
  savingText: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  publishButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  publishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  publishButtonTextDisabled: {
    color: COLORS.gray[500],
  },
  content: {
    flex: 1,
  },
  typeSelector: {
    padding: 20,
  },
  typeSelectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  typeOption: {
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  typeArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
  },
  typeTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary[600],
    marginRight: 6,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    paddingVertical: 8,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.gray[900],
    minHeight: 150,
    paddingVertical: 8,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.gray[400],
    textAlign: 'right',
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  categoryTag: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary[600],
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  advancedToggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  advancedOptions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[50],
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: COLORS.gray[700],
  },
});

