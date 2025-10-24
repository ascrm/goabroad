/**
 * 问候区组件
 * 显示动态问候语和用户昵称
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/src/constants';

const GreetingHeader = ({ userName, targetDate, targetCountry }) => {
  // 获取动态问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  // 计算倒计时
  const calculateDaysLeft = () => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {getGreeting()}，{userName || '用户'}
      </Text>
      {daysLeft !== null && (
        <Text style={styles.countdown}>
          距离{targetCountry || '留学'}出发还有{' '}
          <Text style={styles.daysNumber}>{daysLeft}</Text> 天
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  countdown: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  daysNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
});

export default GreetingHeader;

