/**
 * 文本输入模态框
 * 用于编辑文本类型的字段
 */

import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

/**
 * @param {object} props
 * @param {string} props.value 当前值
 * @param {function} props.onSave 保存回调 (value) => void
 * @param {string} props.title 标题
 * @param {string} props.placeholder 占位符
 * @param {string} props.keyboardType 键盘类型
 * @param {function} props.onClose 关闭回调
 */
const TextInputModal = React.forwardRef(
  ({ value, onSave, title, placeholder, keyboardType = 'default', onClose }, ref) => {
    const { theme } = useTheme();
    const bottomSheetRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || '');
    const snapPoints = useMemo(() => ['40%'], []);

    useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setInputValue(value || '');
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSave = useCallback(() => {
      onSave?.(inputValue);
      bottomSheetRef.current?.close();
    }, [inputValue, onSave]);

    const handleClose = useCallback(() => {
      bottomSheetRef.current?.close();
      setInputValue(value || '');
      onClose?.();
    }, [value, onClose]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleClose}
        backgroundStyle={{ backgroundColor: theme.colors.background.secondary }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border?.light || '#E5E7EB' }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.light || '#E5E7EB',
                },
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.tertiary || '#9CA3AF'}
              keyboardType={keyboardType}
              autoFocus
            />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.colors.primary[600] }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  },
);

TextInputModal.displayName = 'TextInputModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TextInputModal;

