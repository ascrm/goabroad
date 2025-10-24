/**
 * Tabs Layout
 * 底部标签栏布局
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';

export default function TabsLayout() {
  // 从 Redux 获取角标数据
  const todoCount = useSelector((state) => state.planning.todoCount);
  const unreadCount = useSelector((state) => state.ui.unreadCount);

  // 格式化角标数字（>99 显示 99+）
  const formatBadge = (count) => {
    if (!count || count <= 0) return undefined;
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.gray[200],
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 60 : 56,
          paddingBottom: Platform.OS === 'ios' ? 8 : 4,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarBadgeStyle: {
          backgroundColor: COLORS.error[500],
          color: COLORS.white,
          fontSize: 10,
          fontWeight: '700',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          lineHeight: 18,
          textAlign: 'center',
        },
      }}
    >
      {/* Tab 1 - 首页 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2 - 国家 */}
      <Tabs.Screen
        name="countries"
        options={{
          title: '国家',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'globe' : 'globe-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3 - 规划 */}
      <Tabs.Screen
        name="planning"
        options={{
          title: '规划',
          tabBarBadge: formatBadge(todoCount),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'clipboard' : 'clipboard-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 4 - 社区 */}
      <Tabs.Screen
        name="community"
        options={{
          title: '社区',
          tabBarBadge: formatBadge(unreadCount),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5 - 我的 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
