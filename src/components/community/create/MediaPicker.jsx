/**
 * 媒体选择器组件（Modal形式）
 * 支持图片、视频的选择，以及拍照、录制视频
 * 基于 create.jsx 中的媒体选择逻辑实现
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function MediaPicker({ 
  visible = false,
  onClose = () => {},
  onTakePhoto = () => {},
  onPickImages = () => {},
  onRecordVideo = () => {},
  onPickVideo = () => {},
  showImageOptions = true,  // 是否显示图片选项
  showVideoOptions = true,  // 是否显示视频选项
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>选择媒体</Text>
          
          {showImageOptions && (
            <>
              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => {
                  onClose();
                  setTimeout(onTakePhoto, 300);
                }}
              >
                <Ionicons name="camera" size={24} color={COLORS.gray[700]} />
                <Text style={styles.actionText}>拍照</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => {
                  onClose();
                  setTimeout(onPickImages, 300);
                }}
              >
                <Ionicons name="images" size={24} color={COLORS.gray[700]} />
                <Text style={styles.actionText}>从相册选择图片</Text>
              </TouchableOpacity>
            </>
          )}

          {showVideoOptions && (
            <>
              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => {
                  onClose();
                  setTimeout(onRecordVideo, 300);
                }}
              >
                <Ionicons name="videocam" size={24} color={COLORS.gray[700]} />
                <Text style={styles.actionText}>录制视频</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => {
                  onClose();
                  setTimeout(onPickVideo, 300);
                }}
              >
                <Ionicons name="film" size={24} color={COLORS.gray[700]} />
                <Text style={styles.actionText}>从相册选择视频</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.actionItem, styles.cancelAction]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  actionText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  cancelAction: {
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
  },
});
