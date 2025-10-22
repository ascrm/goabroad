/**
 * TabBar 底部标签栏组件
 * 5个Tab：首页、国家、规划、社区、我的
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../ui/Badge';

const TabBar = ({ style }) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      key: 'home',
      label: '首页',
      icon: 'home',
      iconOutline: 'home-outline',
      path: '/(tabs)',
    },
    {
      key: 'country',
      label: '国家',
      icon: 'globe',
      iconOutline: 'globe-outline',
      path: '/(tabs)/country',
    },
    {
      key: 'planning',
      label: '规划',
      icon: 'calendar',
      iconOutline: 'calendar-outline',
      path: '/(tabs)/planning',
      badge: 0, // 可以显示数字角标
    },
    {
      key: 'community',
      label: '社区',
      icon: 'people',
      iconOutline: 'people-outline',
      path: '/(tabs)/community',
    },
    {
      key: 'profile',
      label: '我的',
      icon: 'person',
      iconOutline: 'person-outline',
      path: '/(tabs)/profile',
      showDot: false, // 可以显示红点
    },
  ];

  const handleTabPress = (path) => {
    router.push(path);
  };

  const isActive = (path) => {
    if (path === '/(tabs)') {
      return pathname === '/' || pathname === '/(tabs)';
    }
    return pathname.startsWith(path);
  };

  return (
    <View style={[styles.tabBar, style]}>
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.path)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={active ? tab.icon : tab.iconOutline}
                size={24}
                color={active ? '#0066FF' : '#999999'}
              />
              {tab.badge > 0 && (
                <View style={styles.badgeContainer}>
                  <Badge color="error" size="sm">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </Badge>
                </View>
              )}
              {tab.showDot && (
                <Badge
                  dot
                  color="error"
                  size="sm"
                  style={styles.dotBadge}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                active && styles.label_active,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

TabBar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -12,
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  label: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
  },
  label_active: {
    color: '#0066FF',
    fontWeight: '600',
  },
});

export default TabBar;

