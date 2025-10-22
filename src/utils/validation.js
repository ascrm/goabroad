/**
 * 表单验证 Schemas
 * 使用 Yup 进行表单验证
 */

import * as yup from 'yup';

// 手机号正则（中国手机号）
const phoneRegex = /^1[3-9]\d{9}$/;

// 邮箱正则
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// 密码正则（6-20位，至少包含字母和数字）
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/;

// 登录验证 Schema
export const loginSchema = yup.object().shape({
  account: yup
    .string()
    .required('请输入手机号或邮箱')
    .test('account-format', '请输入有效的手机号或邮箱', (value) => {
      if (!value) return false;
      return phoneRegex.test(value) || emailRegex.test(value);
    }),
  password: yup
    .string()
    .required('请输入密码')
    .min(6, '密码至少6位')
    .max(20, '密码最多20位'),
  rememberMe: yup.boolean(),
});

// 注册验证 Schema
export const registerSchema = yup.object().shape({
  phone: yup
    .string()
    .required('请输入手机号')
    .matches(phoneRegex, '请输入有效的手机号'),
  verifyCode: yup
    .string()
    .required('请输入验证码')
    .length(6, '验证码为6位数字')
    .matches(/^\d{6}$/, '验证码只能包含数字'),
  password: yup
    .string()
    .required('请设置密码')
    .matches(passwordRegex, '密码需6-20位，至少包含字母和数字'),
  confirmPassword: yup
    .string()
    .required('请再次输入密码')
    .oneOf([yup.ref('password')], '两次密码输入不一致'),
});

// 忘记密码验证 Schema
export const forgotPasswordSchema = yup.object().shape({
  phone: yup
    .string()
    .required('请输入手机号')
    .matches(phoneRegex, '请输入有效的手机号'),
  verifyCode: yup
    .string()
    .required('请输入验证码')
    .length(6, '验证码为6位数字')
    .matches(/^\d{6}$/, '验证码只能包含数字'),
  newPassword: yup
    .string()
    .required('请设置新密码')
    .matches(passwordRegex, '密码需6-20位，至少包含字母和数字'),
  confirmPassword: yup
    .string()
    .required('请再次输入密码')
    .oneOf([yup.ref('newPassword')], '两次密码输入不一致'),
});

// 密码强度检测
export const checkPasswordStrength = (password) => {
  if (!password) return { strength: 0, text: '', color: '#CCCCCC' };
  
  let strength = 0;
  
  // 长度检查
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  
  // 包含数字
  if (/\d/.test(password)) strength += 1;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 1;
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength += 1;
  
  // 包含特殊字符
  if (/[@$!%*#?&]/.test(password)) strength += 1;
  
  // 根据强度返回结果
  if (strength <= 2) {
    return { strength: 1, text: '弱', color: '#FF4444' };
  } else if (strength <= 4) {
    return { strength: 2, text: '中', color: '#FF9800' };
  } else {
    return { strength: 3, text: '强', color: '#00C853' };
  }
};

// 验证手机号
export const isValidPhone = (phone) => {
  return phoneRegex.test(phone);
};

// 验证邮箱
export const isValidEmail = (email) => {
  return emailRegex.test(email);
};

// 验证密码
export const isValidPassword = (password) => {
  return passwordRegex.test(password);
};

