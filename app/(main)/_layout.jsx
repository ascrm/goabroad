/**
 * Main 应用布局
 * 包含首页、个人中心等主要功能
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}

