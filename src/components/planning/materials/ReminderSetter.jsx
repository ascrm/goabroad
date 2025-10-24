/**
 * 提醒设置组件
 * 设置材料准备的提醒日期和提前提醒时间
 */

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

const ADVANCE_OPTIONS = [
  { label: '当天', value: 0 },
  { label: '提前1天', value: 1 },
  { label: '提前3天', value: 3 },
  { label: '提前1周', value: 7 },
];

export default function ReminderSetter({ visible, material, onClose }) {
  const [selectedDate, setSelectedDate] = useState(
    material?.dueDate ? new Date(material.dueDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [advanceDays, setAdvanceDays] = useState(1);

  // 处理日期选择
  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  // 计算实际提醒日期
  const getReminderDate = () => {
    const reminderDate = new Date(selectedDate);
    reminderDate.setDate(reminderDate.getDate() - advanceDays);
    return reminderDate;
  };

  // 保存提醒
  const handleSave = () => {
    const reminderDate = getReminderDate();
    
    console.log('设置提醒:', {
      materialId: material.id,
      dueDate: selectedDate,
      reminderDate: reminderDate,
      advanceDays: advanceDays,
    });

    // TODO: 调用 Redux action 或 API 保存提醒

    Alert.alert(
      '提醒已设置',
      `将在 ${format(reminderDate, 'yyyy年MM月dd日', { locale: zhCN })} 提醒您准备"${material.name}"`,
      [{ text: '确定', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>设置提醒</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* 内容 */}
          <View style={styles.content}>
            {/* 材料名称 */}
            <View style={styles.materialInfo}>
              <Ionicons name="document-text" size={20} color={COLORS.primary[600]} />
              <Text style={styles.materialName}>{material?.name}</Text>
            </View>

            {/* 截止日期选择 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>截止日期</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.gray[600]} />
                <Text style={styles.dateButtonText}>
                  {format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>
            </View>

            {/* 提前提醒 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>提前提醒</Text>
              <View style={styles.optionsContainer}>
                {ADVANCE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      advanceDays === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setAdvanceDays(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        advanceDays === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 提醒时间预览 */}
            <View style={styles.previewContainer}>
              <Ionicons name="notifications" size={20} color={COLORS.warning[600]} />
              <View style={styles.previewTextContainer}>
                <Text style={styles.previewLabel}>将在以下时间提醒您：</Text>
                <Text style={styles.previewDate}>
                  {format(getReminderDate(), 'yyyy年MM月dd日 上午9:00', { locale: zhCN })}
                </Text>
              </View>
            </View>
          </View>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>设置提醒</Text>
            </TouchableOpacity>
          </View>

          {/* 日期选择器 */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  materialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginLeft: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  optionTextActive: {
    color: COLORS.white,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning[50],
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.warning[200],
  },
  previewTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  previewLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.warning[800],
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

