/**
 * 首次登录引导页面
 * 3步引导流程：选择国家 -> 选择目标 -> 选择时间和状态
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Button } from '@/src/components';
import { COLORS } from '@/src/constants';
import { useAppDispatch } from '@/src/store/hooks';
import { updatePreferencesLocal } from '@/src/store/slices/userSlice';

const { width } = Dimensions.get('window');

// 国家数据
const COUNTRIES = [
  { code: 'US', name: '美国', flag: '🇺🇸' },
  { code: 'UK', name: '英国', flag: '🇬🇧' },
  { code: 'CA', name: '加拿大', flag: '🇨🇦' },
  { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
  { code: 'DE', name: '德国', flag: '🇩🇪' },
  { code: 'FR', name: '法国', flag: '🇫🇷' },
  { code: 'JP', name: '日本', flag: '🇯🇵' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬' },
  { code: 'NZ', name: '新西兰', flag: '🇳🇿' },
  { code: 'NL', name: '荷兰', flag: '🇳🇱' },
  { code: 'CH', name: '瑞士', flag: '🇨🇭' },
  { code: 'SE', name: '瑞典', flag: '🇸🇪' },
];

// 目标选项
const PURPOSES = [
  {
    id: 'study',
    icon: '📚',
    title: '留学',
    description: '前往海外学习深造',
    color: COLORS.primary[600],
  },
  {
    id: 'work',
    icon: '💼',
    title: '工作',
    description: '海外就业、工作签证',
    color: COLORS.success[600],
  },
  {
    id: 'immigration',
    icon: '🏠',
    title: '移民',
    description: '技术移民、投资移民',
    color: COLORS.warning[600],
  },
  {
    id: 'explore',
    icon: '👀',
    title: '先看看',
    description: '暂时没有明确计划',
    color: COLORS.gray[600],
  },
];

// 出发时间选项
const DEPARTURE_TIMES = [
  { id: '3months', label: '3个月内' },
  { id: '6months', label: '半年内' },
  { id: '1year', label: '1年内' },
  { id: '1-2years', label: '1-2年' },
  { id: 'flexible', label: '还没想好' },
];

// 当前状态选项
const CURRENT_STATUS = [
  { id: 'student', label: '在校生', icon: 'school' },
  { id: 'graduate', label: '应届生', icon: 'ribbon' },
  { id: 'working', label: '在职', icon: 'briefcase' },
  { id: 'unemployed', label: '待业', icon: 'home' },
];

export default function Interests() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedDepartureTime, setSelectedDepartureTime] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // 切换国家选择
  const toggleCountry = (countryCode) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  // 下一步
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // 跳过
  const handleSkip = () => {
    // 直接完成，使用默认值
    dispatch(updatePreferencesLocal({
      onboarding: {
        completed: true,
        targetCountries: [],
        purpose: 'explore',
        departureTime: 'flexible',
        currentStatus: null,
      }
    }));
    router.replace('/(tabs)');
  };

  // 完成设置
  const handleComplete = () => {
    // 保存用户选择
    dispatch(updatePreferencesLocal({
      onboarding: {
        completed: true,
        targetCountries: selectedCountries,
        purpose: selectedPurpose,
        departureTime: selectedDepartureTime,
        currentStatus: selectedStatus,
      }
    }));
    
    // 跳转到 Tabs 首页
    router.replace('/(tabs)');
  };

  // 渲染进度条
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{currentStep}/3</Text>
    </View>
  );

  // 渲染步骤1：选择国家
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>选择目标国家</Text>
      <Text style={styles.subtitle}>可以选择多个国家（可选）</Text>
      
      <View style={styles.countryGrid}>
        {COUNTRIES.map((country) => {
          const isSelected = selectedCountries.includes(country.code);
          return (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryCard,
                isSelected && styles.countryCardSelected
              ]}
              onPress={() => toggleCountry(country.code)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={[
                styles.countryName,
                isSelected && styles.countryNameSelected
              ]}>
                {country.name}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // 渲染步骤2：选择目标
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>选择您的目标</Text>
      <Text style={styles.subtitle}>告诉我们您的出国计划</Text>
      
      <View style={styles.purposeContainer}>
        {PURPOSES.map((purpose) => {
          const isSelected = selectedPurpose === purpose.id;
          return (
            <TouchableOpacity
              key={purpose.id}
              style={[
                styles.purposeCard,
                isSelected && { 
                  borderColor: purpose.color,
                  backgroundColor: purpose.color + '10'
                }
              ]}
              onPress={() => setSelectedPurpose(purpose.id)}
            >
              <View style={styles.purposeIcon}>
                <Text style={styles.purposeEmoji}>{purpose.icon}</Text>
              </View>
              <View style={styles.purposeContent}>
                <Text style={[
                  styles.purposeTitle,
                  isSelected && { color: purpose.color }
                ]}>
                  {purpose.title}
                </Text>
                <Text style={styles.purposeDescription}>
                  {purpose.description}
                </Text>
              </View>
              {isSelected && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={24} 
                  color={purpose.color} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // 渲染步骤3：时间和状态
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>补充一些信息</Text>
      <Text style={styles.subtitle}>帮助我们更好地为您推荐</Text>
      
      {/* 出发时间 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>计划出发时间</Text>
        <View style={styles.optionRow}>
          {DEPARTURE_TIMES.map((time) => {
            const isSelected = selectedDepartureTime === time.id;
            return (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected
                ]}
                onPress={() => setSelectedDepartureTime(time.id)}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected
                ]}>
                  {time.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 当前状态 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>当前状态</Text>
        <View style={styles.statusGrid}>
          {CURRENT_STATUS.map((status) => {
            const isSelected = selectedStatus === status.id;
            return (
              <TouchableOpacity
                key={status.id}
                style={[
                  styles.statusCard,
                  isSelected && styles.statusCardSelected
                ]}
                onPress={() => setSelectedStatus(status.id)}
              >
                <Ionicons 
                  name={status.icon}
                  size={28}
                  color={isSelected ? COLORS.primary[600] : COLORS.gray[400]}
                />
                <Text style={[
                  styles.statusText,
                  isSelected && styles.statusTextSelected
                ]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  // 检查当前步骤是否可以继续
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // 第一步可以跳过
      case 2:
        return selectedPurpose !== null;
      case 3:
        return selectedDepartureTime !== null && selectedStatus !== null;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      {/* 进度条 */}
      {renderProgressBar()}

      {/* 内容区域 */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>跳过</Text>
        </TouchableOpacity>

        <Button
          title={currentStep === 3 ? '完成设置' : '下一步 →'}
          onPress={handleNext}
          disabled={!canProceed()}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  // 进度条
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  
  // 内容区域
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 32,
  },
  
  // 国家选择
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  countryCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.background.primary,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  countryCardSelected: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  countryFlag: {
    fontSize: 40,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  countryNameSelected: {
    color: COLORS.primary[600],
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 目标选择
  purposeContainer: {
    gap: 12,
  },
  purposeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  purposeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeEmoji: {
    fontSize: 28,
  },
  purposeContent: {
    flex: 1,
  },
  purposeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  purposeDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  
  // 时间和状态
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  optionChipSelected: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.background.primary,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statusCardSelected: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  statusTextSelected: {
    color: COLORS.primary[600],
  },
  
  // 底部按钮
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.background.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 12,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  nextButton: {
    flex: 1,
  },
});

