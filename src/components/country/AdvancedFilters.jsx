/**
 * 高级筛选组件
 * 费用范围、难度级别、地区分类等多维度筛选
 */

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const AdvancedFilters = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    costRange: initialFilters.costRange || [0, 100],
    difficulty: initialFilters.difficulty || [],
    regions: initialFilters.regions || [],
    features: initialFilters.features || [],
  });

  // 难度选项
  const difficultyOptions = [
    { id: 'low', label: '容易', icon: 'happy-outline' },
    { id: 'medium', label: '中等', icon: 'remove-outline' },
    { id: 'high', label: '困难', icon: 'sad-outline' },
  ];

  // 地区选项
  const regionOptions = [
    { id: 'north-america', label: '北美', icon: '🌎' },
    { id: 'europe', label: '欧洲', icon: '🌍' },
    { id: 'asia', label: '亚洲', icon: '🌏' },
    { id: 'oceania', label: '大洋洲', icon: '🗺️' },
  ];

  // 特色选项
  const featureOptions = [
    { id: 'work-friendly', label: '工作友好', icon: 'briefcase-outline' },
    { id: 'immigration', label: '移民推荐', icon: 'airplane-outline' },
    { id: 'low-cost', label: '费用低', icon: 'cash-outline' },
    { id: 'short-duration', label: '学制短', icon: 'time-outline' },
    { id: 'high-safety', label: '安全性高', icon: 'shield-checkmark-outline' },
    { id: 'good-climate', label: '气候宜人', icon: 'partly-sunny-outline' },
  ];

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleReset = () => {
    setFilters({
      costRange: [0, 100],
      difficulty: [],
      regions: [],
      features: [],
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.costRange[0] > 0 || filters.costRange[1] < 100) count++;
    count += filters.difficulty.length;
    count += filters.regions.length;
    count += filters.features.length;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 头部 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.title}>高级筛选</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>重置</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 费用范围 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cash-outline" size={20} color={COLORS.gray[700]} />
                <Text style={styles.sectionTitle}>留学费用（万/年）</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderValue}>{filters.costRange[0]}万</Text>
                  <Text style={styles.sliderValue}>{filters.costRange[1]}万</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={filters.costRange[0]}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      costRange: [value, prev.costRange[1]],
                    }))
                  }
                  minimumTrackTintColor={COLORS.primary[600]}
                  maximumTrackTintColor={COLORS.gray[300]}
                  thumbTintColor={COLORS.primary[600]}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={filters.costRange[1]}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      costRange: [prev.costRange[0], value],
                    }))
                  }
                  minimumTrackTintColor={COLORS.primary[600]}
                  maximumTrackTintColor={COLORS.gray[300]}
                  thumbTintColor={COLORS.primary[600]}
                />
              </View>
            </View>

            {/* 申请难度 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bar-chart-outline" size={20} color={COLORS.gray[700]} />
                <Text style={styles.sectionTitle}>申请难度</Text>
              </View>
              <View style={styles.optionsGrid}>
                {difficultyOptions.map((option) => {
                  const isSelected = filters.difficulty.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => toggleFilter('difficulty', option.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={isSelected ? COLORS.primary[600] : COLORS.gray[600]}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 地区分类 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={20} color={COLORS.gray[700]} />
                <Text style={styles.sectionTitle}>地区分类</Text>
              </View>
              <View style={styles.optionsGrid}>
                {regionOptions.map((option) => {
                  const isSelected = filters.regions.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => toggleFilter('regions', option.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionIcon}>{option.icon}</Text>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 特色筛选 */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star-outline" size={20} color={COLORS.gray[700]} />
                <Text style={styles.sectionTitle}>特色筛选</Text>
              </View>
              <View style={styles.optionsGrid}>
                {featureOptions.map((option) => {
                  const isSelected = filters.features.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.featureButton,
                        isSelected && styles.featureButtonSelected,
                      ]}
                      onPress={() => toggleFilter('features', option.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={option.icon}
                        size={18}
                        color={isSelected ? COLORS.primary[600] : COLORS.gray[600]}
                      />
                      <Text
                        style={[
                          styles.featureText,
                          isSelected && styles.featureTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={COLORS.primary[600]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.bottomPlaceholder} />
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>
                应用筛选 {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  resetText: {
    fontSize: 15,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  sliderContainer: {
    paddingVertical: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gray[100],
    gap: 6,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[600],
  },
  optionIcon: {
    fontSize: 18,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gray[100],
    gap: 6,
  },
  featureButtonSelected: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[200],
  },
  featureText: {
    fontSize: 13,
    color: COLORS.gray[700],
    fontWeight: '500',
  },
  featureTextSelected: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  bottomPlaceholder: {
    height: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  applyButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default AdvancedFilters;

