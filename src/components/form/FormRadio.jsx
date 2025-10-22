/**
 * FormRadio 单选框组组件
 * 支持垂直/水平布局
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const FormRadio = ({
  control,
  name,
  rules,
  defaultValue,
  label,
  options = [],
  layout = 'vertical',
  disabled = false,
  style,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}
          
          <View
            style={[
              styles.optionsContainer,
              layout === 'horizontal' && styles.optionsContainer_horizontal,
            ]}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    layout === 'horizontal' && styles.option_horizontal,
                  ]}
                  onPress={() => !disabled && onChange(option.value)}
                  disabled={disabled}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionText_selected,
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
      )}
    />
  );
};

FormRadio.propTypes = {
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
  ).isRequired,
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0066FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  optionText_selected: {
    color: '#0066FF',
    fontWeight: '600',
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

export default FormRadio;

