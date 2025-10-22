/**
 * Toast 提示组件
 * 支持多种类型和位置
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const Toast = ({
  visible = false,
  type = 'info',
  message,
  duration = 3000,
  position = 'top',
  onHide,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  useEffect(() => {
    if (visible) {
      // 显示动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 自动隐藏
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) {
        onHide();
      }
    });
  };

  const getIcon = () => {
    const iconMap = {
      success: { name: 'checkmark-circle', color: '#00C853' },
      error: { name: 'close-circle', color: '#FF4444' },
      warning: { name: 'warning', color: '#FF9800' },
      info: { name: 'information-circle', color: '#0066FF' },
    };
    return iconMap[type] || iconMap.info;
  };

  const icon = getIcon();

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        styles[`container_${position}`],
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={[styles.toast, styles[`toast_${type}`]]}>
        <Ionicons name={icon.name} size={24} color={icon.color} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

Toast.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top', 'center', 'bottom']),
  onHide: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10000,
    alignItems: 'center',
  },
  container_top: {
    top: 60,
  },
  container_center: {
    top: '50%',
    marginTop: -30,
  },
  container_bottom: {
    bottom: 60,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
    maxWidth: '100%',
  },
  toast_success: {
    borderLeftWidth: 4,
    borderLeftColor: '#00C853',
  },
  toast_error: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  toast_warning: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  toast_info: {
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
});

export default Toast;

