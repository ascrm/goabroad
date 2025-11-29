/**
 * 登录页面
 * 支持手机号 / 邮箱登录与三方占位提示
 */

import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input, Toast } from '@/src/components';
import { useAppDispatch } from '@/src/hooks/auth';
import { loginUser } from '@/src/store/slices/authSlice';
import { loginSchema } from '@/src/utils/validation';

const Login = () => {
  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast({ visible: false, type: 'success', message: '' }), 3000);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const loginData = {
        account: data.account.trim(),
        password: data.password,
        rememberMe,
      };

      await dispatch(loginUser(loginData)).unwrap();

      showToast('success', '登录成功！');

      // 延迟跳转以展示提示
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 800);
    } catch (error) {
      showToast('error', error?.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>欢迎回来</Text>
            <Text style={styles.subtitle}>登录您的 GoAbroad 账号</Text>
          </View>

          {/* 表单卡片 */}
          <View style={styles.card}>

            {/* 账号输入 */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="account"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="手机号或邮箱"
                    prefixIcon={<Ionicons name="person-outline" size={20} color="#999" />}
                    error={!!errors.account}
                    errorMessage={errors.account?.message}
                    clearable
                  />
                )}
              />
            </View>

            {/* 密码输入 */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="密码"
                    type="password"
                    prefixIcon={<Ionicons name="lock-closed-outline" size={20} color="#999" />}
                    error={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                )}
              />
            </View>

            {/* 记住我 & 忘记密码 */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.rememberMeText}>记住我</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPassword}>忘记密码？</Text>
              </TouchableOpacity>
            </View>

            <Button
              fullWidth
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.loginButton}
            >
              登录
            </Button>
          </View>

          {/* 注册引导 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>还没有账号？</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>立即注册</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Toast 提示 */}
        <Toast
          visible={toast.visible}
          type={toast.type}
          message={toast.message}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666666',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default Login;




