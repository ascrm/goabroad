/**
 * 编辑字段页面
 * 用于编辑非 picker 类型的字段
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import { api } from '@/src/services/api';

export default function EditFieldScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { fieldKey, fieldLabel, fieldValue, keyboardType } = params;

  const [inputValue, setInputValue] = useState(fieldValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInputValue(fieldValue || '');
  }, [fieldValue]);

  const handleSave = async () => {
    if (!fieldKey) return;

    setLoading(true);
    setError(null);

    try {
      await api.user.updateUserProfile({ [fieldKey]: inputValue });
      // 保存成功后返回上一页
      router.back();
    } catch (err) {
      console.error('更新失败:', err);
      setError(err.message || '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top || 0 }]}>
      {/* 顶部导航栏 */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background.secondary || '#FFFFFF',
            borderBottomColor: theme.colors.border?.light || '#E5E7EB',
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          {fieldLabel || '编辑'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary[600]} />
          ) : (
            <Text style={[styles.confirmText, { color: theme.colors.primary[600] }]}>确定</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            {fieldLabel || '请输入'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.primary || '#FFFFFF',
                color: theme.colors.text.primary,
                borderColor: error
                  ? theme.colors.error || '#EF4444'
                  : theme.colors.border?.light || '#E5E7EB',
              },
            ]}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              setError(null);
            }}
            placeholder={`请输入${fieldLabel || ''}`}
            placeholderTextColor={theme.colors.text.tertiary || '#9CA3AF'}
            keyboardType={keyboardType || 'default'}
            autoFocus
            multiline={false}
          />
          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error || '#EF4444' }]}>
              {error}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    minWidth: 60,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputContainer: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 50,
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
  },
});

