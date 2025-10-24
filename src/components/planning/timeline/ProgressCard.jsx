/**
 * 进度卡片组件
 * 显示规划的整体进度和统计信息
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { COLORS } from '@/src/constants';

export default function ProgressCard({
  progress,
  completedTasks,
  totalTasks,
  daysUntilTarget,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 环形进度图 */}
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={100}
            width={8}
            fill={progress}
            tintColor={COLORS.primary[600]}
            backgroundColor={COLORS.gray[200]}
            rotation={0}
          >
            {() => (
              <View style={styles.progressContent}>
                <Text style={styles.progressValue}>{progress}%</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* 统计信息 */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success[500]} />
            <Text style={styles.statText}>
              已完成 <Text style={styles.statHighlight}>{completedTasks}/{totalTasks}</Text> 项任务
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Ionicons name="time" size={20} color={COLORS.primary[600]} />
            <Text style={styles.statText}>
              距离入学还有 <Text style={styles.statHighlight}>{daysUntilTarget}</Text> 天
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    marginRight: 20,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  statsContainer: {
    flex: 1,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 15,
    color: COLORS.gray[700],
    marginLeft: 8,
  },
  statHighlight: {
    fontWeight: '700',
    color: COLORS.gray[900],
  },
});

