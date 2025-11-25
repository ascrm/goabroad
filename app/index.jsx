/**
 * 根路由重定向
 * Expo Router 默认命中 "/"，显式重定向到登录页，避免出现空白屏
 */
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}

