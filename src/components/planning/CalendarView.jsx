/**
 * 日历视图组件
 * 按时间节点展示任务
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const CalendarView = ({ plans, onPlanPress, onTaskPress }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 获取月份的天数
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 添加上个月的日期（填充）
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // 添加当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  // 获取指定日期的任务
  const getTasksForDate = (day) => {
    if (!day) return [];
    
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    const allTasks = plans.flatMap((plan) =>
      (plan.tasks || []).map((task) => ({
        ...task,
        planId: plan.id,
        planName: plan.name,
        planType: plan.type,
      }))
    );

    return allTasks.filter((task) => {
      const taskDate = new Date(task.deadline || task.startDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // 检查是否是今天
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  // 检查是否是选中的日期
  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 获取类型配置
  const getTypeConfig = (type) => {
    const configs = {
      study: {
        icon: 'school',
        color: COLORS.primary[600],
        bgColor: COLORS.primary[50],
        label: '留学',
      },
      work: {
        icon: 'briefcase',
        color: COLORS.success[600],
        bgColor: COLORS.success[50],
        label: '工作',
      },
      immigration: {
        icon: 'airplane',
        color: COLORS.warning[600],
        bgColor: COLORS.warning[50],
        label: '移民',
      },
    };
    return configs[type] || configs.study;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const selectedDayTasks = getTasksForDate(selectedDate.getDate());

  // 月份导航
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <View style={styles.container}>
      {/* 月份选择器 */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => navigateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </Text>

        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => navigateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 日历网格 */}
        <View style={styles.calendarContainer}>
          {/* 星期标题 */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 日期网格 */}
          <View style={styles.daysGrid}>
            {calendarDays.map((item, index) => {
              const tasks = item.day ? getTasksForDate(item.day) : [];
              const hasUrgentTask = tasks.some((task) => {
                const deadline = new Date(task.deadline);
                const today = new Date();
                const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 3 && diffDays >= 0;
              });

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !item.isCurrentMonth && styles.dayCellInactive,
                    isToday(item.day) && styles.dayCellToday,
                    isSelected(item.day) && styles.dayCellSelected,
                  ]}
                  onPress={() => {
                    if (item.day) {
                      setSelectedDate(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          item.day
                        )
                      );
                    }
                  }}
                  disabled={!item.isCurrentMonth}
                >
                  {item.day && (
                    <>
                      <Text
                        style={[
                          styles.dayText,
                          !item.isCurrentMonth && styles.dayTextInactive,
                          isToday(item.day) && styles.dayTextToday,
                          isSelected(item.day) && styles.dayTextSelected,
                        ]}
                      >
                        {item.day}
                      </Text>
                      {tasks.length > 0 && (
                        <View style={styles.taskDots}>
                          {tasks.slice(0, 3).map((task, idx) => {
                            const typeConfig = getTypeConfig(task.planType);
                            return (
                              <View
                                key={idx}
                                style={[
                                  styles.taskDot,
                                  {
                                    backgroundColor: hasUrgentTask
                                      ? COLORS.error[600]
                                      : typeConfig.color,
                                  },
                                ]}
                              />
                            );
                          })}
                          {tasks.length > 3 && (
                            <Text style={styles.moreDots}>+{tasks.length - 3}</Text>
                          )}
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 选中日期的任务列表 */}
        <View style={styles.taskListContainer}>
          <View style={styles.taskListHeader}>
            <Text style={styles.taskListTitle}>
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日的任务
            </Text>
            <Text style={styles.taskListCount}>
              {selectedDayTasks.length} 个任务
            </Text>
          </View>

          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => {
              const typeConfig = getTypeConfig(task.planType);
              const deadline = new Date(task.deadline);
              const today = new Date();
              const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 3 && diffDays >= 0;

              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskItem,
                    isUrgent && styles.taskItemUrgent,
                  ]}
                  onPress={() => onTaskPress(task)}
                >
                  {/* 类型指示条 */}
                  <View
                    style={[
                      styles.taskTypeBar,
                      { backgroundColor: typeConfig.color },
                    ]}
                  />

                  <View style={styles.taskContent}>
                    {/* 任务标题 */}
                    <View style={styles.taskHeader}>
                      <View
                        style={[
                          styles.taskTypeIcon,
                          { backgroundColor: typeConfig.bgColor },
                        ]}
                      >
                        <Ionicons
                          name={typeConfig.icon}
                          size={16}
                          color={typeConfig.color}
                        />
                      </View>
                      <Text style={styles.taskTitle} numberOfLines={2}>
                        {task.title}
                      </Text>
                      {task.completed && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.success[600]}
                        />
                      )}
                    </View>

                    {/* 所属规划 */}
                    <Text style={styles.taskPlan}>{task.planName}</Text>

                    {/* 任务元信息 */}
                    <View style={styles.taskMeta}>
                      {/* 优先级 */}
                      {task.priority && (
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="flag"
                            size={12}
                            color={
                              task.priority === 'high'
                                ? COLORS.error[600]
                                : task.priority === 'medium'
                                ? COLORS.warning[600]
                                : COLORS.gray[600]
                            }
                          />
                          <Text style={styles.metaText}>
                            {task.priority === 'high'
                              ? '高优先级'
                              : task.priority === 'medium'
                              ? '中优先级'
                              : '低优先级'}
                          </Text>
                        </View>
                      )}

                      {/* 截止时间 */}
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={isUrgent ? COLORS.error[600] : COLORS.gray[600]}
                        />
                        <Text
                          style={[
                            styles.metaText,
                            isUrgent && { color: COLORS.error[600], fontWeight: '600' },
                          ]}
                        >
                          {isUrgent ? `${diffDays}天后到期` : '到期'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyTask}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.gray[400]} />
              <Text style={styles.emptyTaskText}>这天没有安排任务</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  monthButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayCellInactive: {
    opacity: 0.3,
  },
  dayCellToday: {
    backgroundColor: COLORS.primary[50],
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary[600],
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  dayTextInactive: {
    color: COLORS.gray[400],
  },
  dayTextToday: {
    color: COLORS.primary[600],
  },
  dayTextSelected: {
    color: COLORS.white,
  },
  taskDots: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreDots: {
    fontSize: 8,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  taskListContainer: {
    padding: 16,
    backgroundColor: COLORS.gray[50],
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  taskListCount: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskItemUrgent: {
    borderWidth: 2,
    borderColor: COLORS.error[200],
  },
  taskTypeBar: {
    width: 4,
  },
  taskContent: {
    flex: 1,
    padding: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  taskTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  taskPlan: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.gray[600],
  },
  emptyTask: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTaskText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginTop: 12,
  },
  bottomPlaceholder: {
    height: 20,
  },
});

export default CalendarView;

