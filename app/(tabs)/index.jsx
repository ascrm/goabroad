/**
 * Tabs 根路由
 * Expo Router 进入 /(tabs) 时默认命中此文件
 * 重定向到首页，避免出现 unmatched route
 */
import { Redirect } from 'expo-router';

export default function TabsIndex() {
  return <Redirect href="/(tabs)/home" />;
}


