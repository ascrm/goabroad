/**
 * Badge 徽章组件
 * 支持多种颜色、尺寸和形状
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Badge = ({
  children,
  color = 'primary',
  size = 'md',
  shape = 'rounded',
  dot = false,
  style,
  textStyle,
}) => {
  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          styles[`dot_${color}`],
          styles[`dot_${size}`],
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${color}`],
        styles[`badge_${size}`],
        styles[`badge_${shape}`],
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${color}`],
          styles[`text_${size}`],
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  shape: PropTypes.oneOf(['rounded', 'pill']),
  dot: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  
  // Colors
  badge_primary: {
    backgroundColor: '#E6F0FF',
  },
  badge_success: {
    backgroundColor: '#E6F9F0',
  },
  badge_warning: {
    backgroundColor: '#FFF5E6',
  },
  badge_error: {
    backgroundColor: '#FFE6E6',
  },
  badge_info: {
    backgroundColor: '#E6F7FF',
  },
  
  // Sizes
  badge_sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 20,
  },
  badge_md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 24,
  },
  badge_lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 28,
  },
  
  // Shapes
  badge_rounded: {
    borderRadius: 4,
  },
  badge_pill: {
    borderRadius: 100,
  },
  
  // Text
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#0066FF',
  },
  text_success: {
    color: '#00C853',
  },
  text_warning: {
    color: '#FF9800',
  },
  text_error: {
    color: '#FF4444',
  },
  text_info: {
    color: '#00B8D4',
  },
  text_sm: {
    fontSize: 11,
    lineHeight: 16,
  },
  text_md: {
    fontSize: 12,
    lineHeight: 16,
  },
  text_lg: {
    fontSize: 14,
    lineHeight: 18,
  },
  
  // Dot
  dot: {
    borderRadius: 100,
  },
  dot_primary: {
    backgroundColor: '#0066FF',
  },
  dot_success: {
    backgroundColor: '#00C853',
  },
  dot_warning: {
    backgroundColor: '#FF9800',
  },
  dot_error: {
    backgroundColor: '#FF4444',
  },
  dot_info: {
    backgroundColor: '#00B8D4',
  },
  dot_sm: {
    width: 6,
    height: 6,
  },
  dot_md: {
    width: 8,
    height: 8,
  },
  dot_lg: {
    width: 10,
    height: 10,
  },
});

export default Badge;

