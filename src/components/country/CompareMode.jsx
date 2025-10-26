/**
 * 国家对比模式组件
 * 支持选择2-3个国家进行多维度对比
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const CompareMode = ({ visible, onClose, countries, selectedCountries, onToggleCountry, onCompare }) => {
  const canCompare = selectedCountries.length >= 2 && selectedCountries.length <= 3;

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
            <Text style={styles.title}>选择对比国家</Text>
            <View style={styles.placeholder} />
          </View>

          {/* 提示 */}
          <View style={styles.hint}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary[600]} />
            <Text style={styles.hintText}>
              请选择 2-3 个国家进行对比 ({selectedCountries.length}/3)
            </Text>
          </View>

          {/* 国家列表 */}
          <ScrollView style={styles.countryList} showsVerticalScrollIndicator={false}>
            {countries.map((country) => {
              const isSelected = selectedCountries.includes(country.id);
              const isDisabled = !isSelected && selectedCountries.length >= 3;

              return (
                <TouchableOpacity
                  key={country.id}
                  style={[
                    styles.countryItem,
                    isSelected && styles.countryItemSelected,
                    isDisabled && styles.countryItemDisabled,
                  ]}
                  onPress={() => onToggleCountry(country.id)}
                  disabled={isDisabled}
                  activeOpacity={0.7}
                >
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <View style={styles.countryText}>
                      <Text style={styles.countryName}>{country.name}</Text>
                      <Text style={styles.countryDesc}>{country.description}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.compareButton, !canCompare && styles.compareButtonDisabled]}
              onPress={onCompare}
              disabled={!canCompare}
            >
              <Ionicons
                name="git-compare-outline"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.compareButtonText}>
                开始对比 ({selectedCountries.length})
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
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 32,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[50],
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary[700],
    lineHeight: 18,
  },
  countryList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  countryItemSelected: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  countryItemDisabled: {
    opacity: 0.4,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  countryText: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  countryDesc: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  compareButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CompareMode;

