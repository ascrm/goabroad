我理解了，你想让 `app/community/post/create.jsx`（发帖页面）的底部工具栏功能和逻辑与 `app/community/question/create.jsx`（提问页面）保持一致，除了表情功能保持现状。

让我先查看一下这两个文件的差异，然后给你提供修改方案。

[2 tools called]

好的，我现在明白了两个文件的差异。`create.jsx`（提问页面）使用了 `ImagePicker` 直接实现图片和视频选择功能，而 `post/create.jsx`（发帖页面）目前使用的是封装好的 `MediaPicker` 组件，但功能不完整。

## 📋 修改方案：统一底部工具栏功能实现

### 需要修改的内容

#### 1. **导入 ImagePicker 和相关依赖**

在 `app/community/post/create.jsx` 文件顶部添加：

```javascript
import * as ImagePicker from 'expo-image-picker';
```

#### 2. **添加权限请求函数**

在组件内部，`loadDraft` 函数之前添加：

```javascript
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
```

#### 3. **添加媒体处理函数**

替换现有的简单 `removeImage` 和 `removeVideo` 函数，添加完整的媒体处理逻辑：

```javascript
// ========== 媒体上传功能 ==========

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
    setImages([...images, { uri: result.assets[0].uri }]);
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
    const newImages = result.assets.map(asset => ({ uri: asset.uri }));
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
        { text: '替换', onPress: () => setVideo({ uri: result.assets[0].uri }) },
      ]);
    } else {
      setVideo({ uri: result.assets[0].uri });
      // 如果添加了视频，清空图片
      setImages([]);
    }
  }
};

// 从相册选择视频
const handlePickVideo = async () => {
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
        { text: '替换', onPress: () => setVideo({ uri: result.assets[0].uri }) },
      ]);
    } else {
      setVideo({ uri: result.assets[0].uri });
      // 如果添加了视频，清空图片
      setImages([]);
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
```

#### 4. **修改 EditorToolbar 的回调函数**

将现有的工具栏配置改为：

```javascript
<EditorToolbar
  config={{
    showImage: !video,
    showCamera: !video,
    showVideo: images.length === 0,
    showMention: false,
    showTag: true,
    showLocation: false,
    showEmoji: true,
  }}
  onPickImages={handlePickImages}
  onTakePhoto={handleTakePhoto}
  onPickVideo={handlePickVideo}
  onAddTag={() => setShowTagInput(!showTagInput)}
  onAddEmoji={() => {
    if (showEmojiPicker) {
      // 如果表情面板已显示，则关闭它并重新聚焦输入框
      setShowEmojiPicker(false);
      setTimeout(() => {
        contentInputRef.current?.focus();
      }, 100);
    } else {
      // 如果表情面板未显示，先关闭键盘，再显示表情面板
      contentInputRef.current?.blur();
      setShowEmojiPicker(true);
    }
  }}
  isSaving={isSavingDraft}
/>
```

#### 5. **移除旧的 MediaPicker 组件使用**

删除以下代码块：

```javascript
// 删除这些
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
```

同时删除相关的状态：

```javascript
// 删除这两个状态
const [showImagePicker, setShowImagePicker] = useState(false);
const [showVideoPicker, setShowVideoPicker] = useState(false);
```

#### 6. **移除 MediaPicker 的导入**

在文件顶部，删除：

```javascript
import MediaPicker from '@/src/components/community/create/MediaPicker';  // 删除这行
```

#### 7. **修改图片预览部分**

将图片预览中的 `images[0].uri` 改为统一的访问方式（因为现在 images 数组中的对象结构是 `{ uri: '...' }`）：

确保所有图片显示的地方都使用 `image.uri`：

```javascript
{images.length === 1 ? (
  <View style={styles.singleImageContainer}>
    <Image 
      source={{ uri: images[0].uri }} 
      style={styles.singleImage}
      resizeMode="cover"
    />
    {/* ... */}
  </View>
) : (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.multiImageScroll}>
    {images.map((image, index) => (
      <View key={index} style={styles.multiImageItem}>
        <Image 
          source={{ uri: image.uri }} 
          style={styles.multiImage}
          resizeMode="cover"
        />
        {/* ... */}
      </View>
    ))}
  </ScrollView>
)}
```

### 总结

这些修改将使 `app/community/post/create.jsx` 的图片、相机和视频功能与 `app/community/question/create.jsx` 完全一致：

✅ 直接使用 `expo-image-picker` 而不是封装的 MediaPicker 组件  
✅ 添加权限检查  
✅ 支持拍照、选择图片、录制视频、选择视频  
✅ 图片最多9张限制  
✅ 视频和图片互斥（有视频时不能添加图片，反之亦然）  
✅ 保留表情选择器的现有功能（键盘替换模式）  

由于你处于 ask 模式，我无法直接修改文件。请切换到 agent 模式，我可以帮你应用这些更改。