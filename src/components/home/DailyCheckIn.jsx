/**
 * 每日签到/任务系统组件
 * 提升用户留存和活跃度
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const DailyCheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setPoints(points + 10);
      setStreak(streak + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>⭐ 每日签到</Text>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color={COLORS.warning[600]} />
            <Text style={styles.streakText}>连续{streak}天</Text>
          </View>
        </View>
        <View style={styles.pointsContainer}>
          <Ionicons name="diamond" size={16} color={COLORS.primary[600]} />
          <Text style={styles.pointsText}>{points}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.weekDays}>
          {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
            <View
              key={index}
              style={[
                styles.dayItem,
                index < streak && styles.dayItemChecked,
                index === streak - 1 && styles.dayItemToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  index < streak && styles.dayTextChecked,
                ]}
              >
                {day}
              </Text>
              {index < streak && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={COLORS.primary[600]}
                  style={styles.checkIcon}
                />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.checkInButton,
            isCheckedIn && styles.checkInButtonDisabled,
          ]}
          onPress={handleCheckIn}
          disabled={isCheckedIn}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isCheckedIn ? 'checkmark-circle' : 'gift'}
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.checkInButtonText}>
            {isCheckedIn ? '今日已签到' : '签到领积分 +10'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasks}>
        <Text style={styles.tasksTitle}>今日任务</Text>
        <View style={styles.tasksList}>
          <View style={styles.taskItem}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success[600]} />
            <Text style={styles.taskText}>浏览3篇攻略</Text>
            <Text style={styles.taskReward}>+5积分</Text>
          </View>
          <View style={styles.taskItem}>
            <Ionicons name="ellipse-outline" size={18} color={COLORS.gray[400]} />
            <Text style={styles.taskText}>发布1条动态</Text>
            <Text style={styles.taskReward}>+15积分</Text>
          </View>
          <View style={styles.taskItem}>
            <Ionicons name="ellipse-outline" size={18} color={COLORS.gray[400]} />
            <Text style={styles.taskText}>完成1个规划任务</Text>
            <Text style={styles.taskReward}>+20积分</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 11,
    color: COLORS.warning[700],
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    color: COLORS.primary[700],
    fontWeight: '700',
  },
  content: {
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayItem: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    position: 'relative',
  },
  dayItemChecked: {
    backgroundColor: COLORS.primary[50],
  },
  dayItemToday: {
    borderWidth: 2,
    borderColor: COLORS.primary[600],
  },
  dayText: {
    fontSize: 13,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  dayTextChecked: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  checkIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  checkInButtonDisabled: {
    backgroundColor: COLORS.gray[400],
  },
  checkInButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: '600',
  },
  tasks: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  tasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  tasksList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray[700],
  },
  taskReward: {
    fontSize: 12,
    color: COLORS.primary[600],
    fontWeight: '600',
  },
});

export default DailyCheckIn;

