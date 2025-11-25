import * as yup from 'yup';

const phoneRegex = /^1[3-9]\d{9}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{6,20}$/;

const isValidPhone = (value = '') => phoneRegex.test(value.trim());
const isValidEmail = (value = '') => emailRegex.test(value.trim());

export const loginSchema = yup.object().shape({
  account: yup
    .string()
    .required('请输入手机号或邮箱')
    .test('is-valid-account', '请输入有效的手机号或邮箱', (value) => {
      if (!value) return false;
      return isValidPhone(value) || isValidEmail(value);
    }),
  password: yup
    .string()
    .required('请输入密码')
    .matches(passwordRegex, '密码需为6-20位，且包含字母和数字'),
});

export const registerSchema = yup.object().shape({
  phone: yup
    .string()
    .required('请输入手机号')
    .matches(phoneRegex, '请输入有效的手机号'),
  verifyCode: yup
    .string()
    .required('请输入验证码')
    .length(6, '验证码为6位数字')
    .matches(/^\d+$/, '验证码只能包含数字'),
  password: yup
    .string()
    .required('请设置密码')
    .matches(passwordRegex, '密码需为6-20位，且包含字母和数字'),
  confirmPassword: yup
    .string()
    .required('请再次输入密码')
    .oneOf([yup.ref('password'), null], '两次输入的密码不一致'),
});

export const forgotPasswordSchema = yup.object().shape({
  phone: yup
    .string()
    .required('请输入手机号')
    .matches(phoneRegex, '请输入有效的手机号'),
  verifyCode: yup
    .string()
    .required('请输入验证码')
    .length(6, '验证码为6位数字')
    .matches(/^\d+$/, '验证码只能包含数字'),
  newPassword: yup
    .string()
    .required('请设置新密码')
    .matches(passwordRegex, '密码需为6-20位，且包含字母和数字'),
  confirmPassword: yup
    .string()
    .required('请再次输入密码')
    .oneOf([yup.ref('newPassword'), null], '两次输入的密码不一致'),
});

export const checkPasswordStrength = (password = '') => {
  if (!password) {
    return { strength: 0, text: '', color: '#CCCCCC' };
  }

  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (/[A-Z]/.test(password) || /[!@#$%^&*()_+\-=]/.test(password)) strength += 1;
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) strength += 1;

  const strengthMap = {
    1: { text: '弱', color: '#FF6B6B' },
    2: { text: '中', color: '#FFA726' },
    3: { text: '强', color: '#43A047' },
  };

  const fallback = { text: '弱', color: '#FF6B6B' };
  const level = strength > 3 ? 3 : strength;

  if (level === 0) return { strength: 0, text: '', color: '#CCCCCC' };

  return { strength: level, ...(strengthMap[level] || fallback) };
};

