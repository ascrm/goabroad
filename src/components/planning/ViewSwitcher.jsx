/**
 * 视图切换器组件
 * 支持看板、时间线、日历三种视图模式切换
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    {
      id: 'kanban',
      label: '看板',
      icon: 'grid-outline',
      description: '卡片形式',
    },
    {
      id: 'timeline',
      label: '时间线',
      icon: 'git-branch-outline',
      description: '甘特图',
    },
    {
      id: 'calendar',
      label: '日历',
      icon: 'calendar-outline',
      description: '月视图',
    },
  ];

  return (
    <View style={styles.container}>
      {views.map((view) => {
        const isActive = currentView === view.id;
        return (
          <TouchableOpacity
            key={view.id}
            style={[
              styles.viewButton,
              isActive && styles.viewButtonActive,
            ]}
            onPress={() => onViewChange(view.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={view.icon}
              size={20}
              color={isActive ? COLORS.primary[600] : COLORS.gray[600]}
            />
            <View style={styles.viewInfo}>
              <Text
                style={[
                  styles.viewLabel,
                  isActive && styles.viewLabelActive,
                ]}
              >
                {view.label}
              </Text>
              <Text
                style={[
                  styles.viewDescription,
                  isActive && styles.viewDescriptionActive,
                ]}
              >
                {view.description}
              </Text>
            </View>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[50],
    position: 'relative',
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[600],
  },
  viewInfo: {
    flex: 1,
  },
  viewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 2,
  },
  viewLabelActive: {
    color: COLORS.primary[700],
  },
  viewDescription: {
    fontSize: 11,
    color: COLORS.gray[600],
  },
  viewDescriptionActive: {
    color: COLORS.primary[600],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: COLORS.primary[600],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default ViewSwitcher;

