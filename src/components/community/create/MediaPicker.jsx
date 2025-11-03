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
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { COLORS } from '@/src/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 3; // 3列布局，减去间距
const MAX_IMAGES = 9;
const MAX_VIDEO_DURATION = 300; // 5分钟

export default function MediaPicker({ 
  type = 'image', 
  images = [], 
  video = null, 
  onImagesChange, 
  onVideoChange,
  visible = true,
  onClose = () => {}
}) {
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
        
        // 关闭Modal
        if (onClose) onClose();
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
          
          // 关闭Modal
          if (onClose) onClose();
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
        
        // 关闭Modal
        if (onClose) onClose();
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
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>选择图片</Text>
                <TouchableOpacity onPress={onClose} hitSlop={12}>
                  <Ionicons name="close" size={24} color={COLORS.gray[700]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    pickImages();
                  }}
                >
                  <Ionicons name="images" size={24} color={COLORS.primary[600]} />
                  <Text style={styles.optionText}>从相册选择</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    takePhoto();
                  }}
                >
                  <Ionicons name="camera" size={24} color={COLORS.primary[600]} />
                  <Text style={styles.optionText}>拍照</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.optionButton, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // 渲染视频选择
  if (type === 'video') {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择视频</Text>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={24} color={COLORS.gray[700]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  pickVideo();
                }}
              >
                <Ionicons name="videocam" size={24} color={COLORS.primary[600]} />
                <Text style={styles.optionText}>从相册选择视频</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Modal 样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  modalBody: {
    padding: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  cancelButton: {
    justifyContent: 'center',
    borderColor: COLORS.gray[300],
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});

