/**
 * 文件上传组件
 * 支持拍照、从相册选择、从文件管理器选择
 */

import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function FileUploader({ visible, material, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 拍照上传
  const handleCamera = async () => {
    try {
      // 请求相机权限
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要相机权限', '请在设置中允许访问相机');
        return;
      }

      // 打开相机
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadFile(result.assets[0].uri, 'image');
      }
    } catch (error) {
      console.error('拍照失败:', error);
      Alert.alert('错误', '拍照失败，请重试');
    }
  };

  // 从相册选择
  const handleImagePicker = async () => {
    try {
      // 请求相册权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要相册权限', '请在设置中允许访问相册');
        return;
      }

      // 打开相册
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadFile(result.assets[0].uri, 'image');
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片失败，请重试');
    }
  };

  // 从文件管理器选择
  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await uploadFile(result.uri, 'document');
      }
    } catch (error) {
      console.error('选择文件失败:', error);
      Alert.alert('错误', '选择文件失败，请重试');
    }
  };

  // 上传文件（模拟）
  const uploadFile = async (uri, type) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // TODO: 实际上传到服务器
      console.log('上传文件:', { materialId: material.id, uri, type });

      Alert.alert(
        '上传成功',
        `${material.name} 已成功上传`,
        [{ text: '确定', onPress: onClose }]
      );
    } catch (error) {
      console.error('上传失败:', error);
      Alert.alert('上传失败', '请检查网络连接后重试');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>上传 {material?.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {uploading ? (
            // 上传中
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary[600]} />
              <Text style={styles.uploadingText}>上传中...</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          ) : (
            // 选择上传方式
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleCamera}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="camera" size={32} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.optionTitle}>拍照</Text>
                <Text style={styles.optionDescription}>使用相机拍摄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleImagePicker}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="images" size={32} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.optionTitle}>从相册选择</Text>
                <Text style={styles.optionDescription}>选择已有照片</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleDocumentPicker}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="folder" size={32} color={COLORS.primary[600]} />
                </View>
                <Text style={styles.optionTitle}>从文件选择</Text>
                <Text style={styles.optionDescription}>选择PDF或图片</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 提示 */}
          {!uploading && (
            <View style={styles.tips}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.gray[500]} />
              <Text style={styles.tipsText}>
                支持 PDF、JPG、PNG 格式，单个文件不超过10MB
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  closeButton: {
    padding: 4,
  },
  uploadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginTop: 16,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[600],
    marginTop: 8,
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  tipsText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 6,
    flex: 1,
  },
});

