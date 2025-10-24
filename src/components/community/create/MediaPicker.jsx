/**
 * 媒体选择器组件
 * 支持图片和视频的选择、预览、上传
 */

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Progress from 'react-native-progress';

import { COLORS } from '@/src/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 3; // 3列布局，减去间距
const MAX_IMAGES = 9;
const MAX_VIDEO_DURATION = 300; // 5分钟

export default function MediaPicker({ type = 'image', images = [], video = null, onImagesChange, onVideoChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // 请求相册权限
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能选择图片或视频');
      return false;
    }
    return true;
  };

  // 选择图片
  const pickImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image',
          size: asset.fileSize,
        }));

        // 限制最多9张
        const totalImages = [...images, ...newImages].slice(0, MAX_IMAGES);
        onImagesChange(totalImages);

        // 模拟上传
        uploadImages(newImages);
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片失败，请重试');
    }
  };

  // 拍摄照片
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newImage = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: 'image',
          size: asset.fileSize,
        };

        if (images.length < MAX_IMAGES) {
          onImagesChange([...images, newImage]);
          uploadImages([newImage]);
        } else {
          Alert.alert('提示', `最多只能上传${MAX_IMAGES}张图片`);
        }
      }
    } catch (error) {
      console.error('拍照失败:', error);
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  // 选择视频
  const pickVideo = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
        videoMaxDuration: MAX_VIDEO_DURATION,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // 检查时长
        if (asset.duration && asset.duration > MAX_VIDEO_DURATION * 1000) {
          Alert.alert('提示', '视频时长不能超过5分钟');
          return;
        }

        const newVideo = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          size: asset.fileSize,
          type: 'video',
        };

        onVideoChange(newVideo);
        uploadVideo(newVideo);
      }
    } catch (error) {
      console.error('选择视频失败:', error);
      Alert.alert('错误', '选择视频失败，请重试');
    }
  };

  // 模拟上传图片
  const uploadImages = async (newImages) => {
    setUploading(true);

    for (const image of newImages) {
      const imageId = image.uri;
      
      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress((prev) => ({ ...prev, [imageId]: progress }));
      }
    }

    setUploading(false);
    setUploadProgress({});
  };

  // 模拟上传视频
  const uploadVideo = async (video) => {
    setUploading(true);
    const videoId = video.uri;

    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 5) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress((prev) => ({ ...prev, [videoId]: progress }));
    }

    setUploading(false);
    setUploadProgress({});
  };

  // 删除图片
  const removeImage = (index) => {
    Alert.alert('确认', '确定要删除这张图片吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          const newImages = images.filter((_, i) => i !== index);
          onImagesChange(newImages);
        },
      },
    ]);
  };

  // 删除视频
  const removeVideo = () => {
    Alert.alert('确认', '确定要删除这个视频吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => onVideoChange(null),
      },
    ]);
  };

  // 预览图片
  const previewImage = (index) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  // 显示选择菜单
  const showImageMenu = () => {
    Alert.alert('选择图片', '', [
      { text: '从相册选择', onPress: pickImages },
      { text: '拍照', onPress: takePhoto },
      { text: '取消', style: 'cancel' },
    ]);
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 格式化时长
  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 渲染图片网格
  if (type === 'image') {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.imageGrid}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <TouchableOpacity
                  onPress={() => previewImage(index)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  
                  {/* 上传进度 */}
                  {uploadProgress[image.uri] !== undefined && uploadProgress[image.uri] < 100 && (
                    <View style={styles.progressOverlay}>
                      <Progress.Circle
                        progress={uploadProgress[image.uri] / 100}
                        size={40}
                        color={COLORS.white}
                        thickness={3}
                        showsText
                        formatText={() => `${uploadProgress[image.uri]}%`}
                        textStyle={styles.progressText}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                {/* 删除按钮 */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}

            {/* 添加按钮 */}
            {images.length < MAX_IMAGES && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={showImageMenu}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={32} color={COLORS.gray[400]} />
                <Text style={styles.addButtonText}>{images.length}/{MAX_IMAGES}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 图片预览 Modal */}
        <Modal visible={previewVisible} transparent animationType="fade">
          <View style={styles.previewModal}>
            <TouchableOpacity
              style={styles.previewClose}
              onPress={() => setPreviewVisible(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: previewIndex * SCREEN_WIDTH, y: 0 }}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.previewImageContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.previewIndicator}>
              <Text style={styles.previewIndicatorText}>
                {previewIndex + 1} / {images.length}
              </Text>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // 渲染视频选择
  if (type === 'video') {
    return (
      <View style={styles.container}>
        {video ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPreview}>
              <Ionicons name="videocam" size={48} color={COLORS.primary[600]} />
              <Text style={styles.videoInfo}>
                {formatDuration(video.duration)} · {formatFileSize(video.size)}
              </Text>
              
              {/* 上传进度 */}
              {uploadProgress[video.uri] !== undefined && uploadProgress[video.uri] < 100 && (
                <View style={styles.videoProgressContainer}>
                  <Progress.Bar
                    progress={uploadProgress[video.uri] / 100}
                    width={200}
                    color={COLORS.primary[600]}
                    borderRadius={4}
                  />
                  <Text style={styles.videoProgressText}>{uploadProgress[video.uri]}%</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.videoRemoveButton}
              onPress={removeVideo}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error[600]} />
              <Text style={styles.videoRemoveText}>删除视频</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.videoSelectButton}
            onPress={pickVideo}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam-outline" size={32} color={COLORS.primary[600]} />
            <Text style={styles.videoSelectText}>选择视频</Text>
            <Text style={styles.videoSelectHint}>最长5分钟</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  imageItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.gray[200],
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  addButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  addButtonText: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 4,
  },
  previewModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  previewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  previewImageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: '80%',
  },
  previewIndicator: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewIndicatorText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  videoContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  videoPreview: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  videoInfo: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginTop: 12,
  },
  videoProgressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  videoProgressText: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginTop: 8,
  },
  videoRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  videoRemoveText: {
    fontSize: 14,
    color: COLORS.error[600],
    marginLeft: 6,
    fontWeight: '500',
  },
  videoSelectButton: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderStyle: 'dashed',
  },
  videoSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginTop: 12,
  },
  videoSelectHint: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 4,
  },
});

