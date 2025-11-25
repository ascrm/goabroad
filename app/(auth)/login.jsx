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

import { Button, Input, Toast } from '@/src/components';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { loginUser } from '@/src/store/slices/authSlice';
import { loginSchema } from '@/src/utils/validation';

const Login = () => {
  const dispatch = useAppDispatch();
  const onboardingCompleted = useAppSelector(
    (state) => state.user?.preferences?.onboarding?.completed,
  );
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
        if (onboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/interests');
        }
      }, 800);
    } catch (error) {
      showToast('error', error?.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartyLogin = (provider) => {
    showToast('info', `${provider} 登录功能暂未开放`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo 与标题 */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="earth" size={60} color="#0066FF" />
          </View>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录你的 GoAbroad 账号</Text>
        </View>

        {/* 表单 */}
        <View style={styles.form}>
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

          {/* 登录按钮 */}
          <Button
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          >
            登录
          </Button>

          {/* 分隔线 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>或</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 第三方登录 */}
          <View style={styles.thirdPartyContainer}>
            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('Apple')}
            >
              <Ionicons name="logo-apple" size={32} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('微信')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#07C160" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('QQ')}
            >
              <View style={styles.qqIcon}>
                <Ionicons name="chatbubble" size={28} color="#12B7F5" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 注册链接 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>还没有账号？</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>立即注册 →</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 32,
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
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666666',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999999',
  },
  thirdPartyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  thirdPartyButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qqIcon: {
    transform: [{ rotate: '-15deg' }],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
});

export default Login;




