/**
 * 编辑器工具栏组件
 * 用于社区发布页面（问题、帖子、动态等）的底部工具栏
 * 提供图片、相机、@提及、标签、视频等功能
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { COLORS } from '@/src/constants';

/**
 * 工具栏配置项类型
 * @typedef {Object} ToolbarConfig
 * @property {boolean} showImage - 显示图片图标（相册）
 * @property {boolean} showCamera - 显示相机图标
 * @property {boolean} showVideo - 显示视频图标
 * @property {boolean} showMention - 显示@提及图标
 * @property {boolean} showTag - 显示标签图标
 * @property {boolean} showLocation - 显示位置图标
 * @property {boolean} showEmoji - 显示表情图标
 * @property {boolean} showRichText - 显示富文本格式工具图标
 */

/**
 * EditorToolbar 组件
 * @param {Object} props
 * @param {ToolbarConfig} props.config - 工具栏配置
 * @param {Function} props.onPickImages - 选择图片回调
 * @param {Function} props.onTakePhoto - 拍照回调
 * @param {Function} props.onPickVideo - 选择视频回调
 * @param {Function} props.onMention - @提及回调
 * @param {Function} props.onAddTag - 添加标签回调
 * @param {Function} props.onAddLocation - 添加位置回调
 * @param {Function} props.onAddEmoji - 添加表情回调
 * @param {Function} props.onToggleRichToolbar - 切换富文本工具栏回调
 * @param {string} props.rightText - 右侧提示文本
 * @param {boolean} props.isSaving - 是否正在保存
 * @param {Object} props.style - 自定义样式
 */
export default function EditorToolbar({
  config = {
    showImage: true,
    showCamera: true,
    showVideo: false,
    showMention: true,
    showTag: true,
    showLocation: false,
    showEmoji: false,
    showRichText: false,
  },
  onPickImages,
  onTakePhoto,
  onPickVideo,
  onMention,
  onAddTag,
  onAddLocation,
  onAddEmoji,
  onToggleRichToolbar,
  rightText = '',
  isSaving = false,
  style,
}) {
  return (
    <View style={[styles.toolbar, style]}>
      {/* 左侧工具按钮组 */}
      <View style={styles.toolbarLeft}>
        {/* 从相册选择图片 */}
        {config.showImage && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onPickImages}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="image-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 拍照 */}
        {config.showCamera && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onTakePhoto}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="camera-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 选择视频 */}
        {config.showVideo && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onPickVideo}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="videocam-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* @提及 */}
        {config.showMention && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onMention}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="at" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 添加标签 */}
        {config.showTag && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onAddTag}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pricetag-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 添加位置 */}
        {config.showLocation && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onAddLocation}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="location-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 添加表情 */}
        {config.showEmoji && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onAddEmoji}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="happy-outline" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}

        {/* 富文本格式工具 */}
        {config.showRichText && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={onToggleRichToolbar}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="text" size={24} color="#00A6F0" />
          </TouchableOpacity>
        )}
      </View>

      {/* 右侧提示信息 */}
      <View style={styles.toolbarRight}>
        {isSaving && <Text style={styles.savingText}>保存中...</Text>}
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  toolbarBtn: {
    padding: 8,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingText: {
    fontSize: 11,
    color: COLORS.gray[500],
  },
  rightText: {
    fontSize: 11,
    color: COLORS.gray[600],
  },
});

