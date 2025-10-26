/**
 * Tabs Layout
 * 底部标签栏布局 - 带中间凸起规划按钮
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
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
              size={26}
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
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3 - 规划（中间凸起按钮）*/}
      <Tabs.Screen
        name="planning"
        options={{
          title: '规划',
          tabBarBadge: formatBadge(todoCount),
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButtonContainer}>
              <View style={[
                styles.centerButton,
                focused && styles.centerButtonActive
              ]}>
                <Ionicons
                  name={focused ? 'clipboard' : 'clipboard-outline'}
                  size={28}
                  color={COLORS.white}
                />
              </View>
            </View>
          ),
          tabBarLabel: () => null, // 隐藏中间按钮的文字
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
              size={26}
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
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    position: 'absolute',
    top: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  centerButtonActive: {
    backgroundColor: COLORS.primary[700],
    transform: [{ scale: 1.05 }],
  },
});
