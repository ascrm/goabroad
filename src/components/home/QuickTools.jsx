/**
 * 快捷工具区组件
 * 显示常用工具的快捷入口
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const TOOLS = [
  {
    id: 'cost-calculator',
    icon: 'calculator',
    name: '费用计算',
    description: '计算留学费用',
    color: COLORS.primary[600],
    bgColor: COLORS.primary[50],
    route: '/tools/cost-calculator',
  },
  {
    id: 'visa-slots',
    icon: 'calendar',
    name: '签证预约',
    description: '查看预约时间',
    color: COLORS.success[600],
    bgColor: COLORS.success[50],
    route: '/tools/visa-slots',
  },
  {
    id: 'gpa-converter',
    icon: 'sync',
    name: 'GPA转换',
    description: '成绩转换工具',
    color: COLORS.warning[600],
    bgColor: COLORS.warning[50],
    route: '/tools/gpa-converter',
  },
  {
    id: 'checklist',
    icon: 'list',
    name: '清单下载',
    description: '材料清单模板',
    color: COLORS.info[600],
    bgColor: COLORS.info[50],
    route: '/tools/checklist',
  },
  {
    id: 'exchange-rate',
    icon: 'cash',
    name: '汇率换算',
    description: '实时汇率查询',
    color: COLORS.error[600],
    bgColor: COLORS.error[50],
    route: '/tools/exchange-rate',
  },
  {
    id: 'time-zone',
    icon: 'time',
    name: '时差查询',
    description: '全球时差对比',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    route: '/tools/time-zone',
  },
];

const QuickTools = () => {
  const handleToolPress = (tool) => {
    // 这里可以根据工具类型导航到不同页面
    // router.push(tool.route);
    console.log('打开工具:', tool.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ 快捷工具</Text>
        <TouchableOpacity
          onPress={() => router.push('/tools')}
          style={styles.moreButton}
        >
          <Text style={styles.moreText}>更多</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TOOLS.map((tool, index) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, index === 0 && styles.firstCard]}
            onPress={() => handleToolPress(tool)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: tool.bgColor }]}>
              <Ionicons name={tool.icon} size={28} color={tool.color} />
            </View>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolDescription} numberOfLines={1}>
              {tool.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginRight: 2,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 120,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  firstCard: {
    marginLeft: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
});

export default QuickTools;

