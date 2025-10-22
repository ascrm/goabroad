/**
 * Form 包装组件
 * 提供统一的验证规则、错误处理、提交状态管理
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const Form = ({
  children,
  defaultValues,
  onSubmit,
  validationSchema,
  mode = 'onBlur',
  style,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues,
    mode,
    resolver: validationSchema ? undefined : undefined, // yup resolver can be added here
  });

  // 将 form 方法传递给子组件
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        control,
        errors,
        isSubmitting,
        isValid,
      });
    }
    return child;
  });

  return (
    <View style={[styles.form, style]}>
      {childrenWithProps}
    </View>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func,
  validationSchema: PropTypes.object,
  mode: PropTypes.oneOf(['onBlur', 'onChange', 'onSubmit', 'onTouched', 'all']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
});

export default Form;

// 导出验证规则辅助函数
export const validationRules = {
  required: (message = '此字段为必填项') => ({
    required: { value: true, message },
  }),
  
  email: (message = '请输入有效的邮箱地址') => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),
  
  phone: (message = '请输入有效的手机号码') => ({
    pattern: {
      value: /^1[3-9]\d{9}$/,
      message,
    },
  }),
  
  minLength: (length, message) => ({
    minLength: {
      value: length,
      message: message || `最少需要${length}个字符`,
    },
  }),
  
  maxLength: (length, message) => ({
    maxLength: {
      value: length,
      message: message || `最多允许${length}个字符`,
    },
  }),
  
  min: (value, message) => ({
    min: {
      value,
      message: message || `最小值为${value}`,
    },
  }),
  
  max: (value, message) => ({
    max: {
      value,
      message: message || `最大值为${value}`,
    },
  }),
  
  password: (message = '密码至少8位，包含字母和数字') => ({
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      message,
    },
  }),
};

