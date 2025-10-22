/**
 * FormDatePicker 日期选择组件
 * 支持日期、时间、日期时间选择
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const FormDatePicker = ({
  control,
  name,
  rules,
  defaultValue,
  label,
  placeholder = '请选择日期',
  mode = 'date',
  format,
  minimumDate,
  maximumDate,
  disabled = false,
  style,
}) => {
  const [show, setShow] = useState(false);

  const formatDate = (date, mode) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (format) {
      return format(d);
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    switch (mode) {
      case 'time':
        return `${hours}:${minutes}`;
      case 'datetime':
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const handleChange = (event, selectedDate, currentValue, onChange) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}
          
          <TouchableOpacity
            style={[
              styles.dateButton,
              error && styles.dateButton_error,
              disabled && styles.dateButton_disabled,
            ]}
            onPress={() => !disabled && setShow(true)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.dateText,
                !value && styles.dateText_placeholder,
              ]}
            >
              {value ? formatDate(value, mode) : placeholder}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#666666" />
          </TouchableOpacity>
          
          {error && <Text style={styles.errorMessage}>{error.message}</Text>}

          {show && (
            <DateTimePicker
              value={value || new Date()}
              mode={mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) =>
                handleChange(event, selectedDate, value, onChange)
              }
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onTouchCancel={() => setShow(false)}
            />
          )}
        </View>
      )}
    />
  );
};

FormDatePicker.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  defaultValue: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  format: PropTypes.func,
  minimumDate: PropTypes.instanceOf(Date),
  maximumDate: PropTypes.instanceOf(Date),
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  dateButton_error: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  dateButton_disabled: {
    backgroundColor: '#F5F5F5',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  dateText_placeholder: {
    color: '#999999',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
});

export default FormDatePicker;

