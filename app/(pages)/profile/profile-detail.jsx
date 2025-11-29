/**
 * 个人资料详情页面
 * 展示用户的详细个人信息
 * 支持点击字段进行编辑
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/src/components/ui/PageHeader';
import PickerModal from '@/src/components/ui/PickerModal';
import SettingsSectionCard from '@/src/components/ui/SettingsSectionCard';
import { PROFILE_SECTIONS } from '@/src/constants';
import { useTheme } from '@/src/context/ThemeContext';
import { useUserInfo } from '@/src/hooks/auth';
import { api } from '@/src/services/api';

export default function ProfileDetailScreen() {
  const { theme } = useTheme();
  const userInfo = useUserInfo();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const pickerModalRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  // 当页面重新获得焦点时，刷新数据（从编辑页面返回时）
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.user.getUserProfile();
      setProfile(response.data || {});
    } catch (err) {
      console.error('加载个人资料失败:', err);
      setError(err.message || '加载失败');
      // 如果接口不存在，使用空数据
      setProfile({});
    } finally {
      setLoading(false);
    }
  };

  const handleFieldPress = (field, section) => {
    if (field.type === 'picker') {
      setEditingField({ field, section });
      pickerModalRef.current?.open();
    } else {
      // 非 picker 类型，跳转到编辑页面
      router.push({
        pathname: '/(pages)/profile/edit-field',
        params: {
          fieldKey: field.key,
          fieldLabel: field.label,
          fieldValue: profile?.[field.key] || '',
          keyboardType: field.keyboardType || 'default',
        },
      });
    }
  };

  const handlePickerSelect = async (value) => {
    if (!editingField) return;
    const { field } = editingField;
    const updatedProfile = { ...profile, [field.key]: value };
    setProfile(updatedProfile);
    
    try {
      await api.user.updateUserProfile({ [field.key]: value });
    } catch (err) {
      console.error('更新失败:', err);
      // 回滚
      setProfile(profile);
    }
    setEditingField(null);
  };


  const formatValue = (field, value) => {
    if (value === null || value === undefined || value === '') {
      return '未填写';
    }
    if (field.format) {
      return field.format(value);
    }
    return String(value);
  };

  const renderSection = (section) => (
    <SettingsSectionCard
      key={section.title}
      title={section.title}
      items={section.fields.map((field) => {
        const value = profile?.[field.key];
        const displayValue = formatValue(field, value);
        return {
          id: field.key,
          label: field.label,
          value: displayValue,
          onPress: () => handleFieldPress(field, section),
          renderRight: () => (
            <>
              <Text style={[styles.rowValue, { color: theme.colors.text.secondary }]}>
                {displayValue}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.text.tertiary || '#9CA3AF'} />
            </>
          ),
        };
      })}
      colors={{
        cardBg: theme.colors.background.secondary,
        title: theme.colors.text.secondary,
        textPrimary: theme.colors.text.primary,
        textSecondary: theme.colors.text.secondary,
        value: theme.colors.text.secondary,
        divider: theme.colors.border?.light,
      }}
      style={{ marginBottom: 24 }}
    />
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top || 0 },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          加载中...
        </Text>
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top || 0 },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary[600] }]}
          onPress={loadProfile}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      <PageHeader title="个人资料" onBack={() => router.back()} />

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 用户基本信息卡片 */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.background.secondary }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(userInfo?.nickname || userInfo?.name || '用').slice(0, 1)}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
            {userInfo?.nickname || userInfo?.name || '用户'}
          </Text>
          {userInfo?.email && (
            <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>
              {userInfo.email}
            </Text>
          )}
        </View>

        {/* 资料分组 */}
        {PROFILE_SECTIONS.map(renderSection)}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* 滚动选择器模态框 */}
      <PickerModal
        ref={pickerModalRef}
        title={editingField?.field?.label || '请选择'}
        options={editingField?.field?.options || []}
        value={editingField ? profile?.[editingField.field.key] : null}
        onSelect={handlePickerSelect}
        onClose={() => setEditingField(null)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  userCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1D4EB9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 13,
    marginRight: 4,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

