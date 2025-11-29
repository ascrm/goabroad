/**
 * 账户与安全页面
 * 展示账号基础信息、联系方式与安全设置
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/src/components/ui/PageHeader';
import { useTheme } from '@/src/context/ThemeContext';
import { useUserInfo } from '@/src/hooks/auth';

const SECTION_CONFIG = (phone, email) => [
  {
    title: '账号绑定',
    description: '绑定信息可用于登录或身份验证，完善资料可提升账号安全等级',
    items: [
      { id: 'phone', icon: 'call-outline', label: '手机号绑定', value: phone },
      { id: 'email', icon: 'mail-outline', label: '邮箱绑定', value: email },
      { id: 'real-name', icon: 'id-card-outline', label: '实名认证', value: '未认证' },
      { id: 'password', icon: 'key-outline', label: '登录密码', value: '未设置' },
      { id: 'third-party', icon: 'link-outline', label: '第三方账号绑定', value: '去绑定' },
    ],
  },
  {
    title: '认证与备案',
    items: [
      {
        id: 'official',
        icon: 'ribbon-outline',
        label: '申请官方认证',
        value: '个人/机构账号认证',
      },
    ],
  },
  {
    title: '授权信息',
    items: [
      { id: 'privacy', icon: 'document-lock-outline', label: '隐私与授权', value: '查看' },
    ],
  },
];

export default function AccountScreen() {
  const { isDarkMode } = useTheme();
  const userInfo = useUserInfo();
  const [saveLogin, setSaveLogin] = useState(true);
  const insets = useSafeAreaInsets();

  const displayName = userInfo?.nickname || userInfo?.name || '旅行者';
  const accountId = userInfo?.id ? userInfo.id : '未获取';
  const phone = formatContact(userInfo?.phone);
  const email = userInfo?.email ? formatContact(userInfo.email) : '未绑定';

  const sections = useMemo(() => SECTION_CONFIG(phone, email), [phone, email]);
  const palette = useMemo(
    () => ({
      pageBg: isDarkMode ? '#05060C' : '#F5F6F8',
      cardBg: isDarkMode ? '#151C2B' : '#FFFFFF',
      avatarBg: isDarkMode ? '#232B3E' : '#E7E9F5',
      textPrimary: isDarkMode ? '#FFFFFF' : '#0B0D13',
      textSecondary: isDarkMode ? '#8D95B5' : '#5C6074',
      icon: isDarkMode ? '#ABB4D6' : '#5D6274',
      divider: isDarkMode ? '#1F2433' : '#E5E6EC',
      rowValue: isDarkMode ? '#7F88A4' : '#6F7485',
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
        title="账户与安全"
        onBack={() => router.back()}
        backgroundColor={isDarkMode ? '#0F1420' : '#FFFFFF'}
        textColor={isDarkMode ? '#FFFFFF' : '#0B0D13'}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: palette.cardBg }]}>
          <View style={[styles.avatar, { backgroundColor: palette.avatarBg }]}>
            <Text style={styles.avatarText}>{displayName.slice(0, 1)}</Text>
          </View>
          <Text style={[styles.name, { color: palette.textPrimary }]}>{displayName}</Text>
          <Text style={[styles.accountId, { color: palette.rowValue }]}>账号：{accountId}</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={[styles.section, { backgroundColor: palette.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>{section.title}</Text>
            <View style={styles.sectionBody}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity style={styles.row} activeOpacity={0.8}>
                    <View style={styles.rowLeft}>
                      <Ionicons name={item.icon} size={20} color={palette.icon} />
                      <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>{item.label}</Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={[styles.rowValue, { color: palette.rowValue }]}>{item.value}</Text>
                      <Ionicons name="chevron-forward" size={16} color={palette.rowValue} />
                    </View>
                  </TouchableOpacity>
                  {index !== section.items.length - 1 && (
                    <View style={[styles.rowDivider, { backgroundColor: palette.divider }]} />
                  )}
                </View>
              ))}
            </View>
            {section.description && (
              <Text style={[styles.sectionDesc, { color: palette.rowValue }]}>{section.description}</Text>
            )}
          </View>
        ))}

        <View style={[styles.section, { backgroundColor: palette.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: palette.textSecondary }]}>登录管理</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity style={styles.row} activeOpacity={0.8}>
              <View style={styles.rowLeft}>
                <Ionicons name="desktop-outline" size={20} color={palette.icon} />
                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>登录设备管理</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={palette.rowValue} />
            </TouchableOpacity>
            <View style={[styles.rowDivider, { backgroundColor: palette.divider }]} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="save-outline" size={20} color={palette.icon} />
                <Text style={[styles.rowLabel, { color: palette.textPrimary }]}>保存登录信息</Text>
              </View>
              <Switch
                value={saveLogin}
                onValueChange={setSaveLogin}
                thumbColor={saveLogin ? (isDarkMode ? '#0B0F19' : '#FFFFFF') : '#7C89A9'}
                trackColor={{
                  false: isDarkMode ? '#3E455C' : '#CFD2DC',
                  true: '#42E28F',
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const formatContact = (value) => {
  if (!value) return '未绑定';
  if (typeof value !== 'string') return value;
  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    if (!name || !domain) return value;
    return `${name.slice(0, 2)}***@${domain}`;
  }
  if (value.length >= 7) {
    return `${value.slice(0, 3)}****${value.slice(-4)}`;
  }
  return value;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 28,
    borderRadius: 20,
    backgroundColor: '#151C2B',
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#232B3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  accountId: {
    marginTop: 4,
    fontSize: 13,
    color: '#8D96B2',
  },
  section: {
    borderRadius: 18,
    padding: 18,
    gap: 12,
    backgroundColor: '#151C2B',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionBody: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    color: '#E6E9F5',
    fontSize: 15,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    color: '#7F88A4',
    fontSize: 13,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#21283C',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#5D6786',
    lineHeight: 18,
  },
});


