/**
 * 快捷工具网格组件
 * 首页顶部固定显示的快捷工具（4个）
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const QUICK_TOOLS = [
  {
    id: 'cost-calculator',
    icon: 'calculator-outline',
    name: '费用计算',
    color: COLORS.primary[600],
    bgColor: COLORS.primary[50],
    route: '/tools/cost-calculator',
  },
  {
    id: 'visa-slots',
    icon: 'calendar-outline',
    name: '签证预约',
    color: COLORS.success[600],
    bgColor: COLORS.success[50],
    route: '/tools/visa-slots',
  },
  {
    id: 'gpa-converter',
    icon: 'sync-outline',
    name: 'GPA转换',
    color: COLORS.warning[600],
    bgColor: COLORS.warning[50],
    route: '/tools/gpa-converter',
  },
  {
    id: 'more',
    icon: 'apps-outline',
    name: '更多工具',
    color: COLORS.gray[600],
    bgColor: COLORS.gray[100],
    route: '/tools',
  },
];

const QuickToolsGrid = () => {
  const handleToolPress = (tool) => {
    console.log('打开工具:', tool.name);
    // router.push(tool.route);
  };

  return (
    <View style={styles.container}>
      {QUICK_TOOLS.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={styles.toolItem}
          onPress={() => handleToolPress(tool)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: tool.bgColor }]}>
            <Ionicons name={tool.icon} size={24} color={tool.color} />
          </View>
          <Text style={styles.toolName} numberOfLines={1}>
            {tool.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  toolItem: {
    alignItems: 'center',
    width: '23%',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolName: {
    fontSize: 12,
    color: COLORS.gray[700],
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuickToolsGrid;

