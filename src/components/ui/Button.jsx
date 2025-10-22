/**
 * Button 组件
 * 支持多种变体、尺寸和状态
 */

import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  ...rest
}) => {
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        fullWidth && styles.button_fullWidth,
        disabled && styles.button_disabled,
        loading && styles.button_loading,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={variant === 'primary' ? '#FFFFFF' : '#0066FF'}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`text_${size}`],
              disabled && styles.text_disabled,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  button_primary: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  button_secondary: {
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderColor: '#0066FF',
  },
  button_ghost: {
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    borderColor: 'transparent',
  },
  button_text: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  
  // Sizes
  button_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  button_md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  button_lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 52,
  },
  
  // States
  button_disabled: {
    opacity: 0.5,
  },
  button_loading: {
    opacity: 0.7,
  },
  button_fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#333333',
  },
  text_outline: {
    color: '#0066FF',
  },
  text_ghost: {
    color: '#0066FF',
  },
  text_text: {
    color: '#0066FF',
  },
  text_sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  text_md: {
    fontSize: 16,
    lineHeight: 24,
  },
  text_lg: {
    fontSize: 18,
    lineHeight: 26,
  },
  text_disabled: {
    opacity: 1,
  },
  
  // Icon
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;

