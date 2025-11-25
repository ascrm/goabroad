/**
 * 鐧诲綍椤甸潰
 * 鏀寔鎵嬫満鍙?閭鐧诲綍銆佽浣忔垜銆佺涓夋柟鐧诲綍
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
    View
} from 'react-native';

import { Button, Input, Toast } from '@/src/components';
import { useAppDispatch } from '@/src/store/hooks';
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
      rememberMe: false,
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
        account: data.account,
        password: data.password,
      };

      const result = await dispatch(loginUser(loginData)).unwrap();
      
      showToast('success', '鐧诲綍鎴愬姛锛?);
      
      // 寤惰繜璺宠浆锛岃鐢ㄦ埛鐪嬪埌鎻愮ず
      setTimeout(() => {
        // 鏍规嵁寮曞瀹屾垚鐘舵€佽烦杞?
        if (onboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/interests');
        }
      }, 1000);
      
    } catch (error) {
      showToast('error', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartyLogin = (provider) => {
    showToast('info', `${provider}鐧诲綍鍔熻兘鍗冲皢寮€鏀綻);
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
        {/* Logo 鍜屾爣棰?*/}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="earth" size={60} color="#0066FF" />
          </View>
          <Text style={styles.title}>娆㈣繋鍥炴潵</Text>
          <Text style={styles.subtitle}>鐧诲綍浣犵殑 GoAbroad 璐﹀彿</Text>
        </View>

        {/* 琛ㄥ崟 */}
        <View style={styles.form}>
          {/* 璐﹀彿杈撳叆 */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="account"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="鎵嬫満鍙锋垨閭"
                  prefixIcon={<Ionicons name="person-outline" size={20} color="#999" />}
                  error={!!errors.account}
                  errorMessage={errors.account?.message}
                  clearable
                />
              )}
            />
          </View>

          {/* 瀵嗙爜杈撳叆 */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="瀵嗙爜"
                  type="password"
                  prefixIcon={<Ionicons name="lock-closed-outline" size={20} color="#999" />}
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              )}
            />
          </View>

          {/* 璁颁綇鎴?& 蹇樿瀵嗙爜 */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberMeText}>璁颁綇鎴?/Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotPassword}>蹇樿瀵嗙爜锛?/Text>
            </TouchableOpacity>
          </View>

          {/* 鐧诲綍鎸夐挳 */}
          <Button
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          >
            鐧诲綍
          </Button>

          {/* 鍒嗛殧绾?*/}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>鎴?/Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 绗笁鏂圭櫥褰?*/}
          <View style={styles.thirdPartyContainer}>
            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('Apple')}
            >
              <Ionicons name="logo-apple" size={32} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('寰俊')}
            >
              <Ionicons name="logo-wechat" size={32} color="#07C160" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.thirdPartyButton}
              onPress={() => handleThirdPartyLogin('QQ')}
            >
              <View style={styles.qqIcon}>
                <Ionicons name="chatbubble" size={32} color="#12B7F5" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 娉ㄥ唽閾炬帴 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>杩樻病璐﹀彿锛?/Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>绔嬪嵆娉ㄥ唽 鈫?/Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast 鎻愮ず */}
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




