/**
 * 注册页面
 * 支持手机号注册、验证码验证、密码强度检测
 */

import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { authApi } from '@/src/services/api';
import { useAppDispatch } from '@/src/store/hooks';
import { registerUser } from '@/src/store/slices/authSlice';
import { checkPasswordStrength, registerSchema } from '@/src/utils/validation';

const Register = () => {
  const dispatch = useAppDispatch();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
  
  // 验证码相关
  const [countdown, setCountdown] = useState(0);
  const [canSendCode, setCanSendCode] = useState(true);
  
  // 密码强度
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '', color: '#CCCCCC' });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      phone: '',
      verifyCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const phone = watch('phone');
  const password = watch('password');

  // 监听密码变化，更新强度
  useEffect(() => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  // 倒计时
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanSendCode(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast({ visible: false, type: 'success', message: '' }), 3000);
  };

  const handleSendCode = async () => {
    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('error', '请输入有效的手机号');
      return;
    }

    if (!canSendCode) return;

    try {
      setCanSendCode(false);
      
      // 调用发送验证码 API
      await authApi.sendVerificationCode({ phone});
      
      showToast('success', '验证码已发送');
      setCountdown(60);
      
    } catch (error) {
      showToast('error', error.message || '发送失败，请稍后重试');
      setCanSendCode(true);
    }
  };

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      showToast('error', '请阅读并同意用户协议');
      return;
    }

    try {
      setLoading(true);
      
      // 调用注册 API
      const result = await dispatch(registerUser({
        phone: data.phone,
        code: data.verifyCode,
        password: data.password,
      })).unwrap();
      
      showToast('success', '注册成功！');
      
      // 注册成功后跳转到引导页面
      setTimeout(() => {
        router.replace('/(auth)/interests');
      }, 1500);
      
    } catch (error) {
      showToast('error', error?.message);
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>加入 GoAbroad，开启留学之旅</Text>
        </View>

        {/* 表单 */}
        <View style={styles.form}>
          {/* 手机号 */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="手机号"
                  keyboardType="phone-pad"
                  prefixIcon={<Ionicons name="phone-portrait-outline" size={20} color="#999" />}
                  error={!!errors.phone}
                  errorMessage={errors.phone?.message}
                  clearable
                />
              )}
            />
          </View>

          {/* 验证码 */}
          <View style={styles.inputContainer}>
            <View style={styles.codeInputRow}>
              <View style={styles.codeInput}>
                <Controller
                  control={control}
                  name="verifyCode"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="验证码"
                      keyboardType="number-pad"
                      maxLength={6}
                      prefixIcon={<Ionicons name="shield-checkmark-outline" size={20} color="#999" />}
                      error={!!errors.verifyCode}
                      errorMessage={errors.verifyCode?.message}
                    />
                  )}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  !canSendCode && styles.sendCodeButtonDisabled,
                ]}
                onPress={handleSendCode}
                disabled={!canSendCode}
              >
                <Text style={[
                  styles.sendCodeText,
                  !canSendCode && styles.sendCodeTextDisabled,
                ]}>
                  {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 密码 */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="设置密码（6-20位，含字母和数字）"
                  type="password"
                  prefixIcon={<Ionicons name="lock-closed-outline" size={20} color="#999" />}
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            
            {/* 密码强度指示器 */}
            {password && (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBars}>
                  <View style={[
                    styles.strengthBar,
                    passwordStrength.strength >= 1 && { backgroundColor: passwordStrength.color },
                  ]} />
                  <View style={[
                    styles.strengthBar,
                    passwordStrength.strength >= 2 && { backgroundColor: passwordStrength.color },
                  ]} />
                  <View style={[
                    styles.strengthBar,
                    passwordStrength.strength >= 3 && { backgroundColor: passwordStrength.color },
                  ]} />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  密码强度：{passwordStrength.text}
                </Text>
              </View>
            )}
          </View>

          {/* 确认密码 */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="再次输入密码"
                  type="password"
                  prefixIcon={<Ionicons name="lock-closed-outline" size={20} color="#999" />}
                  error={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          {/* 用户协议 */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              我已阅读并同意
              <Text style={styles.termsLink}> 用户协议 </Text>
              和
              <Text style={styles.termsLink}> 隐私政策</Text>
            </Text>
          </TouchableOpacity>

          {/* 注册按钮 */}
          <Button
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.registerButton}
          >
            注册
          </Button>
        </View>

        {/* 登录链接 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>已有账号？</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>立即登录 →</Text>
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
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  codeInput: {
    flex: 1,
  },
  sendCodeButton: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendCodeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sendCodeTextDisabled: {
    color: '#999999',
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#0066FF',
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 8,
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
  loginLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
});

export default Register;

