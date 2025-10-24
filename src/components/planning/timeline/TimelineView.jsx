/**
 * 时间线视图组件
 * 显示规划的阶段和任务
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { COLORS } from '@/src/constants';
import StageCard from './StageCard';
import UrgentTaskCard from './UrgentTaskCard';

export default function TimelineView({ stages }) {
  // 找出下一步紧急任务
  const urgentTask = findUrgentTask(stages);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 紧急任务提醒 */}
      {urgentTask && (
        <UrgentTaskCard
          task={urgentTask.task}
          stage={urgentTask.stage}
        />
      )}

      {/* 阶段列表 */}
      <View style={styles.stagesContainer}>
        {stages.map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isLast={index === stages.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// 找出紧急任务
function findUrgentTask(stages) {
  for (const stage of stages) {
    if (stage.status === 'in_progress') {
      const urgentTask = stage.tasks.find(task => task.urgent && !task.completed);
      if (urgentTask) {
        return { task: urgentTask, stage };
      }
    }
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  stagesContainer: {
    paddingBottom: 20,
  },
});

