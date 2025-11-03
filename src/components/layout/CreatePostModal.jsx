/**
 * 发布选择器全局Modal组件
 * 在当前页面上方弹出底部选择器，不触发页面跳转
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CreatePostModal({ visible, onClose }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // 当visible改变时触发动画
  useEffect(() => {
    if (visible) {
      // 显示动画
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 隐藏动画
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // 关闭菜单
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  // 处理选项点击
  const handleOptionPress = (type) => {
    handleClose();
    
    // 延迟跳转，等待关闭动画完成
    setTimeout(() => {
      switch (type) {
        case 'post':
          // 跳转到发布动态页面
          router.push('/community/post/create');
          break;
        case 'question':
          // 跳转到提问题页面
          router.push('/community/question/create');
          break;
        case 'answer':
          // 跳转到写回答页面
          router.push('/community/answer/create');
          break;
        case 'article':
          // 跳转到写攻略页面
          router.push('/community/article/create');
          break;
        case 'plan':
          // 跳转到创建规划
          router.push('/planning/create');
          break;
        default:
          break;
      }
    }, 300);
  };

  // 选项配置
  const options = [
    {
      id: 'post',
      icon: 'images',
      iconColor: COLORS.primary[600],
      title: '发布动态',
      description: '分享图片、视频和你的生活',
      backgroundColor: COLORS.primary[50],
    },
    {
      id: 'question',
      icon: 'help-circle-outline',
      iconColor: '#0284C7', // 蓝色系
      title: '提问题',
      description: '向社区提出你的疑问',
      backgroundColor: '#E0F2FE', // 浅蓝色
    },
    {
      id: 'answer',
      icon: 'chatbox-ellipses-outline',
      iconColor: '#7C3AED', // 紫色系
      title: '写回答',
      description: '回答社区中的问题',
      backgroundColor: '#EDE9FE', // 浅紫色
    },
    {
      id: 'article',
      icon: 'document-text',
      iconColor: COLORS.success[600],
      title: '写攻略',
      description: '分享你的经验和知识',
      backgroundColor: COLORS.success[50],
    },
    {
      id: 'plan',
      icon: 'list',
      iconColor: COLORS.warning[600],
      title: '创建规划',
      description: '开始你的出国规划之旅',
      backgroundColor: COLORS.warning[50],
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* 遮罩层 */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={handleClose}
            accessibilityLabel="关闭发布选择器"
            accessibilityHint="点击背景关闭菜单"
          />
        </Animated.View>

        {/* 底部菜单 */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* 拖动条 */}
          <View style={styles.handle}>
            <View style={styles.handleBar} />
          </View>

          {/* 标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>选择发布类型</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="关闭"
              accessibilityHint="关闭发布选择器"
            >
              <Ionicons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* 选项列表 */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  index < options.length - 1 && styles.optionItemWithBorder,
                ]}
                onPress={() => handleOptionPress(option.id)}
                activeOpacity={0.7}
                accessibilityLabel={option.title}
                accessibilityHint={option.description}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.backgroundColor },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={28}
                    color={option.iconColor}
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.gray[400]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 底部安全区域 */}
          <View style={styles.safeAreaBottom} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  // 拖动条
  handle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray[300],
    borderRadius: 2,
  },

  // 头部
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
  },

  // 选项列表
  optionsContainer: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
  },

  // 底部安全区域
  safeAreaBottom: {
    height: Platform.OS === 'ios' ? 34 : 20,
  },
});

