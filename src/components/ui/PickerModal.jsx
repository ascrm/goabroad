/**
 * 滚动选择器模态框
 * 使用 @gorhom/bottom-sheet 实现底部弹出的滚动选择器
 */

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

/**
 * @param {object} props
 * @param {Array} props.options 选项数组 [{ label, value }]
 * @param {string|number} props.value 当前选中的值
 * @param {function} props.onSelect 选择回调 (value) => void
 * @param {string} props.title 标题
 * @param {function} props.onClose 关闭回调
 */
const PickerModal = React.forwardRef(({ options = [], value, onSelect, title, onClose }, ref) => {
  const { theme } = useTheme();
  const bottomSheetRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const snapPoints = useMemo(() => ['50%'], []);

  // 当 value 变化时，更新选中值
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setSelectedValue(value); // 打开时重置为当前值
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  // 点击列表项时，只更新临时选中值，不发送请求
  const handleItemPress = useCallback((itemValue) => {
    setSelectedValue(itemValue);
  }, []);

  // 点击确定按钮时，发送请求并关闭
  const handleConfirm = useCallback(() => {
    onSelect?.(selectedValue);
    bottomSheetRef.current?.close();
  }, [selectedValue, onSelect]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedValue(value); // 关闭时恢复为原始值
    onClose?.();
  }, [value, onClose]);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item.value === selectedValue;
      return (
        <TouchableOpacity
          style={[
            styles.optionItem,
            isSelected && { backgroundColor: theme.colors.primary[50] || '#EEF2FF' },
          ]}
          onPress={() => handleItemPress(item.value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              { color: theme.colors.text.primary },
              isSelected && { color: theme.colors.primary[600], fontWeight: '600' },
            ]}
          >
            {item.label}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark" size={20} color={theme.colors.primary[600]} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedValue, theme, handleItemPress],
  );

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
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.confirmButton, { backgroundColor: theme.colors.primary[600] }]}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>确定</Text>
        </TouchableOpacity>
      </View>
      <BottomSheetFlatList
        data={options}
        keyExtractor={(item, index) => `${item.value}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </BottomSheet>
  );
});

PickerModal.displayName = 'PickerModal';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});

export default PickerModal;

