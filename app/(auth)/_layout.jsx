/**
 * Auth 布局
 * 登录、注册相关页面的布局
 */

import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

export default function AuthLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: '登录',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: '注册',
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: '忘记密码',
          }}
        />
      </Stack>
    </>
  );
}

