/**
 * 底部 Tab 布局
 * - 负责主业务导航（主页、清单、资源）
 * - 未登录用户重定向到登录页
 */
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { useIsLoggedIn } from '@/src/hooks/auth';

const TAB_ICON_MAP = {
  home: { active: 'speedometer', inactive: 'speedometer-outline' },
  checklist: { active: 'checkbox', inactive: 'checkbox-outline' },
  planner: { active: 'map', inactive: 'map-outline' },
  resources: { active: 'library', inactive: 'library-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabsLayout() {
  const isLoggedIn = useIsLoggedIn();
  const { theme, isDarkMode } = useTheme();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => {
        const iconConfig =
          TAB_ICON_MAP[route.name] ||
          TAB_ICON_MAP.home; // fallback to avoid crashes when route map missing
        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary[600],
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: theme.colors.background.primary,
              borderTopColor: theme.colors.border.light,
            },
          ],
          tabBarItemStyle: {
            paddingVertical: 0, // keep items compact so the overall bar looks slimmer
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? iconConfig.active : iconConfig.inactive}
              size={22}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
          },
        };
      }}
      sceneContainerStyle={{
        backgroundColor: isDarkMode
          ? theme.colors.background.secondary
          : theme.colors.background.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // hidden redirect route so it doesn't render a tab item
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: '主页',
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: '清单',
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: '规划',
          tabBarLabel: '',
          tabBarButton: (props) => (
            <PlannerTabButton
              {...props}
              colors={{
                primary: theme.colors.primary[600],
                shadow: theme.colors.shadow?.default || 'rgba(0,0,0,0.15)',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: '资源',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
        }}
      />
    </Tabs>
  );
}

const PlannerTabButton = ({ accessibilityState, onPress, colors }) => {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.centerButtonWrapper}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.centerButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
            opacity: focused ? 1 : 0.95,
          },
        ]}
      >
        <Ionicons name="map" size={26} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0.5,
    height: 66,
    paddingTop: 6,
    paddingBottom: 6,
  },
  centerButtonWrapper: {
    position: 'relative',
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
});


