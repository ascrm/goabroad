/**
 * Country Layout
 * 国家模块布局
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function CountryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[code]" />
    </Stack>
  );
}

