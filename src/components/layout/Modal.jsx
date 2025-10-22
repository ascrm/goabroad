/**
 * Modal 模态框组件
 * 支持底部弹出、居中弹窗、全屏模态
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Modal = ({
  visible = false,
  onClose,
  type = 'bottom',
  title,
  children,
  showClose = true,
  footer,
  height,
  closeOnBackdrop = true,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(type === 'bottom' ? SCREEN_HEIGHT : 0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: type === 'bottom' ? SCREEN_HEIGHT : 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, type]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  const getModalStyle = () => {
    switch (type) {
      case 'center':
        return styles.modal_center;
      case 'fullscreen':
        return styles.modal_fullscreen;
      default:
        return [styles.modal_bottom, height && { height }];
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnim }]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            getModalStyle(),
            type === 'bottom' && {
              transform: [{ translateY: slideAnim }],
            },
            type === 'center' && {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
            style,
          ]}
        >
          {type === 'bottom' && <View style={styles.handle} />}
          
          {(title || showClose) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showClose && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Ionicons name="close" size={24} color="#333333" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </RNModal>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(['bottom', 'center', 'fullscreen']),
  title: PropTypes.string,
  children: PropTypes.node,
  showClose: PropTypes.bool,
  footer: PropTypes.element,
  height: PropTypes.number,
  closeOnBackdrop: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  modal_bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  modal_center: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    marginTop: -150,
    borderRadius: 16,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  modal_fullscreen: {
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default Modal;

