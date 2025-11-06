/**
 * 写攻略页面
 * 功能：标题 + 正文编辑器（富文本） + 标签 + 分区
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
  Animated,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import RichTextEditor from '@/src/components/community/create/RichTextEditor';
import RichTextToolbar from '@/src/components/community/create/RichTextToolbar';
import TagInput from '@/src/components/community/create/TagInput';
import EditorToolbar from '@/src/components/tools/EditorToolbar';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { publishPost } from '@/src/store/slices/communitySlice';

const DRAFT_KEY = 'community_article_draft';

export default function CreateArticle() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useUserInfo();
  const titleInputRef = useRef(null);
  const editorRef = useRef(null); // 富文本编辑器引用

  // 状态管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]); // 图片数组
  const [showTagInput, setShowTagInput] = useState(false);
  const [showRichToolbar, setShowRichToolbar] = useState(false); // 富文本工具栏显示状态
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0); // 键盘高度
  const [richToolbarHeight, setRichToolbarHeight] = useState(0); // 富文本工具栏高度
  
  // 动画值：底部容器的 marginBottom
  const bottomMarginAnim = useRef(new Animated.Value(0)).current;

  // 从草稿恢复
  useEffect(() => {
    loadDraft();
  }, []);

  // 监听富文本工具栏显示/隐藏，执行动画
  useEffect(() => {
    Animated.timing(bottomMarginAnim, {
      toValue: showRichToolbar ? richToolbarHeight : 0,
      duration: 250, // 动画时长 250ms，与工具栏滑入动画保持一致
      useNativeDriver: false, // marginBottom 不支持 native driver
    }).start();
  }, [showRichToolbar, richToolbarHeight]);

  // 自动保存草稿
  useEffect(() => {
    if (title || content || images.length > 0) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content, tags, images]);

  // 自动聚焦
  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
  }, []);

  // 监听键盘事件（自定义实现 KeyboardAvoidingView 的 padding behavior）
  useEffect(() => {
    // 只在 iOS 上启用（Android 不需要）
    if (Platform.OS !== 'ios') return;

    // 键盘显示事件
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        // 获取键盘高度
        let height = e.endCoordinates.height;
        height = height - 40;
        setKeyboardHeight(height);
      }
    );

    // 键盘隐藏事件
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    // 清理监听器
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
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
              setTags(data.tags || []);
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
        title,
        content,
        tags,
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

  // 发布攻略
  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      // 发布攻略
      console.log('📤 [发布流程] 发布攻略');

      const postData = {
        contentType: 'GUIDE', // 新API: GUIDE(写攻略)
        title: title.trim(),
        content: content.trim(),
        status: 'PUBLISHED',
        mediaUrls: images, // 新API: 使用mediaUrls替代images和videos
        category: tags[0] || '攻略', // 新API: 使用category替代tags
        tags: tags, // 标签数组
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
    if (title || content || images.length > 0 || tags.length > 0) {
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

  // ========== 图片上传功能 ==========
  
  // 请求相机和相册权限
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('权限不足', '需要相机和相册权限才能上传图片');
      return false;
    }
    return true;
  };

  // 拍照
  const handleTakePhoto = async () => {
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

  // 删除图片
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View 
        style={[
          styles.keyboardView,
          { paddingBottom: keyboardHeight } // 动态设置底部内边距
        ]}
      >
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
              onFocus={() => {
                // 当标题输入框获得焦点时，关闭富文本工具栏
                if (showRichToolbar) {
                  setShowRichToolbar(false);
                }
              }}
              autoFocus
            />
          </View>

          {/* 正文编辑器 */}
          <View style={styles.editorContainer}>
            <RichTextEditor
              ref={editorRef}
              initialContent={content}
              onContentChange={setContent}
              placeholder="分享你的出国攻略和经验..."
              minHeight={400}
              onFocus={() => {
                // 当富文本编辑器获得焦点时，关闭富文本工具栏
                if (showRichToolbar) {
                  setShowRichToolbar(false);
                }

                console.log('showRichToolbar的值',showRichToolbar);
              }}
            />
          </View>

          {/* 图片预览区域 */}
          {images.length > 0 && (
            <View style={styles.previewContainer}>
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
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* 底部固定区域：标签展示 + 工具栏 */}
        <Animated.View 
          style={[
            styles.bottomContainer,
            // 使用动画值来控制 marginBottom，实现平滑过渡
            { 
              marginBottom: bottomMarginAnim 
            }
          ]}
          onLayout={(event) => {
            // 可选：记录底部容器的高度，用于后续计算
          }}
        >
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
                    <TouchableOpacity onPress={() => removeTag(tag)}>
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
              showMention: false,
              showTag: true,
              showLocation: false,
              showEmoji: false,
              showRichText: true, // 启用富文本格式按钮
            }}
            onPickImages={handlePickImages}
            onTakePhoto={handleTakePhoto}
            onAddTag={() => setShowTagInput(true)}
            onToggleRichToolbar={() => {
              console.log('showRichToolbar的值', showRichToolbar);

              editorRef.current?.blur(); // 让富文本编辑器失焦，关闭 WebView 键盘
              Keyboard.dismiss(); // 关闭普通键盘
              setShowRichToolbar(!showRichToolbar); // 切换富文本工具栏
            }}
            isSaving={isSavingDraft}
            rightText={
              images.length > 0 ? `${images.length}张图片` : ''
            }
          />
        </Animated.View>
      </View>

      {/* 富文本工具栏（从屏幕底部弹出，覆盖层） */}
      {showRichToolbar && (
        <View 
          style={styles.richToolbarOverlay}
          onLayout={(event) => {
            // 获取工具栏高度，用于计算 bottomContainer 的 marginBottom
            let { height } = event.nativeEvent.layout;
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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

  // 编辑器容器
  editorContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // 图片预览区域
  previewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
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

  // 富文本工具栏覆盖层（从屏幕底部弹出）
  richToolbarOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
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

