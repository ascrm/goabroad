/**
 * 设置页面
 * 参考抖音深色设置风格，展示通用与关于配置
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/src/components/ui/PageHeader';
import SettingsSectionCard from '@/src/components/ui/SettingsSectionCard';
import { useTheme } from '@/src/context/ThemeContext';

const GENERAL_SETTINGS = [
  { id: 'notification', icon: 'notifications-outline', label: '通知设置' },
  { id: 'background', icon: 'color-palette-outline', label: '背景设置' },
  { id: 'clear-cache', icon: 'trash-outline', label: '清理缓存' },
];

const ABOUT_SETTINGS = [
  { id: 'about', icon: 'information-circle-outline', label: '关于 GoAbroad' },
  { id: 'feedback', icon: 'help-circle-outline', label: '反馈与帮助' },
];

export default function SettingsScreen() {
  const { themeMode, setThemeMode, isDarkMode } = useTheme();
  const [cacheSize, setCacheSize] = useState('356MB');
  const [searchValue, setSearchValue] = useState('');
  const insets = useSafeAreaInsets();

  const handleItemPress = async (id) => {
    switch (id) {
      case 'clear-cache':
        // TODO: 调用实际清理逻辑
        setCacheSize('0MB');
        break;
      default:
        console.log('Navigate to', id);
    }
  };

  const handleAccountAction = (type) => {
    if (type === 'switch') {
      router.push('/(auth)/login');
      return;
    }
    if (type === 'logout') {
      router.replace('/(auth)/login');
    }
  };

  const palette = useMemo(
    () => ({
      pageBg: isDarkMode ? '#05060C' : '#F5F6F8',
      cardBg: isDarkMode ? '#0F111C' : '#FFFFFF',
      searchBg: isDarkMode ? '#0F111C' : '#FFFFFF',
      icon: isDarkMode ? '#ABB4D6' : '#5F6578',
      textPrimary: isDarkMode ? '#E7EAF6' : '#07080E',
      textSecondary: isDarkMode ? '#7C84A2' : '#7D8499',
      value: isDarkMode ? '#7F88A4' : '#6F7387',
      divider: isDarkMode ? '#1F2433' : '#E6E8EF',
      actionBorder: isDarkMode ? '#1F2433' : '#DADDE6',
      logoutBg: isDarkMode ? '#1F1A1A' : '#FFF0F0',
      logoutText: isDarkMode ? '#FF6B6B' : '#C62828',
    }),
    [isDarkMode],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.pageBg, paddingTop: insets.top || 0 },
      ]}
    >
      <PageHeader
        title="设置"
        onBack={() => router.back()}
        backgroundColor={isDarkMode ? '#05060C' : '#FFFFFF'}
        textColor={isDarkMode ? '#FFFFFF' : '#0B0D13'}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchBar, { backgroundColor: palette.searchBg }]}>
          <Ionicons name="search-outline" size={18} color={palette.value} />
          <TextInput
            placeholder="搜索"
            placeholderTextColor={palette.value}
            style={[styles.searchInput, { color: palette.textPrimary }]}
            value={searchValue}
            onChangeText={setSearchValue}
          />
        </View>

        <SettingsSectionCard
          title="通用"
          items={GENERAL_SETTINGS.map((item) => ({
            ...item,
            onPress:
              item.id === 'background'
                ? undefined
                : () => handleItemPress(item.id),
            renderRight:
              item.id === 'background'
                ? () => (
                    <BackgroundModeSelector
                      mode={themeMode}
                      onSelect={setThemeMode}
                      palette={palette}
                      isDarkMode={isDarkMode}
                    />
                  )
                : item.id === 'clear-cache'
                  ? () => (
                      <Text style={[styles.rowValue, { color: palette.value }]}>
                        {cacheSize}
                      </Text>
                    )
                  : undefined,
          }))}
          colors={{
            cardBg: palette.cardBg,
            title: palette.textSecondary,
            icon: palette.icon,
            textPrimary: palette.textPrimary,
            textSecondary: palette.textSecondary,
            value: palette.value,
            divider: palette.divider,
          }}
        />
        <SettingsSectionCard
          title="关于"
          items={ABOUT_SETTINGS.map((item) => ({
            ...item,
            onPress: () => handleItemPress(item.id),
            renderRight: () => (
              <Ionicons name="chevron-forward" size={16} color={palette.value} />
            ),
          }))}
          colors={{
            cardBg: palette.cardBg,
            title: palette.textSecondary,
            icon: palette.icon,
            textPrimary: palette.textPrimary,
            textSecondary: palette.textSecondary,
            value: palette.value,
            divider: palette.divider,
          }}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: palette.actionBorder }]}
            activeOpacity={0.85}
            onPress={() => handleAccountAction('switch')}
          >
            <Text style={[styles.actionText, { color: palette.textPrimary }]}>切换账号</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.logoutButton,
              { backgroundColor: palette.logoutBg, borderColor: 'transparent' },
            ]}
            activeOpacity={0.85}
            onPress={() => handleAccountAction('logout')}
          >
            <Text style={[styles.actionText, { color: palette.logoutText }]}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const BackgroundModeSelector = ({ mode, onSelect, palette, isDarkMode }) => (
  <View style={styles.modeSelector}>
    {[
      { id: 'light', label: '白天' },
      { id: 'dark', label: '黑夜' },
    ].map((option) => {
      const active = mode === option.id;
      return (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.modeButton,
            {
              backgroundColor: active
                ? isDarkMode
                  ? '#1C2333'
                  : '#E5E8F0'
                : 'transparent',
              borderColor: active ? palette.value : palette.divider,
            },
          ]}
          onPress={() => onSelect(option.id)}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: active ? palette.textPrimary : palette.value },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  rowValue: {
    fontSize: 13,
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
  },
  backgroundRow: {
    alignItems: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 13,
  },
});

