/**
 * FormSelect 下拉选择组件
 * 支持单选/多选、搜索功能
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const FormSelect = ({
  control,
  name,
  rules,
  defaultValue,
  label,
  placeholder = '请选择',
  options = [],
  multiple = false,
  searchable = false,
  renderOption,
  disabled = false,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getDisplayValue = (value) => {
    if (!value) return placeholder;
    
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      const selectedOptions = options.filter(opt => value.includes(opt.value));
      return selectedOptions.map(opt => opt.label).join(', ');
    }
    
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || placeholder;
  };

  const filteredOptions = searchable && searchText
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const handleSelect = (optionValue, currentValue, onChange) => {
    if (multiple) {
      const newValue = currentValue || [];
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        onChange(newValue.filter(v => v !== optionValue));
      } else {
        onChange([...newValue, optionValue]);
      }
    } else {
      onChange(optionValue);
      setModalVisible(false);
      setSearchText('');
    }
  };

  const isSelected = (optionValue, currentValue) => {
    if (multiple) {
      return currentValue?.includes(optionValue);
    }
    return currentValue === optionValue;
  };

  const renderSelectOption = ({ item, currentValue, onChange }) => {
    const selected = isSelected(item.value, currentValue);

    return (
      <TouchableOpacity
        style={[styles.option, selected && styles.option_selected]}
        onPress={() => handleSelect(item.value, currentValue, onChange)}
      >
        {renderOption ? (
          renderOption(item, selected)
        ) : (
          <>
            <Text style={[styles.optionText, selected && styles.optionText_selected]}>
              {item.label}
            </Text>
            {selected && (
              <Ionicons name="checkmark" size={20} color="#0066FF" />
            )}
          </>
        )}
      </TouchableOpacity>
    );
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
              styles.selectButton,
              error && styles.selectButton_error,
              disabled && styles.selectButton_disabled,
            ]}
            onPress={() => !disabled && setModalVisible(true)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.selectText,
                !value && styles.selectText_placeholder,
              ]}
            >
              {getDisplayValue(value)}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </TouchableOpacity>
          
          {error && <Text style={styles.errorMessage}>{error.message}</Text>}

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => {
              setModalVisible(false);
              setSearchText('');
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label || '选择'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSearchText('');
                    }}
                  >
                    <Ionicons name="close" size={24} color="#333333" />
                  </TouchableOpacity>
                </View>

                {searchable && (
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999999" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="搜索..."
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>
                )}

                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) =>
                    renderSelectOption({ item, currentValue: value, onChange })
                  }
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>暂无选项</Text>
                    </View>
                  }
                />

                {multiple && (
                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => {
                        setModalVisible(false);
                        setSearchText('');
                      }}
                    >
                      <Text style={styles.confirmButtonText}>确定</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      )}
    />
  );
};

FormSelect.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  defaultValue: PropTypes.any,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  renderOption: PropTypes.func,
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
  selectButton: {
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
  selectButton_error: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  selectButton_disabled: {
    backgroundColor: '#F5F5F5',
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  selectText_placeholder: {
    color: '#999999',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingLeft: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  option_selected: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  optionText_selected: {
    color: '#0066FF',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FormSelect;

