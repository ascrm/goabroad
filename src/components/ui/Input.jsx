/**
 * Input 输入框组件
 * 支持多种类型、前后缀图标、清除按钮、错误提示
 */

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  type = 'text',
  value,
  onChangeText,
  placeholder,
  label,
  error,
  errorMessage,
  disabled = false,
  prefixIcon,
  suffixIcon,
  clearable = false,
  onClear,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  autoCapitalize = 'none',
  autoCorrect = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
    if (onClear) {
      onClear();
    }
  };

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const isPasswordType = type === 'password';
  const showPassword = isPasswordType && !isPasswordVisible;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainer_focused,
          error && styles.inputContainer_error,
          disabled && styles.inputContainer_disabled,
        ]}
      >
        {prefixIcon && (
          <View style={styles.prefixIcon}>{prefixIcon}</View>
        )}
        
        <TextInput
          style={[
            styles.input,
            prefixIcon && styles.input_withPrefix,
            (suffixIcon || clearable || isPasswordType) && styles.input_withSuffix,
            multiline && styles.input_multiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          editable={!disabled}
          secureTextEntry={showPassword}
          keyboardType={getKeyboardType()}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        
        <View style={styles.suffixContainer}>
          {clearable && value && !disabled && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
          
          {isPasswordType && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.passwordToggle}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#999999"
              />
            </TouchableOpacity>
          )}
          
          {suffixIcon && (
            <View style={styles.suffixIcon}>{suffixIcon}</View>
          )}
        </View>
      </View>
      
      {error && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
      
      {maxLength && (
        <Text style={styles.charCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email', 'phone', 'number']),
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  prefixIcon: PropTypes.element,
  suffixIcon: PropTypes.element,
  clearable: PropTypes.bool,
  onClear: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  maxLength: PropTypes.number,
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputContainer_focused: {
    borderColor: '#0066FF',
    borderWidth: 2,
  },
  inputContainer_error: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  inputContainer_disabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
  input_withPrefix: {
    paddingLeft: 8,
  },
  input_withSuffix: {
    paddingRight: 8,
  },
  input_multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  prefixIcon: {
    marginRight: 8,
  },
  suffixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suffixIcon: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default Input;

