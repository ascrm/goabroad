/**
 * 紧急任务卡片组件
 * 显示需要立即处理的紧急任务
 */

import { Ionicons } from '@expo/vector-icons';
import { differenceInDays, format, parseISO } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

export default function UrgentTaskCard({ task, stage }) {
  // 计算截止倒计时
  const daysLeft = differenceInDays(parseISO(task.dueDate), new Date());
  
  const handlePress = () => {
    console.log('立即处理任务:', task.title);
    // TODO: 跳转到任务详情或处理页面
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 警告图标 */}
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={32} color={COLORS.error[500]} />
        </View>

        {/* 内容 */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.badge}>下一步行动</Text>
            <View style={styles.countdown}>
              <Ionicons name="time" size={16} color={COLORS.error[500]} />
              <Text style={styles.countdownText}>
                {daysLeft > 0 ? `还剩 ${daysLeft} 天` : '已逾期'}
              </Text>
            </View>
          </View>

          <Text style={styles.taskTitle}>{task.title}</Text>
          
          <View style={styles.stageInfo}>
            <Text style={styles.stageText}>阶段：{stage.title}</Text>
            <Text style={styles.dueDateText}>
              截止：{format(parseISO(task.dueDate), 'yyyy-MM-dd')}
            </Text>
          </View>

          {/* 操作按钮 */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>立即处理</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.error[500],
    shadowColor: COLORS.error[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error[500],
    backgroundColor: `${COLORS.error[500]}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error[500],
    marginLeft: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginRight: 12,
  },
  dueDateText: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.error[500],
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
});

