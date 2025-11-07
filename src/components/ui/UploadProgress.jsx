/**
 * 上传进度组件
 * 显示美观的图片上传进度和状态
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { COLORS } from '@/src/constants';

const { width } = Dimensions.get('window');

const UploadProgress = ({ visible, status = 'uploading', message, progress = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // 进入动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 退出动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  // 根据状态选择图标和颜色
  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: null, // 使用 ActivityIndicator
          color: COLORS.primary,
          bgColor: COLORS.primary + '10',
        };
      case 'success':
        return {
          icon: 'checkmark-circle',
          color: COLORS.success,
          bgColor: COLORS.success + '10',
        };
      case 'error':
        return {
          icon: 'close-circle',
          color: COLORS.error,
          bgColor: COLORS.error + '10',
        };
      default:
        return {
          icon: null,
          color: COLORS.primary,
          bgColor: COLORS.primary + '10',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={styles.overlay}>
      {/* 半透明遮罩层 */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          },
        ]}
      />
      
      {/* Toast 卡片 */}
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            borderColor: config.color + '30',
          },
        ]}
      >
        {/* 图标或加载指示器 */}
        <View style={styles.iconContainer}>
          {status === 'uploading' ? (
            <ActivityIndicator size="large" color={config.color} />
          ) : (
            <Ionicons name={config.icon} size={48} color={config.color} />
          )}
        </View>

        {/* 消息文本 */}
        {message && (
          <Text style={[styles.message, { color: config.color }]}>{message}</Text>
        )}

        {/* 进度条（仅在上传中显示） */}
        {status === 'uploading' && progress > 0 && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: config.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 半透明黑色遮罩
  },
  container: {
    width: width * 0.7,
    maxWidth: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明白色背景
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray[600],
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default UploadProgress;

