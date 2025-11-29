import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TYPE_COLOR_MAP = {
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
  warning: '#F97316',
};

const Toast = ({
  visible,
  type = 'info',
  message = '',
  onHide,
  position = 'top',
  offset = 32,
}) => {
  if (!visible) {
    return null;
  }

  const backgroundColor = TYPE_COLOR_MAP[type] || TYPE_COLOR_MAP.info;
  const isTop = position === 'top';
  const placementStyle = isTop ? { top: offset } : { bottom: offset };

  return (
    <View pointerEvents="box-none" style={[styles.container, placementStyle]}>
      <TouchableOpacity
        accessibilityRole="alert"
        activeOpacity={0.9}
        style={[styles.toast, { backgroundColor }]}
        onPress={onHide}
      >
        <Text style={styles.text}>{message}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  toast: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Toast;


