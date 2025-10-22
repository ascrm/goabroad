/**
 * FormCheckbox 复选框组件
 * 支持单个复选框和复选框组
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const FormCheckbox = ({
  control,
  name,
  rules,
  defaultValue,
  label,
  options,
  layout = 'vertical',
  disabled = false,
  style,
}) => {
  // 单个复选框
  if (!options) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue || false}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={[styles.container, style]}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => !disabled && onChange(!value)}
              disabled={disabled}
            >
              <View style={[styles.checkbox, value && styles.checkbox_checked]}>
                {value && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              {label && (
                <Text
                  style={[
                    styles.label,
                    disabled && styles.label_disabled,
                  ]}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
            {error && <Text style={styles.errorMessage}>{error.message}</Text>}
          </View>
        )}
      />
    );
  }

  // 复选框组
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue || []}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (optionValue) => {
          const currentValue = value || [];
          const index = currentValue.indexOf(optionValue);
          
          if (index > -1) {
            onChange(currentValue.filter(v => v !== optionValue));
          } else {
            onChange([...currentValue, optionValue]);
          }
        };

        return (
          <View style={[styles.container, style]}>
            {label && <Text style={styles.groupLabel}>{label}</Text>}
            
            <View
              style={[
                styles.optionsContainer,
                layout === 'horizontal' && styles.optionsContainer_horizontal,
              ]}
            >
              {options.map((option) => {
                const isChecked = (value || []).includes(option.value);
                
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      layout === 'horizontal' && styles.option_horizontal,
                    ]}
                    onPress={() => !disabled && handleChange(option.value)}
                    disabled={disabled}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkbox_checked]}>
                      {isChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        disabled && styles.optionText_disabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {error && <Text style={styles.errorMessage}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

FormCheckbox.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  defaultValue: PropTypes.any,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkbox_checked: {
    backgroundColor: '#0066FF',
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  label_disabled: {
    color: '#999999',
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionsContainer_horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  option_horizontal: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  optionText_disabled: {
    color: '#999999',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
});

export default FormCheckbox;

